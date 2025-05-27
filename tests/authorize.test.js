const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authorize');

const { expect } = chai;

describe('verifyToken Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            redirect: sinon.stub(),
            clearCookie: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should return 403 if no token is provided', () => {
        verifyToken(req, res, next);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'No token provided' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should redirect to /login if token verification fails', () => {
        req.cookies.token = 'invalidToken';
        sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        verifyToken(req, res, next);

        expect(res.redirect.calledWith('/login')).to.be.true;
        expect(next.called).to.be.false;

        jwt.verify.restore();
    });

    it('should set req.user and call next if token is valid', () => {
        const decodedToken = { id: 1, name: 'Test User' };
        req.cookies.token = 'validToken';
        sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, decodedToken);
        });

        verifyToken(req, res, next);

        expect(req.user).to.deep.equal(decodedToken);
        expect(next.called).to.be.true;

        jwt.verify.restore();
    });

    it('should clear the token cookie if an error occurs', () => {
        req.cookies.token = 'validToken';
        sinon.stub(jwt, 'verify').throws(new Error('Unexpected error'));

        verifyToken(req, res, next);

        expect(res.clearCookie.calledWith('token')).to.be.true;

        jwt.verify.restore();
    });
});
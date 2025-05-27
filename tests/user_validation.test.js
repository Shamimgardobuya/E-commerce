const chai = require('chai');
const sinon = require('sinon');
const { userValidator } = require('../middleware/user_validation');

const { expect } = chai;

describe('userValidator Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should call next() when validation passes', async () => {
        req.body = {
            email: 'test@example.com',
            phoneNumber: '1234567890',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            _csrf: 'csrfToken'
        };

        await userValidator(req, res, next);

        expect(next.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;
    });

    it('should return 400 if email is invalid', async () => {
        req.body = {
            email: 'invalid-email',
            phoneNumber: '1234567890',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            _csrf: 'csrfToken'
        };

        await userValidator(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.have.property('error');
        expect(next.called).to.be.false;
    });

    it('should return 400 if phoneNumber is invalid', async () => {
        req.body = {
            email: 'test@example.com',
            phoneNumber: '12345',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            _csrf: 'csrfToken'
        };

        await userValidator(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.have.property('error');
        expect(next.called).to.be.false;
    });

    it('should return 400 if password is too short', async () => {
        req.body = {
            email: 'test@example.com',
            phoneNumber: '1234567890',
            password: 'short',
            firstName: 'John',
            lastName: 'Doe',
            _csrf: 'csrfToken'
        };

        await userValidator(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.have.property('error');
        expect(next.called).to.be.false;
    });

    it('should return 400 if firstName is too short', async () => {
        req.body = {
            email: 'test@example.com',
            phoneNumber: '1234567890',
            password: 'password123',
            firstName: 'J',
            lastName: 'Doe',
            _csrf: 'csrfToken'
        };

        await userValidator(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.have.property('error');
        expect(next.called).to.be.false;
    });

    it('should return 400 if _csrf token is missing', async () => {
        req.body = {
            email: 'test@example.com',
            phoneNumber: '1234567890',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        };

        await userValidator(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.args[0][0]).to.have.property('error');
        expect(next.called).to.be.false;
    });
});
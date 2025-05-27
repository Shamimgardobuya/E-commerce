const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, loginUser } = require('../controllers/UserController');
const model = require('../models');


const { expect } = chai;

chai.use(chaiHttp.default);

describe('UserController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            cookies: {},
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            redirect: sinon.stub(),
            cookie: sinon.stub(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createUser', () => {
        it('should create a user and redirect to login', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '1234567890',
                password: 'password123',
            };

            const mockRole = { id: 1 };
            const mockUser = { id: 1, get: sinon.stub().returnsThis() };

            sandbox.stub(model.Roles, 'findOne').resolves(mockRole);
            sandbox.stub(model.Roles, 'findByPk').resolves(mockRole);
            sandbox.stub(bcrypt, 'genSalt').resolves('salt');
            sandbox.stub(bcrypt, 'hash').resolves('hashedPassword');
            sandbox.stub(model.User, 'create').resolves(mockUser);
            sandbox.stub(model.User, 'findByPk').resolves(mockUser);
            sandbox.stub(model.UserRoles, 'create').resolves();

            await createUser(req, res);

            expect(res.redirect.calledWith('/login')).to.be.true;
        });

        it('should handle errors during user creation', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '1234567890',
                password: 'password123',
            };
            sandbox.stub(bcrypt, 'genSalt').rejects(new Error('Hashing error'));
            sandbox.stub(model.Roles, 'findOne').rejects(new Error('Database error'));

            const result = await createUser(req, res);

            expect(result).to.be.an('error');
        });
    });

    describe('loginUser', () => {
        it('should log in a user and redirect to dashboard', async () => {
            req.body = {
                email: 'john.doe@example.com',
                password: 'password123',
            };


            const mockUser = {
                id: 1,
                password: 'hashedPassword',
                get: sinon.stub().returnsThis(),
            };
            const mockRole = { role_name: 'Customer' };

            sandbox.stub(model.User, 'findOne').resolves(mockUser);
            sandbox.stub(bcrypt, 'compare').resolves(true);
            sandbox.stub(model.Roles, 'findOne').resolves(mockRole);
            sandbox.stub(jwt, 'sign').returns('token');

            await loginUser(req, res);

            expect(res.cookie.calledWith('token', 'token')).to.be.true;
            expect(res.redirect.calledWith(303, '/dashboard')).to.be.true;
        });

        it('should return 401 if user does not exist', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };
            
            sandbox.stub(model.User, 'findOne').resolves(null);
            await loginUser(req, res);
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'User with the provided email does not exist' })).to.be.true;
        });

        it('should return 401 if password is invalid', async () => {
            req.body = {
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            };

            const mockUser = {
                id: 1,
                password: 'hashedPassword',
                get: sinon.stub().returnsThis(),
            };

            sandbox.stub(model.User, 'findOne').resolves(mockUser);
            sandbox.stub(bcrypt, 'compare').resolves(false);

            await loginUser(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid password' })).to.be.true;
        });
    });
});
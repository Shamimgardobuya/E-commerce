const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { createProduct, editProduct, deleteProduct } = require('../controllers/ProductController');
const model = require('../models');

const { expect } = chai;
const Product = model.Product;

chai.use(chaiHttp.default);
describe('ProductController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            params: {}
        };
        res = {
            redirect: sandbox.spy(),
            json: sandbox.spy()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createProduct', () => {
        it('should create a product and redirect to /products', async () => {
            req.body = {
                name: 'Bread',
                weight: '500g',
                quantity: 10,
                price: 5,
                batch_No: 'B123',
                unit: 'g'
            };

            sandbox.stub(Product, 'create').resolves();

            await createProduct(req, res);

            expect(Product.create.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/products')).to.be.true;
        });

        it('should return an error message if product creation fails', async () => {
            req.body = {
                name: 'Bread',
                weight: '500g',
                quantity: 10,
                price: 5,
                batch_No: 'B123',
                unit: 'g'
            };

            sandbox.stub(Product, 'create').throws();
            await createProduct(req, res);

            expect(res.json.calledWith({ message: 'Products failed to be added ', data: [] })).to.be.true;
        });
    });

    describe('editProduct', () => {
        it('should update a product and redirect to /products', async () => {
            req.body = {
                name: 'Cake',
                quantity: 5,
                price: 15,
                batch_No: 'C456'
            };
            req.params.productId = 1;

            sandbox.stub(Product, 'findByPk').resolves({});
            sandbox.stub(Product, 'update').resolves();

            await editProduct(req, res);

            expect(Product.update.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/products')).to.be.true;
        });

        it('should return an error message if product is not found', async () => {
            req.params.productId = 1;

            sandbox.stub(Product, 'findByPk').resolves(null);

            await editProduct(req, res);

            expect(res.json.calledWith({ message: 'Product not found', data: [] })).to.be.true;
        });

        it('should return an error message if product update fails', async () => {
            req.body = {
                name: 'Cake',
                quantity: 5,
                price: 15,
                batch_No: 'C456'
            };
            req.params.productId = 1;

            sandbox.stub(Product, 'findByPk').resolves({});
            sandbox.stub(Product, 'update').throws();

            await editProduct(req, res);

            expect(res.json.calledWith({ message: 'Product failed to be updated ', data: [] })).to.be.true;
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product and redirect to /products', async () => {
            req.params.productId = 1;

            sandbox.stub(Product, 'destroy').resolves();

            await deleteProduct(req, res);

            expect(Product.destroy.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/products')).to.be.true;
        });

        it('should return an error message if product deletion fails', async () => {
            req.params.productId = 1;

            sandbox.stub(Product, 'destroy').throws();

            await deleteProduct(req, res);

            expect(res.json.calledWith({ message: 'Product failed to be updated ', data: sinon.match.any })).to.be.true;
        });
    });
});
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Make sure to adjust the path
const should = chai.should();

chai.use(chaiHttp);

describe('Items', () => {
    it('should retrieve all auction items on /items GET', (done) => {
        chai.request(server)
            .get('/items')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('should retrieve a single auction item by ID on /items/:id GET', (done) => {
        chai.request(server)
            .get('/items/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                done();
            });
    });

    it('should create a new auction item on /items POST', (done) => {
        const item = {
            name: 'Test Item',
            description: 'Test Description',
            starting_price: 100.00,
            end_time: '2024-12-31 23:59:59'
        };
        chai.request(server)
            .post('/items')
            .send(item)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('id');
                done();
            });
    });

    it('should update an auction item by ID on /items/:id PUT', (done) => {
        const item = {
            name: 'Updated Test Item'
        };
        chai.request(server)
            .put('/items/1')
            .send(item)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('should delete an auction item by ID on /items/:id DELETE', (done) => {
        chai.request(server)
            .delete('/items/1')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

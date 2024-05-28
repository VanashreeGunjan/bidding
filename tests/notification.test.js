const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); // Make sure to adjust the path
const should = chai.should();

chai.use(chaiHttp);

describe('Notifications', () => {
    it('should retrieve notifications for the logged-in user on /notifications GET', (done) => {
        chai.request(server)
            .get('/notifications')
            .set('Authorization', 'Bearer your_jwt_token') // Replace with a valid token
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('should mark notifications as read on /notifications/mark-read POST', (done) => {
        chai.request(server)
            .post('/notifications/mark-read')
            .set('Authorization', 'Bearer your_jwt_token') // Replace with a valid token
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

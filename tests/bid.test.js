const request = require('supertest');
const app = require('../app'); // Assume this is your Express app

describe('Bid API', () => {
    let token;
    let itemId;

    beforeAll(async () => {
        // Login and get token
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'testuser', password: 'testpassword' });
        token = res.body.token;

        // Create an item for testing
        const itemRes = await request(app)
            .post('/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', description: 'Test Description', starting_price: 10, end_time: new Date(Date.now() + 3600000) });
        itemId = itemRes.body.id;
    });

    it('should place a new bid', async () => {
        const res = await request(app)
            .post(`/items/${itemId}/bids`)
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: 1, bidAmount: 20 });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Bid placed successfully');
    });

    it('should retrieve all bids for an item', async () => {
        const res = await request(app)
            .get(`/items/${itemId}/bids`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});

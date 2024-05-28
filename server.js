const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/users', authRoutes);
app.use('/items', itemRoutes);
app.use('/items/:itemId/bids', bidRoutes);
app.use('/notifications', notificationRoutes);
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

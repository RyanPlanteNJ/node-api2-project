const express = require('express');
const postsRouter = require('./posts/posts-router.js');

const CORS = require('cors');

const server = express();

server.use(express.json());
server.use(CORS());

server.use('/api/posts/', postsRouter);



server.get('/', (req,res) => {
    res.send(`
    <h2>Lambda Blog</h2>
    <p>Welcome to the Blog</p>
    `);
});

module.exports = server;
const express = require('express');

const PORT = process.env.PORT;
const server = express()

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (_req, res) => {
    res.send('online');
});

server.listen(PORT, err => {
    console.log(err || `server online on port ${PORT}`);
});
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1 style="color:blue;">Hello from Color-API</h1>');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Color-API listening on port ${port}`);
});

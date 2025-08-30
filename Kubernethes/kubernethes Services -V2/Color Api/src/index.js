const express = require('express');
const os = require('os');

const app = express();
const port = 80;
const color = 'blue';
const hostname = os.hostname();

app.get('/', (req, res) => {
    res.send(`<h1 style="color:${color};">Hello from Color-API!</h1>
            <h2>Hostname: ${hostname}</h2>`);
});

app.get('/api', (req, res) => {
    const format = req.query.format;
    if (format==='json'){
        return res.json({
            color,
            hostname,
        });
    } else {
        return res.send(`COLOR : ${color}, HOSTNAME : ${hostname}`);
    }
    
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Color-API listening on port ${port}`);
});

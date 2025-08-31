const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');

const getColor = () => {
    let color = process.env.DEFAULT_COLOR;
    const filePath = process.env.COLOR_CONFIG_PATH;
    if (filePath){
        try {
            const colorFromFile = fs.readFileSync(path.resolve(filePath), 'utf8');
            color = colorFromFile.trim();
        } catch (err) {
            console.error(`Failed to read contents of: ${filePath}`);
            console.error(err);
        }
    }
    return color || 'blue';
};

const app = express();
const port = 80;
const color = getColor();
const hostname = os.hostname();

const delay_startup = process.env.DELAY_STARTUP === 'true';
const fail_liveness = process.env.FAIL_LIVENESS === 'true';
const fail_readiness = process.env.FAIL_READINESS === 'true' ? Math.random() < 0.5 : false;
console.log(`Delayed startup: ${delay_startup}`);
console.log(`Fail liveness: ${fail_liveness}`);
console.log(`Fail readiness: ${fail_readiness}`);

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

app.get('/ready',(req,res)=>{
    if (fail_readiness){
        return res.sendStatus(503);
    }
    return res.send('ok');
});

app.get('/up',(req,res)=>{
    return res.send('ok');
});

app.get('/health',(req,res)=>{
        if (fail_liveness){
        return res.sendStatus(503);
    }
    return res.send('ok');
});

if (delay_startup){
    const start = Date.now();

    // forcefully blocked the execution for 60 sec
    while (Date.now() - start < 60000) {}
};

app.listen(port, '0.0.0.0', () => {
    console.log(`Color-API listening on port ${port}`);
});

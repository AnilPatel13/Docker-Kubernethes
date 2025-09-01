const express = require('express');
const {getHostname} = require('../utils');
const { getColor } = require('../db/color')

const rootRouter = express.Router();


rootRouter.get('/', async (req, res) => {
    const {colorkey} = req.query;
    
    console.log(`Color Key: ${colorkey}`)
    const color = await getColor({key:colorkey});
    const hostname = getHostname();
    res.send(`<h1 style="color:${color};">Hello from Color-API!</h1>
            <h2>Hostname: ${hostname}</h2>`);
});

module.exports = {
    rootRouter,
}

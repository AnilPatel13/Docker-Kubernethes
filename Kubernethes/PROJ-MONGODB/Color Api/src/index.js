const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {healthRouter} = require('./routes/health');
const { apiRouter } = require('./routes/api');
const { rootRouter } = require('./routes/root');

const app = express();
const port = 80;


const delay_startup = process.env.DELAY_STARTUP === 'true';
console.log(`Delayed startup: ${delay_startup}`);

app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use('/', healthRouter);
app.use('/', rootRouter);

if (delay_startup){
    const start = Date.now();

    // forcefully blocked the execution for 60 sec
    while (Date.now() - start < 60000) {}
};

mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {
    console.log(`Color-API listening on port ${port}`);
});
}).catch((err) =>{
    console.error('Error connecting to MongoDB:', err);
});



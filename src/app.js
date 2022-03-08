const express = require('express');
const bodyParser = require('body-parser');
const { getProfile } = require('./middleware/getProfile');

const app = express();

app.use(bodyParser.json());

app.use('/', getProfile);
app.use('/contracts', require('./routes/contract.route'));
app.use('/jobs', require('./routes/job.route'));
app.use('/', require('./routes/profile.route'));

module.exports = app;

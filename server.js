const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cors = require('cors'),
    routers = require('./routes/routes.js');


const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
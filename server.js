const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cors = require('cors'),
    fs = require('fs'),
    routers = require('./routes/routes.js');


const app = express();
const port = 3001;

app.get('/', (req, res) => {
    fs.readFile('client/homePage.html', (err, html) => {
        if (err) {
            throw err;
        }

        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    })
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routers);
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/addPhoto', express.static(path.join(__dirname, 'client/addPhoto.html')));
app.use('/addAlbum', express.static(path.join(__dirname, 'client/addAlbum.html')));




const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
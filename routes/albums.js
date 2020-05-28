const fs = require('fs');
// variables
const dataPath = './data/albums.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};


module.exports = {
    //READ - GET http://localhost:3001/albums
    get_all_albums: function(req, res) {
        readFile(data => {
            res.send(JSON.parse(data));
        });
    },

    //READ - GET http://localhost:3001/albums/{albumId} 
    get_albums: function(req, res) {
        readFile(data => {
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            res.send(values[id]);
        });
    },

    // CREATE - POST http://localhost:3001/albums/{albumId} 
    create_photo: function(req, res) {
        readFile(data => {
            if (!req.body.id)
                return res.send("There is no ID.");
            //if it seem like http://localhost:3001/albums/  it should return error
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            if (values[id] == undefined)
                return res.send("Error.")
            var album = values[id]
            var pictures = album["pictures"];
            pictures[req.body.id] = req.body;

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('New photo added to album.');
            });
        });
    },

    // DELETE - POST http://localhost:3001/albums/{albumId} 
    delete_album: function(req, res) {

        readFile(data => {
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            if (values[id] == undefined)
                return res.send("Error.")

            delete values[id];

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('Album: ' + id + " deleted.");
            });
        });
    },

    // CREATE - POST http://localhost:3001/albums
    create_album: function(req, res) {
        readFile(data => {
            var values = {};
            values = JSON.parse(data);
            var i = 0;
            // while (values[i] != undefined)
            //     i++;
            // values[i] = i;
            if (values[req.body.id] == undefined)
                values[req.body.id] = req.body;
            else
                res.send("the ID is alreasy exist");

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('New album added.');
            });
        });
    }
};
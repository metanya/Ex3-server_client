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
            if (req.params.id == undefined)
                return res.send("There is no album with ID ''.");
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            res.send(values[id]);
        });
    },

    // CREATE - POST http://localhost:3001/albums/{albumId} 
    create_photo: function(req, res) {
        readFile(data => {
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            if (values[id] == undefined)
                return res.send("Error.")
            if (req.body.name == undefined || req.body.name.trim() == "") {
                res.send("Wrong picture name.");
                return;
            }
            if (req.body.photographer == undefined || req.body.photographer.trim() == "") {
                res.send("Wrong photographer.");
                return;
            }
            if (!isValidURL(req.body.link)) {
                res.send("Url must be valid.");
                return;
            }
            var album = values[id]
            var pictures = album["pictures"];
            var i = 1;
            while (pictures[i] != undefined)
                i++;
            pictures[i] = req.body;
            pictures[i].id = i + "";

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('New photo added to album.');
            });
        });
    },

    // DELETE - DELETE http://localhost:3001/albums/{albumId} 
    delete_album: function(req, res) {

        readFile(data => {
            var values = {};
            values = JSON.parse(data);
            var id = req.params.id;
            if (values[id] == undefined)
                return res.send("Error.");

            delete values[id];

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('Album: ' + id + " deleted.");
            });
        });
    },

    // CREATE - POST http://localhost:3001/albums
    create_album: function(req, res) {
        readFile(data => {
            if (req.body.name == undefined) {
                res.send("I didn't get the name.");
                return;
            }
            if (req.body.type == undefined) {
                res.send("I didn't get the type.");
                return;
            }
            if (req.body.type != "People" && req.body.type != "Nature") {
                res.send("Type is not People or Nature.");
                return;
            }
            var values = {};
            values = JSON.parse(data);
            var i = 0;
            while (values[i] != undefined)
                i++;
            values[i] = req.body;
            values[i].id = i + "";
            if (req.body.pictures != {}) {
                var album = values[i];
                album["pictures"] = {};
            }

            writeFile(JSON.stringify(values, null, 2), () => {
                res.status(200).send('New album added.');
            });
        });
    }
};

function isValidURL(urlLink) {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]* ) *" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    return !!pattern.test(urlLink);
}
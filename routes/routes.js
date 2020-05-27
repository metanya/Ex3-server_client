const express = require('express'),
    userRoutes = require('./albums'),
    fs = require('fs');
var router = express.Router();


router.get('/', (req, res) => {
    fs.readFile('client/homePage.html', (err, html) => {
        if (err) {
            throw err;
        }

        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    })
});
router.get('/albums/:id', userRoutes.get_albums);
router.post('/albums/:id', userRoutes.create_photo);
router.delete('/albums/:id', userRoutes.delete_album);

router.post(' /albums', userRoutes.create_album);

module.exports = router;
const express = require('express'),
    userRoutes = require('./albums');
var router = express.Router();

router.get('/albums', userRoutes.get_all_albums);
router.get('/albums/:id', userRoutes.get_albums);
router.post('/albums/:id', userRoutes.create_photo);
router.delete('/albums/:id', userRoutes.delete_album);
router.post('/albums', userRoutes.create_album);

module.exports = router;
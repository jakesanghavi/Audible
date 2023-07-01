const express = require('express')

const {
    getSongs,
    getRandom,
    getSong,
    postSong,
    deleteSong,
    updateSong
} = require('../controllers/songsController')

const router = express.Router()

// GET all songs
router.get('/', getSongs)

// GET one random song
router.get('/random/random/', getRandom)

//GET single song
router.get('/:id', getSong)

//POST a new song (?)
router.post('/', postSong)

//DELETE a song (?)
router.delete('/:id', deleteSong)
//UPDATE a song (?)
router.patch('/:id', updateSong)

module.exports = router
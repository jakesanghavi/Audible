const express = require('express')

const {
    getSongs,
    getSong,
    postSong,
    deleteSong,
    updateSong
} = require('../controllers/songsController')

const router = express.Router()

// GET all songs
router.get('/', getSongs)

//GET single song
router.get('/:id', getSong)

//POST a new song (?)
router.post('/', postSong)

//DELETE a song (?)
router.delete('/:id', deleteSong)
//UPDATE a song (?)
router.patch('/:id', updateSong)

module.exports = router
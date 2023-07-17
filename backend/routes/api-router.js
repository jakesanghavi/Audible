const express = require('express')

const {
    getHome,
    getSongs,
    getRandom,
    getSong,
    postSong,
    deleteSong,
    updateSong
} = require('../controllers/songsController')

const {
    getUser,
    postUser
} = require('../controllers/usersController')

const router = express.Router()

// GET the homepage (prevent crashing)
router.get('/', getHome)

// GET all songs
router.get('/api/songs/', getSongs)

// GET one random song
router.get('/api/songs/random/random/', getRandom)

//GET single song
router.get('/api/songs/:id', getSong)

//POST a new song (?)
// router.post('/', postSong)

//DELETE a song (?)
// router.delete('/:id', deleteSong)
//UPDATE a song (?)
// router.patch('/:id', updateSong)

// GET a specific user
router.get('/api/users/:id', getUser);

// POST a user to the DB
router.post('/api/users/:id', postUser)

module.exports = router
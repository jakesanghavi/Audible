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
    getUserByUsername,
    getUserByEmail,
    postUser,
    updateUser
} = require('../controllers/usersController')

const {
    getCookieUser,
    postCookieUser,
    updateCookieUser,
    deleteCookieUser
} = require('../controllers/cookieUsersController')

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

// GET a specific user by email
router.get('/api/users/email/:id', getUserByEmail);

// GET a specific user by email
router.get('/api/users/username/:id', getUserByUsername);

// POST a user to the DB
router.post('/api/users/:id', postUser)

// PATCH a user in the DB
router.post('/api/users/patchcookie/:id', updateUser)

// GET a specific user by cookie ID
router.get('/api/users/userID/:id', getCookieUser);

// POST a cookie user to the DB
router.post('/api/users/userID/post/:id', postCookieUser)

// PATCH a cookie user in the DB
router.post('/api/users/userID/patch/:id', updateCookieUser)

// DELETE a cookie user in the DB
router.post('/api/users/userID/del/:id', deleteCookieUser)

module.exports = router
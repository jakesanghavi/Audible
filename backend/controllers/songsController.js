const Song = require('../models/song_model.js')
const mongoose = require('mongoose')

// GET all songs
const getSongs = async (request, response) => {
  const songs = await Song.find({}).sort({ createdAt: -1 })
  response.status(200).json(songs)
}

// GET one random song
const getRandom = async (request, response) => {
  t = Song.aggregate([{ $sample: { size: 1 } }]).then(results => {
    return response.status(200).json(results[0])
  }).catch(error => {
    return response.status(500).json({ error: 'Internal Server Error' });
  })
}

// GET one song
const getSong = async (request, response) => {
  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({ error: 'No song found.' })
  }

  const song = await Song.findById(id)

  if (!song) {
    return response.status(404).json({ error: 'No song found.' })
  }

  return response.status(200).json(song)
}

// POST (?) a song
const postSong = async (request, response) => {
  const { title, artist, album, soundcloud_link } = request.body

  // add song to database
  try {
    const song = await Song.create({ title, artist, album, soundcloud_link })
    response.status(200).json(song)
  }
  catch (error) {
    response.status(400).json({ error: error.message })
  }
}

// DELETE (?) a song
const deleteSong = async (request, response) => {
  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({ error: 'No song found.' })
  }

  const song = await Song.findOneAndDelete({ _id: id })

  if (!song) {
    return response.status(404).json({ error: 'No song found.' })
  }

  response.status(200).json(song)
}

// PATCH/UPDATE (?) a song
const updateSong = async (request, response) => {
  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).json({ error: 'No song found.' })
  }

  const song = await Song.findOneAndUpdate({ _id: id }, {
    ...request.body
  })

  if (!song) {
    return response.status(404).json({ error: 'No song found.' })
  }

  response.status(200).json(song)
}

module.exports = {
  getSongs,
  getRandom,
  getSong,
  postSong,
  deleteSong,
  updateSong
}

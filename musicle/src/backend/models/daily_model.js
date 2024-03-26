const mongoose = require('mongoose')

const Schema = mongoose.Schema

// This is the defined structure that our DB collection has.
const dailySongSchema = new Schema({
    song_title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album_name: {
        type: String,
        required: true
    },
    album_year: {
        type: String,
        required: true
    },
    soundcloud_link: {
        type: String,
        required: true
    },
    album_cover: {
        type: String,
        required: true
    },
    full_link: {
        type: String,
        required: true
    },
    current_date: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model(process.env.DAILY_COLLECTION, dailySongSchema)
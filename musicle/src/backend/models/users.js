const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
   email_address: {
      type: String,
      required: false
   },
   username: {
      type: String,
      required: true
   },
   last_daily: {
      type: String,
      required: true
   },
   today_guesses: {
      type: [String],
      required: true
   },
   daily_history: {
      type: [Number],
      required: true
   }
});

module.exports = mongoose.model(process.env.GOOGLE_USERS_COLLECTION, userSchema)
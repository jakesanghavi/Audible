const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
   email_address: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
});

module.exports = mongoose.model(process.env.USERS_COLLECTION, userSchema)
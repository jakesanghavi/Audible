const User = require('../models/users.js')
const mongoose = require('mongoose')

// GET a specific user
const getUser = async (request, response) => {
    const { email } = request.params

    try {
      const userData = await User.findOne({ email_address: email }).exec();
      if (!userData) {
        return response.status(399).json({ "error": "User does not exist" })
      }
      return response.status(200).json(userData)
    }
    catch (error) {
      return response.status(400).json({ error: error.message })
    }
}

// POST a user
const postUser = async (request, response) => {
    const { email_address, password } = request.body
  
    // add song to database
    try {
      const user = await User.create({ email_address, password })
      response.status(200).json(user)
    }
    catch (error) {
      response.status(400).json({ error: error.message })
    }
  }

module.exports = {
    getUser,
    postUser
}
const User = require('../models/users.js')
const mongoose = require('mongoose')

// GET a specific user
const getUserByEmail = async (request, response) => {
    const { id } = request.params

    try {
      const userData = await User.findOne({ email_address: id });
      if (!userData) {
        // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
        return response.status(201).json({ "error": "User does not exist" })
      }
      return response.status(200).json(userData)
    }
    catch (error) {
      return response.status(400).json({ error: error.message })
    }
}

// GET a specific user
const getUserByUsername = async (request, response) => {
  const { id } = request.params

  try {
    const userData = await User.findOne({ username: id });
    if (!userData) {
      // Returning 201 instead of the proper 404 prevents errors from coming up in the console.
      return response.status(201).json({ "error": "User does not exist" })
    }
    return response.status(200).json(userData)
  }
  catch (error) {
    return response.status(400).json({ error: error.message })
  }
}

// POST a user
const postUser = async (request, response) => {
    const { email_address, username, password } = request.body
  
    // add song to database
    try {
      const user = await User.create({ email_address, username, password })
      response.status(200).json(user)
    }
    catch (error) {
      response.status(400).json({ error: error.message })
    }
  }

module.exports = {
    getUserByUsername,
    getUserByEmail,
    postUser
}
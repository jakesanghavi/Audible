const cookieUser = require('../models/cookie_users.js')
const mongoose = require('mongoose')

// GET a specific user
const getCookieUser = async (request, response) => {
    const { id } = request.params

    try {
      const userData = await cookieUser.findOne({ userID: id });
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
const postCookieUser = async (request, response) => {
    const { userID, email_address } = request.body
  
    // add song to database
    try {
      const user = await cookieUser.create({ userID, email_address })
      response.status(200).json(user)
    }
    catch (error) {
      response.status(400).json({ error: error.message })
    }
  }

// PATCH a user
const updateCookieUser = async (request, response) => {
  const uid = request.body.userID
  const email = request.body.email_address

  const user = await cookieUser.findOneAndUpdate(
    { userID: uid },
    { $set: { userID: uid, email_address: email } },
    { new: true } // This option returns the updated document
  );

  response.status(200).json(user)
}

module.exports = {
    getCookieUser,
    postCookieUser,
    updateCookieUser
}
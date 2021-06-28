const jwt = require('jsonwebtoken')

// Function to create JWT token for authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  })
}

module.exports = generateToken

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generateToken = (id) => {
  // console.log('generateToken')
  // console.log(process.env.JWT_TOKEN)
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  })
}

module.exports = generateToken

const bcrypt = require('bcryptjs')

// function to generate encrypted password using bcrypt package.
const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

module.exports = generateHashPassword

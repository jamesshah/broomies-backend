const bcrypt = require('bcryptjs')

const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

module.exports = generateHashPassword

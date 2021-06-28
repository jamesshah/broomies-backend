const jwt = require('jsonwebtoken')
const client = require('../util/database')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // get token from the authorization header
      token = req.headers.authorization.split(' ')[1]

      // decode token and get the user id from it
      const decoded = jwt.verify(token, process.env.JWT_TOKEN)

      // find the user with that id
      const user = await client.searchByHash({
        table: 'users',
        hashValues: [decoded.id],
        attributes: ['id'],
      })

      req.user = user.data[0]
      next()
    } catch (err) {
      console.error(err)
      res.status(401)
      throw new Error('Unauthorized. Token failed.')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Unauthorized. No token')
  }
}

module.exports = { protect }

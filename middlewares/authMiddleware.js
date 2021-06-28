const jwt = require('jsonwebtoken')
const client = require('../util/database')
require('dotenv').config()

const protect = async (req, res, next) => {
  // console.log(req.headers.authorization)
  // console.log(req.body)
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      // console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_TOKEN)
      const user = await client.searchByHash({
        table: 'users',
        hashValues: [decoded.id],
        attributes: ['id'],
      })

      req.user = user.data[0]

      // console.log(user)
      next()
    } catch (err) {
      console.error(err)
      res.status(401).json({ error: 'Unauthorized. Token failed.' })
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. No token' })
  }
}

module.exports = { protect }

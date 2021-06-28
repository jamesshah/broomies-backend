const express = require('express')
const cors = require('cors')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Middlewares
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 2, // limit each IP to 100 requests per windowMs
// })
// app.use(limiter)

app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)

// routes
app.use('/dev', require('./routes/dev.routes'))
app.use('/users', require('./routes/users.routes'))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server up and running on PORT ${PORT} With CORS Enabled`)
})

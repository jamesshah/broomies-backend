const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
require('dotenv').config()

const app = express()

// Middlewares
app.use(helmet()) // For security using HTTPS headers
app.use(express.json()) // For parsing requests with JSON payloads
app.use(
  cors({
    origin: 'https://broomies-frontend.vercel.app',
  })
) // For Cross Origin Requests

// routes
app.use('/users', require('./routes/users.routes'))

// Custom Middlewares
app.use(notFound) // to handle undefined routes with a 404 error.
app.use(errorHandler) // to send error message to frontend.

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server up and running on PORT ${PORT} With CORS Enabled`)
})

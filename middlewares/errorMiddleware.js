// If a route is undefined, send a 404 error with a message.
exports.notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// sends error message to the frontend
exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

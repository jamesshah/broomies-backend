const client = require('../util/database')

exports.getVersion = (req, res, next) => {
  return res.status(200).json({ version: '1.0.0' })
}

exports.getTodos = async (req, res, next) => {
  try {
    const result = await client.describeAll()
    console.log(result)
    res.json(result)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
}

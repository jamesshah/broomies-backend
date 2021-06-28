const harperive = require('harperive')
// require('dotenv').config()

const config = {
  harperHost: process.env.HARPER_DB_INSTANCE_URL,
  username: process.env.HARPER_DB_INSTANCE_USERNAME,
  password: process.env.HARPER_DB_INSTANCE_PASSWORD,
  schema: process.env.HARPER_DB_SCHEMA_NAME,
}

const Client = harperive.Client
const db = new Client(config)

module.exports = db

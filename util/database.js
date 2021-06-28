const harperive = require('harperive')

// Create configurations object for harperive client.
const config = {
  harperHost: process.env.HARPER_DB_INSTANCE_URL,
  username: process.env.HARPER_DB_INSTANCE_USERNAME,
  password: process.env.HARPER_DB_INSTANCE_PASSWORD,
  schema: process.env.HARPER_DB_SCHEMA_NAME,
}

// Create a harperive client to run queries.
const Client = harperive.Client
const db = new Client(config)

// export client.
module.exports = db

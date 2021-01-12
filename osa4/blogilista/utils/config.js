require('dotenv').config()

let PORT = process.env.PORT
let MONODB_URI = process.env.MONGODB_URI
let SECRET = process.env.SECRET

if (process.env.NODE_ENV === 'test') {
  MONODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONODB_URI,
  PORT,
  SECRET,
}

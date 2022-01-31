const express = require('express')

const router = express.Router()

router.use('/weather', require('./weather.js'))

module.exports = router
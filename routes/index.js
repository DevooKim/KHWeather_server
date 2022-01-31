const express = require('express')

// const weather = require('weather')

const router = express.Router()

router.use('/weather', require('./weather.js'))

module.exports = router
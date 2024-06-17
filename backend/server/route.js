const express = require("express")
const { runScheduler, ping } = require("./controller")
const router = express.Router()



router.route('').get(ping).post(runScheduler)
module.exports = router
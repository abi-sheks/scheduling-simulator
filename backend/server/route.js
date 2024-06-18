const express = require("express")
const { runScheduler, ping, runAllAlgorithms } = require("./controller")
const router = express.Router()



router.route('').get(ping).post(runScheduler)
router.route('/bulk').get().post(runAllAlgorithms)
module.exports = router
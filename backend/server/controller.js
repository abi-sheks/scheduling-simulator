require('dotenv').config()
const {performIPC} = require('./utils')

const ping = (req, res) => {
    res.status(StatusCodes.OK).json({ "message": "up and running" });
}

const runAllAlgorithms = async (req, res) => {
    //todo : bad practice sending req and res into util, rectify
    await performIPC(req, res, process.env.SCHEDULER_CONFIG_PATH, process.env.BULK_METRICS_EXE_PATH, process.env.METRICS_OUTPUT_PATH, "")
}
const runScheduler = async (req, res) => {
    await performIPC(req, res, process.env.SCHEDULER_CONFIG_PATH, process.env.SCHEDULER_EXE_PATH, process.env.SCHEDULER_OUTPUT_PATH, process.env.GANTT_OUTPUT_PATH)
}

module.exports = {
    runScheduler,
    runAllAlgorithms,
    ping
}
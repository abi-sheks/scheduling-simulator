const SCHEDULER_EXE_PATH = "/root/scheduling-simulator/lib/scheduler"
const BULK_METRICS_EXE_PATH = "/root/scheduling-simulator/lib/bulk_metrics"
const SCHEDULER_OUTPUT_PATH = "/root/scheduling-simulator/lib/outfile.txt"
const METRICS_OUTPUT_PATH = "/root/scheduling-simulator/lib/metrics_outfile.txt"
const SCHEDULER_CONFIG_PATH = "/root/scheduling-simulator/lib/process_info.txt"
const {performIPC} = require('./utils')

const ping = (req, res) => {
    res.status(StatusCodes.OK).json({ "message": "up and running" });
}

const runAllAlgorithms = async (req, res) => {
    //todo : bad practice sending req and res into util, rectify
    await performIPC(req, res, SCHEDULER_CONFIG_PATH, BULK_METRICS_EXE_PATH, METRICS_OUTPUT_PATH)
}
const runScheduler = async (req, res) => {
    await performIPC(req, res, SCHEDULER_CONFIG_PATH, SCHEDULER_EXE_PATH, SCHEDULER_OUTPUT_PATH)
}

module.exports = {
    runScheduler,
    runAllAlgorithms,
    ping
}
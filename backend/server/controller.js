const SCHEDULER_EXE_PATH = "/root/scheduling-simulator/backend/lib/scheduler"
const SCHEDULER_OUTPUT_PATH = "/root/scheduling-simulator/backend/lib/outfile.txt"
const SCHEDULER_CONFIG_PATH = "/root/scheduling-simulator/backend/lib/process_info.txt"
const fs = require('fs')
const { spawn } = require('node:child_process')
const { exec } = require('child_process')
const { StatusCodes } = require('http-status-codes');
const { STATUS_CODES } = require('http')


const ping = (req, res) => {
    res.status(StatusCodes.OK).json({ "message": "up and running" });
}
const runScheduler = async (req, res) => {
    //write the parameters to a file and run the scheduler
    let formattedString = ""
    const processList = req.body.processes;
    processList.forEach(process => {
        formattedString += `${process.pid} ${process.atime} ${process.btime} \n`
    })
    fs.writeFile(SCHEDULER_CONFIG_PATH, formattedString, (err) => {
        console.log("god please")
        if (err) {
            console.log("write fucked")
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "ERROR IN SCHEDULER ACTION." })
        }
        else {
            // const scheduler = spawn(SCHEDULER_EXE_PATH)
            // scheduler.stdout.on('data', (data) => {
            //     console.log(`stdout: ${data}`);
            //     fs.readFileSync(SCHEDULER_OUTPUT_PATH, { encoding: 'utf8' }, (error, data) => {
            //         if (error) {
            //             console.log(error)
            //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": `${error}` })   
            //         }
            //         console.log(data)
            //         res.status(StatusCodes.OK).json({ "data": data })
            //     })
            // });

            // scheduler.stderr.on('data', (data) => {
            //     console.error(`stderr: ${data}`);
            //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "ERROR IN SCHEDULER ACTION." })
            // });

            // scheduler.on('close', (code) => {
            //     console.log(`child process exited with code ${code}`);
            // });
            exec(SCHEDULER_EXE_PATH, (error, stdout, stderr) => {
                if (!error) {
                    //read from designated output file
                    fs.readFile(SCHEDULER_OUTPUT_PATH, { encoding: 'utf8' }, (error, data) => {
                        if (error) {
                            console.log(error)
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": error })
                        }
                        console.log(data)
                        res.status(StatusCodes.OK).json({ "data": data })
                    })
                } else {
                    console.log("exec fucked")
                    console.log(error)
                    console.log(stderr)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "ERROR IN SCHEDULER ACTION." })
                }
            })
        }

    })


}

module.exports = {
    runScheduler,
    ping
}
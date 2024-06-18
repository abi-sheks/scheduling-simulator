const fs = require('fs')
const { spawn } = require('node:child_process')
const { exec } = require('child_process')
const { StatusCodes } = require('http-status-codes');


const performIPC = async (req, res, CONFIG_PATH, EXE_PATH, OUTPUT_PATH) => {
    //write parameters to input file
    let formattedString = ""
    const processList = req.body.processes;
    const algoType = req.body.type
    const quantum = req.body.quantum
    processList.forEach(process => {
        formattedString += `${process.pid} ${process.arrivalTime} ${process.burstTime} `
        if(process.tickets) formattedString += `${process.tickets}`
        formattedString += "\n"
    })
    fs.writeFile(CONFIG_PATH, formattedString, (err) => {
        if (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "ERROR IN SCHEDULER ACTION." })
        }
        else {
            let NEW_EXE_PATH = EXE_PATH
            if(algoType !== "All")
            {
                //add arguments for each possible type    
                NEW_EXE_PATH += " -pol "
                if(algoType ===  "First Come First Serve") NEW_EXE_PATH += "fcfs"
                else if(algoType === "Shortest Job First") NEW_EXE_PATH += "sjf"
                else if(algoType === "Shortest Time To Complete First") NEW_EXE_PATH += "stcf"
                else if(algoType === "Round Robin") NEW_EXE_PATH += `rr ${quantum}`
                else if(algoType === "Lottery Scheduling") NEW_EXE_PATH += `lottery ${quantum}`
                else throw new Error("ERROR : UNSUPPORTED ALGORITHM")
            } 
            else {
                NEW_EXE_PATH += ` -sq ${quantum}`
            }
            exec(NEW_EXE_PATH, (error, stdout, stderr) => {
                if (!error) {
                    //read from designated output file
                    fs.readFile(OUTPUT_PATH, { encoding: 'utf8' }, (error, data) => {
                        if (error) {
                            console.log(error)
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": error })
                        }
                        console.log(data)
                        res.status(StatusCodes.OK).json({ "data": data })
                    })
                } else {
                    console.log(error)
                    console.log(stderr)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ "message": "ERROR IN SCHEDULER ACTION." })
                }
            })
        }

    })
}

module.exports = {
    performIPC
}
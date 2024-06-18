import React, { useEffect, useState } from 'react'
import { SCHEDULER_ENDPOINT } from '../constants'
import { useOutletContext } from 'react-router'
import axios from 'axios'
import { Typography, Card, CardContent, CardActions, Container } from '@mui/material'
import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

const IndividualDashboard = () => {
    //silly, silly fact, but these parameters actually have to be in the same order as when defined in
    //the context
    //wasted a good 30 minutes
    const [workload, setWorkload, quantum, setQuantum, schedulingAlgo, setAlgo] = useOutletContext()
    const [tat, setTat] = useState()
    const [rt, setRt] = useState()
    const [rd, setRd] = useState([])
    const [timeDomain, setTimeDomain]= useState([])
    const [processDomain, setProcessDomain] = useState([])
    

    useEffect(() => {
        (async () => {
            try {
                const response = (await axios.post(SCHEDULER_ENDPOINT,
                    JSON.stringify({ processes: workload, type: schedulingAlgo.label, quantum: quantum }),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )).data
                const metric_data_raw = response.data.data
                const metric_data_cleaned = metric_data_raw.split("\n")[0].split(" ")
                //set metrics data
                setRt(metric_data_cleaned[4])
                setTat(metric_data_cleaned[3])
                const gantt_data_raw = response.data.gantt_data
                const gantt_data_cleaned = gantt_data_raw.split("\n")
                const finalData = gantt_data_cleaned.map(dataline => {
                    const actual_data = dataline.split(" ")
                    const pid = actual_data[0]
                    const arrivalTime = actual_data[1]
                    const firstrunTime = actual_data[2]
                    const completionTime = actual_data[3]
                    return {
                        pid : pid,
                        startTime : firstrunTime,
                        endTime : completionTime
                    }
                })
                finalData.pop()
                setTimeDomain(Math.max(...(finalData.map(data => data.endTime))))
                setProcessDomain(Math.max(...(finalData.map(data => data.pid))))
                setRd(finalData)
                //convert cleaned up gantt chart data into processable form
            } catch (error) {
                console.log(error)
            }
        })()
    }, [workload])
    return (
        <div style={{ marginTop: "1rem", width: "100%", height: "100%", display: "flex", flexDirection: 'column', alignItems: "center" }}>
            <Typography>{schedulingAlgo.label}'s performance on this workload - </Typography>
            <Card sx={{ minWidth: 275, marginTop: "1rem" }}>
                <CardContent>
                    <Container sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>Average Turnaround Time : </Typography>
                        <Typography sx={{ marginLeft: "1rem" }} fontWeight="bold">{tat}</Typography>
                    </Container>
                    <Container sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>Average Response Time : </Typography>
                        <Typography sx={{ marginLeft: "1rem" }} fontWeight="bold">{rt}</Typography>
                    </Container>
                </CardContent>
            </Card>
            {/* Gantt chart here */}
            <Typography variant='h4' sx={{margin : "1rem"}}>Gantt Chart : </Typography>
            <ScatterChart
                width={1200}
                height={500}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="startTime"
                    name="time"
                    domain={() => {
                        return [0, timeDomain]
                    }}
                />
                <YAxis
                 type="number"
                 dataKey="pid" name="process_id" 
                 domain={() => {return [0, processDomain]}}
                 />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                    name="Gantt Chart"
                    data={rd}
                    fill="#8884d8"
                    shape={(props) => {
                        return (
                            <rect
                                fill={() => getRandomColor()}
                                x={props.cx}
                                y={props.cy}
                                width={
                                    props.xAxis.scale(props.payload.endTime) -
                                    props.xAxis.scale(props.payload.startTime)
                                }
                                height={8}
                            />
                        );
                    }}
                ></Scatter>
            </ScatterChart>
        </div>
    )
}

export default IndividualDashboard

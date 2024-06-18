import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import axios from 'axios'
import { BULK_METRICS_ENDPOINT } from '../constants'
import { ResponsiveContainer, XAxis, YAxis, Legend, BarChart, Tooltip, Bar, CartesianGrid } from 'recharts'
import { Button, Container, Typography } from '@mui/material'


const idxmap = new Map()
idxmap.set(0, "First Come First Serve")
idxmap.set(1, "Shortest Job First")
idxmap.set(2, "Shortest Time to Completion First")
idxmap.set(3, "Round Robin")

const ComparisonDashboard = () => {
    const [workload, setWorkload, quantum, setQuantum, schedulingAlgo, setAlgo] = useOutletContext()
    const [metrics, setMetrics] = useState([])
    const [bestTat, setBestTat] = useState(-1)
    const [bestTatAlgo, setBestTatAlgo] = useState()
    const [bestRt, setBestRt] = useState(-1)
    const [bestRtAlgo, setBestRtAlgo] = useState()
    const [metricType, setMetricType] = useState("Average")
    //immediately runs for workload and displays results
    //expected to be navigated to from Workload screen
    const switchMetrics = () => {
        if (metricType === "Average") setMetricType("Total")
        else if (metricType === "Total") setMetricType("Average")
    }
    useEffect(() => {
        (async () => {
            //make the scheduling algorithm bulk
            try {
                const response = (await axios.post(BULK_METRICS_ENDPOINT,
                    JSON.stringify({ processes: workload, type: "All", quantum: quantum }),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )).data
                console.log(response)
                const resultList = response.data.split("\n")
                resultList.pop()
                //the metrics are in order total - average and in tat - rt - ct
                //normalize the metrics to have keys
                const resultWKeys = resultList.map((result, idx) => {
                    let algo = ""
                    if (idx === 0) algo = "FCFS"
                    if (idx === 1) algo = "SJF"
                    if (idx === 2) algo = "STCF"
                    if (idx === 3) algo = "RR"
                    const metrics = result.split(" ")
                    //lesser === better for these times
                    if (bestTat === -1) {
                        setBestTat(metrics[3])
                        setBestTatAlgo(idxmap.get(idx))
                    }
                    if (bestRt === -1) {
                        setBestRt(metrics[4])
                        setBestRtAlgo(idxmap.get(idx))

                    }
                    if (metrics[3] < bestTat) {
                        setBestTat(metrics[3])
                        setBestTatAlgo(idxmap.get(idx))
                    }
                    if (metrics[4] < bestRt) {
                        setBestRt(metrics[4])
                        setBestRtAlgo(idxmap.get(idx))
                    }
                    return {
                        type: algo,
                        "Total Turnaround Time": metrics[0],
                        "Total Response Time": metrics[1],
                        "Total Completion Time": metrics[2],
                        "Average Turnaround Time": metrics[3],
                        "Average Response Time": metrics[4],
                        "Average Completion Time": metrics[5],
                    }
                })
                console.log(resultWKeys)
                setMetrics(resultWKeys)
            }
            catch (error) {
                console.log("ERROR : " + error)
            }
        })()
    }, [workload])
    return (
        <div style={{ marginTop: "1rem", width: "100%", height: "100%", display: "flex", flexDirection: 'column', alignItems: "center" }}>
            <Typography textAlign="center">The best algorithm for this workload for optimal turnaround time/efficiency, is <Typography display="inline" fontWeight="bold">{bestTatAlgo}</Typography> with an average turnaround time of <Typography display="inline" fontWeight="bold">{bestTat}</Typography></Typography>
            <Typography>The best algorithm for this workload for optimal response time/fairness, is <Typography display="inline" fontWeight="bold">{bestRtAlgo}</Typography> with an average response time of <Typography display="inline" fontWeight="bold">{bestRt}</Typography></Typography>
            <BarChart
                width={1000}
                height={500}
                data={metrics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={metricType === "Average" ? "Average Turnaround Time" : "Total Turnaround Time"} fill="#8884d8" />
                <Bar dataKey={metricType === "Average" ? "Average Response Time" : "Total Response Time"} fill="#82ca9d" />
                <Bar dataKey={metricType === "Average" ? "Average Completion Time" : "Total Completion Time"} fill="#ffc658" />
            </BarChart>
            <Button variant='contained' onClick={switchMetrics}>See {metricType === "Average" ? "Total" : "Average"} metrics</Button>
        </div>
    )
}

export default ComparisonDashboard

import React, {useState} from 'react'
import {Typography} from '@mui/material'
import { Outlet } from 'react-router'
import Workload from './Workload'

const MainScreen = () => {
  const [workload, setWorkload] = useState([])
  const [quantum ,setQuantum] = useState(0)
  const [schedulingAlgo, setAlgo] = useState({ label: "First Come First Serve" })
  return (
    <div style={{display : "flex", flexDirection : "column", alignItems : "center", paddingTop : "2rem"}}>
      <Typography variant="h3">
        CPU Scheduling Algorithms Simulator
      </Typography>
      <Outlet context={[workload, setWorkload, quantum, setQuantum, schedulingAlgo, setAlgo]} />
    </div>
  )
}

export default MainScreen

import React, {useState} from 'react'
import {Typography} from '@mui/material'
import Workload from './Workload'

const MainScreen = () => {
  const [workload, setWorkload] = useState([])
  return (
    <div style={{display : "flex", flexDirection : "column", alignItems : "center", paddingTop : "2rem"}}>
      <Typography variant="h2">
        CPU Scheduling Algorithms Simulator
      </Typography>
      <Workload workload={workload} setWorkload={setWorkload} />
    </div>
  )
}

export default MainScreen

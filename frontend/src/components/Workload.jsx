import React, { useState } from 'react'
import { List, ListItem, Typography, TextField, Button, IconButton, Autocomplete, Dialog, DialogTitle } from '@mui/material'
import { Link as RRLink } from 'react-router-dom'
import DeleteIcon from "@mui/icons-material/Delete"
import { useOutletContext } from 'react-router'


const Row = ({ id, arrivalTime, burstTime, tickets, heading, handleDelete }) => {
    return <ListItem sx={{ borderTop: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black", display: "flex", alignItems: "center", justifyContent: "space-around", width: "80%" }}>
        <Typography width="20%" padding="1rem" >{id}</Typography>
        <Typography width="20%" padding="1rem">{arrivalTime}</Typography>
        <Typography width="20%" padding="1rem">{burstTime}</Typography>
        <Typography width="20%" padding="1rem">{tickets}</Typography>
        <IconButton sx={{ visibility: heading ? "hidden" : "visible" }} onClick={() => handleDelete(id, arrivalTime, burstTime, tickets)}>
            <DeleteIcon />
        </IconButton>
    </ListItem>
}

const Workload = () => {
    const [workload, setWorkload, quantum, setQuantum, schedulingAlgo, setAlgo] = useOutletContext()
    const [isOpen, setOpen] = useState(false)
    const [pid, setPid] = useState()
    const [arrivalTime, setArrivalTime] = useState()
    const [burstTime, setBurstTime] = useState()
    const [tickets, setTickets] = useState()

    const handleAddProcess = () => {
        if (pid && arrivalTime && burstTime && tickets) {
            const newWorkload = [...workload, { pid: pid, tickets: tickets, burstTime: burstTime, arrivalTime: arrivalTime }]
            setWorkload(newWorkload)
            setPid("")
            setArrivalTime("")
            setBurstTime("")
            setTickets("")
        }
    }
    const handleDeleteProcess = (id, atime, btime, tickets) => {
        const newWorkload = workload.filter(job => {
            return job.pid !== id || job.arrivalTime !== atime || job.burstTime !== btime || job.tickets !== tickets
        })
        setWorkload(newWorkload)
    }
    const rowList = workload.map(job => {
        return (
            <Row arrivalTime={job.arrivalTime} burstTime={job.burstTime} tickets={job.tickets} id={job.pid} heading={false} handleDelete={handleDeleteProcess} />
        )
    })
    const schedulingOptions = [
        { label: "First Come First Serve" },
        { label: "Shortest Job First" },
        { label: "Shortest Time to Complete First" },
        { label: "Round Robin" },
        { label: "Lottery Scheduling" },
    ]
    return (
        <List sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Row id="Process ID" arrivalTime="Arrival Time" burstTime="Burst Time" tickets="Tickets" heading={true} />
            {rowList}
            <ListItem sx={{ border: "1px solid black", display: "flex", width: "80%", alignItems: "center", justifyContent: "center" }}>
                <TextField value={pid} onChange={(e) => setPid(e.target.value)} sx={{ width: "25%", padding: "1rem" }} />
                <TextField value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} sx={{ width: "25%", padding: "1rem" }} />
                <TextField value={burstTime} onChange={(e) => setBurstTime(e.target.value)} sx={{ width: "25%", padding: "1rem" }} />
                <TextField value={tickets} onChange={(e) => setTickets(e.target.value)} sx={{ width: "25%", padding: "1rem" }} />
            </ListItem>
            <Button sx={{ marginTop: '1rem' }}  onClick={handleAddProcess}>Add process</Button>
            <ListItem sx={{ marginTop: '1rem', display: "flex", width: "80%", alignItems: "center", justifyContent: "center" }}>
                <Button component={RRLink} to='/comparison' sx={{ marginTop: '1rem', marginRight : "1rem" }} variant="contained">Run all non-ticketed and compare</Button>
                <Button sx={{ marginTop: '1rem', marginRight : "1rem" }} variant="outlined" onClick={() => setOpen(true)}>Run a specific algo</Button>
                <TextField sx={{marginTop: '1rem'}} size='small' label="Scheduling quantum (for fair share schedulers)" value={quantum} onChange={(e) => setQuantum(e.target.value)} />
            </ListItem>
            <Dialog open={isOpen} onClose={() => setOpen(false)}>
                <DialogTitle sx={{textAlign : "center"}}>Choose the specific algorithm</DialogTitle>
                <Autocomplete disablePortal options={schedulingOptions} sx={{width :"300px", margin : "2rem"}} renderInput={(params) => <TextField {...params} label="Movie" />} value={schedulingAlgo} onChange={(e) => setAlgo(e.target.value)}  />
                <Button sx={{margin : "1rem"}}>Simulate</Button>
            </Dialog>
        </List>
    )
}

export default Workload

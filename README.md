# Process Scheduling Simulator
This repository implements a simulator in C++ and web-based frontend to analyze different performance metrics for CPU scheduling algorithms on custom workloads. A web based interface is provided to the user for providing job details, and the simulation results are displayed in Gantt charts and comparison bar graphs.  
A lot of my understanding of these algorithms and scheduling and context switching in general is from the book [Operating Systems : Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/).  
Note : The report provides a far more detailed examination of the algorithm implementations, the motivations behind the chosen metrics and tradeoffs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Working and Flow](#working-and-flow)
- [Algorithms Implemented and Metrics Used](#algorithms-implemented-and-metrics-used)
- [Further Implementations](#further-implementations)

## Installation

Clone the repository. 
```
git clone git@github.com:abi-sheks/scheduling-simulator.git
cd scheduling-simulator
```
Navigate to the ```lib``` directory and compile the required scheduler binaries. Note that there will be no interaction with these binaries from the users side, they will be interacted with only by the web server.
Also, navigate to ```lib/include/paths.h``` and replace all instances of <BASE_DIR> with the directory you ran ```git clone``` in. This solution is in lieu of the lack of a healthy/convenient .env ecosystem in C++ :)
```
cd lib
make scheduler
make metrics
```
Setup the Express backend (below instructions assume you are at the base directory). Create and populate a ```.env``` file using the .env.example and replace <BASE_DIR> with the directory you ran ```git clone``` in.
```
cd backend/server
npm install
npm run serve
```
The server will now be running on http://localhost:8000
Setup the React frontend.
```
cd frontend
npm install
npm start
```
The simulator app can now be accessed on http://localhost:3000

## Usage
Access the web based interface on http://localhost:3000 and play arounf with different workloads and algorithms. For lottery scheduling, tickets are a required field and will throw an error if not provided. It is recommended to always set the time slice/scheduling quantum. Setting it equal to zero will throw an error as well (of course).  
There are two main ways to use the interface - 
- Simulate for a single algorithm and view its Gantt chart and performance metrics.
- Simulate for all algorithms and view comparison based on given metrics.

## Tech Stack
The project can broadly be broken up into 3 pieces - 
- Frontend - Standard React frontend with MUI components to maintain a clean look. Uses Recharts, a wrapper over D3.js to do most of the heavy lifting on data visualization.
- Backend - Small Express web server that interact with the simulator binaries.
- Simulator - Written in C++. I chose it over C for its robust standard library.

## Working and Flow
The working of the entire system is as follows -
1. The user provides process details and selects the algorithm to be run using the frontend.
2. The frontend communicates with the server and lets it know which binary to run and with what parameters
3. The backend uses an ```exec``` call to execute the specified binary after writing the process information to the specified input file.
4. The C++ simulator executes the algorithm and writes the metrics to output files.
5. The backend reads these files on successfully executing and send the info back to the frontend
6. The frontend uses charts and other rich visualization methods to display the data.
Data is not persisted between different scheduler runs.

![Screenshot 2024-06-19 083358](https://github.com/abi-sheks/scheduling-simulator/assets/103749272/9e8bada8-91c4-4820-8322-0967adb89bf0)  
Fig1. Result on an individual algorithm run

![Screenshot 2024-06-19 083545](https://github.com/abi-sheks/scheduling-simulator/assets/103749272/9bba35e6-fb43-4788-b44a-357fadafbcbd)  
Fig2. Result on a comparison run

## Algorithms Implemented and Metrics Used
The algorithms, their key implementational details in code and the overall architecture and design ideas are discussed in detail in the report. Likewise, the metrics optimized by the different scheduling algorithms and their tradeoffs are discussed in detail there.
Below is a short overview of the algorithms implemented and the metrics used to gauge them:
We are assuming that the arrival times and burst times (time taken to complete) are known to us.
Metrics:
- Turnaround time - Defined as the difference between the time of completion and time of arrival. It is used as a measure of efficiency of scheduling.
- Response time - Defined as the difference between the time at which the process is first scheduled and the time of arrival. It measures fairness/interactivity.

Algorithms implemented:
1. First Come First Serve(FCFS) - The most basic, schedules according to time of arrivals. Optimizes practically nothing. It is only really optimal for disjoint processes.
2. Shortest Job First(SJF) - Schedules processes according to their burst time on arrival. A step towards optimizing turnaround time, but still not the best we could do.
3. Shortest Time to Completion First(STCF) - A preemptive version of SJF (preemptive vs non preemptive discussed in report), optimizes turnaround time by always scheduling the process which has lowest time left to completion. However, it performs poorly from a fairness perspective.
4. Round Robin(RR) - Switches between processes every time slice/scheduling quantum. Optimizes fairness by trading off turnaround time.
5. Lottery Scheduling - Probabilistic fair share algorithm where jobs are allocated a certain number of tickets (ticket allocation is complex - here it is assumed the user does it), holds a "lottery" every time slice and the process with the winning ticket is scheduled. Optimizes fairness by trading off turnaround time.   

For most runs and workloads, it was observed that STCF almost always performs best in turnaround time, while response time is minimized by Round Robin or Lottery Scheduling. For larger values of scheduling quantum, Round Robin underperforms in fairness and starts performing better in efficiency instead. 

## Further Implementations
Could possibly implement a Multi-level Feedback Queue or some version of the Linux CFS (Completely Fair Scheduler). Had trouble figuring out how I'd simulate a process relinquishing control of the CPU to perform I/O, so dropped these for now.



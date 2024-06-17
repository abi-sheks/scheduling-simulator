#pragma once
// Asumption - Processes do not relinquish CPU control to perform I/O
struct proc
{
    int pid;

    int arrival_time;
    // time taken for process to complete
    int burst_time;
    int firstrun_time;
    int completion_time;
    int time_to_completion;

    // performance metrics
    int response_time;
    int turnaround_time;

    // factory method
    void init_proc(int id, int atime, int btime)
    {
        pid = id;
        arrival_time = atime;
        burst_time = btime;
        // default, will be computed at the end of process lifecycle
        firstrun_time = 0;
        completion_time = 0;
        response_time = 0;
        turnaround_time = 0;
        time_to_completion = burst_time;
    }
};

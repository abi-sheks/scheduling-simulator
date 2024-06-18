#pragma once
#include "process.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

namespace rr
{
    bool compare(proc p1, proc p2)
    {
        // in case of identical arrival time, they will be arbitrarily processed
        return p1.arrival_time < p2.arrival_time;
    }
    // the scheduling quantum parameter will hereby be referred to as a time_slice
    void simulate(std::string time_slice, std::ios_base::openmode mode, std::string file_path)
    {
        int ts = atoi(time_slice.c_str());
        std::vector<proc> processes = get_processes();

        std::sort(processes.begin(), processes.end(), compare);
        int proc_count = processes.size();

        // just keep iterating for every time_slice until all processes are complete
        int incomplete_processes = proc_count;

        // used to index into processes
        int ptr = 0;
        int current_time = processes[0].arrival_time;
        if (ts == 0)
        {
            // an obviously invalid case, the processes will never be scheduled
            std::cerr << "ERROR : INVALID VALUE OF SCHEDULING QUANTUM. \n";
            return;
        }
        while (incomplete_processes)
        {
            //the two edge cases need to ba handled differently as the scheduler will respond differently
            if (processes[ptr].time_to_completion == 0)
            {
                //simply advance pointer and check
                ptr = (ptr + 1) % proc_count;
                continue;
            }
            if(processes[ptr].arrival_time > current_time)
            {
                //all subsequent processes are unreachable as well
                //the scheduler will idle
                current_time++;
                continue;
            }
            // schedulable process
            // check to set firstrun time
            if (processes[ptr].firstrun_time == -1)
            {
                processes[ptr].firstrun_time = current_time;
                processes[ptr].response_time = current_time - processes[ptr].arrival_time;
            }
            // decrease ttc by minimum of time slice/itself
            processes[ptr].time_to_completion -= std::min(processes[ptr].time_to_completion, ts);
            current_time += std::min(processes[ptr].time_to_completion, ts);
            // check if process has been completed
            if (processes[ptr].time_to_completion == 0)
            {
                processes[ptr].completion_time = current_time;
                processes[ptr].turnaround_time = current_time - processes[ptr].arrival_time;
                incomplete_processes--;
            }
            ptr = (ptr + 1) % proc_count;
        }
        // get average metrics
        metrics result = calculate_metrics(processes);

        // return metrics
        std::cout << result.avg_tat << " " << result.avg_rt << " " << result.total_tat << " " << result.total_rt << "\n";
        write_to_output_file(result.total_tat, result.total_rt, result.total_ct, result.avg_tat, result.avg_rt, result.avg_ct, mode, file_path);
    }
}
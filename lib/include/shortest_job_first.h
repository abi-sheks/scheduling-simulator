#pragma once
#include "process.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <algorithm>

namespace sjf
{
    bool compare(proc &p1, proc &p2)
    {
        if (p1.arrival_time != p2.arrival_time)
            return p1.arrival_time < p2.arrival_time;
        // if they arrive at the same time, pick the shorter job
        else
            return p1.burst_time < p2.burst_time;
    }
    void simulate(std::ios_base::openmode mode, std::string file_path)
    {
        std::vector<proc> processes = get_processes();
        int proc_count = processes.size();

        // non preemptive, so we simply order based on arrival time
        // in case of same arrrival time, we pick the job with smaller burst time
        std::sort(processes.begin(), processes.end(), compare);
        int current_time = processes[0].arrival_time;
        for (auto &process : processes)
        {
            process.firstrun_time = current_time;
            process.response_time = process.firstrun_time - process.arrival_time;

            // process runs until completion
            current_time += process.burst_time;
            process.completion_time = current_time;
            process.turnaround_time = process.completion_time - process.arrival_time;
        }

        // get average metrics
        metrics result = calculate_metrics(processes);

        // return metrics
        std::cout << result.avg_tat << " " << result.avg_rt << " " << result.total_tat << " " << result.total_rt << "\n";
        write_to_output_file(result.total_tat, result.total_rt, result.total_ct, result.avg_tat, result.avg_rt, result.avg_ct, mode, file_path);
    }
}
#pragma once
#include "process.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <algorithm>

namespace fcfs
{

    bool comp(proc &p1, proc &p2)
    {
        // in case of identical arrival time, they will be arbitrarily processed
        return p1.arrival_time < p2.arrival_time;
    }
    void simulate(std::ios_base::openmode mode, std::string metrics_file_path, std::string gantt_file_path)
    {
        std::vector<proc> processes = get_processes();
        int proc_count = processes.size();
        //to prevent accidental hits from server
        if(proc_count == 0) return;
        // overall iterations = summation of burst times of all processes
        // sort processes by arrival time
        std::sort(processes.begin(), processes.end(), comp);
        // schedule them one by one
        int current_time = processes[0].arrival_time;
        for (auto &process : processes)
        {
            if(current_time < process.arrival_time) current_time = process.arrival_time;
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
        write_metrics_to_output_file(result.total_tat, result.total_rt, result.total_ct, result.avg_tat, result.avg_rt, result.avg_ct, mode, metrics_file_path);
        if(gantt_file_path != "") write_gantt_data(processes, gantt_file_path);
    }
}
#pragma once
#include "process.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

namespace stcf
{
    bool compare(proc p1, proc p2)
    {
        // in case of identical arrival time, they will be arbitrarily processed
        return p1.arrival_time < p2.arrival_time;
    }
    void simulate()
    {
        std::vector<proc> processes = get_processes();
        std::sort(processes.begin(), processes.end(), compare);
        int proc_count = processes.size();

        // takes O(total_time*number_of_processes)
        int incomplete_processes = proc_count;
        int current_time = processes[0].arrival_time;
        // iterates until all processes complete
        while (incomplete_processes)
        {
            // iterate through all schedulable processes to find the shortest one
            int sji = -1;
            int shortest_ttc = INT_MAX;
            for (auto &process : processes)
            {
                // if schedulable
                if (process.time_to_completion > 0 && process.arrival_time <= current_time)
                {
                    if (process.time_to_completion < shortest_ttc)
                    {
                        // a little pointer magic to get the index
                        sji = &process - &processes[0];
                        shortest_ttc = process.time_to_completion;
                    }
                }
            }
            // if this is the first time being scheduled
            if (processes[sji].firstrun_time == -1)
            {
                processes[sji].firstrun_time = current_time;
                processes[sji].response_time = processes[sji].firstrun_time - processes[sji].arrival_time;
            }

            // decrementing ttc instead of burst time, not a problem as they are identical. perhaps a little redundant.
            processes[sji].time_to_completion--;
            current_time++;
            // if done, mark as completion time
            if (processes[sji].time_to_completion == 0)
            {
                processes[sji].completion_time = current_time;
                processes[sji].turnaround_time = processes[sji].completion_time - processes[sji].arrival_time;
                incomplete_processes--;
            }
        }
        // calculate total and average metrics
        // get average metrics
        metrics result = calculate_metrics(processes);

        // return metrics
        std::cout << result.avg_tat << " " << result.avg_rt << " " << result.total_tat << " " << result.total_rt << "\n";
        write_to_output_file(result.total_tat, result.total_rt, result.total_ct, result.avg_tat, result.avg_rt, result.avg_ct);
    }
}
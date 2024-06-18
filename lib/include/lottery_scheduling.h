#pragma once
#include "process.h"
#include "utils.h"
#include <iostream>
#include <vector>
#include <queue>
#include <set>
#include <algorithm>
#include <random>
#include <climits>
#include <memory>

namespace lottery
{
// as a process completes, its tickets are ERASED from the pool, not redistributed.
// maintain a sorted list of runnable processes in descending order of their number of tickets
bool ticket_compare(ticketed_proc p1, ticketed_proc p2)
{
    if (p1.tickets != p2.tickets)
        return p1.tickets > p2.tickets;
    // super super important, this is a set so the comparator straight up ignores anything with same number of tickets
    return p1.process.pid < p2.process.pid;
}
bool at_compare(ticketed_proc &p1, ticketed_proc &p2)
{
    return p1.process.arrival_time < p2.process.arrival_time;
}

void simulate(std::string time_slice, std::ios_base::openmode mode, std::string metrics_file_path, std::string gantt_file_path)
{
    int ts = atoi(time_slice.c_str());
    std::vector<ticketed_proc> processes = get_ticketed_processes();
    int proc_count = processes.size();
    if (proc_count == 0)
        return;
    std::set<ticketed_proc, decltype(ticket_compare) *> runnable_procs(ticket_compare);
    std::vector<ticketed_proc> final_vec;
    // sort the original processes array based on arrival time
    std::sort(processes.begin(), processes.end(), at_compare);
    int current_time = processes[0].process.arrival_time;
    int incomplete_processes = proc_count;
    int ticket_pool = 0;
    // will be required for edge case
    int next_greatest_at = -1;
    while (incomplete_processes)
    {
        // iterate through processes and see which can be scheduled according to current_time
        // add them to the runnable set and add their tickets to the pool
        // todo : can be optimized to remove this loop
        for (auto tproc : processes)
        {
            if (tproc.process.arrival_time > current_time)
            {
                next_greatest_at = tproc.process.arrival_time;
                break;
            }
            // if the process has not yet completed and is now eligible to be run
            if (runnable_procs.count(tproc) == 0 && tproc.process.completion_time == -1)
            {
                ticket_pool += tproc.tickets;
                runnable_procs.insert(tproc);
            }
        }
        // hypothetical case -> in case nothing is schedulable and the next process is far off
        if (runnable_procs.empty() && current_time < next_greatest_at)
        {
            current_time = next_greatest_at;
            continue;
        }

        std::random_device dev;
        std::mt19937 rng(dev());
        std::uniform_int_distribution<std::mt19937::result_type> dist6(0, ticket_pool - 1);
        int winner = dist6(rng);
        // iterate through the set and schedule the winning ticket
        int current_sum = 0;
        auto winning_proc_it = runnable_procs.end();
        for (auto it = runnable_procs.begin(); it != runnable_procs.end(); ++it)
        {
            current_sum += it->tickets;
            if (current_sum > winner)
            {
                // found the winner, schedule him
                winning_proc_it = it;
                break;
            }
        }

        if (winning_proc_it == runnable_procs.end())
        {
            std::cerr << "FAILED TO SELECT WORKING PROCESS.\n";
            return;
        }

        ticketed_proc &winning_proc = const_cast<ticketed_proc &>(*winning_proc_it);
        // schedule the winning proc for a time slice
        if (winning_proc.process.firstrun_time == -1)
        {
            winning_proc.process.firstrun_time = current_time;
            winning_proc.process.response_time = current_time - winning_proc.process.arrival_time;
        }
        // decrease ttc by minimum of time slice/itself
        winning_proc.process.time_to_completion -= std::min(winning_proc.process.time_to_completion, ts);
        current_time += std::min(winning_proc.process.time_to_completion, ts);
        // check if process has been completed
        if (winning_proc.process.time_to_completion == 0)
        {
            winning_proc.process.completion_time = current_time;
            winning_proc.process.turnaround_time = current_time - winning_proc.process.arrival_time;
            incomplete_processes--;
            // erase it from the set
            ticket_pool -= winning_proc.tickets;
            // update the final set with this completed process, the initial array is obviously untouched by this change
            auto winning_proc_copy = winning_proc;
            final_vec.push_back(winning_proc_copy);
            runnable_procs.erase(winning_proc_it);
        }

        if (runnable_procs.empty() && incomplete_processes > 0)
        {
            current_time = next_greatest_at;
        }
    }
    // tickets no longer relevant, map out a normal process array
    std::vector<proc> n_processes;
    for (auto tproc : final_vec)
    {
        // ok as no further references to processes vector
        n_processes.push_back(tproc.process);
    }
    metrics result = calculate_metrics(n_processes);

    // return metrics
    std::cout << result.avg_tat << " " << result.avg_rt << " " << result.total_tat << " " << result.total_rt << "\n";
    write_metrics_to_output_file(result.total_tat, result.total_rt, result.total_ct, result.avg_tat, result.avg_rt, result.avg_ct, mode, metrics_file_path);
    if (gantt_file_path != "")
        write_gantt_data(n_processes, gantt_file_path);
}
}
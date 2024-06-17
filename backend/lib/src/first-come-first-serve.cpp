#include "./process.h"
#include "./utils.h"
#include <iostream>
#include <vector>
#include <algorithm>

bool comp(proc p1, proc p2)
{
    //in case of identical arrival time, they will be arbitrarily processed
    return p1.arrival_time < p2.arrival_time;
}
int main(int argc, char *argv[])
{
    std::vector<proc> processes = get_processes();
    int proc_count = processes.size();
    //overall iterations = summation of burst times of all processes
    //sort processes by arrival time
    std::sort(processes.begin(), processes.end(), comp);
    //schedule them one by one
    int current_time = processes[0].arrival_time;
    for(auto &process : processes)
    {
        process.firstrun_time = current_time;
        process.response_time = process.firstrun_time - process.arrival_time;

        //process runs until completion
        current_time += process.burst_time;
        process.completion_time = current_time;
        process.turnaround_time = process.completion_time - process.arrival_time;
    }
    //get average metrics
    int total_comp_time = 0; for(auto process : processes) total_comp_time += process.completion_time;
    int total_ta_time = 0; for(auto process : processes) total_ta_time += process.turnaround_time;
    int total_response_time = 0; for(auto process : processes) total_response_time += process.response_time;
    float avg_comp = total_comp_time / proc_count;
    float avg_ta = total_ta_time / proc_count;
    float avg_response = total_response_time / proc_count;

    //return metrics
    std::cout << avg_ta << " " << avg_response << " " << total_ta_time << " " << total_response_time << "\n"; 
    write_to_output_file(total_ta_time, total_response_time, total_comp_time, avg_ta, avg_response, avg_comp);
    return 0;
}

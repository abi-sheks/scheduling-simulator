#pragma once
#include <fstream>
#include <vector>
#include <sstream>
#include "./process.h"
#include <string>
#include "./paths.h"

struct metrics
{
    int total_tat;
    int total_rt;
    int total_ct;
    float avg_ct;
    float avg_rt;
    float avg_tat;
};


std::vector<proc> get_processes()
{
    // expects process information in BASE_BACKEND_DIR/process_info.txt
    // process_info should have newline separated values pid<space>arrival_time<space>burst_time
    std::ifstream config_file(input_file_path);
    std::vector<proc> processes;
    int pid;
    int atime;
    int btime;
    std::string line;
    while (std::getline(config_file, line))
    {
        std::istringstream iss(line);
        if (!(iss >> pid >> atime >> btime))
        {
            break;
        }
        proc new_proc;
        new_proc.init_proc(pid, atime, btime);
        processes.push_back(new_proc);
    }
    config_file.close();
    return processes;
}
std::vector<ticketed_proc> get_ticketed_processes()
{
    // expects process information in BASE_BACKEND_DIR/process_info.txt
    // process_info should have newline separated values pid<space>arrival_time<space>burst_time
    std::ifstream config_file(input_file_path);
    std::vector<ticketed_proc> processes;
    int pid;
    int atime;
    int btime;
    int tickets;
    std::string line;
    while(std::getline(config_file, line))
    {
        std::istringstream iss(line);
        if (!(iss >> pid >> atime >> btime >> tickets))
        {
            break;
        }
        ticketed_proc new_proc;
        new_proc.init_proc(pid, atime, btime, tickets);
        processes.push_back(new_proc);
    }
    config_file.close();
    return processes;
}

metrics calculate_metrics(std::vector<proc> processes)
{
    metrics result;
    int proc_count = processes.size();
    if (proc_count == 0)
        return result;
    result.total_ct = 0;
    for (auto process : processes)
        result.total_ct += process.completion_time;
    result.total_tat = 0;
    for (auto process : processes)
        result.total_tat += process.turnaround_time;
    result.total_rt = 0;
    for (auto process : processes)
        result.total_rt += process.response_time;
    result.avg_ct = (float)result.total_ct / proc_count;
    result.avg_tat = (float)result.total_tat / proc_count;
    result.avg_rt = (float)result.total_rt / proc_count;
    return result;
}

void write_metrics_to_output_file(
    int total_ta,
    int total_r,
    int total_comp,
    float avg_ta,
    float avg_r,
    float avg_comp,
    std::ios_base::openmode mode,
    std::string outfile_path)
{
    std::ofstream out_file(outfile_path, mode);
    out_file << total_ta << " " << total_r << " " << total_comp << " " << avg_ta << " " << avg_r << " " << avg_comp << "\n";
    out_file.close();
}

void write_gantt_data(std::vector<proc> processes, std::string outfile_path)
{
    std::ofstream out_file(outfile_path);
    for(auto proc : processes)
    {
        out_file << proc.pid << " " << proc.arrival_time << " " << proc.firstrun_time << " " << proc.completion_time << "\n";  
    }
    out_file.close();
}

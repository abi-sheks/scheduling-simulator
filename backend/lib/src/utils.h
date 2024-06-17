#pragma once
#include <fstream>
#include <vector>
#include <sstream>
#include "./process.h"
#include <string>

std::vector<proc> get_processes()
{
    //expects process information in BASE_BACKEND_DIR/process_info.txt
    //process_info should have newline separated values pid<space>arrival_time<space>burst_time
    std::ifstream config_file("/root/scheduling-simulator/backend/lib/process_info.txt");
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

void write_to_output_file(
    int total_ta,
    int total_r,
    int total_comp,
    float avg_ta,
    float avg_r,
    float avg_comp
)
{
    std::ofstream out_file;
    out_file.open("/root/scheduling-simulator/backend/lib/outfile.txt");
    out_file << total_ta << " " << total_r << " " << total_comp << " " << avg_ta << " " << avg_r << " " << avg_comp << "\n";
    out_file.close();
}
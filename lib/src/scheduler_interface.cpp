#include "../include/first_come_first_serve.h"
#include "../include/shortest_job_first.h"
#include "../include/round_robin.h"
#include "../include/lottery_scheduling.h"
#include "../include/shortest_ttc_first.h"

std::string  file_path = "/root/scheduling-simulator/lib/outfile.txt";

int main(int argc, char *argv[])
{
    // command lin arguments in the form ```./executable -pol <policy_name>```
    if (argc < 3 || std::string(argv[1]) != "-pol")
    {
        std::cerr << "BAD ARGUMENTS \n";
        return -1;
    }
    std::string policy = argv[2];
    if (policy == "fcfs")
    {
        fcfs::simulate(std::ios::out, file_path);
    }
    else if (policy == "sjf")
    {
        sjf::simulate(std::ios::out, file_path);
    }
    else if (policy == "stcf")
    {
        stcf::simulate(std::ios::out, file_path);
    }
    else if (policy == "rr")
    {
        //round robin requires an additional argument of scheduling quantum
        if(argc < 4) return -1;
        rr::simulate(std::string(argv[3]), std::ios::out, file_path);
    }
    else if(policy == "lottery")
    {
        if(argc < 4) return -1;
        lottery::simulate(std::string(argv[3]), std::ios::out, file_path);
    }
    else
    {
        std::cerr << "UNSUPPORTED POLICY \n";
        return -1;
    }
    return 0;
}
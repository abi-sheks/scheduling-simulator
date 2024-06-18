#include "../include/first_come_first_serve.h"
#include "../include/shortest_job_first.h"
#include "../include/round_robin.h"
#include "../include/shortest_ttc_first.h"

std::string file_path = "/root/scheduling-simulator/lib/metrics_outfile.txt";


//compiles together results for all 
int main(int argc, char *argv[])
{
    //argument expected like ./<exec> -sq <scheduling_quantum>
    if(argc < 3) return -1;
    fcfs::simulate(std::ios::out, file_path);
    sjf::simulate(std::ios::app, file_path);
    stcf::simulate(std::ios::app, file_path);
    rr::simulate(std::string(argv[2]), std::ios::app, file_path);
}
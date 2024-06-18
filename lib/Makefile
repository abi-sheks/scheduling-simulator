FILES := ./src/scheduler_interface.cpp
OBJECTS :=scheduler_interface.o

scheduler:./src/scheduler_interface.cpp
	g++ -c $(FILES) 
	g++ $(OBJECTS) -o scheduler

metrics:./src/bulk_metrics.cpp
	g++ -c ./src/bulk_metrics.cpp
	g++ bulk_metrics.o -o bulk_metrics

run:
	./scheduler

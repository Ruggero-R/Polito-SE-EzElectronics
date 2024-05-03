# Project Estimation - FUTURE

Date: 03/0/2024

Version: 1.0

# Estimation approach

Consider the EZElectronics  project in FUTURE version (as proposed by your team in requirements V2), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch (not from V1)

# Estimate by size

|             | Estimate                        |
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   | 35  |
|  A = Estimated average size per class, in LOC       |   150 |
| S = Estimated size of project, in LOC (= NC * A) | 5250 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  | 525 |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 15750 |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 4 |

# Estimate by product decomposition

|         component name    | Estimated effort (person hours)   |
| ----------- | -------------|
|requirement document | 25 |
| GUI prototype |20|
|design document |5|
|code |62|
| unit tests | 8 |
| api tests |8|
| management documents  |4|

# Estimate by activity decomposition

|         Activity name    | Estimated effort (person hours)   |
| ----------- | ------------------------------- |
| **GROUP AND PROJECT MANAGEMENT** | 9 |
| Project management plan | 5 |
| Scheduling | 3 |
| Risk Estimation | 1 |
| **REQUIREMENTS PLANNING** | 24 |
| Review existing code | 6 |
| Work Analysis | 4 |
| Model process | 2 |
| Identify user requirements |  8  |
| Identify performance requirements |  4 |
| **DESIGN** | 19 |
| Identify and develop the prototype design | 5 |
| Developing the GUI prototype | 14 |
| **IMPLEMENTATION**| 65 |
| Develop general code | 6 |
| Developing the models | 9 |
| Developing the controllers and test code | 50 |
| **TESTING** | 17 |
| API Testing | 9 |
| UI Testing | 2 |
| Testing of NF req | 6 |

![Gantt diagramm](images/diagram/GanttDiagram-v2.0.jpg)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort (in ph) |    Estimated duration (days=(ph/n_members)/ph_of_day)  |
| ----------- | ------------------------------- | ---------------|
| estimate by size |  525  | 17 |
| estimate by product decomposition |   132  | 5 |
| estimate by activity decomposition |  134 | 5 |

The differing results among the three approaches may be related to various factors. 
First of all, the approach based on lines of code (LOC) doesn't consider all the effort spent on requirements, design and testing parts. 
Finally, the discrepancy between the two decomposition approaches is related to the different levels of details required from each method: the activity-based decomposition has a higher level of details respect to the product-based decomposition.

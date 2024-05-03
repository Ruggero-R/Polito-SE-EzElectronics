# Project Estimation - FUTURE

Date: 03/0/2024

Version: 1.0

# Estimation approach

Consider the EZElectronics  project in FUTURE version (as proposed by your team in requirements V2), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch (not from V1)

# Estimate by size

|             | Estimate                        |
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   | 29  |
|  A = Estimated average size per class, in LOC       |   150 |
| S = Estimated size of project, in LOC (= NC * A) | 4350 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  | 435 |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 13050 |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 3 |

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
| estimate by size |  435  | 14 |
| estimate by product decomposition |   132  | 5 |
| estimate by activity decomposition |  134 | 5 |


The reasons why the results given by the three approaches differ from each other could be that the first (by size) uses specific approximations and is only based on the LOC (lines of code) and so it doesn’t include the parts related to PM, requirements, design, and testing. The difference in the 2 other approaches could be explained by the fact that the one splitting by activities has a higher level of details with respect to the one based on the one splitting based on products.

# Project Estimation - CURRENT

Date: 01/05/2024

Version: 1.2

# Estimation approach

Consider the EZElectronics  project in CURRENT version (as given by the teachers), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch

# Estimate by size

|             | Estimate                        |
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |      5  |
|  A = Estimated average size per class, in LOC       |       150 |
| S = Estimated size of project, in LOC (= NC * A) | 750 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |      75  |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 2250 |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 1 |

# Estimate by product decomposition

|         component name    | Estimated effort (person hours)   |
| ----------- | -------------|
|requirement document    | 16 |
| GUI prototype |10|
|design document |4|
|code |56|
| unit tests | 8 |
| api tests |8|
| management documents  |4|

# Estimate by activity decomposition

|         Activity name    | Estimated effort (person hours)   |
| ----------- | ------------------------------- |
| **GROUP AND PROJECT MANAGEMENT** | |
| Project management plan | 4 |
| Scheduling | 2 |
| Risk Estimation | 1 |
| **REQUIREMENTS PLANNING** | |
| Review existing code | 4 |
| Work Analysis | 3 |
| Model process | 2 |
| Identify user requirements |  6 |
| Identify performance requirements |  4 |
| **DESIGN** | |
| Identify and develop the prototype design | 4 |
|Developing the GUI prototype | 8 |
| **IMPLEMENTATION**| |
| Develop general code | 6 |
| Developing the models | 8|
| Developing the controllers and test code | 42 |
| **TESTING** | |
| API Testing | 8 |
| UI Testing | 2 |
| Testing of NF req | 6 |

![Gantt diagramm](images/diagram/GanttDiagram-v1.0.jpg)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort (in ph)      |   Estimated duration (in days) |
| ----------- | --------- | ---------------|
| estimate by size | 75 | 5 |
| estimate by product decomposition | 106 | 25 |
| estimate by activity decomposition | 110 | 28 |

The reasons why the results given by the three approaches differ from each other could be that the first (by size) uses specific approximations and is only based on the LOC (lines of code) and so it doesn’t include the parts related to PM, requirements, design, and testing. The difference in the 2 other approaches could be explained by the fact that the one splitting by activities has a higher level of details with respect to the one based on the one splitting based on products.

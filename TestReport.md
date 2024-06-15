# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

     <report the here the dependency graph of EzElectronics>

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |

## User

This table describes the tests that provide reports for the UserDAO class

|        Test case name        |      Object(s) tested     | Test level | Technique used  |
|:----------------------------|:-------------------------:|:----------:|:---------------:|
| createUser resolves true | createUser method of UserDAO | Unit       | WB/statement coverage |
| getIsUserAuthenticated returns false for unauthenticated user | getIsUserAuthenticated method of UserDAO | Unit       | WB/statement coverage |
| getIsUserAuthenticated rejects on database error | getIsUserAuthenticated method of UserDAO | Unit       | WB/statement coverage |
| createUser throws UserAlreadyExistsError | createUser method of UserDAO | Unit       | WB/statement coverage |
| createUser raises an error | createUser method of UserDAO | Unit       | WB/statement coverage |
| getUserByUsername returns user by username | getUserByUsername method of UserDAO | Unit       | WB/statement coverage |
| getUserByUsername throws UserNotFoundError | getUserByUsername method of UserDAO | Unit       | WB/statement coverage |
| getUserByUsername raises an error | getUserByUsername method of UserDAO | Unit       | WB/statement coverage |
| getUserByUsername throws InvalidParametersError for empty username | getUserByUsername method of UserDAO | Unit       | WB/statement coverage |
| getUsers resolves with users | getUsers method of UserDAO | Unit       | WB/statement coverage |
| getUsers rejects on database error | getUsers method of UserDAO | Unit       | WB/statement coverage |
| getUsersByRole throws UserNotFoundError | getUsersByRole method of UserDAO | Unit       | WB/statement coverage |
| getUsersByRole rejects on database error | getUsersByRole method of UserDAO | Unit       | WB/statement coverage |
| getUsersByRole returns users by role | getUsersByRole method of UserDAO | Unit       | WB/statement coverage |
| deleteUser rejects in get function | deleteUser method of UserDAO | Unit       | WB/statement coverage |
| deleteUser rejects in run function | deleteUser method of UserDAO | Unit       | WB/statement coverage |
| deleteUser deletes user successfully | deleteUser method of UserDAO | Unit       | WB/statement coverage |
| deleteUser throws UserNotFoundError | deleteUser method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin rejects in get function | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin not find anything | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin raises an error | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin rejects in run function | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin deletes user successfully | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteUserAsAdmin throws UserIsAdminError | deleteUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| deleteAllUsers raises an error | deleteAllUsers method of UserDAO | Unit       | WB/statement coverage |
| deleteAllUsers deletes all users successfully | deleteAllUsers method of UserDAO | Unit       | WB/statement coverage |
| deleteAllUsers throws UserNotFoundError | deleteAllUsers method of UserDAO | Unit       | WB/statement coverage |
| updateUser updates user successfully | updateUser method of UserDAO | Unit       | WB/statement coverage |
| updateUser raises an error | updateUser method of UserDAO | Unit       | WB/statement coverage |
| updateUser rejects in get function | updateUser method of UserDAO | Unit       | WB/statement coverage |
| updateUser rejects in run function | updateUser method of UserDAO | Unit       | WB/statement coverage |
| updateUser throws UserNotFoundError | updateUser method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin not find any user | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin not find any user who is not an admin | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin get-function rejects | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin run-function rejects | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin raises an error | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |
| updateUserAsAdmin updates user successfully | updateUserAsAdmin method of UserDAO | Unit       | WB/statement coverage |

This table describes the tests that provide reports for the UserController class

| Test case name                                            | Object(s) tested     | Test level | Technique used         |
| :------------------------------------------------------- | :------------------: | :--------: | :-------------------:  |
| Should return true                                        | `createUser`         | Unit       | Mocking                |
| Should throw InvalidParametersError                       | `createUser`         | Unit       | Error handling         |
| Should throw InvalidParametersError for empty surname     | `createUser`         | Unit       | Error handling         |
| Should throw InvalidRoleError                             | `createUser`         | Unit       | Error handling         |
| Should return all users                                   | `getUsers`           | Unit       | Mocking                |
| Should throw InvalidParametersError                       | `getUserByUsername`  | Unit       | Error handling         |
| Should throw UnauthorizedUserError                        | `getUserByUsername`  | Unit       | Error handling         |
| Should return a user by username                          | `getUserByUsername`  | Unit       | Mocking                |
| Should return all users with a specific role              | `getUsersByRole`     | Unit       | Mocking                |
| Should throw InvalidRoleError                             | `getUsersByRole`     | Unit       | Error handling         |
| Should throw UnauthorizedUserError                        | `deleteUser`         | Unit       | Error handling         |
| Should delete a user                                      | `deleteUser`         | Unit       | Mocking                |
| Should delete a user as admin                             | `deleteUser`         | Unit       | Mocking                |
| Should throw InvalidParametersError if user not found     | `deleteUser`         | Unit       | Error handling         |
| Should delete all users                                   | `deleteAllUsers`     | Unit       | Mocking                |
| Should update a user's information                        | `updateUserInfo`     | Unit       | Mocking                |
| Should throw InvalidParametersError for invalid name      | `updateUserInfo`     | Unit       | Error handling         |
| Should throw ArrivalDateError                             | `updateUserInfo`     | Unit       | Error handling         |
| Should update a user's information as admin               | `updateUserInfo`     | Unit       | Mocking                |
| Should throw UnauthorizedUserError                        | `updateUserInfo`     | Unit       | Error handling         |
| Should throw InvalidParametersError for invalid parameters| `updateUserInfo`     | Unit       | Error handling         |

This table describes the tests that provide reports for the UserRoute class

| Test case name                                                | Object(s) tested    | Test level | Technique used      |
| :-----------------------------------------------------------: | :-----------------: | :--------: | :-----------------: |
| It should return a 200 success code                           | `POST /users`       | Integration | Mocking             |
| It should return a InvalidParametersError for missing fields  | `POST /users`       | Integration | Error handling      |
| It should return UserAlreadyExistsError for existing username | `POST /users`       | Integration | Mocking/Error handling |
| It should raise an error                                      | `GET /users`        | Integration | Mocking/Error handling |
| It should return an array of users                            | `GET /users`        | Integration | Mocking             |
| It should return a 401 error code without admin privileges    | `GET /users`        | Integration | Error handling      |
| It should raise an error                                      | `GET /users/roles/Customer` | Integration | Mocking/Error handling |
| It should return an array of users by role                    | `GET /users/roles/Customer` | Integration | Mocking             |
| It should raise an error                                      | `GET /users/user`   | Integration | Mocking/Error handling |
| It should return a user by username                           | `GET /users/user`   | Integration | Mocking             |
| It should return a 200 success code for deleting a user       | `DELETE /users/user` | Integration | Mocking             |
| It should return a 503 error code for deleting a user with error | `DELETE /users/user` | Integration | Mocking/Error handling |
| It should work for deleting all users                         | `DELETE /users`     | Integration | Mocking             |
| It should not work for deleting all users with error          | `DELETE /users`     | Integration | Mocking/Error handling |
| It should return a 200 success code for updating user information | `PATCH /users/user` | Integration | Mocking             |
| It should return a 401 error code without admin privileges    | `PATCH /users/user` | Integration | Error handling      |
| It should return a 503 error code with an error               | `PATCH /users/user` | Integration | Mocking/Error handling |
| It should return a 404 error code for missing fields          | `PATCH /users/user` | Integration | Mocking/Error handling |
| It should return a 400 error code for invalid role            | `PATCH /users/user` | Integration | Mocking/Error handling |

## Product

This table describes the tests that provide reports for the Product class

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |

## Cart

This table describes the tests that provide reports for the Cart class

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |

## Review

This table describes the tests that provide reports for the Review class

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage

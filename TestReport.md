# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
  - [User](#user)
  - [Product](#product)
  - [Cart](#cart)
  - [Review](#review)
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
| createUser should insert a user customer into the database     | `UserDAO.createUser`            | Integration | Mocking             |
| createUser should throw UserAlreadyExistsError for duplicate username | `UserDAO.createUser`            | Integration | Error handling      |
| getIsUserAuthenticated should return true for correct credentials | `UserDAO.getIsUserAuthenticated` | Integration | Mocking             |
| getIsUserAuthenticated should return false for incorrect password | `UserDAO.getIsUserAuthenticated` | Integration | Mocking             |
| getUserByUsername should retrieve a user from the database     | `UserDAO.getUserByUsername`     | Integration | Mocking             |
| getUserByUsername should throw UserNotFoundError for non-existing user | `UserDAO.getUserByUsername`     | Integration | Error handling      |
| getUsers should retrieve all users from the database           | `UserDAO.getUsers`              | Integration | Mocking             |
| getUsersByRole should retrieve all users with a specific role from the database | `UserDAO.getUsersByRole`        | Integration | Mocking             |
| deleteUser should remove a user from the database              | `UserDAO.deleteUser`            | Integration | Mocking             |
| deleteUser should throw UserNotFoundError for non-existing user | `UserDAO.deleteUser`            | Integration | Error handling      |
| deleteUserAsAdmin should remove a user from the database as an admin | `UserDAO.deleteUserAsAdmin`     | Integration | Mocking             |
| deleteUserAsAdmin should throw UserIsAdminError if trying to delete an admin | `UserDAO.deleteUserAsAdmin`     | Integration | Error handling      |
| updateUser should update user details in the database          | `UserDAO.updateUser`            | Integration | Mocking             |
| updateUser should throw UserNotFoundError for non-existing user | `UserDAO.updateUser`            | Integration | Error handling      |
| updateUserAsAdmin should update user details as an admin       | `UserDAO.updateUserAsAdmin`     | Integration | Mocking             |
| updateUserAsAdmin should throw UserIsAdminError if trying to update an admin | `UserDAO.updateUserAsAdmin`     | Integration | Error handling      |

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
| createUser should create a user in the database | UserController, db                        | Integration | CRUD operation, Data validation |
| createUser should throw an error if the username is already taken | UserController, UserAlreadyExistsError   | Integration | Exception handling, Negative testing |
| getUsers should retrieve all users             | UserController, db                        | Integration | CRUD operation, Data validation |
| getUsersByRole should retrieve all users with a specific role | UserController, db, Role.CUSTOMER       | Integration | CRUD operation, Data filtering |
| getUsersByRole should throw an error if the role is not valid | UserController, InvalidRoleError         | Integration | Exception handling, Negative testing |
| getUserByUsername should retrieve a specific user | UserController, db, User                  | Integration | CRUD operation, Data retrieval |
| getUserByUsername should throw InvalidParametersError if parameters are invalid | UserController, InvalidParametersError   | Integration | Exception handling, Negative testing |
| getUserByUsername should throw UnauthorizedUserError if user is not authorized | UserController, UnauthorizedUserError    | Integration | Exception handling, Negative testing |
| deleteUser should delete a specific user      | UserController, db, User                  | Integration | CRUD operation, Data deletion |
| deleteUser should throw InvalidParametersError if parameters are invalid | UserController, InvalidParametersError   | Integration | Exception handling, Negative testing |
| deleteUser should throw UnauthorizedUserError if user is not authorized | UserController, UnauthorizedUserError    | Integration | Exception handling, Negative testing |
| deleteAllUsers should delete all non-Admin users | UserController, db, User, Role.ADMIN      | Integration | CRUD operation, Data deletion, Data filtering |
| updateUserInfo should update the information of a specific user | UserController, db, User                  | Integration | CRUD operation, Data update |
| updateUserInfo should throw InvalidParametersError if parameters are missing or empty | UserController, InvalidParametersError   | Integration | Exception handling, Negative testing |
| updateUserInfo should throw UnauthorizedUserError if user is not authorized | UserController, UnauthorizedUserError    | Integration | Exception handling, Negative testing |

This table describes the tests that provide reports for the UserRoute class

| Test case name                                                | Object(s) tested    | Test level | Technique used      |
| :----------------------------------------------------------- | :-----------------: | :--------: | :-----------------: |
| It should return a 200 success code                           | `POST /users`       | Unit | Mocking             |
| It should return a InvalidParametersError for missing fields  | `POST /users`       | Unit | Error handling      |
| It should return UserAlreadyExistsError for existing username | `POST /users`       | Unit | Mocking/Error handling |
| It should raise an error                                      | `GET /users`        | Unit | Mocking/Error handling |
| It should return an array of users                            | `GET /users`        | Unit | Mocking             |
| It should return a 401 error code without admin privileges    | `GET /users`        | Unit | Error handling      |
| It should raise an error                                      | `GET /users/roles/Customer` | Unit | Mocking/Error handling |
| It should return an array of users by role                    | `GET /users/roles/Customer` | Unit | Mocking             |
| It should raise an error                                      | `GET /users/user`   | Unit | Mocking/Error handling |
| It should return a user by username                           | `GET /users/user`   | Unit | Mocking             |
| It should return a 200 success code for deleting a user       | `DELETE /users/user` | Unit | Mocking             |
| It should return a 503 error code for deleting a user with error | `DELETE /users/user` | Unit | Mocking/Error handling |
| It should work for deleting all users                         | `DELETE /users`     | Unit | Mocking             |
| It should not work for deleting all users with error          | `DELETE /users`     | Unit | Mocking/Error handling |
| It should return a 200 success code for updating user information | `PATCH /users/user` | Unit | Mocking             |
| It should return a 401 error code without admin privileges    | `PATCH /users/user` | Unit | Error handling      |
| It should return a 503 error code with an error               | `PATCH /users/user` | Unit | Mocking/Error handling |
| It should return a 404 error code for missing fields          | `PATCH /users/user` | Unit | Mocking/Error handling |
| It should return a 400 error code for invalid role            | `PATCH /users/user` | Unit | Mocking/Error handling |
| Integration test for createUser routes                     | `userCustomer`, `userManager`, `userAdmin` | Integration | HTTP request/response validation    |
| Integration test for getUsers routes                        | `userCustomer`, `userManager`, `userAdmin` | Integration | HTTP request/response validation    |
| Integration test for getUserByUsername routes               | `userCustomer`                      | Integration | HTTP request/response validation    |
| Integration test for deleteUser routes                      | `userCustomer`, `userAdmin`          | Integration | HTTP request/response validation    |
| Integration test for updateUser routes                      | `userCustomer`                      | Integration | HTTP request/response validation    |
| It should return 200 for creating a Customer                | `userCustomer`                      | Integration       | Function return value validation    |
| It should return 422 for missing fields                     | N/A                                 | Integration       | Function parameter validation       |
| It should return 422 for invalid role                       | `userCustomer` with invalid role    | Integration       | Function parameter validation       |
| It should return 401 for non-existent user                  | `getUserByUsername` with non-existent username | Integration       | Function parameter validation       |
| It should return 200 and delete user by username            | `deleteUser` with existing user     | Integration       | Function side-effect validation     |
| It should return 404 for non-existent user                  | `deleteUser` with non-existent username | Integration       | Function parameter validation       |
| It should return 200 and update user info                   | `updateUser` with existing user     | Integration       | Function side-effect validation     |
| It should return 422 for missing fields in update           | `updateUser` with missing fields   | Integration       | Function parameter validation       |
| It should return 404 for non-existent user in update        | `updateUser` with non-existent username | Integration       | Function parameter validation       |

## Product

This table describes the tests that provide reports for the ProductDAO class

| Test case name               | Object(s) tested       | Test level | Technique used        |
| :--------------------------: | :--------------------: | :--------: | :-------------------: |
| It should register a product | registerProduct method | Unit       | WB/statement coverage |
| It should throw an error if product already exists | "  | "  | " |
| It should register a product without details | " | " | " |
| It should register a prodcut without arrival date | " | " | " |
| It should throw an error if database fails | " | " | " |
| It should throw an error if an error is thrown in the try block | " | " | " |
| It should change the product quantity                    | changeProductQuantity method | Unit       | WB/statement coverage |
| It should change the product quantity if the changeDate is not specified | " | " | " |
| It should throw an error if product not found            | " | " | " |
| It should throw an error if change date is before the arrival date | " | " | " |
| It should throw an error if change date is after the current date | " | " | " |
| It should throw an error if the database fails to recover the requested model | " | " | " |
| It should throw an error if the database fails to update the product quantity | " | " | " |
| It should throw an error if an error is thrown in the try block | " | " | " |
| It should sell a product                                 | sellProduct method     | Unit       | WB/statement coverage |
| It should sell a product if the sellingDate is not specified | " | " | " |
| It should throw an error if product not found            | " | " | " |
| It should throw an error if the product stock is already 0 | " | " | " |
| It should throw an error if the quantity to sell is greater than the stock | " | " | " |
| It should throw an error if sell date is before the arrival date | " | " | " |
| It should throw an error if sell date is after the current date | " | " | " |
| It should throw an error if the database fails to recover the requested model | " | " | " |
| It should throw an error if the database fails to update the product quantity | " | " | " |
| It should throw an error if an error is thrown in the try block | " | " | " |
| It should get all products in the database if the three parameters are null   | getProducts method | Unit       | WB/statement coverage |
| It should get all products in the database if the grouping is 'category' and the category is valid | " | " | " |
| It should get all products in the database if the grouping is 'model' and the model is valid | " | " | " |
| It should throw a FiltersError if grouping is null and category or model is provided | " | " | " |
| It should throw a FiltersError if grouping is 'category' and category is not provided or model is provided | " | " | " |
| It should throw a FiltersError if grouping is 'model' and model is not provided or category is provided | " | " | " |
| It should throw a FiltersError if grouping is not 'category', 'model', null, or undefined | " | " | " |
| It should throw a ProductNotFoundError if no product is found for the given model | " | " | " |
| It should throw an Error if the database fails to get the products (get method) | " | " | " |
| It should throw an Error if the database fails to get the products (all method) | " | " | " |
| It should throw an Error if an error is thrown in the try block                | " | " | " |
| It should get all available products in the database if the three parameters are null           | getAvailableProducts method | Unit       | WB/statement coverage |
| It should get all available products in the database if the grouping is 'category' and the category is valid | "                       | "          | "                     |
| It should get the available product in the database if the grouping is 'model' and the model is valid | "                        | "          | "                     |
| It should throw a FiltersError if grouping is null and category or model is provided            | "                        | "          | "                     |
| It should throw a FiltersError if grouping is 'category' and category is not provided or model is provided | "                      | "          | "                     |
| It should throw a FiltersError if grouping is 'model' and model is not provided or category is provided | "                        | "          | "                     |
| It should throw a FiltersError if grouping is not 'category', 'model', null, or undefined       | "                        | "          | "                     |
| It should throw a ProductNotFoundError if no product is found for the given model               | "                        | "          | "                     |
| It should throw an Error if the database fails to get the products (get method)                 | "                        | "          | "                     |
| It should throw an Error if the database fails to get the products (all method)                 | "                        | "          | "                     |
| It should throw an Error if an error is thrown in the try block                                 | "                        | "          | "                     |
| It should throw an EmptyProductStockError if the requested model is out of stock                | "                        | "          | "                     |
| It should delete all products | deleteAllProducts method | Unit       | WB/statement coverage |
| It should throw an Error if the database fails to delete the products | " | " | " |
| It should throw an Error if an error is thrown in the try block | " | " | " |
| It should delete the product if the model is valid                    | deleteProduct method  | Unit       | WB/statement coverage |
| It should throw a ProductNotFoundError if the model is not found      | "   | " | " |
| It should throw an Error if the database fails to get the product     | "  | " | " |
| It should throw an Error if the database fails to delete the product  | "  | " | " |
| It should throw an Error if an error is thrown in the try block       | "  | " | " |












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

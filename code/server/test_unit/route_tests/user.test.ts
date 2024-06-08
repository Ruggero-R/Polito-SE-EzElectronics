import { describe, test, expect, jest, afterEach, beforeAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { Role, User } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import UserController from "../../src/controllers/userController"
import { UserRoutes } from "../../src/routers/userRoutes"
import {
    InvalidParametersError,
    UserAlreadyExistsError,
    UserIsAdminError,
    UserNotFoundError,
    UserNotManagerError,
    UserNotCustomerError,
    UserNotAdminError,
    UnauthorizedUserError,
    InvalidRoleError
} from '../../src/errors/userError';
import { error } from "console"
import e from "express"

const baseURL = "/ezelectronics"
jest.mock('../../src/controllers/userController')
jest.mock('../../src/routers/auth')

// Cleanup after each test
afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
})

const userCustomer = {
    username: "test",
    name: "test",
    surname: "test",
    password: "test",
    role: "Customer" as Role,
    address: "test",
    birthdate: "test"
}


//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters
test("It should return a 200 success code", async () => {
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})

test("It should return a InvalidParametersError for creating a user with missing fields", async () => {
    jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new InvalidParametersError())
    const response = await request(app).post(baseURL + "/users").send({ ...userCustomer, name: undefined })
    expect(response.status).toBe(404)
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(userCustomer.username, undefined, userCustomer.surname, userCustomer.password, userCustomer.role, userCustomer.address, userCustomer.birthdate)
})

test("It should return UserAlreadyExistsError for creating a user with an existing username", async () => {
    jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new UserAlreadyExistsError())
    const response = await request(app).post(baseURL + "/users").send(userCustomer)
    expect(response.status).toBe(409)
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1)
})

// Test for retrieving all users
test("It should return an array of users for retrieving all users", async () => {
    const users = [
        {
            username: "test1",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Customer" as Role
        },
        {
            username: "test2",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Manager" as Role
        },
        {
            username: "test3",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Admin" as Role
        }
    ];
    jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(users)
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).post(baseURL + "/users").send(users)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(users)
    expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1);
    expect(Array.isArray(response.body)).toBe(true);
})

test("It should return a 401 error code for retrieving all users without being logged in", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockRejectedValueOnce(new UserNotAdminError)

    const response = await request(app).get(baseURL + "/users")
    expect(response.status).toBe(401)
    expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
})  //Check if the createUser method has been called with the correct parameters

test("It should return a 403 error code for retrieving all users without admin privileges", async () => {
    jest.spyOn(Authenticator.prototype, "isCustomer" || "isManager").mockRejectedValueOnce(new UserNotAdminError)

    const response = await request(app).get(baseURL + "/users")
    expect(response.status).toBe(403)
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
})  //Check if the createUser method has been called with the correct parameters

// Test for retrieving users by role
test("It should return an array of users for retrieving users by role", async () => {
    const role = "Customer"
    const users = [
        {
            username: "test1",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Customer" as Role
        },
        {
            username: "test01",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Customer" as Role
        },
        {
            username: "test2",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Manager" as Role
        },
        {
            username: "test02",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Manager" as Role
        },
        {
            username: "test3",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Admin" as Role
        },
        {
            username: "test03",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: "Admin" as Role
        }
    ];
    jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(users)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).get(baseURL + `/users/roles/${role}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(users)
    expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith(role)
})

// Test for retrieving a user by username
test("It should return a user for retrieving user by username", async () => {
    const username = "user"
    const testUser = { //Define a test user object sent to the route
        username: "user",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: "Customer" as Role
    }
    jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(testUser)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).get(baseURL + `/users/${username}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(testUser)
    expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(expect.any(Object), username)
})

/* *************************************** *
 *     Test for the deleteUser method      *
 * *************************************** */
test("It should return a 200 success code for deleting a user", async () => {
    const username = "user"
    jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).delete(baseURL + `/users/${username}`)
    expect(response.status).toBe(200)
    expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(expect.any(Object), username)
})

test("It should return a 401 error code for deleting a user without being logged in", async () => {
    const username = "user"
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockRejectedValueOnce(new Error("Not logged in"))

    const response = await request(app).delete(baseURL + `/users/${username}`)
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: "Not logged in" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})

test("It should return a 403 error code for deleting a user without admin privileges", async () => {
    const username = "user"
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
        next(new Error("Not an admin"))
    })
    const response = await request(app).delete(baseURL + `/users/${username}`)
    expect(response.status).toBe(403)
    expect(response.body).toEqual({ error: "Not an admin" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
})

test("It should return a 500 error code for deleting a user with an error", async () => {
    const username = "user"
    jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new Error("Error deleting user"))
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).delete(baseURL + `/users/${username}`)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: "Error deleting user" })
    expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(expect.any(Object), username)
})

test("It should return a 400 error code for deleting a user with an invalid username", async () => {
    const username = ""
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).delete(baseURL + `/users/${username}`)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: "Invalid username" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})

// Test for updating user information
test("It should return a 200 success code for updating user information", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: "Customer" as Role
    }
    const returnedUser = { username: "user", ...updatedUser }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(returnedUser)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(returnedUser)
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(expect.any(Object), updatedUser.name, updatedUser.surname, updatedUser.address, updatedUser.birthdate, username)
})

test("It should return a 401 error code for updating user information without being logged in", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: "Customer" as Role
    }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockRejectedValueOnce(new Error("Not logged in"))

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: "Not logged in" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 403 error code for updating user information without admin privileges", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: "Customer" as Role
    }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    jest.spyOn(Authenticator.prototype, "isAdmin").mockRejectedValueOnce(new Error("Not an admin"))

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(403)
    expect(response.body).toEqual({ error: "Not an admin" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
    expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 500 error code for updating user information with an error", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: "Customer" as Role
    }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new Error("Error updating user"))
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: "Error updating user" })
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(expect.any(Object), updatedUser.name, updatedUser.surname, updatedUser.address, updatedUser.birthdate, username)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 400 error code for updating user information with an invalid username", async () => {
    const username = ""
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${username}`)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: "Invalid username" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 400 error code for updating user information with missing fields", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01"
    }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: "Missing fields" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 400 error code for updating user information with an invalid role", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: "InvalidRole"
    }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: "Invalid role" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

test("It should return a 400 error code for updating user information with an invalid birthdate", async () => {
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/${userCustomer.username}`).send(userCustomer)
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "Invalid birthdate" })
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

/* Tests for AuthRoutes */

// Test for logging in a user
test("It should return a 200 success code for logging in a user", async () => {
    const loginData = { username: "test", password: "test" }
    const loggedInUser = { username: "test", name: "Test User" }
    jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(loggedInUser)

    const response = await request(app).post(baseURL + "/auth").send(loginData)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(loggedInUser)
    expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
})

test("It should return a 401 error code for logging in with invalid credentials", async () => {
    const loginData = { username: "test", password: "test" }
    jest.spyOn(Authenticator.prototype, "login").mockRejectedValueOnce(new Error("Invalid credentials"))

    const response = await request(app).post(baseURL + "/auth").send(loginData)
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: "Invalid credentials" })
    expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
})  //Check if the createUser method has been called with the correct parameters

test("It should return a 401 error code for logging in with an unregistered user", async () => {
    const loginData = { username: "test", password: "test" }
    jest.spyOn(Authenticator.prototype, "login").mockRejectedValueOnce(new Error("User not found"))

    const response = await request(app).post(baseURL + "/auth").send(loginData)
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ error: "User not found" })
    expect(Authenticator.prototype.login).toHaveBeenCalledTimes(1)
})   //Check if the createUser method has been called with the correct parameters

// Test for logging out a user
test("It should return a 200 success code for logging out a user", async () => {
    jest.spyOn(Authenticator.prototype, "logout").mockResolvedValueOnce(true)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).delete(baseURL + "/auth/current")
    expect(response.status).toBe(200)
    expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1)
})

// Test for retrieving the currently logged in user
test("It should return the currently logged in user", async () => {
    const loggedInUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => { req.user = loggedInUser; next() })

    const response = await request(app).get(baseURL + "/auth/current")
    expect(response.status).toBe(200)
    expect(response.body).toEqual(loggedInUser)
})

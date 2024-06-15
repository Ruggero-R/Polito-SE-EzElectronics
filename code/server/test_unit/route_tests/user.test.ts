import { describe, test, expect, jest, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { Role, User } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import UserController from "../../src/controllers/userController"
import { InvalidParametersError, UserAlreadyExistsError, UserNotAdminError, InvalidRoleError } from '../../src/errors/userError';

const baseURL = "/ezelectronics"
jest.mock('../../src/routers/auth')

// Cleanup after each test
afterEach(() => {
    jest.resetAllMocks()
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
    const response = await request(app).post(baseURL + "/users").send({ ...userCustomer, name: undefined })
    expect(response.status).toBe(422)
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(0);
})

test("It should return UserAlreadyExistsError for creating a user with an existing username", async () => {
    jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new UserAlreadyExistsError())
    const response = await request(app).post(baseURL + "/users").send(userCustomer)
    expect(response.status).toBe(409)
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1)
})

// Test for retrieving all users

test("It should raise an error", async () => {
    jest.spyOn(UserController.prototype, "getUsers").mockRejectedValue(new Error());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementationOnce((req, res, next) => next());
    const response = await request(app).get(baseURL + "/users")
    expect(response.status).toBe(503)
})

test("It should return an array of users for retrieving all users", async () => {
    const users = [
        {
            username: "test1",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        },
        {
            username: "test2",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.MANAGER
        },
        {
            username: "test3",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.ADMIN
        }
    ];
    jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce(users)
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).get(baseURL + "/users");
    expect(response.status).toBe(200)
    expect(response.body).toEqual(users)
    expect(UserController.prototype.getUsers).toHaveBeenCalledTimes(1);
})

test("It should return a 401 error code for retrieving all users without admin privileges", async () => {
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => { return res.status(401).end() })
    const response = await request(app).get(baseURL + "/users");
    expect(response.status).toBe(401)
    expect(Authenticator.prototype.isAdmin).toHaveBeenCalledTimes(1)
})

// Test for retrieving users by role

test("It should raise an error", async () => {
    jest.spyOn(UserController.prototype, "getUsersByRole").mockRejectedValue(new Error());
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementationOnce((req, res, next) => next());
    const response = await request(app).get(baseURL + "/users/roles/Customer")
    expect(response.status).toBe(503)
})

test("It should return an array of users for retrieving users by role", async () => {
    const users = [
        {
            username: "test1",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        },
        {
            username: "test01",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        },
        {
            username: "test2",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        },
        {
            username: "test02",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        },
        {
            username: "test3",
            name: "test",
            surname: "test",
            password: "test",
            address: "test",
            birthdate: "test",
            role: Role.CUSTOMER
        }];

    jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce(users)
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())

    const response = await request(app).get(baseURL + `/users/roles/Customer`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(users)
    expect(UserController.prototype.getUsersByRole).toHaveBeenCalledTimes(1)
    expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith("Customer")
})

// Test for retrieving a user by username

test("It should raise an error", async () => {
    jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValue(new Error());
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementationOnce((req, res, next) => next());
    const response = await request(app).get(baseURL + "/users/user")
    expect(response.status).toBe(503)
})

test("It should return a user for retrieving user by username", async () => {
    const testUser = {
        username: "user",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: Role.CUSTOMER
    }

    jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(testUser);
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    const response = await request(app).get(baseURL + `/users/user`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(testUser)
    expect(UserController.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
})

/* *************************************** *
 *     Test for the deleteUser method      *
 * *************************************** */

test("It should return a 200 success code for deleting a user", async () => {
    jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).delete(baseURL + `/users/user`)
    expect(response.status).toBe(200)
    expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
})

test("It should return a 503 error code for deleting a user with an error", async () => {
    jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new Error())
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    const response = await request(app).delete(baseURL + `/users/user`)
    expect(response.status).toBe(503)
    expect(UserController.prototype.deleteUser).toHaveBeenCalledTimes(1)
})

//Test for deleteAllUsers method
test("It should work", async () => {
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())
    jest.spyOn(UserController.prototype, "deleteAllUsers").mockResolvedValueOnce(true);
    const response = await request(app).delete(baseURL + `/users`)
    expect(response.status).toBe(200)
})

test("It should not work", async () => {
    jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => next())
    jest.spyOn(UserController.prototype, "deleteAllUsers").mockRejectedValueOnce(new Error())
    const response = await request(app).delete(baseURL + `/users`)
    expect(response.status).toBe(503)
})

// Test for updating user information
test("It should return a 200 success code for updating user information", async () => {
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: Role.CUSTOMER
    }
    const returnedUser = { username: "user", ...updatedUser }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(returnedUser)
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())

    const response = await request(app).patch(baseURL + `/users/user`).send(updatedUser)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(returnedUser)
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1)
})

test("It should return a 401 error code for updating user information without admin privileges", async () => {
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: Role.CUSTOMER
    }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValue(new UserNotAdminError);
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    const response = await request(app).patch(baseURL + `/users/user`).send(updatedUser)
    expect(response.status).toBe(401)
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})

test("It should return a 503 error code for updating user information with an error", async () => {
    const username = "user"
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01",
        role: Role.CUSTOMER
    }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockImplementationOnce(() => { throw new Error() })
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(503)
    expect(UserController.prototype.updateUserInfo).toHaveBeenCalledTimes(1)
})

test("It should return a 404 error code for updating user information with missing fields", async () => {
    const updatedUser = {
        name: "newname",
        surname: "newsurname",
        address: "newaddress",
        birthdate: "1990-01-01"
    }
    jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new InvalidParametersError);
    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next())
    const response = await request(app).patch(baseURL + `/users/user`).send(updatedUser)
    expect(response.status).toBe(404)
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})

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
    jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new InvalidRoleError(""));

    const response = await request(app).patch(baseURL + `/users/${username}`).send(updatedUser)
    expect(response.status).toBe(422)
    expect(Authenticator.prototype.isLoggedIn).toHaveBeenCalledTimes(1)
})
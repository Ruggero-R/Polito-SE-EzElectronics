import { describe, test, expect, jest, beforeEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
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
} from "../../src/errors/userError";
import { Role, User } from "../../src/components/user"; // Import the User interface from the appropriate file

const mockUsers = [
    {
        username: "test1",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: "Customer"
    },
    {
        username: "test2",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: "Manager"
    },
    {
        username: "test3",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: "Admin"
    }
];

const userCustomer = {
    username: "test1",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Customer" as Role
}
const userManager = {
    username: "test2",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Manager" as Role
}
const userAdmin = {
    username: "test3",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Admin" as Role
}
const DAOmockCreateUser = jest.fn().mockImplementation(() => Promise.resolve());
const DAOmockGetUsers = jest.fn((filterType, value) => {
    if (filterType === 'username') {
        return Promise.resolve(mockUsers.filter(u => u.username === value));
    } else if (filterType === 'role') {
        return Promise.resolve(mockUsers.filter(u => u.role === value));
    }
    return Promise.resolve(mockUsers);
});
const DAOmockDeleteUser = jest.fn().mockImplementation(() => Promise.resolve(true));
const DAOmockDeleteAllUser = jest.fn().mockImplementation(() => Promise.resolve(true));
const DAOmockUpdateUserInfo = jest.fn().mockImplementation(() => Promise.resolve(userCustomer));

jest.mock("../../src/dao/userDAO", () => {
    return jest.fn().mockImplementation(() => {
        return {
            createUser: DAOmockCreateUser,
            getUsers: DAOmockGetUsers,
            deleteUser: DAOmockDeleteUser,
            deleteAll: DAOmockDeleteAllUser,
            updateUserInfo: DAOmockUpdateUserInfo,
        };
    });
});


describe("UserController", () => {
    let controller: UserController;
    let userDAO: jest.Mocked<UserDAO>;

    beforeEach(() => {
        userDAO = new UserDAO() as jest.Mocked<UserDAO>;
        controller = new UserController();
        jest.clearAllMocks();
    });

    //Example of a unit test for the createUser method of the UserController
    //The test checks if the method returns true when the DAO method returns true
    //The test also expects the DAO method to be called once with the correct parameters

    test("It should return true", async () => {
        const testUser = { //Define a test user object
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "Manager"
        }
        jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
        const controller = new UserController(); //Create a new instance of the controller
        //Call the createUser method of the controller with the test user object
        const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

        //Check if the createUser method of the DAO has been called once with the correct parameters
        expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
            testUser.name,
            testUser.surname,
            testUser.password,
            testUser.role);
        expect(response).toBe(true); //Check if the response is true
    });

    /* ******************************************
     *     Unit test for the getUsers method    *
     * ******************************************/
    test("It should return all users", async () => {
        await expect(controller.getUsers()).resolves.toEqual(mockUsers);
        expect(DAOmockGetUsers).toHaveBeenCalledTimes(1);
    });

    test("It should return a user by username", async () => {
        await expect(controller.getUserByUsername(userCustomer, "test1")).resolves.toEqual(mockUsers.filter(u => u.username === "test1"));
        expect(DAOmockGetUsers).toHaveBeenCalledTimes(1);
    });

    test("It should return all users with a specific role", async () => {
        await expect(controller.getUsersByRole("Customer")).resolves.toEqual(mockUsers.filter(u => u.role === "Customer"));
        expect(DAOmockGetUsers).toHaveBeenCalledTimes(1);
    });

    /* ***********************************************
    * Unit test for the deleteUser method         *
    * ********************************************** */
    test("It should delete a user", async () => {
        await expect(controller.deleteUser(userCustomer, "test1")).resolves.toBe(true);
        expect(userDAO.deleteUser).toHaveBeenCalledTimes(1);
    });

    test("It should throw InvalidParametersError if the user is not found", async () => {
        await expect(controller.deleteUser(userCustomer, "")).rejects.toThrow(InvalidParametersError);
        expect(DAOmockDeleteUser).not.toHaveBeenCalled();
    });

    /* ***********************************************
    * Unit test for the deleteAllUsers method         *
    * ********************************************** */
    test("It should delete all users", async () => {
        await expect(controller.deleteAllUsers()).resolves.toBe(true);
        expect(DAOmockDeleteAllUser).toHaveBeenCalled();
    });

    /* *********************************************
     * Unit test for the updateUserInfo method         *
     * *********************************************/
    test("It should update a user's information", async () => {
        const controller = new UserController();
        await expect(controller.updateUserInfo(userCustomer, "test1", "test", "test", "2000-01-01", "test")).resolves.toBe(userCustomer);
        expect(DAOmockUpdateUserInfo).toHaveBeenCalledWith("test1", "test", "test", "test", "2000-01-01", "test");
    });
});
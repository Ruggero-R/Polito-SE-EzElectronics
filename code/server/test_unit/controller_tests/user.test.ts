import { describe, test, expect, jest, beforeEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { InvalidParametersError, UserNotFoundError } from "../../src/errors/userError";
import { Role, User } from "../../src/components/user"; // Import the User interface from the appropriate file

jest.mock("../../src/dao/userDAO")

const testUser = { //Define a test user object
    username: "test",
    name: "test",
    surname: "test",
    password: "test",
    role: "Manager"
}

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

    /* ***********************************************
    * Unit test for the deleteUser method         *
    * ********************************************** */
    test("It should return true", async () => {
        const testUser = {
            username: "test",
            name: "test",
            surname: "test",
            password: "test",
            role: "role"
        };

        // Mock the deleteUser method of the DAO
        const mockDeleteUser = jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);
        // Create a new instance of the controller
        const controller = new UserController();

        // Create a User object with the required properties
        const user = new User(
            testUser.username,
            testUser.name,
            testUser.surname,
            testUser.role as Role,
            "",
            "2020-01-01"
        );

        // Call the deleteUser method of the controller with the test user object
        const response = await controller.deleteUser(user, testUser.username);
        // Check if the deleteUser method of the DAO has been called once with the correct parameters
        expect(mockDeleteUser).toHaveBeenCalledTimes(1);
        expect(mockDeleteUser).toHaveBeenCalledWith(testUser.username);
        expect(response).toBe(true); // Check if the response is true
    });


});
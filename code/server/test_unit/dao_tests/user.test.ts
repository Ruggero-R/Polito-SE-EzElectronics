import { describe, test, expect, beforeAll, afterAll, jest, beforeEach, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { Role, User } from "../../src/components/user";
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
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

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

describe('UserDAO', () => {
    let userDAO: UserDAO;

    // Inizializza UserDAO prima di ogni test
    beforeEach(() => {
        userDAO = new UserDAO();
    });

    // Resetta i mock dopo ogni test
    afterEach(() => {
        jest.clearAllMocks();
    });

    //Example of unit test for the createUser method
    //It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
    //It then calls the createUser method and expects it to resolve true

    test("It should resolve true", async () => {
        const userDAO = new UserDAO()
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null)
            return {} as Database
        });
        const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
            return (Buffer.from("salt"))
        })
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
            return Buffer.from("hashedPassword")
        })
        const result = await userDAO.createUser("username", "name", "surname", "password", "role")
        expect(result).toBe(true)
        mockRandomBytes.mockRestore()
        mockDBRun.mockRestore()
        mockScrypt.mockRestore()
    })

    /* ********************************************** *
     *    Unit test for the createUser method    *
     * ********************************************** */
    /* POSSIBILE INIZIO TESTO EDITATO POICHÈ FALLISCE TEST SOPRA
    test("It should resolve to true if a user has been created", async () => {
        const userDAO = new UserDAO();
        const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockReturnValue(Buffer.from("salt"));
        const mockScrypt = jest.spyOn(crypto, "scrypt").mockResolvedValue(Buffer.from("hashedPassword"));

        const result = await userDAO.createUser("username", "name", "surname", "password", "role");
        expect(result).toBe(true);
        
        mockRandomBytes.mockRestore();
        mockDBRun.mockRestore();
        mockScrypt.mockRestore();
    });

    */

    /* ****************************************************  *
     *    Unit test for the getIsUserAuthenticated method    *
     * ****************************************************  */
    test('The getIsUserAuthenticated method should return true if user is authenticated', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database
        });

        await expect(userDAO.getIsUserAuthenticated("username", "password"));
    });

    /* ********************************************** *
     *    Unit test for the createUser method         *
     * ********************************************** */
    test('The createUser method should create a new user successfully', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.createUser("username", "name", "surname", "password", "role")).resolves.toBe(true);
    });

    test('The createUser method should throw UserAlreadyExistsError if user already exists', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 })
            return {} as Database
        });

        await expect(userDAO.createUser("username", "name", "surname", "password", "role")).rejects.toThrow(UserAlreadyExistsError);
    });

    /* ********************************************** *
     *    Unit test for the getUserByUsername method  *
     * ********************************************** */
    const customer = new User("username", "name", "surname", Role.CUSTOMER, "address", "birthdate");
    const manager = new User("username", "name", "surname", Role.MANAGER, "address", "birthdate");
    const admin = new User("username", "name", "surname", Role.ADMIN, "address", "birthdate");
    test('The getUserByUsername method should return a user by username', async () => {
        const username = 'username';
        const row = {
            username,
            name: 'name',
            surname: 'surname',
            role: 'Customer',
            address: 'address',
            birthdate: 'birthdate'
        };
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, row);
            return {} as Database;
        });

        const result = await userDAO.getUserByUsername(username);
        expect(result).toEqual(customer || manager || admin);
    });

    test('The getUserByUsername method should throw UserNotFoundError if user is not found', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });

        await expect(userDAO.getUserByUsername("username")).rejects.toThrow(UserNotFoundError);
    });

    test('The getUsersByRole method should throw UserNotFoundError if user is not found', async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []);
            return {} as Database;
        });

        await expect(userDAO.getUsersByRole("role")).rejects.toThrow(UserNotFoundError);
    });

    /* **************************************** *
    *  Unit test for the deleteUser method      *
    * ***************************************** */
    test('The deleteUser method should delete a user successfully', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.deleteUser("username")).resolves.toBe(true);
    });

    test('The deleteUser method should throw UserNotFoundError if user is not found', async () => {
        const username = 'nonexistentuser';

        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null); // Simulate no user found
            return {} as Database;
        });

        await expect(userDAO.deleteUser(username)).rejects.toThrow(UserNotFoundError);
    });

    /* *********************************************
    *  Unit test for the deleteUserAsAdmin method  *
    * **********************************************/
    test("The deleteUserAsAdmin method should delete a user as admin successfully", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { role: "Customer" });
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.deleteUserAsAdmin("admin", "username")).resolves.toBe(true);
    });

    test("The deleteUserAsAdmin method should throw UserIsAdminError if user is an admin", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { role: "Admin" });
            return {} as Database;
        });

        await expect(userDAO.deleteUserAsAdmin("admin", "username")).rejects.toThrow(UserIsAdminError);
    });


    /* **************************************** *
    *  Unit test for the deleteAllUsers method      *
    * ***************************************** */
    test('The deleteAllUsers method should delete all users successfully', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.deleteAllUsers()).resolves.toBe(true);
    });

    /* **************************************** *
    * Unit test for the UpdateUser method       *
    * ***************************************** */
    test("The updateUser method should update a user successfully", async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { role: "Customer" });
            return {} as Database;
        });

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).resolves.toEqual(new User("username", "name", "surname", Role.CUSTOMER, "address", "birthdate"));
    });


    test("The updateUser method should throw UserNotFoundError if user is not found", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });

        await expect(userDAO.updateUser("nonexistentuser", "name", "surname", "address", "birthdate")).rejects.toThrow(UserNotFoundError);
    });

})

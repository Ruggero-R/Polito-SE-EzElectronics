import { describe, test, expect, beforeAll, afterAll, jest, beforeEach, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
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
     *    Unit test for the getIsUserAuthenticated method    *
     * ********************************************** */
    test('should return true if user is authenticated', async () => {
        const username = 'testuser';
        const password = 'password';
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.scryptSync(password, salt, 16).toString('hex');
        const row = { username, password: hashedPassword, salt };

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, row);
            return {} as Database
        });

        const result = await userDAO.getIsUserAuthenticated(username, password);
        expect(result).toBe(true);
    });
})

import { describe, test, expect, jest, beforeEach } from "@jest/globals"
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
} from '../../src/errors/userError';

jest.mock("crypto")
const userDAO=new UserDAO();

describe('UserDAO',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();});

    test("It should resolve true",async()=>{
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

    /* ****************************************************  *
     *    Unit test for the getIsUserAuthenticated method    *
     * ****************************************************  */

    test('The getIsUserAuthenticated method should return false if user is not authenticated', () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,false);
            return {} as Database
        });

        expect(userDAO.getIsUserAuthenticated("username", "password")).resolves.toBe(false);
    })

    test("Login should reject",async()=>{
        jest.spyOn(db,"get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
                return {} as Database;});
        await expect(userDAO.getIsUserAuthenticated("username","password")).rejects.toThrow("Database error")})

    test("Login should raise an error",async()=>{
        jest.spyOn(db,"get").mockImplementation(()=>{throw new Error()})
        await expect(userDAO.getIsUserAuthenticated("username","password")).rejects.toThrow()})

    /* ********************************************** *
     *    Unit test for the createUser method  *
     * ********************************************** */
    test("The createUser method should resolve true if a user has been created", async () => {
        jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
            return Buffer.from("salt");
        });
    });

    test('The createUser method should throw UserAlreadyExistsError if user already exists', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("UNIQUE constraint failed: users.username")) // Mocks the case where the user already exists
            return {} as Database
        });

        await expect(userDAO.createUser("username", "name", "surname", "password", "role")).rejects.toThrow(UserAlreadyExistsError);
    });

    test("createUser should raise an error",async()=>{
        jest.spyOn(db,"run").mockImplementation(()=>{throw new Error()})
        await expect(userDAO.createUser("a","p","w","s","W")).rejects.toThrow()})


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

    test("getUserByUsername should raise an error",async()=>{
        jest.spyOn(db,"get").mockImplementation(()=>{throw new Error()})
        await expect(userDAO.getUserByUsername("username")).rejects.toThrow()})

    test("getUserByUsername should raise an error in db",async()=>{
        jest.spyOn(db,"get").mockImplementation((sql,pars,callback)=>{
            callback(new Error());
            return {} as Database})
        await expect(userDAO.getUserByUsername("username")).rejects.toThrow()})

    test('The getUserByUsername method should throw InvalidParametersError for empty username', async () => {
        const emptyUsername = '';

        await expect(userDAO.getUserByUsername(emptyUsername)).rejects.toThrow(InvalidParametersError);
    });

    /* ********************************************** *
     *    Unit test for the getUsers method     *
     * ********************************************** */

    test("GetUsers method should work",()=>{
        jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
            callback(null,[customer,manager,admin]);
            return {} as Database})
        expect(userDAO.getUsers()).resolves.toEqual([customer,manager,admin])
    })

    test("GetUsers method should reject",()=>{
        jest.spyOn(db,"all").mockImplementation((sql,params,callback)=>{
            callback(new Error());
            return {} as Database})
        expect(userDAO.getUsers()).rejects.toThrow();
    })

    test("GetUsers method should raise an error",()=>{
        jest.spyOn(db,"all").mockImplementation(()=>{throw new Error()})
        expect(userDAO.getUsers()).rejects.toThrow();
    })

    /* ********************************************** *
     *    Unit test for the getUsersByRole method     *
     * ********************************************** */

    test('The getUsersByRole method should throw UserNotFoundError if user is not found', async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []);
            return {} as Database;
        });

        await expect(userDAO.getUsersByRole("role")).rejects.toThrow(UserNotFoundError);
    });

    test('The getUsersByRole method should reject', async () => {
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.getUsersByRole("role")).rejects.toThrow();
    });

    test('The getUsersByRole method should raise an error', async () => {
        jest.spyOn(db, "all").mockImplementation(() => { throw new Error()})
        await expect(userDAO.getUsersByRole("role")).rejects.toThrow();
    });

    test('The getUsersByRole method should return users by role', async () => {
        const rows = [
            { username: "user1", name: "name1", surname: "surname1", role: "Customer", address: "address1", birthdate: "birthdate1" },
            { username: "user2", name: "name2", surname: "surname2", role: "Customer", address: "address2", birthdate: "birthdate2" }
        ];
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, rows);
            return {} as any;
        });

        const result = await userDAO.getUsersByRole("Customer");
        expect(result).toEqual(rows.map(row => new User(row.username, row.name, row.surname, row.role as Role, row.address, row.birthdate)));
    });

    test('The getUsersByRole method should throw InvalidRoleError if role is invalid', async () => {
        const invalidRole = "InvalidRole";

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, []);
            return {} as Database;
        });

        await expect(userDAO.getUsersByRole(invalidRole)).rejects.toThrow(UserNotFoundError);
    });

    /* **************************************** *
    *  Unit test for the deleteUser method      *
    * ***************************************** */

    test('The deleteUser method should reject in get-function', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteUser("Not valid")).rejects.toThrow();
    });

    test('The deleteUser method should reject in run-function', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteUser("Not valid")).rejects.toThrow();
    });

    test('The deleteUser method should raise an error', async () => {
        jest.spyOn(db, "all").mockImplementation(() => { throw new Error()})
        await expect(userDAO.deleteUser("role")).rejects.toThrow();
    });

    test('The deleteUser method should delete a user successfully', async () => {
        const username = 'existinguser';
        // Simulate the user exists in the database
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 }); // Simulate user found
            return {} as Database;
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.deleteUser(username)).resolves.toBe(true);
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

    test('The deleteUserAsAdmin method should reject in get-function', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteUserAsAdmin("Not valid","Not valid")).rejects.toThrow();
    });

    test('The deleteUserAsAdmin method should not find anything', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,undefined);
            return {} as Database;
        });

        await expect(userDAO.deleteUserAsAdmin("Not valid","Not valid")).rejects.toThrow();
    });

    test('The deleteUserAsAdmin method should raise an error', async () => {
        jest.spyOn(db, "get").mockImplementation(() => {throw new Error()});

        await expect(userDAO.deleteUserAsAdmin("Not valid","Not valid")).rejects.toThrow();
    });

    test('The deleteUserAsAdmin method should reject in run-function', async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,{});
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });

        await expect(userDAO.deleteUserAsAdmin("Not valid","Not valid")).rejects.toThrow();
    });

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

    test('The deleteAllUsers method should raise an error', async () => {
        jest.spyOn(db, "run").mockImplementation(() => {throw new Error()});

        await expect(userDAO.deleteAllUsers()).rejects.toThrow();
    });

    test('The deleteAllUsers method should delete all users successfully', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        await expect(userDAO.deleteAllUsers()).resolves.toBe(true);
    });

    test('The deleteAllUsers method should throw UserNotFoundError if no users are found', async () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new UserNotFoundError);
            return {} as Database;
        });

        await expect(userDAO.deleteAllUsers()).rejects.toThrow(UserNotFoundError);
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

    test('The updateUser method should raise an error', async () => {
        jest.spyOn(db, "get").mockImplementation(() => {throw new Error()});

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).rejects.toThrow();
    });

    test('The updateUser method should reject in get', async () => {
        jest.spyOn(db, "get").mockImplementation((sql,params,callback) => {
            callback(new Error())
            return {} as Database});

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).rejects.toThrow();
    });

    test('The updateUser method should reject in run', async () => {
        jest.spyOn(db, "get").mockImplementation((sql,params,callback) => {
            callback(null,{})
            return {} as Database});

        jest.spyOn(db, "run").mockImplementation((sql,params,callback) => {
            callback(new Error())
            return {} as Database});    

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).rejects.toThrow();
    });

    test('The updateUser method should reject in get', async () => {
        jest.spyOn(db, "get").mockImplementation((sql,params,callback) => {
            callback(null,{})
            return {} as Database});

        jest.spyOn(db, "run").mockImplementation((sql,params,callback) => {
            callback(null,{})
            return {} as Database});  
            
        jest.spyOn(db, "get").mockImplementation((sql,params,callback) => {
            callback(new Error())
            return {} as Database});

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).rejects.toThrow();
    });

    test('The updateUser method should reject in get', async () => {
        jest.spyOn(db, "get").mockImplementation((sql,params,callback) => {
            callback(new Error())
            return {} as Database});

        await expect(userDAO.updateUser("username", "name", "surname", "address", "birthdate")).rejects.toThrow();
    });

    test("The updateUser method should throw UserNotFoundError if user is not found", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });

        await expect(userDAO.updateUser("nonexistentuser", "name", "surname", "address", "birthdate")).rejects.toThrow(UserNotFoundError);
    });

    /* **************************************** *  
    * Unit test for the UpdateUserAsAdmin method       *
    * ***************************************** */

    test("The updateUserAsAdmin method should not find any user", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });

        await expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate")).rejects
        .toThrow(UserNotFoundError);})

    test("The updateUserAsAdmin method should not find any user who is not an admin", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, {role:"Admin"});
            return {} as Database;
        });
    
        await expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate")).rejects
        .toThrow(UserIsAdminError);})

    test("The updateUserasAdmin get-function should reject",async()=>{
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });
    
        await expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate")).rejects
        .toThrow();})
    
    test("The updateUserasAdmin run-function should reject",async()=>{
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,{role:"Ciao"});
            return {} as Database;
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error());
            return {} as Database;
        });
        
        await expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate")).rejects
        .toThrow();})

    test("The updateUserasAdmin run-function should raise an error",async()=>{
        jest.spyOn(db, "get").mockImplementation(() => {throw new Error();})
        expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate")).rejects
        .toThrow();})
    
    test("The updateUserasAdmin method should update a user successfully", async () => {
        const NewUser=new User("username", "name", "surname", Role.CUSTOMER, "address", "birthdate");
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null,{role:Role.CUSTOMER});
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, NewUser);
            return {} as Database;
        });
    
        await expect(userDAO.updateUserAsAdmin("username", "name", "surname", "address", "birthdate"))
        .resolves.toEqual(NewUser);})})

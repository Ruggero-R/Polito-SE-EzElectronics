import { describe, test, expect, jest, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import {InvalidParametersError, InvalidRoleError, UnauthorizedUserError} from "../../src/errors/userError";
import { Role } from "../../src/components/user"; // Import the User interface from the appropriate file
import { ArrivalDateError } from "../../src/errors/productError";

const mockUsers = [
    {
        username: "test1",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: Role.CUSTOMER,
    },
    {
        username: "test2",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: Role.MANAGER,
    },
    {
        username: "test3",
        name: "test",
        surname: "test",
        password: "test",
        address: "test",
        birthdate: "test",
        role: Role.ADMIN,
    }
];

const userCustomer={
    username: "test1",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: Role.CUSTOMER}

const userCustomerNew={
    username: "test1",
    name: "newName",
    surname: "newSurname",
    password: "test",
    address: "newAddress",
    birthdate: "2000-01-01",
    role: Role.CUSTOMER}

const userAdmin={
    username: "test3",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: Role.ADMIN}
    
const controller=new UserController();
afterEach(()=>{jest.clearAllMocks();})

describe("UserController",()=>{
    test("It should return true",async()=>{
        const testUser={username: "test",name: "test",surname: "test",password: "test",role:Role.MANAGER};
        jest.spyOn(UserDAO.prototype,"createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
        const response=await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);

        //Check if the createUser method of the DAO has been called once with the correct parameters
        expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
            testUser.name,
            testUser.surname,
            testUser.password,
            testUser.role);
        expect(response).toBe(true)});

    test("It should throw an invalid parameter error",async()=>{
        const testUser={username: "test",name: "test",surname:"",password: "test",role:Role.MANAGER}
        expect(controller.createUser(testUser.username,testUser.name,testUser.surname,testUser.password,testUser.role))
        .rejects.toThrow(InvalidParametersError);})

    test("It should throw an invalid parameter error because surname is empty",()=>{
        const testUser={username: "test",name: "test",surname:"   ",password: "test",role:Role.MANAGER}
        expect(controller.createUser(testUser.username,testUser.name,testUser.surname,testUser.password,testUser.role))
        .rejects.toThrow(InvalidParametersError);})
    
    test("It should throw an invalid role error",async()=>{
        const testUser={username: "test",name: "test",surname:"test",password: "test",role:"Not valid"}
        expect(controller.createUser(testUser.username,testUser.name,testUser.surname,testUser.password,testUser.role))
        .rejects.toThrow(InvalidRoleError);})
    
/* ******************************************
 *     Unit test for the getUsers method    *
* ******************************************/

    test("getUsers should return all users",async()=>{
        jest.spyOn(UserDAO.prototype,"getUsers").mockResolvedValueOnce(mockUsers);
        await expect(controller.getUsers()).resolves.toEqual(mockUsers);
        expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);})

    test("getUserByUsername should throw an invalid parameter error",()=>{
        expect(controller.getUserByUsername(userCustomer,"")).rejects.toThrow(InvalidParametersError);})

    test("getUserByUsername should throw an unhauthorized error",()=>{
        expect(controller.getUserByUsername(userCustomer,"test2")).rejects.toThrow(UnauthorizedUserError);})

    test("getUserByUsername should return a user by username",async()=>{
        jest.spyOn(UserDAO.prototype,"getUserByUsername").mockResolvedValueOnce(userCustomer);
        await expect(controller.getUserByUsername(userCustomer, "test1")).resolves.toEqual(userCustomer);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith("test1")});

    test("getUsersByRole should return all users with a specific role",async()=>{
        jest.spyOn(UserDAO.prototype,"getUsersByRole").mockResolvedValueOnce([userCustomer]);
        await expect(controller.getUsersByRole("Customer")).resolves.toEqual([userCustomer]);
        expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith("Customer");});

    test("It should throw an invalid role error",async()=>{
        expect(controller.getUsersByRole("Not valid")).rejects.toThrow(InvalidRoleError);})

/* ***********************************************
* Unit test for the deleteUser method         *
* ********************************************** */

    test("deleteUser should throw an unhauthorized error",()=>{
        expect(controller.deleteUser(userCustomer,"test2")).rejects.toThrow(UnauthorizedUserError);})

    test("It should delete a user",async()=>{
        jest.spyOn(UserDAO.prototype,"deleteUser").mockResolvedValueOnce(true);
        await expect(controller.deleteUser(userCustomer, "test1")).resolves.toBe(true);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);});

    test("It should delete a user as admin",async()=>{
        jest.spyOn(UserDAO.prototype,"deleteUserAsAdmin").mockResolvedValueOnce(true);
        await expect(controller.deleteUser(userAdmin, "test1")).resolves.toBe(true);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(0);});

    test("It should throw InvalidParametersError if the user is not found",async()=>{
        jest.spyOn(UserDAO.prototype,"deleteUser").mockRejectedValueOnce(new InvalidParametersError);
        await expect(controller.deleteUser(userCustomer, "")).rejects.toThrow(InvalidParametersError);
        expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(0);});

/* ***********************************************
* Unit test for the deleteAllUsers method         *
* ********************************************** */

    test("deleteAllUsers should delete all users",async()=>{
        jest.spyOn(UserDAO.prototype,"deleteAllUsers").mockResolvedValueOnce(true);
        await expect(controller.deleteAllUsers()).resolves.toBe(true);
        expect(UserDAO.prototype.deleteAllUsers).toHaveBeenCalledTimes(1);});

/* *********************************************
* Unit test for the updateUserInfo method         *
* *********************************************/

    test("updateUserInfo should update a user's information",async()=>{
        jest.spyOn(UserDAO.prototype,"updateUser").mockResolvedValueOnce(userCustomerNew);
        await expect(controller.updateUserInfo(userCustomer,"newName","newSurname","newAddress","2000-01-01","test1")).resolves.
        toEqual(userCustomerNew);
        expect(UserDAO.prototype.updateUser).toHaveBeenCalledTimes(1);
        expect(UserDAO.prototype.updateUser).toHaveBeenCalledWith("test1","newName","newSurname","newAddress","2000-01-01")});

    test("It should throw an invalid parameter error",async()=>{
        await expect(controller.updateUserInfo(userCustomer,"   ","newSurname","newAddress","2000-01-01","test1")).rejects
        .toThrow(InvalidParametersError);})

    test("It should throw an arrival date error",async()=>{
        await expect(controller.updateUserInfo(userCustomer,"newName","newSurname","newAddress","2025-08-20","test1")).rejects
        .toThrow(ArrivalDateError);})

    test("updateUserInfo should update a user's information as an admin",async()=>{
        jest.spyOn(UserDAO.prototype,"updateUserAsAdmin").mockResolvedValueOnce(userCustomerNew);
        const res=await expect(controller.updateUserInfo(userAdmin,"newName","newSurname","newAddress","2000-01-01","test1")).resolves.
        toEqual(userCustomerNew);
        expect(UserDAO.prototype.updateUserAsAdmin).toHaveBeenCalledTimes(1);});

    test("updateUserInfo should throw unhauthorized user error",async()=>{
        await expect(controller.updateUserInfo(userCustomer,"newName","newSurname","newAddress","2000-01-01","test2")).rejects.
        toThrow(UnauthorizedUserError);
        expect(UserDAO.prototype.updateUser).toHaveBeenCalledTimes(0);});
    
    test("updateUserInfo should throw InvalidParametersError if parameters are invalid",async()=>{
        jest.spyOn(UserDAO.prototype,"updateUser").mockRejectedValueOnce(new InvalidParametersError);
        await expect(controller.updateUserInfo(userCustomer, "", "newSurname", "newAddress", "2000-01-01", "test1")).rejects
        .toThrow(InvalidParametersError);
        expect(UserDAO.prototype.updateUser).not.toHaveBeenCalled();})});
import { describe, test, expect, jest, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import { cleanup } from "../../src/db/cleanup";
import UserDAO from "../../src/dao/userDAO";
const baseURL = "/ezelectronics";

const login=async(usr:any,psw:any)=>{
    return new Promise<string>((resolve,reject)=>{
        request(app).post(baseURL+"/sessions").send({username:usr,password:psw}).end((err,res)=>{
            resolve(res.header["set-cookie"][0])})})}

beforeEach(() => {
    jest.resetAllMocks();
    UserDAO.prototype.deleteAllUsers();
  });

afterAll((done) => {
    cleanup();
    done();
});

const userCustomer = {
    username: "test1",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Customer"
}
const userManager = {
    username: "test2",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Manager"
}
const userAdmin = {
    username: "test3",
    name: "test",
    surname: "test",
    password: "test",
    address: "test",
    birthdate: "test",
    role: "Admin"
}

describe("Integration test for the createUser routes", () => {
    test("It should return 200 for creating a Customer", async () => {
        const response = await request(app)
            .post(`${baseURL}/users`)
            .send(userCustomer);
        expect(response.status).toBe(200);
    });

    test("It should return 422 for missing fields", async () => {
        const response = await request(app)
            .post(`${baseURL}/users`)
            .send({ username: "test", name: "test" });
        expect(response.status).toBe(422);
    });

    test("It should return 422 for invalid role", async () => {
        const response = await request(app)
            .post(`${baseURL}/users`)
            .send({ ...userCustomer, role: "InvalidRole" });
        expect(response.status).toBe(422);
    });
});

describe("Integration test for the getUsers routes", () => {
    test("It should return 200 and get all users", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        await request(app).post(`${baseURL}/users`).send(userManager);
        await request(app).post(`${baseURL}/users`).send(userAdmin);
        const Cookie=await login("test3","test");
        const response = await request(app).get(`${baseURL}/users`).set("Cookie",Cookie);;
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });
});

describe("Integration test for the getUserByUsername routes", () => {
    test("It should return 200 and get user by username", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        const Cookie=await login("test1","test");
        const response = await request(app).get(`${baseURL}/users/test1`).set("Cookie",Cookie);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(userCustomer.username);
    });

    test("It should return 401 for non-existent user", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        const Cookie=await login("test1","test");
        const response = await request(app).get(`${baseURL}/users/no`).set("Cookie",Cookie);
        expect(response.status).toBe(401);
    });
});

describe("Integration test for the deleteUser routes", () => {
    test("It should return 200 and delete user by username", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        await request(app).post(`${baseURL}/users`).send(userAdmin);
        const Cookie=await login("test3","test");

        const response = await request(app).delete(`${baseURL}/users/test1`).set("Cookie",Cookie);;
        expect(response.status).toBe(200);

        const getResponse = await request(app).get(`${baseURL}/users/test1`).set("Cookie",Cookie);;
        expect(getResponse.status).toBe(404);
    });

    test("It should return 404 for non-existent user", async () => {
        await request(app).post(`${baseURL}/users`).send(userAdmin);
        const Cookie=await login("test3","test");
        const response = await request(app).delete(`${baseURL}/users/nonexistent`).set("Cookie",Cookie);;
        expect(response.status).toBe(404);
    });
});

describe("Integration test for the updateUser routes", () => {
    test("It should return 200 and update user info", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        const Cookie=await login("test1","test");

        const updatedInfo = {
            name: "updatedName",
            surname: "updatedSurname",
            address: "updatedAddress",
            birthdate: "1990-01-01"
        };

        const response = await request(app).patch(`${baseURL}/users/test1`).send(updatedInfo).set("Cookie",Cookie);
        expect(response.status).toBe(200);
        const getResponse = await request(app).get(`${baseURL}/users/test1`).set("Cookie",Cookie);
        expect(getResponse.status).toBe(200);});

    test("It should return 422 for missing fields in update", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        const Cookie=await login("test1","test");

        const response = await request(app).patch(`${baseURL}/users/test1`).send({ name: "newName" }).set("Cookie",Cookie);
        expect(response.status).toBe(422);
    });

   test("It should return 404 for non-existent user in update", async () => {
    const Cookie=await login("test3","test");
    const response = await request(app).patch(`${baseURL}/users/nonexistent`).send({
            name: "newName",
            surname: "newSurname",
            address: "newAddress",
            birthdate: "1990-01-01"}).set("Cookie",Cookie);
    expect(response.status).toBe(404);
    });
});


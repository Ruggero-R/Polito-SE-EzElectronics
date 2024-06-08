import { describe, test, expect, jest, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import Authenticator from "../../src/routers/auth";

jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

beforeEach((done) => {
    jest.resetAllMocks();
    db.serialize(() => {
        db.run("DELETE FROM users", (err) => {
            if (err) {
                console.log(err);
            }
            done();
        });
    });
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

    test("It should return 400 for missing fields", async () => {
        const response = await request(app)
            .post(`${baseURL}/users`)
            .send({ username: "test", name: "test" });
        expect(response.status).toBe(400);
    });

    test("It should return 400 for invalid role", async () => {
        const response = await request(app)
            .post(`${baseURL}/users`)
            .send({ ...userCustomer, role: "InvalidRole" });
        expect(response.status).toBe(400);
    });
});

describe("Integration test for the getUsers routes", () => {
    beforeEach(() => {
        jest
            .spyOn(Authenticator.prototype, "isAdmin")
            .mockImplementation((req, res, next) => next());
    });

    test("It should return 200 and get all users", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);
        await request(app).post(`${baseURL}/users`).send(userManager);
        await request(app).post(`${baseURL}/users`).send(userAdmin);

        const response = await request(app).get(`${baseURL}/users`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });
});

describe("Integration test for the getUserByUsername routes", () => {
    beforeEach(() => {
        jest
            .spyOn(Authenticator.prototype, "isLoggedIn")
            .mockImplementation((req, res, next) => next());
    });

    test("It should return 200 and get user by username", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);

        const response = await request(app).get(`${baseURL}/users/test1`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(userCustomer.username);
    });

    test("It should return 404 for non-existent user", async () => {
        const response = await request(app).get(`${baseURL}/users/nonexistent`);
        expect(response.status).toBe(404);
    });
});

describe("Integration test for the deleteUser routes", () => {
    beforeEach(() => {
        jest
            .spyOn(Authenticator.prototype, "isLoggedIn")
            .mockImplementation((req, res, next) => next());
    });

    test("It should return 200 and delete user by username", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);

        const response = await request(app).delete(`${baseURL}/users/test1`);
        expect(response.status).toBe(200);

        const getResponse = await request(app).get(`${baseURL}/users/test1`);
        expect(getResponse.status).toBe(404);
    });

    test("It should return 404 for non-existent user", async () => {
        const response = await request(app).delete(`${baseURL}/users/nonexistent`);
        expect(response.status).toBe(404);
    });
});

describe("Integration test for the updateUser routes", () => {
    beforeEach(() => {
        jest
            .spyOn(Authenticator.prototype, "isLoggedIn")
            .mockImplementation((req, res, next) => next());
    });

    test("It should return 200 and update user info", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);

        const updatedInfo = {
            name: "updatedName",
            surname: "updatedSurname",
            address: "updatedAddress",
            birthdate: "1990-01-01"
        };

        const response = await request(app)
            .patch(`${baseURL}/users/test1`)
            .send(updatedInfo);
        expect(response.status).toBe(200);

        const getResponse = await request(app).get(`${baseURL}/users/test1`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.name).toBe(updatedInfo.name);
        expect(getResponse.body.surname).toBe(updatedInfo.surname);
        expect(getResponse.body.address).toBe(updatedInfo.address);
        expect(getResponse.body.birthdate).toBe(updatedInfo.birthdate);
    });

    test("It should return 400 for missing fields in update", async () => {
        await request(app).post(`${baseURL}/users`).send(userCustomer);

        const response = await request(app)
            .patch(`${baseURL}/users/test1`)
            .send({ name: "newName" });
        expect(response.status).toBe(400);
    });

    test("It should return 404 for non-existent user in update", async () => {
        const response = await request(app)
            .patch(`${baseURL}/users/nonexistent`)
            .send({
                name: "newName",
                surname: "newSurname",
                address: "newAddress",
                birthdate: "1990-01-01"
            });
        expect(response.status).toBe(404);
    });
});



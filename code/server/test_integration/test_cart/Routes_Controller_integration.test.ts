import {
    describe,
    test,
    expect,
    jest,
    beforeEach,
    afterEach,
} from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import Authenticator from "../../src/routers/auth";
import dayjs from "dayjs";
import { Category } from "../../src/components/product";
import { InvalidParametersError } from "../../src/errors/cartError";
import CartDAO from "../../src/dao/cartDAO";
import { Role, User } from "../../src/components/user";

const baseURL = "/ezelectronics";
jest.mock("../../src/routers/auth");
afterEach(() => { jest.resetAllMocks(); })

const cart1 = {
    customer: 'user1',
    paid: false,
    paymentDate: '',
    total: 130,
    products: [
        {
            model: 'model1',
            quantity: 2,
            category: Category.SMARTPHONE,
            price: 100
        },
        {
            model: 'model2',
            quantity: 1,
            category: Category.APPLIANCE,
            price: 30
        },
    ]
}
const cart2 = {
    customer: 'user2',
    paid: true,
    paymentDate: '2022-01-01',
    total: 50,
    products: [
        {
            model: 'model3',
            quantity: 1,
            category: Category.SMARTPHONE,
            price: 50
        }
    ]
}

const Utente2 = new User(" ", "Mattia", "Carlino", Role.ADMIN, "matto@polito.it", "2024-01-01");


describe("Integration Tests for the getCart routes", () => {
    // test("It should resolve", () => {
    //     const mock = jest.spyOn(CartDAO.prototype, "addProductToCart").mockResolvedValue(undefined);
    //     expect(Controller.addToCart(Utente1, 'model1')).resolves.toBe(true);
    //     mock.mockClear();
    // })
    test("It should reject due a user not given", async () => {
        const revObjNotValid = {};
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartDAO.prototype, "getActiveCartByUserId").mockRejectedValue(new InvalidParametersError);
        const response = await request(app).get(baseURL + "/carts").send();
        expect(response.status).toBe(422);
    })
    expect(CartDAO.prototype.getActiveCartByUserId("")).toHaveBeenCalledTimes(1);
})
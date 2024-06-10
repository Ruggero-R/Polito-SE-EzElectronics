import { test, expect, jest, describe } from "@jest/globals"
import CartController from "../../src/controllers/cartController"
import CartDAO from "../../src/dao/cartDAO"

import { afterEach, mock } from "node:test";
import { get } from "http";
import { Category } from "../../src/components/product";
import { Role, User } from "../../src/components/user";
import { InvalidParametersError } from "../../src/errors/cartError";

const mockCarts = [
    {
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
    },
    {
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
]

const Controller = new CartController();
const Utente1 = new User("Matto", "Mattia", "Carlino", Role.ADMIN, "matto@polito.it", "2024-01-01");
const Utente2 = new User(" ", "Mattia", "Carlino", Role.ADMIN, "matto@polito.it", "2024-01-01");

/* ********************************************** *
 *    Unit test for the addToCart method    *
 * ********************************************** */

describe("Unit Tests for the addReview method", () => {
    // test("It should resolve", () => {
    //     const mock = jest.spyOn(CartDAO.prototype, "addProductToCart").mockResolvedValue(undefined);
    //     expect(Controller.addToCart(Utente1, 'model1')).resolves.toBe(true);
    //     mock.mockClear();
    // })
    test("It should reject due a model not given", () => {
        expect(() => Controller.addToCart(Utente1, '')).rejects.toThrow(InvalidParametersError);
    })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.addToCart(Utente2, 'model1')).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the getCart method    *
 * ********************************************** */
describe("Unit Tests for the getCart method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "getActiveCartByUserId").mockResolvedValue({
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
        });
        expect(Controller.getCart(Utente1)).resolves.toEqual(mockCarts[0]);
        mock.mockClear();
    })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.getCart(Utente2)).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the checkoutCart method    *
 * ********************************************** */
//TODO finire
describe("Unit Tests for the checkoutCart method", () => {
    // test("It should resolve", () => {
    //     const mock = jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValue(true);
    //     expect(Controller.checkoutCart(Utente1)).resolves.toBe(true);
    //     mock.mockClear();
    // })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.checkoutCart(Utente2)).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the getCustomerCarts method    *
 * ********************************************** */
describe("Unit Tests for the getCustomerCarts method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValue([mockCarts[1]]);
        expect(Controller.getCustomerCarts(Utente1)).resolves.toEqual([mockCarts[1]]);
        mock.mockClear();
    })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.getCustomerCarts(Utente2)).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the removeProductFromCart method    *
 * ********************************************** */
describe("Unit Tests for the removeProductFromCart method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValue(true);
        expect(Controller.removeProductFromCart(Utente1, 'model1')).resolves.toBe(true);
        mock.mockClear();
    })
    test("It should reject due a model not given", () => {
        expect(() => Controller.removeProductFromCart(Utente1, '')).rejects.toThrow(InvalidParametersError);
    })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.removeProductFromCart(Utente2, 'model1')).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the clearCart method    *
 * ********************************************** */
describe("Unit Tests for the clearCart method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValue(true);
        expect(Controller.clearCart(Utente1)).resolves.toBe(true);
        mock.mockClear();
    })
    test("It should reject due to a user not given", () => {
        expect(() => Controller.clearCart(Utente2)).rejects.toThrow(InvalidParametersError);
    })
})

/* ********************************************** *
 *    Unit test for the deleteAllCarts method    *
 * ********************************************** */
describe("Unit Tests for the deleteAllCarts method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValue(true);
        expect(Controller.deleteAllCarts()).resolves.toBe(true);
        mock.mockClear();
    })
})

/* ********************************************** *
 *    Unit test for the getAllCarts method    *
 * ********************************************** */
describe("Unit Tests for the getAllCarts method", () => {
    test("It should resolve", () => {
        const mock = jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValue(mockCarts);
        expect(Controller.getAllCarts()).resolves.toEqual(mockCarts);
        mock.mockClear();
    })
})
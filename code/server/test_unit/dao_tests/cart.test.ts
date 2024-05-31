import { test, expect, jest, beforeEach } from "@jest/globals"
import CartDAO from "../../src/dao/cartDAO"
import db from "../../src/db/db"
import { Database } from "sqlite3";
import { Cart, ProductInCart } from "../../src/components/cart";
import {
    CartNotFoundError,
    ProductInCartError,
    ProductNotInCartError,
    WrongUserCartError,
    EmptyCartError,
    InvalidParametersError,
    LowProductStockError,
    NoCartItemsError,
    AlreadyActiveCart
} from "../../src/errors/cartError";
import { Category } from "../../src/components/product";

jest.mock("../../src/db/db");
let cartDAO: CartDAO;
beforeEach(() => {
    cartDAO = new CartDAO();
});


/* ********************************************** *
 *    Unit test for the createCart method    *
 * ********************************************** */
test("It should create a cart", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
    });
    await expect(cartDAO.createCart("customer")).resolves.toBeUndefined();

    mockDBRun.mockRestore();
});

test("It should throw an error if a cart for the user already exists", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, "customer");
        return {} as Database;
    });
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
    });

    await expect(cartDAO.createCart("customer")).rejects.toThrow(AlreadyActiveCart);

    mockDBGet.mockRestore();
    mockDBRun.mockRestore();
});

test("It should throw an error if database fails", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
        return {} as Database;
    });

    await expect(cartDAO.createCart("customer")).rejects.toThrow("Database error");

    mockDBRun.mockRestore();
});

test("It should throw an error if an error is thrown in the try block", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
        throw new Error("Error in try block");
    });

    await expect(cartDAO.createCart("customer")).rejects.toThrow("Error in try block");

    mockDBRun.mockRestore();
});

/* ********************************************** *
 *    Unit test for the getActiveCartByUserId method    *
 * ********************************************** */
test('It should return a cart with items if the cart exists and has items', async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { customer: 'customer', paid: 0, paymentDate: null, total: 0.0 });
        return {} as Database;
    });

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null,
            [
                { product_id: 'product1', quantity: 1, category: 'Smartphone', price: 10.0 },
                { product_id: 'product2', quantity: 2, category: 'Appliance', price: 20.0 },
            ]);
        return {} as Database;
    });

    const result = await cartDAO.getActiveCartByUserId('customer');

    expect(result).toEqual(new Cart('customer', false, null as string, 0.0, [
        new ProductInCart('product1', 1, Category.SMARTPHONE, 10.0),
        new ProductInCart('product2', 2, Category.APPLIANCE, 20.0),
    ]));

    mockDBGet.mockRestore();
    mockDBAll.mockRestore();

});
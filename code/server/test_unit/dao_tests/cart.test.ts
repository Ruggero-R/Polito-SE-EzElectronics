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

test("It should throw an error if GET query  fails", async () => {
    const mockDBRun = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
        return {} as Database;
    });

    await expect(cartDAO.createCart("customer")).rejects.toThrow("Database error");

    mockDBRun.mockRestore();
});


test("It should throw an error if RUN quey fails", async () => {
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
        callback(null, { customer: 'customer', paid: Boolean(0), paymentDate: null, total: 30.0 });
        return {} as Database;
    });

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null,
            [
                { product_model: 'product1', quantity: 1, category: 'Smartphone', price: 10.0 },
                { product_model: 'product2', quantity: 2, category: 'Appliance', price: 20.0 },
            ]);
        return {} as Database;
    });

    const result = await cartDAO.getActiveCartByUserId('customer');

    expect(result).toEqual(new Cart('customer', false, null as any, 30.0, [
        new ProductInCart('product1', 1, Category.SMARTPHONE, 10.0),
        new ProductInCart('product2', 2, Category.APPLIANCE, 20.0),
    ]));

    mockDBGet.mockRestore();
    mockDBAll.mockRestore();
});

test('It should return a cart without items if the cart exists but has no items', async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { customer: 'customer', paid: Boolean(0), paymentDate: null, total: 0.0 });
        return {} as Database;
    });

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, []);
        return {} as Database;
    });

    const result = await cartDAO.getActiveCartByUserId('customer');

    expect(result).toEqual(new Cart('customer', false, null as any, 0.0, []));

    mockDBGet.mockRestore();
    mockDBAll.mockRestore();
});

test('It should return an empty cart if the cart does not exist', async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
    });

    const result = await cartDAO.getActiveCartByUserId('customer');

    expect(result).toEqual(new Cart('customer', false, null as any, 0.0, []));

    mockDBGet.mockRestore();
});

test("It should throw an error if database fails", async () => {
    const mockDBRun = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
        return {} as Database;
    });

    await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow("Database error");

    mockDBRun.mockRestore();
});

test("It should throw an error if database fails", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { customer: 'customer', paid: Boolean(0), paymentDate: null, total: 0.0 });
        return {} as Database;
    });

    const mockDBRun = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
        return {} as Database;
    });

    await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow("Database error");

    mockDBRun.mockRestore();
});

test("It should throw an error if an error is thrown in the try block", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation(() => {
        throw new Error("Error in try block");
    });

    await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow("Error in try block");

    mockDBGet.mockRestore();
});

/* ********************************************** *
 *    Unit test for the userHasActiveCart method    *
 * ********************************************** */
test('It should return true if the user has an active cart', async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { paid: 0 });
        return {} as Database;
    });

    const result = await cartDAO.userHasActiveCart('customer');

    expect(result).toBe(true);

    mockDBGet.mockRestore();
});

test('It should return false if the user does not have an active cart', async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
    });

    const result = await cartDAO.userHasActiveCart('customer');

    expect(result).toBe(false);

    mockDBGet.mockRestore();
});

test("It should throw an error if database fails", async () => {
    const mockDBRun = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
        return {} as Database;
    });

    await expect(cartDAO.userHasActiveCart("customer")).rejects.toThrow("Database error");

    mockDBRun.mockRestore();
});

test("It should throw an error if an error is thrown in the try block", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation(() => {
        throw new Error("Error in try block");
    });

    await expect(cartDAO.userHasActiveCart("customer")).rejects.toThrow("Error in try block");

    mockDBGet.mockRestore();
});

/* ********************************************** *
 *    Unit test for the addProductToCart method    *
 * ********************************************** */
test('It should add a new product to the exisisting cart of the user', async () => {
    const mockDBGetModel = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
        callback(null, { model: 'product1', quantity: 15 });
        return {} as Database;
    });
    const mockDBGetPrice = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
        callback(null, { sellingPrice: 10.0, category: 'Appliance' });
        return {} as Database;
    });

    const mockUserActiveCart = jest.spyOn(cartDAO, "userHasActiveCart").mockImplementationOnce((userId: string) => {
        return Promise.resolve(true);
    });
    const mockDBGetCheckProduct = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
    });
    
    const mockDBRunInsert = jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
    });
    
    const mockDBRunUpdate = jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
    });
    
    await expect(cartDAO.addProductToCart('customer', 'product1')).resolves.toBe(undefined);
    mockDBGetModel.mockRestore();
    mockDBGetPrice.mockRestore();
    mockUserActiveCart.mockRestore();
    mockDBGetCheckProduct.mockRestore();
    mockDBRunInsert.mockRestore();
    mockDBRunUpdate.mockRestore();
});
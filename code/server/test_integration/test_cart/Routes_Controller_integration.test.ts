import { test, expect, jest, describe, afterEach, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import { Cart } from "../../src/components/cart";
import { Category } from "../../src/components/product";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError, InvalidParametersError, NoCartItemsError, ProductNotInCartError } from "../../src/errors/cartError";
import ProductDAO from "../../src/dao/productDAO";
import CartDAO from "../../src/dao/cartDAO";
import UserDAO from "../../src/dao/userDAO";
import CartController from "../../src/controllers/cartController";

const baseURL = "/ezelectronics";
let Cookie: any;

afterEach(async () => {
    await CartDAO.prototype.deleteAllCarts();
    jest.resetAllMocks();
})

beforeEach(async () => {
    UserDAO.prototype.deleteAllUsers();
    await request(app).post(`${baseURL}/users`).send(userCustomer);
    Cookie = await login("test1", "test");
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

const login = async (usr: any, psw: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app).post(baseURL + "/sessions").send({ username: usr, password: psw }).end((err, res) => {
            resolve(res.header["set-cookie"][0]);
        })
    })
}

//Create Cart
const cart = new Cart('user1', false, '', 10.0, [{
    model: 'model1',
    quantity: 1,
    category: Category.SMARTPHONE,
    price: 10.0,
}]);


/* ********************************************** *
 *    Unit test for the getCart method   *
 * ********************************************** */
describe("Unit test for the getCart route", () => {
    test("It should return 200", async () => {
        jest.spyOn(CartDAO.prototype, "getActiveCartByUserId").mockResolvedValue(cart);
        const response = await request(app).get(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(cart);

        expect(CartDAO.prototype.getActiveCartByUserId).toHaveBeenCalledTimes(1);
    });

    test("It should return an Empty cart", async () => {
        const emptyCart = new Cart('user1', false, '', 0, []);
        jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(emptyCart);
        const response = await request(app).get(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(emptyCart);

        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).get(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(401);
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1);
    })
});

/* ********************************************** *
 *    Unit test for the addToCart method   *
 * ********************************************** */
describe("Unit test for the addToCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "addToCart")
            .mockResolvedValueOnce(true);

        const response = await request(app).post(baseURL + "/carts").send({ model: 'iPhone13' }).set("Cookie", Cookie);
        expect(response.status).toBe(200);

        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);
        expect(response.status).toBe(401);

        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);;
        expect(response.status).toBe(503);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 422 if the model is not provided", async () => {
        const response = await request(app).post(baseURL + "/carts").send({}).set("Cookie", Cookie);;
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 422 if the model is not a string", async () => {
        const response = await request(app).post(baseURL + "/carts").send({ model: 123 }).set("Cookie", Cookie);;
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 422 if the model is an empty string", async () => {
        const response = await request(app).post(baseURL + "/carts").send({ model: '' }).set("Cookie", Cookie);;
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 422 if the model is a white space", async () => {
        jest.spyOn(CartController.prototype, 'addToCart').mockRejectedValueOnce(new InvalidParametersError());
        const response = await request(app).post(baseURL + "/carts").send({ model: ' ' }).set("Cookie", Cookie);;
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 if the model does not represent an existing product", async () => {
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError);
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);;
        expect(response.status).toBe(404);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 400 if the model's available quantity is 0", async () => {
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError);
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);;
        expect(response.status).toBe(409);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the checkoutCart method   *
 * ********************************************** */
describe("Unit test for the checkoutCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "checkoutCart")
            .mockResolvedValueOnce(true);
        const response = await request(app).patch(baseURL + "/carts").set("Cookie", Cookie);;
        expect(response.status).toBe(200);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).patch(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(401);

        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).patch(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an  404 error if there is no information about an unpaid cart in the database", async () => {
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).patch(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 400 error if there is information about an unpaid cart but the cart contains no product", async () => {
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError);
        const response = await request(app).patch(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(400);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 409 error if there is at least one product in the cart whose available quantity in the stock is 0", async () => {
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError);
        const response = await request(app).patch(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);
        expect(response.status).toBe(409);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return a 409 error if there is at least one product in the cart whose quantity is higher than the available quantity in the stock", async () => {
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError);
        const response = await request(app).patch(baseURL + "/carts").send({ model: 'model1' }).set("Cookie", Cookie);
        expect(response.status).toBe(409);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the getCustomerCarts method   *
 * ********************************************** */
describe("Unit test for the getCustomerCarts route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "getCustomerCarts")
            .mockResolvedValueOnce([cart]);
        const response = await request(app).get(baseURL + "/carts/history").set("Cookie", Cookie);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([cart]);

        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).get(baseURL + "/carts/history").set("Cookie", Cookie);
        expect(response.status).toBe(401);

        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts/history").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    });
});

// /* ********************************************** *
//  *    Unit test for the removeProductFromCart method   *
//  * ********************************************** */
describe("Unit test for the removeProductFromCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "removeProductFromCart")
            .mockResolvedValueOnce(true);

        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(200);

        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(401);

        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if the model is an empty string", async () => {
        const model = '';
        const response = await request(app).delete(baseURL + `/carts/products${model}`).set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 404 error if model represents a product that is not in the cart", async () => {
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new NoCartItemsError);
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if there is no information about an unpaid cart for the user", async () => {
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if there is such information but there are no products in the cart", async () => {
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError);
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if model does not represent an existing product", async () => {
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/products/model1").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the clearCart method   *
 * ********************************************** */
describe("Unit test for the clearCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "clearCart")
            .mockResolvedValueOnce(true);
        const response = await request(app).delete(baseURL + "/carts/current").set("Cookie", Cookie);
        expect(response.status).toBe(200);

        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        const response = await request(app).delete(baseURL + "/carts/current").set("Cookie", Cookie);
        expect(response.status).toBe(401);

        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts/current").set("Cookie", Cookie);;
        expect(response.status).toBe(503);
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });

    test("It should return a 404 error if there is no information about an unpaid cart for the user", async () => {
        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/current").set("Cookie", Cookie);
        expect(response.status).toBe(404);
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the deleteAllCarts method   *
 * ********************************************** */
describe("Unit test for the deleteAllCarts route", () => {
    test("It should return 200", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true);

        const response = await request(app).delete(baseURL + "/carts").set("Cookie", Cookie);;
        expect(response.status).toBe(200);

        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not an admin or manager", async () => {
        const response = await request(app).delete(baseURL + "/carts");
        expect(response.status).toBe(401);
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the getAllCarts method   *
 * ********************************************** */
describe("Unit test for the getAllCarts route", () => {
    test("It should return 200", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce([cart]);
        const response = await request(app).get(baseURL + "/carts/all").set("Cookie", Cookie);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([cart]);

        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not an admin or manager", async () => {
        const response = await request(app).get(baseURL + "/carts/all");
        expect(response.status).toBe(401);

        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        await request(app).post(`${baseURL}/users`).send(userManager);
        Cookie = await login("test2", "test");
        jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts/all").set("Cookie", Cookie);
        expect(response.status).toBe(503);
        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    });
});
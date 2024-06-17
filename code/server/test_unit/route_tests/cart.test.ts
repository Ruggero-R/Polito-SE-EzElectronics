import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import { Cart, ProductInCart } from "../../src/components/cart";
import ProductController from "../../src/controllers/productController";
import { Category } from "../../src/components/product";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";
import { CartNotFoundError, EmptyCartError, InvalidParametersError, NoCartItemsError, ProductNotInCartError } from "../../src/errors/cartError";
import ProductDAO from "../../src/dao/productDAO";

jest.mock("../../src/controllers/cartController");
jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

afterEach(() => {
    jest.resetAllMocks();
});

//Create Cart
const cart = new Cart('user3', false, '', 200, [{
    model: 'model1',
    quantity: 1,
    category: Category.SMARTPHONE,
    price: 100,

},
{
    model: 'model2',
    quantity: 1,
    category: Category.LAPTOP,
    price: 100
}]);

const cart2 = new Cart('user1', true, '2024-05-25', 200, [{
    model: 'model1',
    quantity: 1,
    category: Category.SMARTPHONE,
    price: 100,

},
{
    model: 'model2',
    quantity: 1,
    category: Category.LAPTOP,
    price: 100
},
{
    model: 'model3',
    quantity: 1,
    category: Category.LAPTOP,
    price: 100
}]);




/* ********************************************** *
 *    Unit test for the getCart method   *
 * ********************************************** */
describe("Unit test for the getCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "getCart")
            .mockResolvedValueOnce(cart);
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(cart);

        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an Empty cart", async () => {
        const emptyCart = new Cart('user1', false, '', 0, []);
        jest
            .spyOn(CartController.prototype, "getCart")
            .mockResolvedValueOnce(emptyCart);
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(emptyCart);

        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).get(baseURL + "/carts");
        expect(response.status).toBe(401);

        expect(CartController.prototype.getCart).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "getCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts");
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
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).post(baseURL + "/carts").send({ model: 'iPhone13' });
        expect(response.status).toBe(200);

        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' });
        expect(response.status).toBe(401);

        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' });
        expect(response.status).toBe(503);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 422 if the model is not provided", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        const response = await request(app).post(baseURL + "/carts").send({});
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 422 if the model is not a string", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        const response = await request(app).post(baseURL + "/carts").send({ model: 123 });
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });
    test("It should return an 422 if the model is an empty string", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        const response = await request(app).post(baseURL + "/carts").send({ model: '' });
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 422 if the model is a white space", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next())
        jest.spyOn(CartController.prototype, 'addToCart').mockRejectedValueOnce(new InvalidParametersError());
        const response = await request(app).post(baseURL + "/carts").send({ model: ' ' });
        expect(response.status).toBe(422);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 if the model does not represent an existing product", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError);
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' });
        expect(response.status).toBe(404);
        expect(CartController.prototype.addToCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 400 if the model's available quantity is 0", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError);
        const response = await request(app).post(baseURL + "/carts").send({ model: 'model1' });
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
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).patch(baseURL + "/carts");
        expect(response.status).toBe(200);

        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).patch(baseURL + "/carts");
        expect(response.status).toBe(401);

        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).patch(baseURL + "/carts");
        expect(response.status).toBe(503);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an  404 error if there is no information about an unpaid cart in the database", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).patch(baseURL + "/carts").send();
        expect(response.status).toBe(404);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 400 error if there is information about an unpaid cart but the cart contains no product", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError);
        const response = await request(app).patch(baseURL + "/carts").send();
        expect(response.status).toBe(400);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 409 error if there is at least one product in the cart whose available quantity in the stock is 0", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError);
        const response = await request(app).patch(baseURL + "/carts").send({ model: 'model1' });
        expect(response.status).toBe(409);
        expect(CartController.prototype.checkoutCart).toHaveBeenCalledTimes(1);
    });

    test("It should return a 409 error if there is at least one product in the cart whose quantity is higher than the available quantity in the stock", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError);
        const response = await request(app).patch(baseURL + "/carts").send({ model: 'model1' });
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
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/carts/history");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([cart]);

        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).get(baseURL + "/carts/history");
        expect(response.status).toBe(401);

        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(0);  // The error should be thrown before the method is called
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts/history");
        expect(response.status).toBe(503);
        expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the removeProductFromCart method   *
 * ********************************************** */
describe("Unit test for the removeProductFromCart route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "removeProductFromCart")
            .mockResolvedValueOnce(true);
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(200);

        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(401);

        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(503);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an  422 error if the model is not a string", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => res.status(422).send());
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(422);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 404 error if the model is an empty string", async () => {
        const model = '';
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => res.status(404).send());
        const response = await request(app).delete(baseURL + `/carts/products${model}`);
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(0);
    });

    test("It should return an 404 error if model represents a product that is not in the cart", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new NoCartItemsError);
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if there is no information about an unpaid cart for the user", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if there is such information but there are no products in the cart", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError);
        const response = await request(app).delete(baseURL + "/carts/products/model1");
        expect(response.status).toBe(404);
        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 404 error if model does not represent an existing product", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/products/model1");
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
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).delete(baseURL + "/carts/current");
        expect(response.status).toBe(200);

        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not a customer", async () => {
        jest
            .spyOn(Authenticator.prototype, "isCustomer")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).delete(baseURL + "/carts/current");
        expect(response.status).toBe(401);

        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts/current");
        expect(response.status).toBe(503);
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });

    test("It should return a 404 error if there is no information about an unpaid cart for the user", async () => {
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new CartNotFoundError);
        const response = await request(app).delete(baseURL + "/carts/current");
        expect(response.status).toBe(404);
        expect(CartController.prototype.clearCart).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the deleteAllCarts method   *
 * ********************************************** */
describe("Unit test for the deleteAllCarts route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "deleteAllCarts")
            .mockResolvedValueOnce(true);
        jest
            .spyOn(Authenticator.prototype, "isAdminOrManager")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).delete(baseURL + "/carts");
        expect(response.status).toBe(200);

        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not an admin or manager", async () => {
        jest
            .spyOn(Authenticator.prototype, "isAdminOrManager")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).delete(baseURL + "/carts");
        expect(response.status).toBe(401);

        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).delete(baseURL + "/carts");
        expect(response.status).toBe(503);
        expect(CartController.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });
});

/* ********************************************** *
 *    Unit test for the getAllCarts method   *
 * ********************************************** */
describe("Unit test for the getAllCarts route", () => {
    test("It should return 200", async () => {
        jest
            .spyOn(CartController.prototype, "getAllCarts")
            .mockResolvedValueOnce([cart, cart2]);
        jest
            .spyOn(Authenticator.prototype, "isAdminOrManager")
            .mockImplementation((req, res, next) => next());

        const response = await request(app).get(baseURL + "/carts/all");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([cart, cart2]);

        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    });

    test("It should return an 401 if the user is not an admin or manager", async () => {
        jest
            .spyOn(Authenticator.prototype, "isAdminOrManager")
            .mockImplementation((req, res, next) => res.status(401).send());
        const response = await request(app).get(baseURL + "/carts/all");
        expect(response.status).toBe(401);

        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(0);
    });

    test("It should raise an error", async () => {
        jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => next());
        jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValue(new Error("Ops"));
        const response = await request(app).get(baseURL + "/carts/all");
        expect(response.status).toBe(503);
        expect(CartController.prototype.getAllCarts).toHaveBeenCalledTimes(1);
    });
});
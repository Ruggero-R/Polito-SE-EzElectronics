import { test, expect, jest, beforeEach, describe } from "@jest/globals";
import CartDAO from "../../src/dao/cartDAO";
import db from "../../src/db/db";
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
    AlreadyActiveCart,
} from "../../src/errors/cartError";
import { Category } from "../../src/components/product";
import {
    EmptyProductStockError,
    ProductNotFoundError,
} from "../../src/errors/productError";
import { afterEach, beforeAll, afterAll } from "@jest/globals";
import ProductDAO from "../../src/dao/productDAO";
import dayjs from "dayjs";
import {cleanup} from "../../src/db/cleanup";

let cartDAO = new CartDAO();

beforeAll(async () => {
    cleanup();
    await ProductDAO.prototype.registerProducts("product1", Category.SMARTPHONE, 2, null, 10.0, "2024-01-01");
})


afterEach(async () => {
    await cartDAO.deleteAllCarts();
});

describe("Integration testfor the cartDAO class", () => {
    /* ********************************************** *
     *    Integration testfor the createCart method    *
     * ********************************************** */
    describe("Integration testfor the createCart method", () => {
        test("It should create a cart", async () => {
            await expect(cartDAO.createCart("customer")).resolves.toBeUndefined();
        });


        test("It should throw an error if a cart for the user already exists", async () => {
            await cartDAO.createCart("customer")
            await expect(cartDAO.createCart("customer")).rejects.toThrow(
                AlreadyActiveCart
            );
        });
    });

    /* ********************************************** *
     *    Integration testfor the getActiveCartByUserId method    *
     * ********************************************** */
    describe("Integration testfor the getActiveCartByUserId method", () => {
        test("It should return a cart with items if the cart exists and has items", async () => {
            await cartDAO.createCart("customer");

            await cartDAO.addProductToCart("customer", "product1");

            const result = await cartDAO.getActiveCartByUserId("customer");

            expect(result).toEqual(
                new Cart("customer", false, null as any, 10.0, [
                    new ProductInCart("product1", 1, Category.SMARTPHONE, 10.0)
                ])
            );
        });


        test("It should return a cart without items if the cart exists but has no items", async () => {
            await cartDAO.createCart("customer");
            const result = await cartDAO.getActiveCartByUserId("customer");
            expect(result).toEqual(new Cart("customer", false, null as any, 0.0, []));
        });

        test("It should return an empty cart if the cart does not exist", async () => {
            const result = await cartDAO.getActiveCartByUserId("customer");
            expect(result).toEqual(new Cart("customer", false, null as any, 0.0, []));
        });
    });

    /* ********************************************** *
     *    Integration testfor the userHasActiveCart method  *
     * ********************************************** */
    describe("Integration testfor the userHasActiveCart method", () => {
        test("It should return true if the user has an active cart", async () => {
            await cartDAO.createCart("customer");
            const result = await cartDAO.userHasActiveCart("customer");
            expect(result).toBe(true);
        });

        test("It should return false if the user does not have an active cart", async () => {
            const result = await cartDAO.userHasActiveCart("customer");
            expect(result).toBe(false);
        });
    });

    /* ********************************************** *
     *    Integration testfor the addProductToCart method   *
     * ********************************************** */
    describe("Integration testfor the addProductToCart method", () => {
        test("It should add a new product to the exisisting cart of the user", async () => {
            await cartDAO.createCart("customer");;
            await expect(
                cartDAO.addProductToCart("customer", "product1")
            ).resolves.toBe(true);
        });

        test("It should add a new product to a new cart of the user", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");

            await expect(
                cartDAO.addProductToCart("customer", "product1")
            ).resolves.toBe(true);
        });

        test("It should increment product quantity in the cart of the user", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await expect(
                cartDAO.addProductToCart("customer", "product1")
            ).resolves.toBe(true);
        });

        test("It should throw an error if the product is not in the database", async () => {
            await cartDAO.createCart("customer");
            await expect(
                cartDAO.addProductToCart("customer", "product2")
            ).rejects.toThrow(ProductNotFoundError);
        });

        // test("It should throw an error if the product is out of stock", async () => {
        //     await cartDAO.createCart("customer");
        //     await ProductDAO.prototype.changeProductQuantity("product1", 0, "2024-06-13");
        //     console.log(await ProductDAO.prototype.getProducts(null, null, "product1"))

        //     await expect(
        //         cartDAO.addProductToCart("customer", "product1")
        //     ).rejects.toThrow(EmptyProductStockError);
        // });


        test("It should throw an error if the quanity of the product in the cart is greater than the stock", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await cartDAO.addProductToCart("customer", "product1");

            await expect(
                cartDAO.addProductToCart("customer", "product1")
            ).rejects.toThrow(LowProductStockError);
        });
    });

    /* ********************************************** *
     *    Integration testfor the updateCartItem method    *
     * ********************************************** */
    describe("Integration testfor the updateCartItem method", () => {
        test("It should update the quantity of the product in the cart", async () => {
            await cartDAO.createCart("customer");
            await expect(
                cartDAO.updateCartItem("customer", 10.0, "product1", 5)
            ).resolves.toBe(undefined);
        });
    });

    /* ********************************************** *
     *    Integration testfor the updateCartTotal method    *
     * ********************************************** */
    describe("Integration testfor the updateCartTotal method", () => {
        test("It should update the total of the cart", async () => {
            await cartDAO.createCart("customer");
            await expect(cartDAO.updateCartTotal("customer", 30.0)).resolves.toBe(
                undefined
            );
        });
    });

    /* ********************************************** *
     *    Integration testfor the checkoutCart method    *
     * ********************************************** */
    describe("Integration testfor the checkoutCart method", () => {
        test("It should checkout the cart of the user", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");

            await expect(cartDAO.checkoutCart("customer")).resolves.toBe(true);
        });
        test("It should throw an error if the cart is not found", async () => {

            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new CartNotFoundError()
            );
        });

        test("It should throw an error if the cart is empty", async () => {
            await cartDAO.createCart("customer");

            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new EmptyCartError()
            );
        });

        test("It should throw an error if there are not products in the stock anymore", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.updateCartItem("customer", 10.0, "product1", 2);
            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new EmptyProductStockError()
            );
        });

        test("It should throw an error if the product is not in the cart", async () => {
            await cartDAO.createCart("customer");

            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new ProductNotInCartError()
            );
        });

        test("It should throw an error if the product quantity in the cart is greater than the stock", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.updateCartItem("customer", 10.0, "product1", 2);

            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new LowProductStockError()
            );
        });

        test("It should throw an error if the product is not in the cart", async () => {
            await cartDAO.createCart("customer");
            await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
                new ProductNotInCartError()
            );
        });
    });

    /* ********************************************** *
     *    Integration testfor the removeProductFromCart method    *
     * ********************************************** */
    describe("Integration testfor the removeProductFromCart method", () => {
        test("It should remove the product from the cart of the user", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await expect(
                cartDAO.removeProductFromCart("customer", "product1")
            ).resolves.toBe(true);
        });

        test("It should throw an error if the product is not in the database", async () => {
            await cartDAO.createCart("customer");

            await expect(
                cartDAO.removeProductFromCart("customer", "product2")
            ).rejects.toThrow(ProductNotFoundError);
        });

        test("It should throw an error if the cart is not found", async () => {
            await expect(
                cartDAO.removeProductFromCart("customer", "product1")
            ).rejects.toThrow(CartNotFoundError);
        });


        test("It should throw an error if the cart is empty", async () => {
            await cartDAO.createCart("customer");
            await expect(
                cartDAO.removeProductFromCart("customer", "product1")
            ).rejects.toThrow(NoCartItemsError);
        });

        test("It should throw an error if the product is not in the cart", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await ProductDAO.prototype.registerProducts("product2", Category.SMARTPHONE, 2, null, 10.0, "2024-01-01");
            await expect(
                cartDAO.removeProductFromCart("customer", "product2")
            ).rejects.toThrow(ProductNotInCartError);
        });
    });

    /* ********************************************** *
     *    Integration testfor the clearCart method    *
     * ********************************************** */
    describe("Integration testfor the clearCart method", () => {
        test("It should clear the cart of the user", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await expect(cartDAO.clearCart("customer")).resolves.toBe(true);
        });

        test("It should throw an error if the cart is not found", async () => {
            await expect(cartDAO.clearCart("customer")).rejects.toThrow(
                CartNotFoundError
            );
        });

    });
    /* ********************************************** *
     *    Integration testfor the deleteAllCarts method    *
     * ********************************************** */
    describe("Integration testfor the deleteAllCarts method", () => {
        test("It should delete all carts", async () => {
            await cartDAO.createCart("customer");
            await expect(cartDAO.deleteAllCarts()).resolves.toBe(true);
        });
    });
    /* ********************************************** *
     *    Integration testfor the getAllCarts method    *
     * ********************************************** */
    describe("Integration testfor the getAllCarts method", () => {
        test("It should retrieve all carts successfully", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            const expectedCarts = [
                new Cart("customer", false, null as any, 10.0, [
                    new ProductInCart("product1", 1, Category.SMARTPHONE, 10.0),
                ]),
            ];


            await expect(cartDAO.getAllCarts()).resolves.toEqual(expectedCarts);
        });
    });
    /* ********************************************** *
     *   Integration testfor the getCustomerCarts method    *
     * ********************************************** */
    describe("Integration testfor the getCustomerCarts method", () => {
        test("It should retrieve all carts of a customer successfully", async () => {
            await cartDAO.createCart("customer");
            await cartDAO.addProductToCart("customer", "product1");
            await cartDAO.checkoutCart("customer");

            const expectedCarts = [
                new Cart("customer", true, dayjs().format("YYYY-MM-DD"), 10.0, [
                    new ProductInCart("product1", 1, Category.SMARTPHONE, 10.0),
                ]),
            ];

            await expect(cartDAO.getCustomerCarts("customer")).resolves.toEqual(
                expectedCarts
            );
        });
    });
});
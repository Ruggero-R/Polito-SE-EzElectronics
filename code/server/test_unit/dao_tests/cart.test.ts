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

jest.mock("../../src/db/db");
let cartDAO: CartDAO;
beforeEach(() => {
  cartDAO = new CartDAO();
  jest.clearAllMocks();
});

describe("Unit test for the cartDAO class", () => {
  /* ********************************************** *
   *    Unit test for the createCart method    *
   * ********************************************** */
  describe("Unit test for the createCart method", () => {
    test("It should create a cart", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });
      await expect(cartDAO.createCart("customer")).resolves.toBeUndefined();

      mockDBRun.mockRestore();
    });

    test("It should throw an error if a cart for the user already exists", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, "customer");
          return {} as Database;
        });
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(cartDAO.createCart("customer")).rejects.toThrow(
        AlreadyActiveCart
      );

      mockDBGet.mockRestore();
      mockDBRun.mockRestore();
    });

    test("It should throw an error if GET query  fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.createCart("customer")).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if RUN quey fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.createCart("customer")).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBRun = jest.spyOn(db, "run").mockImplementation(() => {
        throw new Error("Error in try block");
      });

      await expect(cartDAO.createCart("customer")).rejects.toThrow(
        "Error in try block"
      );

      mockDBRun.mockRestore();
    });
  });

  /* ********************************************** *
   *    Unit test for the getActiveCartByUserId method    *
   * ********************************************** */
  describe("Unit test for the getActiveCartByUserId method", () => {
    test("It should return a cart with items if the cart exists and has items", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: Boolean(0),
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
            {
              product_model: "product2",
              quantity: 2,
              category: "Appliance",
              price: 20.0,
            },
          ]);
          return {} as Database;
        });

      const result = await cartDAO.getActiveCartByUserId("customer");

      expect(result).toEqual(
        new Cart("customer", false, null as any, 30.0, [
          new ProductInCart("product1", 1, Category.SMARTPHONE, 10.0),
          new ProductInCart("product2", 2, Category.APPLIANCE, 20.0),
        ])
      );

      mockDBGet.mockRestore();
      mockDBAll.mockRestore();
    });

    test("It should return a cart without items if the cart exists but has no items", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: Boolean(0),
            paymentDate: null,
            total: 0.0,
          });
          return {} as Database;
        });

      const mockDBAll = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, []);
          return {} as Database;
        });

      const result = await cartDAO.getActiveCartByUserId("customer");

      expect(result).toEqual(new Cart("customer", false, null as any, 0.0, []));

      mockDBGet.mockRestore();
      mockDBAll.mockRestore();
    });

    test("It should return an empty cart if the cart does not exist", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const result = await cartDAO.getActiveCartByUserId("customer");

      expect(result).toEqual(new Cart("customer", false, null as any, 0.0, []));

      mockDBGet.mockRestore();
    });

    test("It should throw an error if database fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if database fails", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: Boolean(0),
            paymentDate: null,
            total: 0.0,
          });
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBGet = jest.spyOn(db, "get").mockImplementation(() => {
        throw new Error("Error in try block");
      });

      await expect(cartDAO.getActiveCartByUserId("customer")).rejects.toThrow(
        "Error in try block"
      );

      mockDBGet.mockRestore();
    });
  });

  /* ********************************************** *
   *    Unit test for the userHasActiveCart method  *
   * ********************************************** */
  describe("Unit test for the userHasActiveCart method", () => {
    test("It should return true if the user has an active cart", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { paid: 0 });
          return {} as Database;
        });

      const result = await cartDAO.userHasActiveCart("customer");

      expect(result).toBe(true);

      mockDBGet.mockRestore();
    });

    test("It should return false if the user does not have an active cart", async () => {
      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const result = await cartDAO.userHasActiveCart("customer");

      expect(result).toBe(false);

      mockDBGet.mockRestore();
    });

    test("It should throw an error if database fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.userHasActiveCart("customer")).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBGet = jest.spyOn(db, "get").mockImplementation(() => {
        throw new Error("Error in try block");
      });

      await expect(cartDAO.userHasActiveCart("customer")).rejects.toThrow(
        "Error in try block"
      );

      mockDBGet.mockRestore();
    });
  });

  /* ********************************************** *
   *    Unit test for the addProductToCart method   *
   * ********************************************** */
  describe("Unit test for the addProductToCart method", () => {
    test("It should add a new product to the exisisting cart of the user", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });
      const mockDBGetPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });
      const mockDBGetCheckProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDBRunInsert = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDBRunUpdate = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).resolves.toBe(undefined);
    });

    test("It should add a new product to a new cart of the user", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });
      const mockDBGetPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(false);
        });

      const mockCreateCart = jest
        .spyOn(cartDAO, "createCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve();
        });

      const mockDBInsertIntoCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDBRunUpdatCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).resolves.toBe(undefined);
    });

    test("It should increment product quantity in the cart of the user", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });
      const mockDBGetPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDBGetCheckProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            cart_id: 1,
            product_model: "product1",
            quantity: 1,
            price: 10.0,
            category: "Appliance",
          });
          return {} as Database;
        });

      const mockDBGetCheckProductQuantity = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { quantity: 15 });
          return {} as Database;
        });

      const mockUpdateCartItem = jest
        .spyOn(cartDAO, "updateCartItem")
        .mockImplementationOnce(
          (
            userId: string,
            sellingPrice: number,
            productModel: string,
            cartProductQuantity: number
          ) => {
            return Promise.resolve();
          }
        );

      const mockDBRunUpdate = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).resolves.toBe(undefined);
    });

    test("It should throw an error if the product is not in the database", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow(ProductNotFoundError);
    });

    test("It should throw an error if the product is out of stock", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 0 });
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow(EmptyProductStockError);
    });

    test("It should throw an error if the database fails checking the product model", async () => {
      const mockDBGetModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the quanity of the product in the cart is greater than the stock", async () => {
      const mockDBGet_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 1 });
          return {} as Database;
        });

      const mockDBGet_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDBGet_CheckProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            cart_id: 1,
            product_model: "product1",
            quantity: 2,
            price: 10.0,
            category: "Appliance",
          });
          return {} as Database;
        });

      const mockDBGet_CheckStoreProductQuantity = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { quantity: 1 });
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow(LowProductStockError);
    });

    test("It should throw an error if the database fails checking the product price", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails creating a new cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(false);
        });

      const mockCreateCart = jest
        .spyOn(cartDAO, "createCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve();
        });

      const mockDBInsertIntoCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the databse fails updating the newly created cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(false);
        });

      const mockCreateCart = jest
        .spyOn(cartDAO, "createCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve();
        });

      const mockDBInsertIntoCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDBRunUpdate = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails creating a new Cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(false);
        });

      const mockCreateCart = jest
        .spyOn(cartDAO, "createCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.reject(new Error("Database error"));
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails checking if the user has already the product in the cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails checking the quantity of the product in the cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            cart_id: 1,
            product_model: "product1",
            quantity: 2,
            price: 10.0,
            category: "Appliance",
          });
          return {} as Database;
        });

      const mockDB_checkProductQuantity = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails updating the quantity of the product in the cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            cart_id: 1,
            product_model: "product1",
            quantity: 2,
            price: 10.0,
            category: "Appliance",
          });
          return {} as Database;
        });

      const mockDB_checkProductQuantity = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { quantity: 15 });
          return {} as Database;
        });

      const mockUpdateCartItem = jest
        .spyOn(cartDAO, "updateCartItem")
        .mockImplementationOnce(
          (
            userId: string,
            sellingPrice: number,
            productModel: string,
            cartProductQuantity: number
          ) => {
            return Promise.resolve();
          }
        );

      const mockDBRun_updateCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the updateCartItem method fails", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            cart_id: 1,
            product_model: "product1",
            quantity: 2,
            price: 10.0,
            category: "Appliance",
          });
          return {} as Database;
        });

      const mockDB_checkProductQuantity = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { quantity: 15 });
          return {} as Database;
        });

      const mockUpdateCartItem = jest
        .spyOn(cartDAO, "updateCartItem")
        .mockImplementationOnce(
          (
            userId: string,
            sellingPrice: number,
            productModel: string,
            cartProductQuantity: number
          ) => {
            return Promise.reject(new Error("Error in updateCartItem"));
          }
        );

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Error in updateCartItem");
    });

    test("It should throw an error if the database fails inserting the product into the cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDB_insertIntoCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails updating the cart", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.resolve(true);
        });

      const mockDB_checkProduct = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDB_insertIntoCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      const mockDB_updateCart = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the userHasActiveCart method fails", async () => {
      const mockDB_checkModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 15 });
          return {} as Database;
        });

      const mockDB_checkProductPrice = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { sellingPrice: 10.0, category: "Appliance" });
          return {} as Database;
        });

      const mockUserActiveCart = jest
        .spyOn(cartDAO, "userHasActiveCart")
        .mockImplementationOnce((userId: string) => {
          return Promise.reject(new Error("Error in userHasActiveCart"));
        });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Error in userHasActiveCart");
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDB_checkModel = jest.spyOn(db, "get").mockImplementation(() => {
        throw new Error("Error in try block");
      });

      await expect(
        cartDAO.addProductToCart("customer", "product1")
      ).rejects.toThrow("Error in try block");
    });
  });

  /* ********************************************** *
   *    Unit test for the updateCartItem method    *
   * ********************************************** */
  describe("Unit test for the updateCartItem method", () => {
    test("It should update the quantity of the product in the cart", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(
        cartDAO.updateCartItem("customer", 10.0, "product1", 5)
      ).resolves.toBe(undefined);

      mockDBRun.mockRestore();
    });

    test("It should throw an error if database fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.updateCartItem("customer", 10.0, "product1", 5)
      ).rejects.toThrow("Database error");

      mockDBRun.mockRestore();
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(
        cartDAO.updateCartItem("customer", 10.0, "product1", 5)
      ).rejects.toThrow("Error in try block");

      mockDBRun.mockRestore();
    });

    /* ********************************************** *
     *    Unit test for the updateCartTotal method    *
     * ********************************************** */
    test("It should update the total of the cart", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(cartDAO.updateCartTotal("customer", 30.0)).resolves.toBe(
        undefined
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if database fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.updateCartTotal("customer", 30.0)).rejects.toThrow(
        "Database error"
      );

      mockDBRun.mockRestore();
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(cartDAO.updateCartTotal("customer", 30.0)).rejects.toThrow(
        "Error in try block"
      );

      mockDBRun.mockRestore();
    });
  });
  /* ********************************************** *
   *    Unit test for the checkoutCart method    *
   * ********************************************** */
  describe("Unit test for the checkoutCart method", () => {
    test("It should checkout the cart of the user", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_UpdateProductQuantity = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const mockDBRun_checkout = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).resolves.toBe(true);
    });
    test("It should throw an error if the cart is not found", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new CartNotFoundError()
      );
    });

    test("It should throw an error if database fails", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Error in try block"
      );
    });

    test("It should throw an error if the cart is empty", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, []);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new EmptyCartError()
      );
    });

    test("It should throw an error if the databse fails", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if there are not products in the stock anymore", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 0, model: "product1" }]);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new EmptyProductStockError()
      );
    });

    test("It should throw an error if the product is not in the cart", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new ProductNotInCartError()
      );
    });

    test("It should throw an error if the product quantity in the cart is greater than the stock", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 2,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 1, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { quantity: 2 });
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new LowProductStockError()
      );
    });

    test("It should throw an error if the database fails updating the product quantity", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_UpdateProductQuantity = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if the database fails updating the cart as paid", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBRun_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_UpdateProductQuantity = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const mockDBRun_checkout = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if the database fails checking the product availability", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBAll_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if the database fails checking the product quantity in the cart", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBAll_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if the product is not in the cart", async () => {
      const mockDBGet_checkCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_CheckCartItems = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [
            {
              product_model: "product1",
              quantity: 1,
              category: "Smartphone",
              price: 10.0,
            },
          ]);
          return {} as Database;
        });

      const mockDBAll_CheckProductsAvailability = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ quantity: 10, model: "product1" }]);
          return {} as Database;
        });

      const mockDBGet_checkCartItems = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(cartDAO.checkoutCart("customer")).rejects.toThrow(
        new ProductNotInCartError()
      );
    });
  });

  /* ********************************************** *
   *    Unit test for the removeProductFromCart method    *
   * ********************************************** */
  describe("Unit test for the removeProductFromCart method", () => {
    test("It should remove the product from the cart of the user", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementation((sql, params, callback) => {
          callback(null, [{ model: "product1", quantity: 1 }]);
          return {} as Database;
        });

      const mockDBGet_checkProductInCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_deleteProduct = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const mockDBRun_updateCartTotal = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).resolves.toBe(true);
    });

    test("It should throw an error if the product is not in the database", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow(ProductNotFoundError);
    });

    test("It should throw an error if the database fails to retrive the model", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the cart is not found", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow(CartNotFoundError);
    });

    test("It should throw an error if the database fails to retrive the cart", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the cart is empty", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, []);
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow(NoCartItemsError);
    });

    test("It should throw an error if the database fails to retrive the cart items", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the product is not in the cart", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ model: "product2", quantity: 1 }]);
          return {} as Database;
        });

      const mockDBGet_checkProductInCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow(ProductNotInCartError);
    });

    test("It should throw an error if the database fails to retrive the product", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ model: "product1", quantity: 1 }]);
          return {} as Database;
        });

      const mockDBGet_checkProductInCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails to delete the product", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ model: "product1", quantity: 1 }]);
          return {} as Database;
        });

      const mockDBGet_checkProductInCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_deleteProduct = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if the database fails to update the cart total", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            customer: "customer",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBAll_checkEmptyCart = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ model: "product1", quantity: 1 }]);
          return {} as Database;
        });

      const mockDBGet_checkProductInCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1", quantity: 1 });
          return {} as Database;
        });

      const mockDBRun_deleteProduct = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const mockDBRun_updateCartTotal = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Database error");
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBGet_checkExistingModel = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { model: "product1" });
          return {} as Database;
        });

      const mockDBGet_checkActiveCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(
        cartDAO.removeProductFromCart("customer", "product1")
      ).rejects.toThrow("Error in try block");
    });
  });

  /* ********************************************** *
   *    Unit test for the clearCart method    *
   * ********************************************** */
  describe("Unit test for the clearCart method", () => {
    test("It should clear the cart of the user", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            id: 1,
            customer: "customer1",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      await expect(cartDAO.clearCart("customer")).resolves.toBe(true);
    });

    test("It should throw an error if the cart is not found", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, undefined);
          return {} as Database;
        });

      await expect(cartDAO.clearCart("customer")).rejects.toThrow(
        CartNotFoundError
      );
    });

    test("It should throw an error if database fails", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.clearCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(cartDAO.clearCart("customer")).rejects.toThrow(
        "Error in try block"
      );
    });

    test("It should throw an error if the database fails to delete the cart items", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementation((sql, params, callback) => {
          callback(null, {
            id: 1,
            customer: "customer1",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.clearCart("customer")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should throw an error if the database fails to update the cart total", async () => {
      const mockDBGetCart = jest
        .spyOn(db, "get")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, {
            id: 1,
            customer: "customer1",
            paid: 0,
            paymentDate: null,
            total: 30.0,
          });
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const mockDBRun_updateCartTotal = jest
        .spyOn(db, "run")
        .mockImplementationOnce((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.clearCart("customer")).rejects.toThrow(
        "Database error"
      );
    });
  });
  /* ********************************************** *
   *    Unit test for the deleteAllCarts method    *
   * ********************************************** */
  describe("Unit test for the deleteAllCarts method", () => {
    test("It should delete all carts", async () => {
      const mockDBRunDeleteCarts = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null), undefined;
          return {} as Database;
        });

      const mockDBRunDeleteCartItems = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null), undefined;
          return {} as Database;
        });

      await expect(cartDAO.deleteAllCarts()).resolves.toBe(true);
    });

    test("It should throw an error if database fails", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(new Error("Database error"));
          return {} as Database;
        });

      await expect(cartDAO.deleteAllCarts()).rejects.toThrow("Database error");
    });

    test("It should throw an error if an error is thrown in the try block", async () => {
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          throw new Error("Error in try block");
        });

      await expect(cartDAO.deleteAllCarts()).rejects.toThrow(
        "Error in try block"
      );
    });
  });
  /* ********************************************** *
   *    Unit test for the getAllCarts method    *
   * ********************************************** */
  describe("Unit test for the getAllCarts method", () => {
    test("It should retrieve all carts successfully", async () => {
      const mockDBCarts = jest
        .spyOn(db, "all")
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [
            {
              id: 1,
              customer: "customer1",
              paid: 0,
              paymentDate: null,
              total: 100.0,
            },
            {
              id: 2,
              customer: "customer2",
              paid: 1,
              paymentDate: "2023-01-01",
              total: 150.0,
            },
          ]);
          return {} as Database;
        })
        .mockImplementationOnce((sql, params, callback) => {
          if (params[0] === 1) {
            callback(null, [
              {
                product_model: "model1",
                quantity: 2,
                price: 50.0,
                category: "Smartphone",
              },
            ]);
          } else if (params[0] === 2) {
            callback(null, [
              {
                product_model: "model2",
                quantity: 1,
                price: 150.0,
                category: "Appliance",
              },
            ]);
          }
          return {} as Database;
        });

      const expectedCarts = [
        new Cart("customer1", false, null as any, 100.0, [
          new ProductInCart("model1", 2, Category.SMARTPHONE, 50.0),
        ]),
        new Cart("customer2", true, "2023-01-01", 150.0, [
          new ProductInCart("model2", 1, Category.APPLIANCE, 150.0),
        ]),
      ];

      await expect(cartDAO.getAllCarts()).resolves.toEqual(expectedCarts);
    });
  });
});

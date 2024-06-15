import { test, expect, jest, describe, afterEach, beforeEach, beforeAll } from "@jest/globals";
import CartController from "../../src/controllers/cartController";
import ProductController from "../../src/controllers/productController";
import CartDAO from "../../src/dao/cartDAO";
import ProductDAO from "../../src/dao/productDAO";
import { Category } from "../../src/components/product";
import { Role, User } from "../../src/components/user";
import { InvalidParametersError } from "../../src/errors/cartError";
import dayjs from "dayjs";
import { cleanup } from "../../src/db/cleanup";

let cartDAO = new CartDAO();
const Controller = new CartController();

beforeEach(async () => {
  await ProductDAO.prototype.deleteAllProducts();
  await ProductDAO.prototype.registerProducts("model1", Category.SMARTPHONE, 2, null, 10.0, "2024-01-01");
})

beforeAll(() => {
  cleanup();
});

afterEach(async () => {
  await cartDAO.deleteAllCarts();
});

const mockCarts = [
  {
    customer: "user1",
    paid: true,
    paymentDate: dayjs().format("YYYY-MM-DD"),
    total: 10.0,
    products: [
      {
        model: "model1",
        quantity: 1,
        category: Category.SMARTPHONE,
        price: 10.0,
      },
    ],
  },
  {
    customer: "user1",
    paid: false,
    paymentDate: null,
    total: 10.0,
    products: [
      {
        model: "model1",
        quantity: 1,
        category: Category.SMARTPHONE,
        price: 10.0,
      },
    ],
  },
];

afterEach(() => {
  jest.clearAllMocks();
});

const Utente1 = new User(
  "user1",
  "Mattia",
  "Carlino",
  Role.ADMIN,
  "matto@polito.it",
  "2024-01-01"
);
const Utente2 = new User(
  " ",
  "Mattia",
  "Carlino",
  Role.ADMIN,
  "matto@polito.it",
  "2024-01-01"
);

/* ********************************************** *
 *    Unit test for the addToCart method    *
 * ********************************************** */
describe("Unit Tests for the addToCart method", () => {
  test("It should resolve", async () => {
    await expect(Controller.addToCart(Utente1, "model1")).resolves.toBe(true);
  });
  test("It should reject due a model not given", async () => {
    await expect(() => Controller.addToCart(Utente1, " ")).rejects.toThrow(
      InvalidParametersError
    );
  });
  test("It should reject due to a user not given", async () => {
    await expect(() => Controller.addToCart(Utente2, "model1")).rejects.toThrow(
      InvalidParametersError
    );
  });
});


/* ********************************************** *
 *    Unit test for the getCart method    *
 * ********************************************** */
describe("Unit Tests for the getCart method", () => {
  test("It should resolve", async () => {
    await cartDAO.addProductToCart(Utente1.username, "model1");
    await expect(Controller.getCart(Utente1)).resolves.toEqual(mockCarts[1]);
  });
  test("It should reject due to a user not given", async () => {
    await expect(() => Controller.getCart(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

/* ********************************************** *
 *    Unit test for the checkoutCart method    *
 * ********************************************** */
describe("Unit Tests for the checkoutCart method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await expect(Controller.checkoutCart(Utente1)).resolves.toBe(true);
  });

  test("It should reject due to a user not given", async () => {
    await expect(() => Controller.checkoutCart(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

/* ********************************************** *
 *    Unit test for the getCustomerCarts method    *
 * ********************************************** */
describe("Unit Tests for the getCustomerCarts method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await Controller.checkoutCart(Utente1);
    await expect(Controller.getCustomerCarts(Utente1)).resolves.toEqual(
      [mockCarts[0]]
    );
  });
  test("It should reject due to a user not given", async () => {
    await expect(() => Controller.getCustomerCarts(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

/* ********************************************** *
 *    Unit test for the removeProductFromCart method    *
 * ********************************************** */
describe("Unit Tests for the removeProductFromCart method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await expect(Controller.removeProductFromCart(Utente1, "model1")).resolves.toBe(
      true
    );
  });
  test("It should reject due a model not given", async () => {
    await expect(() => Controller.removeProductFromCart(Utente1, " ")).rejects.toThrow(
      InvalidParametersError
    );
  });
  test("It should reject due to a user not given", async () => {
    await expect(() =>
      Controller.removeProductFromCart(Utente2, "model1")
    ).rejects.toThrow(InvalidParametersError);
  });
});

/* ********************************************** *
 *    Unit test for the clearCart method    *
 * ********************************************** */
describe("Unit Tests for the clearCart method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await expect(Controller.clearCart(Utente1)).resolves.toBe(true);
  });
  test("It should reject due to a user not given", async () => {
    await Controller.addToCart(Utente1, "model1");
    await expect(() => Controller.clearCart(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

/* ********************************************** *
 *    Unit test for the deleteAllCarts method    *
 * ********************************************** */
describe("Unit Tests for the deleteAllCarts method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await expect(Controller.deleteAllCarts()).resolves.toBe(true);
  });
});

/* ********************************************** *
 *    Unit test for the getAllCarts method    *
 * ********************************************** */
describe("Unit Tests for the getAllCarts method", () => {
  test("It should resolve", async () => {
    await Controller.addToCart(Utente1, "model1");
    await Controller.checkoutCart(Utente1);
    await Controller.addToCart(Utente1, "model1");
    await expect(Controller.getAllCarts()).resolves.toEqual(mockCarts);
  });
});

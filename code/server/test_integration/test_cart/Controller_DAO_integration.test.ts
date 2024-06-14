import { test, expect, jest, describe, afterEach, beforeAll, afterAll} from "@jest/globals";
import CartController from "../../src/controllers/cartController";
import CartDAO from "../../src/dao/cartDAO";
import ProductDAO from "../../src/dao/productDAO";

import { Category } from "../../src/components/product";
import { Role, User } from "../../src/components/user";
import { InvalidParametersError } from "../../src/errors/cartError";


let cartDAO = new CartDAO();

const mockCarts = [
  {
    customer: "user1",
    paid: false,
    paymentDate: null,
    total: 0,
    products: [
    ],
  },
  {
    customer: "user2",
    paid: true,
    paymentDate: "2022-01-01",
    total: 50,
    products: [
      {
        model: "model3",
        quantity: 1,
        category: Category.SMARTPHONE,
        price: 50,
      },
    ],
  },
];

afterEach(() => {
  jest.clearAllMocks();
});


const Controller = new CartController();
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

beforeAll(async () => {
    await ProductDAO.prototype.registerProducts("model1", Category.SMARTPHONE, 2, null, 10.0, "2024-01-01");
})

afterAll(async () => {
    await ProductDAO.prototype.deleteAllProducts()
});


afterEach(async () => {
    await cartDAO.deleteAllCarts();
});

/* ********************************************** *
 *    Unit test for the addToCart method    *
 * ********************************************** */

describe("Unit Tests for the addToCart method", () => {
  test("It should resolve", async () => {
    await expect(Controller.addToCart(Utente1, "model1")).resolves.toBe(true);
  });
  test("It should reject due a model not given", () => {
    expect(() => Controller.addToCart(Utente1, " ")).rejects.toThrow(
      InvalidParametersError
    );
  });
  test("It should reject due to a user not given", () => {
    expect(() => Controller.addToCart(Utente2, "model1")).rejects.toThrow(
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
    expect(Controller.getCart(Utente1)).resolves.toEqual(mockCarts[0]);
  });
  test("It should reject due to a user not given", () => {
    expect(() => Controller.getCart(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

/* ********************************************** *
 *    Unit test for the checkoutCart method    *
 * ********************************************** */
describe("Unit Tests for the checkoutCart method", () => {
  test("It should resolve", async () => {
    await cartDAO.addProductToCart(Utente1.username, "model1");
    expect(Controller.checkoutCart(Utente1)).resolves.toBe(true);
  });
  test("It should reject due to a user not given", () => {
    expect(() => Controller.checkoutCart(Utente2)).rejects.toThrow(
      InvalidParametersError
    );
  });
});

// /* ********************************************** *
//  *    Unit test for the getCustomerCarts method    *
//  * ********************************************** */
// describe("Unit Tests for the getCustomerCarts method", () => {
//   test("It should resolve", () => {
//     const mock = jest
//       .spyOn(CartDAO.prototype, "getCustomerCarts")
//       .mockResolvedValue([mockCarts[1]]);
//     expect(Controller.getCustomerCarts(Utente1)).resolves.toEqual([
//       mockCarts[1],
//     ]);
//   });
//   test("It should reject due to a user not given", () => {
//     expect(() => Controller.getCustomerCarts(Utente2)).rejects.toThrow(
//       InvalidParametersError
//     );
//   });
// });

// /* ********************************************** *
//  *    Unit test for the removeProductFromCart method    *
//  * ********************************************** */
// describe("Unit Tests for the removeProductFromCart method", () => {
//   test("It should resolve", () => {
//     const mock = jest
//       .spyOn(CartDAO.prototype, "removeProductFromCart")
//       .mockResolvedValue(true);
//     expect(Controller.removeProductFromCart(Utente1, "model1")).resolves.toBe(
//       true
//     );
//   });
//   test("It should reject due a model not given", () => {
//     expect(() => Controller.removeProductFromCart(Utente1, "")).rejects.toThrow(
//       InvalidParametersError
//     );
//   });
//   test("It should reject due to a user not given", () => {
//     expect(() =>
//       Controller.removeProductFromCart(Utente2, "model1")
//     ).rejects.toThrow(InvalidParametersError);
//   });
// });

// /* ********************************************** *
//  *    Unit test for the clearCart method    *
//  * ********************************************** */
// describe("Unit Tests for the clearCart method", () => {
//   test("It should resolve", () => {
//     const mock = jest
//       .spyOn(CartDAO.prototype, "clearCart")
//       .mockResolvedValue(true);
//     expect(Controller.clearCart(Utente1)).resolves.toBe(true);
//   });
//   test("It should reject due to a user not given", () => {
//     expect(() => Controller.clearCart(Utente2)).rejects.toThrow(
//       InvalidParametersError
//     );
//   });
// });

// /* ********************************************** *
//  *    Unit test for the deleteAllCarts method    *
//  * ********************************************** */
// describe("Unit Tests for the deleteAllCarts method", () => {
//   test("It should resolve", () => {
//     const mock = jest
//       .spyOn(CartDAO.prototype, "deleteAllCarts")
//       .mockResolvedValue(true);
//     expect(Controller.deleteAllCarts()).resolves.toBe(true);
//   });
// });

// /* ********************************************** *
//  *    Unit test for the getAllCarts method    *
//  * ********************************************** */
// describe("Unit Tests for the getAllCarts method", () => {
//   test("It should resolve", () => {
//     const mock = jest
//       .spyOn(CartDAO.prototype, "getAllCarts")
//       .mockResolvedValue(mockCarts);
//     expect(Controller.getAllCarts()).resolves.toEqual(mockCarts);
//   });
// });

import {
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
  describe,
} from "@jest/globals";
import ProductDAO from "../../src/dao/productDAO";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { Category, Product } from "../../src/components/product";
import {
  ArrivalDateError,
  EmptyProductStockError,
  FiltersError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from "../../src/errors/productError";

jest.mock("../../src/db/db");

let productDAO: ProductDAO;

beforeEach(() => {
  productDAO = new ProductDAO();
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ********************************************** *
 *    Unit test for the registerProduct method    *
 * ********************************************** */
describe("Unit tests for the registerProduct method", () => {
  test("It should register a product", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "Details1",
        100.0,
        "2022-01-01"
      )
    ).resolves.toBeUndefined();
  });

  test("It should throw an error if product already exists", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("UNIQUE constraint failed: products.model"));
      return {} as Database;
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "Details1",
        100.0,
        "2022-01-01"
      )
    ).rejects.toThrow(ProductAlreadyExistsError);
  });

  test("It should register a product without details", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "",
        100.0,
        "2022-01-01"
      )
    ).resolves.toBeUndefined();
  });

  test("It should register a prodcut without arrival date", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "Details1",
        100.0,
        ""
      )
    ).resolves.toBeUndefined();
  });

  test("It should throw an error if database fails", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"));
      return {} as Database;
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "Details1",
        100.0,
        "2022-01-01"
      )
    ).rejects.toThrow(Error);
  });

  test("It should throw an error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "run").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(
      productDAO.registerProducts(
        "Model1",
        "Smartphone",
        10,
        "Details1",
        100.0,
        "2022-01-01"
      )
    ).rejects.toThrow("Error in try block");
  });
});
/* ********************************************** *
 * Unit test for the changeProductQuantity method *
 * ********************************************** */
describe("Unit tests for the changeProductQuantity method", () => {
  test("It should change the product quantity", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const newQuantity = await productDAO.changeProductQuantity(
      "Model1",
      5,
      "2022-01-02"
    );
    expect(newQuantity).toBe(15);
  });

  test("It should change the product quantity if the changeDate is not specified", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const newQuantity = await productDAO.changeProductQuantity("Model1", 5, "");
    expect(newQuantity).toBe(15);
  });

  test("It should throw an error if product not found", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, undefined);
      return {} as Database;
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2022-01-02")
    ).rejects.toThrow(ProductNotFoundError);
  });

  test("It should throw an error if change date is before the arrival date", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2021-12-31")
    ).rejects.toThrow(ArrivalDateError);
  });

  test("It should throw an error if change date is after the current date", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2031-12-31")
    ).rejects.toThrow(ArrivalDateError);
  });

  test("It should throw an error if the database fails to recover the requested model", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), undefined);
      return {} as Database;
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2022-01-02")
    ).rejects.toThrow(Error);
  });

  test("It should throw an error if the database fails to update the product quantity", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"));
      return {} as Database;
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2022-01-02")
    ).rejects.toThrow(Error);
  });

  test("It should throw an error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "get").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(
      productDAO.changeProductQuantity("Model1", 5, "2022-01-02")
    ).rejects.toThrow("Error in try block");
  });
});
/* ********************************************** *
 *      Unit test for the sellProduct method      *
 * ********************************************** */
describe("Unit tests for the sellProduct method", () => {
  test("It should sell a product", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const newQuantity = await productDAO.sellProduct("Model1", 5, "2022-01-02");
    expect(newQuantity).toBe(5);
  });

  test("It should sell a product if the sellingDate is not specified", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const newQuantity = await productDAO.sellProduct("Model1", 5, null);
    expect(newQuantity).toBe(5);
  });

  test("It should throw an error if product not found", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, undefined);
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2022-01-02")
    ).rejects.toThrow(ProductNotFoundError);
  });

  test("It should throw an error if the product stock is already 0", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 0, arrivalDate: "2022-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2022-01-02")
    ).rejects.toThrow(EmptyProductStockError);
  });

  test("It should throw an error if the quantity to sell is greater than the stock", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 5, arrivalDate: "2022-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 10, "2022-01-02")
    ).rejects.toThrow(LowProductStockError);
  });

  test("It should throw an error if sell date is before the arrival date", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2021-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2020-12-31")
    ).rejects.toThrow(ArrivalDateError);
  });

  test("It should throw an error if sell date is after the current date", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2031-12-31")
    ).rejects.toThrow(ArrivalDateError);
  });

  test("It should throw an error if the database fails to recover the requested model", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), undefined);
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2022-01-02")
    ).rejects.toThrow(Error);
  });

  test("It should throw an error if the database fails to update the product quantity", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 10, arrivalDate: "2022-01-01" });
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"));
      return {} as Database;
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2022-01-02")
    ).rejects.toThrow(Error);
  });

  test("It should throw an error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "get").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(
      productDAO.sellProduct("Model1", 5, "2022-01-02")
    ).rejects.toThrow("Error in try block");
  });
});
/* ********************************************** *
 *      Unit test for the getProducts method      *
 * ********************************************** */
const productsData = [
  new Product(
    100.0,
    "Model1",
    Category.SMARTPHONE,
    "2022-01-01",
    "Details1",
    10
  ),
  new Product(200.0, "Model2", Category.LAPTOP, "2022-01-02", "Details2", 20),
  new Product(
    300.0,
    "Model3",
    Category.APPLIANCE,
    "2022-01-03",
    "Details3",
    30
  ),
];
describe("Unit tests for the getProducts method", () => {
  test("It should get all products in the database if the three parameters are null", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(null, productsData);
      return {} as Database;
    });

    const productsReturned = await productDAO.getProducts(null, null, null);
    expect(productsReturned).toEqual(productsData);
  });

  test("It should get all products in the database if the grouping is 'category' and the category is valid", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      const filteredProducts = productsData.filter(
        (product) => product.category === params[0]
      );
      callback(null, filteredProducts);
      return {} as Database;
    });

    const productsReturned = await productDAO.getProducts(
      "category",
      "Smartphone",
      null
    );
    expect(productsReturned).toEqual([productsData[0]]);
  });

  test("It should get all products in the database if the grouping is 'model' and the model is valid", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      const filteredProducts = productsData.find(
        (product) => product.model === params[0]
      );
      callback(null, filteredProducts);
      return {} as Database;
    });

    const productsReturned = await productDAO.getProducts(
      "model",
      null,
      "Model2"
    );
    expect(productsReturned).toEqual([productsData[1]]);
  });

  test("It should throw a FiltersError if grouping is null and category or model is provided", async () => {
    await expect(
      productDAO.getProducts(null, "category", null)
    ).rejects.toThrow(FiltersError);
    await expect(productDAO.getProducts(null, null, "model")).rejects.toThrow(
      FiltersError
    );
  });

  test("It should throw a FiltersError if grouping is 'category' and category is not provided or model is provided", async () => {
    await expect(
      productDAO.getProducts("category", null, null)
    ).rejects.toThrow(FiltersError);
    await expect(
      productDAO.getProducts("category", "category", "model")
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a FiltersError if grouping is 'model' and model is not provided or category is provided", async () => {
    await expect(productDAO.getProducts("model", null, null)).rejects.toThrow(
      FiltersError
    );
    await expect(
      productDAO.getProducts("model", "category", "model")
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a FiltersError if grouping is not 'category', 'model', null, or undefined", async () => {
    await expect(
      productDAO.getProducts("invalidGrouping", null, null)
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a ProductNotFoundError if no product is found for the given model", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, null); // Simulate no product found
      return {} as Database;
    });

    await expect(
      productDAO.getProducts("model", null, "nonexistentModel")
    ).rejects.toThrow(ProductNotFoundError);
  });

  test("It should throw an Error if the database fails to get the products", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
      return {} as Database;
    });

    await expect(
      productDAO.getProducts("model", null, "Model1")
    ).rejects.toThrow(Error);
  });

  test("It should throw an Error if the database fails to get the products", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
      return {} as Database;
    });

    await expect(productDAO.getProducts(null, null, null)).rejects.toThrow(
      Error
    );
  });

  test("It should throw an Error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "all").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(productDAO.getProducts(null, null, null)).rejects.toThrow(
      "Error in try block"
    );
  });
});
/* ************************************************ *
 *  Unit test for the getAvailableProducts method   *
 * ************************************************ */
describe("Unit tests for the getAvailableProducts method", () => {
  test("It should get all available products in the database if the three parameters are null", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(
        null,
        productsData.filter((product) => product.quantity > 0)
      );
      return {} as Database;
    });

    const productsReturned = await productDAO.getAvailableProducts(
      null,
      null,
      null
    );
    expect(productsReturned).toEqual(
      productsData.filter((product) => product.quantity > 0)
    );
  });

  test("It should get all available products in the database if the grouping is 'category' and the category is valid", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      const filteredProducts = productsData.filter(
        (product) => product.category === params[0] && product.quantity > 0
      );
      callback(null, filteredProducts);
      return {} as Database;
    });

    const productsReturned = await productDAO.getAvailableProducts(
      "category",
      "Smartphone",
      null
    );
    expect(productsReturned).toEqual([productsData[0]]);
  });

  test("It should get the available product in the database if the grouping is 'model' and the model is valid", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      const filteredProduct = productsData.find(
        (product) => product.model === params[0] && product.quantity > 0
      );
      callback(null, filteredProduct);
      return {} as Database;
    });

    const productsReturned = await productDAO.getAvailableProducts(
      "model",
      null,
      "Model2"
    );
    expect(productsReturned).toEqual([productsData[1]]);
  });

  test("It should throw a FiltersError if grouping is null and category or model is provided", async () => {
    await expect(
      productDAO.getAvailableProducts(null, "category", null)
    ).rejects.toThrow(FiltersError);
    await expect(
      productDAO.getAvailableProducts(null, null, "model")
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a FiltersError if grouping is 'category' and category is not provided or model is provided", async () => {
    await expect(
      productDAO.getAvailableProducts("category", null, null)
    ).rejects.toThrow(FiltersError);
    await expect(
      productDAO.getAvailableProducts("category", "category", "model")
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a FiltersError if grouping is 'model' and model is not provided or category is provided", async () => {
    await expect(
      productDAO.getAvailableProducts("model", null, null)
    ).rejects.toThrow(FiltersError);
    await expect(
      productDAO.getAvailableProducts("model", "category", "model")
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a FiltersError if grouping is not 'category', 'model', null, or undefined", async () => {
    await expect(
      productDAO.getAvailableProducts("invalidGrouping", null, null)
    ).rejects.toThrow(FiltersError);
  });

  test("It should throw a ProductNotFoundError if no product is found for the given model", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, null); // Simulate no product found
      return {} as Database;
    });

    await expect(
      productDAO.getAvailableProducts("model", null, "nonexistentModel")
    ).rejects.toThrow(ProductNotFoundError);
  });

  test("It should throw an Error if the database fails to get the products", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
      return {} as Database;
    });

    await expect(
      productDAO.getAvailableProducts("model", null, "Model1")
    ).rejects.toThrow(Error);
  });

  test("It should throw an Error if the database fails to get the products", async () => {
    jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
      return {} as Database;
    });

    await expect(
      productDAO.getAvailableProducts(null, null, null)
    ).rejects.toThrow(Error);
  });

  test("It should throw an Error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "all").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(
      productDAO.getAvailableProducts(null, null, null)
    ).rejects.toThrow("Error in try block");
  });

  test("It should throw a EmptyProductStockError if the requested model is out of stock", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, { quantity: 0 });
      return {} as Database;
    });

    await expect(
      productDAO.getAvailableProducts("model", null, "Model1")
    ).rejects.toThrow(EmptyProductStockError);
  });
});
/* ********************************************** *
 *   Unit test for the deleteAllProducts method   *
 * ********************************************** */
describe("Unit tests for the deleteAllProducts method", () => {
  test("It should delete all products", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    await expect(productDAO.deleteAllProducts()).resolves.toBe(true);
  });

  test("It should throw an Error if the database fails to delete the products", async () => {
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"));
      return {} as Database;
    });

    await expect(productDAO.deleteAllProducts()).rejects.toThrow(Error);
  });

  test("It should throw an Error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "run").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(productDAO.deleteAllProducts()).rejects.toThrow(
      "Error in try block"
    );
  });
});
/* ********************************************** *
 *  Unit test for the deleteProduct method        *
 * ********************************************** */
describe("Unit tests for the deleteProduct method", () => {
  test("It should delete the product if the model is valid", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(
        null,
        productsData.find((product) => product.model === params[0])
      );
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    await expect(productDAO.deleteProduct("Model1")).resolves.toBeTruthy();
  });

  test("It should throw a ProductNotFoundError if the model is not found", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(null, null); // Simulate no product found
      return {} as Database;
    });

    await expect(productDAO.deleteProduct("nonexistentModel")).rejects.toThrow(
      ProductNotFoundError
    );
  });

  test("It should throw an Error if the database fails to get the product", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"), null);
      return {} as Database;
    });

    await expect(productDAO.deleteProduct("Model1")).rejects.toThrow(Error);
  });

  test("It should throw an Error if the database fails to delete the product", async () => {
    jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
      callback(
        null,
        productsData.find((product) => product.model === params[0])
      );
      return {} as Database;
    });
    jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error("Database error"));
      return {} as Database;
    });

    await expect(productDAO.deleteProduct("Model1")).rejects.toThrow(Error);
  });

  test("It should throw an Error if an error is thrown in the try block", async () => {
    jest.spyOn(db, "get").mockImplementation(() => {
      throw new Error("Error in try block");
    });

    await expect(productDAO.deleteProduct("Model1")).rejects.toThrow(
      "Error in try block"
    );
  });
});

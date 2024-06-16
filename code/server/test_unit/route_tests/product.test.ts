import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";
import {
  ArrivalDateError,
  ProductAlreadyExistsError,
  InvalidParametersError,
  ProductNotFoundError,
  EmptyProductStockError,
  LowProductStockError,
  FiltersError,
} from "../../src/errors/productError";

jest.mock("../../src/controllers/productController");
jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

beforeEach(() => {
  jest.resetAllMocks();
});

const p1 = {
  model: "model",
  category: "Smartphone",
  quantity: 10,
  details: "details",
  sellingPrice: 100.05,
  arrivalDate: "2024-01-01",
};

describe("Unit test for the ProductRoutes class", () => {
  /* ********************************************** *
   *    Unit test for the POST products/ method   *
   * ********************************************** */
  describe("Unit test for the `POST product/` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send(p1);
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if model is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, model: "" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, category: "" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category's value is not valid", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, category: "invalid" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if quantity is negative", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, quantity: -1 });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if quantity is zero", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, quantity: 0 });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if sellingPrice is negative", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockRejectedValueOnce(new InvalidParametersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, sellingPrice: -1 });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if sellingPrice is zero", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, sellingPrice: 0 });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 200 if arrivalDate is not provided", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, arrivalDate: undefined });
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 400 if arrivalDate is in the future", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockRejectedValueOnce(new ArrivalDateError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, arrivalDate: "2025-01-01" });
      expect(response.status).toBe(400);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 409 if a model is already registered", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockRejectedValueOnce(new ProductAlreadyExistsError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send(p1);
      expect(response.status).toBe(409);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if arrivalDate is formatted incorrectly", async () => {
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockRejectedValueOnce(new InvalidParametersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .post(baseURL + "/products")
        .send({ ...p1, arrivalDate: "2024-01-02" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app)
        .post(baseURL + "/products")
        .send(p1);
      expect(response.status).toBe(401);

      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });

  /* ********************************************** *
   *  Unit test for the PATCH product/:model method *
   * ********************************************** */
  describe("Unit test for the `PATCH product/:model` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockResolvedValueOnce(20);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 10, changeDate: "2024-01-01" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ quantity: 20 });

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 404 if model is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/ ")
        .send({ quantity: 10, changeDate: "2024-01-01" });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({});

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 404 if the model does not exist", async () => {
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockRejectedValueOnce(new ProductNotFoundError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 10, changeDate: "2024-01-01" });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Product not found",
        status: 404,
      });

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if quantity is negative", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: -1, changeDate: "2024-01-01" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if quantity is zero", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 0, changeDate: "2024-01-01" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if quantity is not an integer", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 1.5, changeDate: "2024-01-01" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if quantity is not provided", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ changeDate: "2024-01-01" });
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if changeDate is in the future", async () => {
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockRejectedValueOnce(new ArrivalDateError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 10, changeDate: "2025-01-01" });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid date", status: 400 });

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if changeDate is formatted incorrectly", async () => {
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockRejectedValueOnce(new InvalidParametersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 10, changeDate: "01-01-2024" });
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: "Invalid parameters",
        status: 422,
      });

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app)
        .patch(baseURL + "/products/model1")
        .send({ quantity: 10, changeDate: "2024-01-01" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({});

      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });

  /* *************************************************** *
   * Unit test for the PATCH products/:model/sell method *
   * *************************************************** */
  describe("Unit test for the `PATCH products/:model/sell` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockResolvedValueOnce(5);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ quantity: 5 });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if model is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/ /sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(422);
    });

    test("It should return 404 if the model does not exist", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(new ProductNotFoundError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Product not found",
        status: 404,
      });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if quantity is negative", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: -1, sellingDate: "2024-01-01" });
      expect(response.status).toBe(422);
    });

    test("It should return 422 if quantity is zero", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 0, sellingDate: "2024-01-01" });
      expect(response.status).toBe(422);
    });

    test("It should return 422 if quantity is not an integer", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 1.5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(422);
    });

    test("It should return 422 if quantity is not provided", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ sellingDate: "2024-01-01" });
      expect(response.status).toBe(422);
    });

    test("It should return 409 if there are no more products to sell", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(new EmptyProductStockError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "Product stock is empty",
        status: 409,
      });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 409 if there are less product units than the requested quantity", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(new LowProductStockError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "Product stock cannot satisfy the requested quantity",
        status: 409,
      });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if sellingDate is in the future", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(new ArrivalDateError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2025-01-01" });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid date", status: 400 });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 422 if sellingDate is formatted incorrectly", async () => {
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(new InvalidParametersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "01-01-2024" });
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: "Invalid parameters",
        status: 422,
      });

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app)
        .patch(baseURL + "/products/model1/sell")
        .send({ quantity: 5, sellingDate: "2024-01-01" });
      expect(response.status).toBe(401);

      expect(ProductController.prototype.sellProduct).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });

  /* ********************************************** *
   *    Unit test for the GET products/ method        *
   * ********************************************** */
  describe("Unit test for the `GET products/` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(baseURL + "/products");
      expect(response.status).toBe(200);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 200 if grouping is category", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=category&category=Smartphone"
      );
      expect(response.status).toBe(200);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 200 if grouping is model", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=model&model=model1"
      );
      expect(response.status).toBe(200);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 422 if grouping is invalid", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=invalid"
      );
      expect(response.status).toBe(422);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category is not valid", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=category&category=invalid"
      );
      expect(response.status).toBe(422);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is null but category is not", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=&category=Smartphone"
      );
      expect(response.status).toBe(422);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is null but model is not", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=&model=model1"
      );
      expect(response.status).toBe(422);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=category&category="
      );
      expect(response.status).toBe(422);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if model is empty", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=model "
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is category but a model is provided", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=category&model=model1"
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is model but a category is provided", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=model&category=Smartphone"
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 404 if the model does not exist", async () => {
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockRejectedValueOnce(new ProductNotFoundError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products?grouping=model&model=model1"
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Product not found",
        status: 404,
      });

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app).get(baseURL + "/products");
      expect(response.status).toBe(401);

      expect(ProductController.prototype.getProducts).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });

  /* ********************************************** *
   * Unit test for the GET products/available method  *
   * ********************************************** */
  describe("Unit test for the `GET products/available` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(baseURL + "/products/available");
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 200 if grouping is category", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=category&category=Smartphone"
      );
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 200 if grouping is model", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce([]);
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=model&model=model1"
      );
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("It should return 422 if grouping is invalid", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=invalid"
      );
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category is not valid", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=category&category=invalid"
      );
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is null but category is not", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=&category=Smartphone"
      );
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is null but model is not", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=&model=model1"
      );
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if category is empty", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=category&category="
      );
      expect(response.status).toBe(422);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });

    test("It should return 422 if model is empty", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=model "
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is category but a model is provided", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=category&model=model1"
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 422 if grouping is model but a category is provided", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockRejectedValueOnce(new FiltersError());
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=model&category=Smartphone"
      );
      expect(response.status).toBe(422);
      expect(response.body).toEqual({ error: "Invalid filters", status: 422 });

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1); // The error should be thrown before the method is called
    });

    test("It should return 404 if the model does not exist", async () => {
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockRejectedValueOnce(new ProductNotFoundError());
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).get(
        baseURL + "/products/available?grouping=model&model=model1"
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Product not found",
        status: 404,
      });

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app).get(baseURL + "/products/available");
      expect(response.status).toBe(401);

      expect(
        ProductController.prototype.getAvailableProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });

  /* *************************************** *
   * Unit test for the DELETE products/ method  *
   * *************************************** */
  describe("Unit test for the `DELETE products/` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "deleteProduct")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).delete(baseURL + "/products/model1");
      expect(response.status).toBe(200);

      expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(
        1
      );
    });

    test("It should return 404 if the model does not exist", async () => {
      jest
        .spyOn(ProductController.prototype, "deleteProduct")
        .mockRejectedValueOnce(new ProductNotFoundError());
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).delete(baseURL + "/products/model1");
      expect(response.status).toBe(404);

      expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(
        1
      );
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app).delete(baseURL + "/products/model1");
      expect(response.status).toBe(401);

      expect(ProductController.prototype.deleteProduct).toHaveBeenCalledTimes(
        0
      ); // The error should be thrown before the method is called
    });
  });

  /* *************************************** *
   * Unit test for the DELETE products/:model method      *
   * *************************************** */
  describe("Unit test for the `DELETE products/:model` route", () => {
    test("It should return 200", async () => {
      jest
        .spyOn(ProductController.prototype, "deleteAllProducts")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => next());

      const response = await request(app).delete(baseURL + "/products");
      expect(response.status).toBe(200);

      expect(
        ProductController.prototype.deleteAllProducts
      ).toHaveBeenCalledTimes(1);
    });

    test("It should return 401 if the user is not an admin or manager", async () => {
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => res.status(401).send());
      const response = await request(app).delete(baseURL + "/products");
      expect(response.status).toBe(401);

      expect(
        ProductController.prototype.deleteAllProducts
      ).toHaveBeenCalledTimes(0); // The error should be thrown before the method is called
    });
  });
});

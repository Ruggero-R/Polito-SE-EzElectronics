import { describe, test, expect, jest, afterEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import ProductRoutes from "../../src/routers/productRoutes";
import ProductController from "../../src/controllers/productController";
import Authenticator from "../../src/routers/auth";

jest.mock("../../src/controllers/productController");
jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

afterEach(() => {
  jest.resetAllMocks();
});

/* ********************************************** *
 *    Unit test for the registerProducts method   *
 * ********************************************** */

describe("Unit test for the registerProducts route", () => {
  test("It should register a product", async () => {
    const p1 = {
      model: "model",
      category: "Smartphone",
      quantity: 1,
      details: "details",
      sellingPrice: 1,
      arrivalDate: "2024-01-01",
    };

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

    expect(ProductController.prototype.registerProducts).toHaveBeenCalledTimes(1);
  });
});

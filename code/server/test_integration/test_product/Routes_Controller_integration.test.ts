import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  beforeAll,
} from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import Authenticator from "../../src/routers/auth";
import dayjs from "dayjs";

jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

beforeEach((done) => {
  jest.resetAllMocks();
  db.serialize(() => {
    db.run("DELETE FROM products", (err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });
});

beforeAll((done) => {
  cleanup();
  done();
});

const p1 = {
  sellingPrice: 100.05,
  model: "model1",
  category: "Smartphone",
  details: "details",
  arrivalDate: dayjs().format("YYYY-MM-DD"),
  quantity: 10,
};
const p2 = {
  sellingPrice: 200.05,
  model: "model2",
  category: "Laptop",
  details: "details",
  arrivalDate: dayjs().format("YYYY-MM-DD"),
  quantity: 20,
};
const p3 = {
  sellingPrice: 300.05,
  model: "model3",
  category: "Appliance",
  details: "details",
  arrivalDate: dayjs().format("YYYY-MM-DD"),
  quantity: 30,
};

describe("Integration test for the registerProducts route", () => {
  beforeEach(() => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());
  });

  test("It should return 200", async () => {
    const pa = { ...p1, model: "model1a", details: "", arrivalDate: "" };
    const pb = { ...p1, model: "model1b", arrivalDate: undefined as any };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(p1);
    expect(response.status).toBe(200);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(200);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(200);
  });

  test("It should return 422 for bad model field", async () => {
    const pa = { ...p1, model: "" };
    const pb = { ...p1, model: undefined as any };
    const pc = { ...p1, model: null as any };
    const pd = { ...p1, model: 123 };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pd);
    expect(response.status).toBe(422);
  });

  test("It should return 409 for model already exists", async () => {
    await request(app)
      .post(baseURL + "/products")
      .send(p1);

    const response = await request(app)
      .post(baseURL + "/products")
      .send(p1);

    expect(response.status).toBe(409);
  });

  test("It should return 422 for bad category field", async () => {
    const pa = { ...p1, category: "" };
    const pb = { ...p1, category: undefined as any };
    const pc = { ...p1, category: null as any };
    const pd = { ...p1, category: 123 };
    const pe = { ...p1, category: "Not a category" };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad quantity field", async () => {
    const pa = { ...p1, quantity: "" };
    const pb = { ...p1, quantity: undefined as any };
    const pc = { ...p1, quantity: null as any };
    const pd = { ...p1, quantity: 0 };
    const pe = { ...p1, quantity: -1 };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad details field", async () => {
    const pa = { ...p1, details: 123 };
    const pb = { ...p1, details: null as any };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad sellingPrice field", async () => {
    const pa = { ...p1, sellingPrice: "" };
    const pb = { ...p1, sellingPrice: undefined as any };
    const pc = { ...p1, sellingPrice: null as any };
    const pd = { ...p1, sellingPrice: 0 };
    const pe = { ...p1, sellingPrice: -1 };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad arrivalDate field", async () => {
    const pa = { ...p1, arrivalDate: null as any };
    const pb = { ...p1, arrivalDate: 123 };
    const pc = { ...p1, arrivalDate: "2024-01-32" };
    const pd = { ...p1, arrivalDate: "2024-13-01" };
    const pe = { ...p1, arrivalDate: dayjs().format("DD-MM-YYYY") };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .post(baseURL + "/products")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 400 for arrivalDate in the future", async () => {
    const pa = {
      ...p1,
      arrivalDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    };

    let response = await request(app)
      .post(baseURL + "/products")
      .send(pa);
    expect(response.status).toBe(400);
  });
});

describe("Integration test for the changeProductQuantity route", () => {
  beforeEach(async () => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());

    await request(app)
      .post(baseURL + "/products")
      .send(p1);
  });

  test("It should return 200", async () => {
    const body1 = { quantity: 5, changeDate: dayjs().format("YYYY-MM-DD") };
    const body2 = { quantity: 5, changeDate: "" };
    const body3 = { quantity: 5, changeDate: undefined as any };

    let response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(body1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ quantity: 15 });

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(body2);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ quantity: 20 });

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(body3);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ quantity: 25 });
  });

  test("It should return 404 for product not found", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/modelA")
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
  });

  test("It should return 422 for bad quantity field", async () => {
    const pa = { quantity: "" };
    const pb = { quantity: undefined as any };
    const pc = { quantity: null as any };
    const pd = { quantity: 0 };
    const pe = { quantity: -1 };

    let response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad changeDate field", async () => {
    const pa = { quantity: 5, changeDate: null as any };
    const pb = { quantity: 5, changeDate: 123 };
    const pc = { quantity: 5, changeDate: "2024-01-32" };
    const pd = { quantity: 5, changeDate: "2024-13-01" };
    const pe = { quantity: 5, changeDate: dayjs().format("DD-MM-YYYY") };

    let response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 400 for changeDate in the future", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/model1")
      .send({
        quantity: 5,
        changeDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      });

    expect(response.status).toBe(400);
  });

  test("It should return 400 for changeDate before arrivalDate", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/model1")
      .send({
        quantity: 5,
        changeDate: dayjs(p1.arrivalDate)
          .subtract(1, "day")
          .format("YYYY-MM-DD"),
      });

    expect(response.status).toBe(400);
  });
});

describe("Integration test for the sellProduct route", () => {
  beforeEach(async () => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());

    await request(app)
      .post(baseURL + "/products")
      .send(p1);
  });

  test("It should return 200", async () => {
    const body1 = { quantity: 1, sellingDate: dayjs().format("YYYY-MM-DD") };
    const body2 = { quantity: 1, sellingDate: "" };
    const body3 = { quantity: 1, sellingDate: undefined as any };

    let response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(body1);
    expect(response.status).toBe(200);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(body2);
    expect(response.status).toBe(200);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(body3);
    expect(response.status).toBe(200);
  });

  test("It should return 404 for product not found", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/modelA/sell")
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
  });

  test("It should return 409 for empty product stock", async () => {
    await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({ quantity: 10 });

    const response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({ quantity: 1 });
    expect(response.status).toBe(409);
  });

  test("It should return 409 for low product stock", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({ quantity: 11 });
    expect(response.status).toBe(409);
  });

  test("It should return 422 for bad quantity field", async () => {
    const pa = { quantity: "" };
    const pb = { quantity: undefined as any };
    const pc = { quantity: null as any };
    const pd = { quantity: 0 };
    const pe = { quantity: -1 };

    let response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 422 for bad sellingDate field", async () => {
    const pa = { quantity: 1, sellingDate: null as any };
    const pb = { quantity: 1, sellingDate: 123 };
    const pc = { quantity: 1, sellingDate: "2024-01-32" };
    const pd = { quantity: 1, sellingDate: "2024-13-01" };
    const pe = { quantity: 1, sellingDate: dayjs().format("DD-MM-YYYY") };

    let response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pa);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pb);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pc);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pd);
    expect(response.status).toBe(422);

    response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send(pe);
    expect(response.status).toBe(422);
  });

  test("It should return 400 for sellingDate in the future", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({
        quantity: 1,
        sellingDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      });

    expect(response.status).toBe(400);
  });

  test("It should return 400 for sellingDate before arrivalDate", async () => {
    const response = await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({
        quantity: 1,
        sellingDate: dayjs(p1.arrivalDate)
          .subtract(1, "day")
          .format("YYYY-MM-DD"),
      });

    expect(response.status).toBe(400);
  });
});

describe("Integration test for the getProducts route", () => {
  beforeEach(async () => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());

    await request(app)
      .post(baseURL + "/products")
      .send(p1);

    await request(app)
      .post(baseURL + "/products")
      .send(p2);

    await request(app)
      .post(baseURL + "/products")
      .send(p3);
  });

  test("It should return 200", async () => {
    let response = await request(app).get(baseURL + "/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([p1, p2, p3]);
  });

  test("It should return 200 with query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products?grouping=category&category=Smartphone"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual([p1]);
  });

  test("It should return 422 for invalid query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products?grouping=&category=Smartphone"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=category&category=Not_a_category"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=categ&category="
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=category&category=Smartphone&model=model1"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=model&category=Smartphone"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=model&model="
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products?grouping=model&model=model1&category=Smartphone"
    );
    expect(response.status).toBe(422);
  });

  test("It should return 200 even if there are no products", async () => {
    let response = await request(app).get(baseURL + "/products");
    expect(response.status).toBe(200);

    response = await request(app).get(
      baseURL + "/products?grouping=category&category=Smartphone"
    );
    expect(response.status).toBe(200);
  });

  test("It should return 404 for no products found with query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products?grouping=model&model=modelA"
    );
    expect(response.status).toBe(404);
  });
});

describe("Integration test for the getAvailableProducts route", () => {
  beforeEach(async () => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());

    await request(app)
      .post(baseURL + "/products")
      .send(p1);
    await request(app)
      .post(baseURL + "/products")
      .send(p2);
    await request(app)
      .post(baseURL + "/products")
      .send(p3);

    await request(app)
      .patch(baseURL + "/products/model1/sell")
      .send({ quantity: 10, sellingDate: dayjs().format("YYYY-MM-DD") });

    jest
      .spyOn(Authenticator.prototype, "isLoggedIn")
      .mockImplementation((req, res, next) => next());
  });

  test("It should return 200", async () => {
    let response = await request(app).get(baseURL + "/products/available");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([p2, p3]);
  });

  test("It should return 200", async () => {
    let response = await request(app).get(baseURL + "/products/available");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([p2, p3]);
  });

  test("It should return 200 with query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products/available?grouping=category&category=Smartphone"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("It should return 422 for invalid query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products/available?grouping=&category=Smartphone"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products/available?grouping=category&category=Not_a_category"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products/available?grouping=categ&category="
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL +
        "/products/available?grouping=category&category=Smartphone&model=model1"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products/available?grouping=model&category=Smartphone"
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL + "/products/available?grouping=model&model="
    );
    expect(response.status).toBe(422);

    response = await request(app).get(
      baseURL +
        "/products/available?grouping=model&model=model1&category=Smartphone"
    );
    expect(response.status).toBe(422);
  });

  test("It should return 200 even if there are no products", async () => {
    let response = await request(app).get(baseURL + "/products/available");
    expect(response.status).toBe(200);

    response = await request(app).get(
      baseURL + "/products/available?grouping=category&category=Smartphone"
    );
    expect(response.status).toBe(200);
  });

  test("It should return 404 for no products found with query parameters", async () => {
    let response = await request(app).get(
      baseURL + "/products/availablegrouping=model&model=modelA"
    );
    expect(response.status).toBe(404);
  });
});

describe("Integration test for the deleteProduct route", () => {
  beforeEach(async () => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());

    await request(app)
      .post(baseURL + "/products")
      .send(p1);
  });

  test("It should return 200", async () => {
    let response = await request(app).delete(baseURL + "/products/model1");
    expect(response.status).toBe(200);
  });

  test("It should return 404 for product not found", async () => {
    const response = await request(app).delete(baseURL + "/products/modelA");
    expect(response.status).toBe(404);
  });
});

describe("Integration test for the deleteAllProducts route", () => {
  beforeEach(() => {
    jest
      .spyOn(Authenticator.prototype, "isAdminOrManager")
      .mockImplementation((req, res, next) => next());
  });

  test("It should return 200", async () => {
    await request(app)
      .post(baseURL + "/products")
      .send(p1);

    let response = await request(app).delete(baseURL + "/products");
    expect(response.status).toBe(200);
  });

  test("It should return 200 even if no models are in the db", async () => {
    const response = await request(app).delete(baseURL + "/products");
    expect(response.status).toBe(200);
  });
});

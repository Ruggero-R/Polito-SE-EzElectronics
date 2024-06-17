import ProductController from "../../src/controllers/productController";
import dayjs from "dayjs";
import { expect, beforeEach, describe, test, beforeAll } from "@jest/globals";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import {
  ArrivalDateError,
  EmptyProductStockError,
  FiltersError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from "../../src/errors/productError";
import { Category, Product } from "../../src/components/product";

beforeAll(() => {
  cleanup();
});

describe("Product Controller Integration Tests", () => {
  let controller: ProductController;

  beforeEach((done) => {
    controller = new ProductController();
    db.serialize(() => {
      db.run("DELETE FROM products", (err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  const p1a = new Product(
    100.0,
    "Model1a",
    Category.SMARTPHONE,
    "2024-01-01",
    "BUY YOUR Model1b NOW!",
    10
  );
  const p1b = new Product(
    100.0,
    "Model1b",
    Category.SMARTPHONE,
    undefined as any,
    undefined as any,
    20
  );
  const p1c = new Product(
    100.0,
    "Model1c",
    Category.SMARTPHONE,
    null as any,
    null as any,
    30
  );
  const p1d = new Product(100.0, "Model1d", Category.SMARTPHONE, "", "", 40);
  const p2 = new Product(
    200.0,
    "Model2",
    Category.LAPTOP,
    "2024-01-02",
    "Details2",
    20
  );
  const p3 = new Product(
    300.0,
    "Model3",
    Category.APPLIANCE,
    "2024-01-03",
    "Details3",
    30
  );
  const p4 = new Product(
    100.0,
    "Model4",
    Category.SMARTPHONE,
    "2024-01-01",
    "Details1",
    0
  );
  const p5 = new Product(
    200.0,
    "Model5",
    Category.LAPTOP,
    "2024-01-02",
    "Details2",
    0
  );
  const p6 = new Product(
    300.0,
    "Model6",
    Category.APPLIANCE,
    "2024-01-03",
    "Details3",
    0
  );

  /* *********************************************** *
   * Integration test for the registerProducts method *
   * ************************************************ */
  describe("tests for the registerProducts method", () => {
    test("registerProducts should register a new product in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p1b.model,
        p1b.category,
        p1b.quantity,
        p1b.details,
        p1b.sellingPrice,
        p1b.arrivalDate
      );
      await controller.registerProducts(
        p1c.model,
        p1c.category,
        p1c.quantity,
        p1c.details,
        p1c.sellingPrice,
        p1c.arrivalDate
      );
      await controller.registerProducts(
        p1d.model,
        p1d.category,
        p1d.quantity,
        p1d.details,
        p1d.sellingPrice,
        p1d.arrivalDate
      );

      const p1bDB = new Product(
        p1b.sellingPrice,
        p1b.model,
        p1b.category,
        dayjs().format("YYYY-MM-DD"),
        `BUY YOUR ${p1b.model} NOW!`,
        p1b.quantity
      );
      const p1cDB = new Product(
        p1c.sellingPrice,
        p1c.model,
        p1c.category,
        dayjs().format("YYYY-MM-DD"),
        `BUY YOUR ${p1c.model} NOW!`,
        p1c.quantity
      );
      const p1dDB = new Product(
        p1d.sellingPrice,
        p1d.model,
        p1d.category,
        dayjs().format("YYYY-MM-DD"),
        `BUY YOUR ${p1d.model} NOW!`,
        p1d.quantity
      );

      const products = await controller.getProducts(null, null, null);
      expect(products).toEqual([p1a, p1bDB, p1cDB, p1dDB]);
    });

    test("registerProducts should throw an error if one of the required parameters is not provided or is of the wrong type", async () => {
      // MODEL
      await controller
        .registerProducts(
          undefined as any,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //undefined
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          null as any,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //null
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          "",
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //empty string
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          1 as any,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //number
          expect(err).toBeInstanceOf(Error);
        });

      // CATEGORY
      await controller
        .registerProducts(
          p1a.model,
          undefined as any,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //undefined
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          null as any,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //null
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          "",
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //empty string
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          "Not a category",
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //invalid category
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          1 as any,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //number
          expect(err).toBeInstanceOf(Error);
        });

      // DETAILS
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          1 as any,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          //number
          expect(err).toBeInstanceOf(Error);
        });

      // QUANTITY
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          undefined as any,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          null as any,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          0,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });

      // SELLLING PRICE
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          undefined as any,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          null as any,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          0,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          10.5,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          "100" as any,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          -100,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });

      // ARRIVAL DATE
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          1 as any
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          dayjs().format("DD-MM-YYYY") as any
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
    });

    test("registerProducts should throw an error if the arrival date is in the future", async () => {
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          dayjs().add(1, "day").format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(ArrivalDateError);
        });
    });

    test("registerProducts should throw an error if the product already exists in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller
        .registerProducts(
          p1a.model,
          p1a.category,
          p1a.quantity,
          p1a.details,
          p1a.sellingPrice,
          p1a.arrivalDate
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(ProductAlreadyExistsError);
        });
    });
  });
  /* **************************************************** *
   * Integration test for the changeProductQuantity method *
   * ***************************************************** */
  describe("tests for the changeProductQuantity method", () => {
    test("changeProductQuantity should increase the quantity of a product in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );

      await controller.changeProductQuantity(
        p1a.model,
        10,
        dayjs().format("YYYY-MM-DD")
      ); // changeDate = today
      await controller.changeProductQuantity(p2.model, 20, null); // changeDate = null
      await controller.changeProductQuantity(p3.model, 30, undefined as any); // changeDate = undefined

      const p1aDB = new Product(
        p1a.sellingPrice,
        p1a.model,
        p1a.category,
        dayjs().format("YYYY-MM-DD"),
        p1a.details,
        20
      );
      const p2DB = new Product(
        p2.sellingPrice,
        p2.model,
        p2.category,
        dayjs().format("YYYY-MM-DD"),
        p2.details,
        40
      );
      const p3DB = new Product(
        p3.sellingPrice,
        p3.model,
        p3.category,
        dayjs().format("YYYY-MM-DD"),
        p3.details,
        60
      );

      const products = await controller.getProducts(null, null, null);

      expect(products).toEqual([p1aDB, p2DB, p3DB]);
    });

    test("changeProductQuantity should throw an error if one of the required parameters is not provided or is of the wrong type", async () => {
      // MODEL
      await controller
        .changeProductQuantity(
          undefined as any,
          10,
          dayjs().format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(null as any, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity("", 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(1 as any, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });

      // NEW QUANTITY
      await controller
        .changeProductQuantity(
          p1a.model,
          undefined as any,
          dayjs().format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(
          p1a.model,
          null as any,
          dayjs().format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(p1a.model, 0, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(p1a.model, -10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(p1a.model, 10.5, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(
          p1a.model,
          "10" as any,
          dayjs().format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });

      // CHANGE DATE
      await controller
        .changeProductQuantity(p1a.model, 10, 1 as any)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .changeProductQuantity(
          p1a.model,
          10,
          dayjs().format("DD-MM-YYYY") as any
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
        });
    });

    test("changeProductQuantity should throw an error if the change date is in the future", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller
        .changeProductQuantity(
          p1a.model,
          10,
          dayjs().add(1, "day").format("YYYY-MM-DD")
        )
        .catch((err) => {
          expect(err).toBeInstanceOf(ArrivalDateError);
        });
    });

    test("changeProductQuantity should throw an error if the product does not exist in the database", async () => {
      await controller
        .changeProductQuantity(p1a.model, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(ProductNotFoundError);
        });
    });
  });
  /* ****************************************** *
   * Integration test for the sellProduct method *
   * ******************************************* */
  describe("tests for the sellProduct method", () => {
    test("sellProduct should decrease the quantity of a product in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );

      await controller.sellProduct(p1a.model, 5, dayjs().format("YYYY-MM-DD")); // sellingDate = today
      await controller.sellProduct(p2.model, 10, null); // sellingDate = null
      await controller.sellProduct(p3.model, 15, undefined as any); // sellingDate = undefined

      const p1aDB = new Product(
        p1a.sellingPrice,
        p1a.model,
        p1a.category,
        p1a.arrivalDate,
        p1a.details,
        5
      );
      const p2DB = new Product(
        p2.sellingPrice,
        p2.model,
        p2.category,
        p2.arrivalDate,
        p2.details,
        10
      );
      const p3DB = new Product(
        p3.sellingPrice,
        p3.model,
        p3.category,
        p3.arrivalDate,
        p3.details,
        15
      );

      const products = await controller.getProducts(null, null, null);

      expect(products).toEqual([p1aDB, p2DB, p3DB]);
    });

    test("sellProduct should throw an error if one of the required parameters is not provided or is of the wrong type", async () => {
      // MODEL
      await controller
        .sellProduct(undefined as any, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //undefined
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(null as any, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //null
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct("", 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //empty string
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(1 as any, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //number
          expect(err).toBeInstanceOf(Error);
        });

      // QUANTITY
      await controller
        .sellProduct(p1a.model, undefined as any, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //undefined
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(p1a.model, null as any, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //null
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(p1a.model, 0, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //0
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(p1a.model, -10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //negative number
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(p1a.model, 10.5, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //float
          expect(err).toBeInstanceOf(Error);
        });
      await controller
        .sellProduct(p1a.model, "10" as any, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          //string
          expect(err).toBeInstanceOf(Error);
        });

      // SELLING DATE
      await controller.sellProduct(p1a.model, 10, 1 as any).catch((err) => {
        //number
        expect(err).toBeInstanceOf(Error);
      });
      await controller
        .sellProduct(p1a.model, 10, dayjs().format("DD-MM-YYYY") as any)
        .catch((err) => {
          //invalid date
          expect(err).toBeInstanceOf(Error);
        });
    });

    test("sellProduct should throw an error if the selling date is in the future", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller
        .sellProduct(p1a.model, 10, dayjs().add(1, "day").format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(ArrivalDateError);
        });
    });

    test("sellProduct should throw an error if the product does not exist in the database", async () => {
      await controller
        .sellProduct(p1a.model, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(ProductNotFoundError);
        });
    });

    test("sellProduct should throw an error if the product is out of stock", async () => {
      await controller.registerProducts(
        p4.model,
        p4.category,
        p4.quantity + 1,
        p4.details,
        p4.sellingPrice,
        p4.arrivalDate
      ); // cannot register a product with 0 stock
      await controller.sellProduct(p4.model, 1, dayjs().format("YYYY-MM-DD")); // sell the only unit
      await controller
        .sellProduct(p4.model, 1, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          // sell 1 more unit
          expect(err).toBeInstanceOf(EmptyProductStockError);
        });
    });

    test("sellProduct should throw an error if the product has low stock", async () => {
      await controller.registerProducts(
        p5.model,
        p5.category,
        5,
        p5.details,
        p5.sellingPrice,
        p5.arrivalDate
      );
      await controller
        .sellProduct(p5.model, 10, dayjs().format("YYYY-MM-DD"))
        .catch((err) => {
          expect(err).toBeInstanceOf(LowProductStockError);
        });
    });
  });
  /* ***************************************** *
   * Integration test for the getProducts method *
   * ****************************************** */
  describe("tests for the getProducts method", () => {
    test("getProducts should return all products in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );

      const products = await controller.getProducts(null, null, null);
      expect(products).toEqual([p1a, p2, p3]);

      const products2 = await controller.getProducts(
        "category",
        "Smartphone",
        null
      );
      expect(products2).toEqual([p1a]);

      const products3 = await controller.getProducts("model", null, "Model2");
      expect(products3).toEqual([p2]);
    });

    test("getProducts should throw an error if the filters are invalid", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );

      // GROUPING
      await controller
        .getProducts("invalidGrouping", null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getProducts("", null, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller.getProducts(1 as any, null, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getProducts(undefined as any, null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getProducts(null, "Smartphone", null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller.getProducts(null, null, "Model1").catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getProducts("category", "Smartphone", "Model1")
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });

      // CATEGORY
      await controller
        .getProducts("category", "Not a category", null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getProducts("category", 1 as any, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller.getProducts("category", "", null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller.getProducts("category", null, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getProducts("category", undefined as any, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getProducts("category", null, "Model1").catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });

      // MODEL

      await controller.getProducts("model", null, 1 as any).catch((err) => {
        expect(err).toBeInstanceOf(ProductNotFoundError);
      });
      await controller.getProducts("model", null, "").catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller.getProducts("model", null, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getProducts("model", null, undefined as any)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getProducts("model", "Smartphone", null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
    });
  });

  /* **************************************************** *
   * Integration test for the getAvailableProducts method *
   * **************************************************** */
  describe("tests for the getAvailableProducts method", () => {
    test("getAvailableProducts should return all available products in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );
      await controller.registerProducts(
        p4.model,
        p4.category,
        p4.quantity + 1,
        p4.details,
        p4.sellingPrice,
        p4.arrivalDate
      );
      await controller.registerProducts(
        p5.model,
        p5.category,
        p5.quantity + 1,
        p5.details,
        p5.sellingPrice,
        p5.arrivalDate
      );
      await controller.registerProducts(
        p6.model,
        p6.category,
        p6.quantity + 1,
        p6.details,
        p6.sellingPrice,
        p6.arrivalDate
      );

      await controller.sellProduct(p4.model, 1, dayjs().format("YYYY-MM-DD")); // sell 1 unit
      await controller.sellProduct(p5.model, 1, dayjs().format("YYYY-MM-DD")); // sell 1 unit
      await controller.sellProduct(p6.model, 1, dayjs().format("YYYY-MM-DD")); // sell 1 unit

      const products = await controller.getAvailableProducts(null, null, null);
      expect(products).toEqual([p1a, p2, p3]);

      const products2 = await controller.getAvailableProducts(
        "category",
        "Smartphone",
        null
      );
      expect(products2).toEqual([p1a]);

      const products3 = await controller.getAvailableProducts(
        "model",
        null,
        "Model2"
      );
      expect(products3).toEqual([p2]);
    });

    test("getAvailableProducts should throw an error if the filters are invalid", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p4.model,
        p4.category,
        p4.quantity + 1,
        p4.details,
        p4.sellingPrice,
        p4.arrivalDate
      );
      await controller.sellProduct(p4.model, 1, dayjs().format("YYYY-MM-DD")); // sell 1 unit

      // GROUPING
      await controller
        .getAvailableProducts("invalidGrouping", null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller.getAvailableProducts("", null, null).catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getAvailableProducts(1 as any, null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts(undefined as any, null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts(null, "Smartphone", null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts(null, null, "Model1")
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", "Smartphone", "Model1")
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });

      // CATEGORY
      await controller
        .getAvailableProducts("category", "Not a category", null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", 1 as any, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", "", null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", undefined as any, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("category", null, "Model1")
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });

      // MODEL

      await controller
        .getAvailableProducts("model", null, 1 as any)
        .catch((err) => {
          expect(err).toBeInstanceOf(ProductNotFoundError);
        });
      await controller.getAvailableProducts("model", null, "").catch((err) => {
        expect(err).toBeInstanceOf(FiltersError);
      });
      await controller
        .getAvailableProducts("model", null, null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("model", null, undefined as any)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
      await controller
        .getAvailableProducts("model", "Smartphone", null)
        .catch((err) => {
          expect(err).toBeInstanceOf(FiltersError);
        });
    });
  });
  /* ************************************************ *
   * Integration test for the deleteAllProducts method *
   * ************************************************* */
  describe("tests for the deleteAllProducts method", () => {
    test("deleteAllProducts should delete all products in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );

      await controller.deleteAllProducts();

      const products = await controller.getProducts(null, null, null);
      expect(products).toEqual([]);
    });
  });
  /* ********************************************* *
   * Integration test for the deleteProduct method *
   * ********************************************* */
  describe("tests for the deleteProduct method", () => {
    test("deleteProduct should delete a product in the database", async () => {
      await controller.registerProducts(
        p1a.model,
        p1a.category,
        p1a.quantity,
        p1a.details,
        p1a.sellingPrice,
        p1a.arrivalDate
      );
      await controller.registerProducts(
        p2.model,
        p2.category,
        p2.quantity,
        p2.details,
        p2.sellingPrice,
        p2.arrivalDate
      );
      await controller.registerProducts(
        p3.model,
        p3.category,
        p3.quantity,
        p3.details,
        p3.sellingPrice,
        p3.arrivalDate
      );

      await controller.deleteProduct(p2.model);

      const products = await controller.getProducts(null, null, null);
      expect(products).toEqual([p1a, p3]);
    });

    test("deleteProduct should throw an error if one of the required parameters is not provided or is of the wrong type", async () => {
      // MODEL
      await controller.deleteProduct(undefined as any).catch((err) => {
        expect(err).toBeInstanceOf(Error);
      });
      await controller.deleteProduct(null as any).catch((err) => {
        expect(err).toBeInstanceOf(Error);
      });
      await controller.deleteProduct("").catch((err) => {
        expect(err).toBeInstanceOf(Error);
      });
      await controller.deleteProduct(1 as any).catch((err) => {
        expect(err).toBeInstanceOf(Error);
      });
    });

    test("deleteProduct should throw an error if the product does not exist in the database", async () => {
      await controller.deleteProduct(p1a.model).catch((err) => {
        expect(err).toBeInstanceOf(ProductNotFoundError);
      });
    });
  });
});

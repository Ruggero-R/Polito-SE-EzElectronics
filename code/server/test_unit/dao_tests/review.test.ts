import { test, expect, describe, jest, afterEach } from "@jest/globals";
import reviewDAO from "../../src/dao/reviewDAO";
import { User, Role } from "../../src/components/user";
import { ExistingReviewError, InvalidParametersError, NoReviewProductError, ProductNotFoundError } from "../../src/errors/reviewError";
import db from "../../src/db/db";
import { Database } from "sqlite3";

const RevDAO = new reviewDAO();
const Utente1 = new User("Ale", "Alessandro", "Mosca", Role.ADMIN, "amosca502@gmail.com", "2024-01-01");
afterEach(() => { jest.clearAllMocks() });

/* *************************************************** *
 *    Unit test for the checkExistingProduct method    *
 * *************************************************** */
describe("Unit tests for the checkExistingProduct method", () => {
    test("It should resolve if the product exists", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { model: "iPhone13" });
            return {} as Database;
        });
        await expect(RevDAO.checkExistingProduct("iPhone13")).resolves.toBeUndefined();
    });

    test("It should reject with ProductNotFoundError if the product does not exist", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.checkExistingProduct("iPhone13")).rejects.toThrow(ProductNotFoundError);
    });

    test("It should reject with an error if the database fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"), null);
            return {} as Database;
        });
        await expect(RevDAO.checkExistingProduct("iPhone13")).rejects.toThrow("Database error");
    });
});

/* *************************************************** *
 *    Unit test for the checkExistingReview method    *
 * *************************************************** */
describe("Unit tests for the checkExistingReview method", () => {
    test("It should resolve with true if the review exists", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { user: "Ale", model: "iPhone13" });
            return {} as Database;
        });
        await expect(RevDAO.checkExistingReview("iPhone13", Utente1)).resolves.toBe(true);
    });

    test("It should resolve with false if the review does not exist", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.checkExistingReview("iPhone13", Utente1)).resolves.toBe(false);
    });

    test("It should reject with an error if the database fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"), null);
            return {} as Database;
        });
        await expect(RevDAO.checkExistingReview("iPhone13", Utente1)).rejects.toThrow("Database error");
    });
});

/* ********************************************** *
 *    Unit test for the addReview method    *
 * ********************************************** */

describe("Unit tests for the addReview method", () => {
    test("It should not insert a review due to a non-existing model", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.addReview("iPhone13", Utente1, 125, "Test1")).rejects.toThrow(ProductNotFoundError);
    });

    test("It should not insert a review due to an invalid parameter", async () => {
        await expect(RevDAO.addReview("iPhone13", Utente1, 125, "")).rejects.toThrow(InvalidParametersError);
    });

    test("It should insert a new review", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.addReview("iPhone13", Utente1, 5, "Test2")).resolves.toBeUndefined();
    });

    test("It should throw an error", async () => {
        jest.spyOn(db, "get").mockImplementation(() => { throw new Error("Error"); })
        await expect(RevDAO.addReview("Notebook", Utente1, 5, "Test3")).rejects.toThrow("Error");
    });

    test("It should throw an Error if the database fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.addReview("Notebook", Utente1, 5, "Test4")).rejects.toThrow("Database error");
    });

    test("It should throw an Error if the database fails in the run", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.addReview("Notebook", Utente1, 5, "Test4")).rejects.toThrow("Database error");
    });

    test("It should not insert the review due to an existing review for the same tuple user-model", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { M: 1 });
            return {} as Database;
        });
        await expect(RevDAO.addReview("iPhone13", Utente1, 5, "Hi")).rejects.toThrow(ExistingReviewError);
    });
})

/* ********************************************** *
 *    Unit test for the getProductReviews method    *
 * ********************************************** */

describe("Unit tests for the getReviews method", () => {
    test("It should not get reviews due to a non-existing model", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.getProductReviews("iPhone13")).rejects.toThrow(ProductNotFoundError);
    });

    test("It should throw an error", async () => {
        jest.spyOn(db, "get").mockImplementation(() => { throw new Error("Error"); })
        await expect(RevDAO.getProductReviews("iPhone13")).rejects.toThrow("Error");
    });

    test("It should throw an Error if the database fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.getProductReviews("Notebook")).rejects.toThrow("Database error");
    });

    test("It should throw an Error if the database fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.getProductReviews("Notebook")).rejects.toThrow("Database error");
    });

    test("It should get one review", async () => {
        const reviewObj = [{ model: "iPhone13", user: "aaaa", score: 2, date: "", comment: "" }];
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, reviewObj);
            return {} as Database;
        });
        await expect(RevDAO.getProductReviews("iPhone13")).resolves.toEqual(reviewObj);
    });
});

/* ********************************************** *
 *    Unit test for the deleteReview method    *
 * ********************************************** */

describe("Unit tests for the deleteReview method", () => {
    test("It should not find any review to delete due to a non-existing model", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow(ProductNotFoundError);
    });

    test("It should throw an error", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow("Database error");
    });

    test("It should throw an error if checking review existence fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow("Database error");
    });

    test("It should throw an error if running delete fails", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { M: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow("Database error");
    });

    test("It should not find any review to delete due to a non-existing pair (model-user)", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow(NoReviewProductError);
    });

    test("It should raise an error during review check", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).rejects.toThrow("Database error");
    });

    test("It should delete a review", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { N: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { M: 1 });
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        await expect(RevDAO.deleteReview("iPhone13", Utente1)).resolves.toBeUndefined();
    });
});

/* ********************************************** *
 * Unit test for the deleteReviewsOfProduct method*
 * ********************************************** */

describe("Unit tests for the deleteReviewsOfProduct method", () => {
    test("It should not find any review to delete due to an unexisting model", () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        expect(RevDAO.deleteReviewsOfProduct("iPhone13")).rejects.toThrow(ProductNotFoundError);
    });

    test("It should throw an error", () => {
        jest.spyOn(db, "get").mockImplementation(() => { throw new Error("Error"); })
        expect(RevDAO.deleteReviewsOfProduct("iPhone13")).rejects.toThrow("Error")
    })

    test("It should throw an error", () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        expect(RevDAO.deleteReviewsOfProduct("iPhone13")).rejects.toThrow("Database error")
    })

    test("It should throw an Error if the database fails", () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { model: "" });
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        expect(RevDAO.deleteReviewsOfProduct("Notebook")).rejects.toThrow("Database error")
    })

    test("It should delete any review for the given model", () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { model: "" });
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        expect(RevDAO.deleteReviewsOfProduct("iPhone13")).resolves.toBe(undefined);
    })
})

/* ********************************************** *
 * Unit test for the deleteAllReviews method*
 * ********************************************** */

describe("Unit tests for the deleteAllReviews method", () => {
    test("It should not find any review to delete", () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database;
        });
        expect(RevDAO.deleteAllReviews()).resolves.toBe(undefined);
    })

    test("It should throw an error", () => {
        jest.spyOn(db, "run").mockImplementation(() => { throw new Error("Error"); })
        expect(RevDAO.deleteAllReviews()).rejects.toThrow("Error")
    })

    test("It should throw an Error if the database fails", () => {
        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(new Error("Database error"));
            return {} as Database;
        });
        expect(RevDAO.deleteAllReviews()).rejects.toThrow("Database error")
    })
})
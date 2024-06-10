import { describe, test, expect, jest, beforeEach, afterAll } from "@jest/globals";
import { app } from "../../index";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import Authenticator from "../../src/routers/auth";

jest.mock("../../src/routers/auth");

const baseURL = "/ezelectronics";

beforeEach((done) => {
  jest.resetAllMocks();
  db.serialize(() => {
    db.run("DELETE FROM carts", (err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });
});

afterAll((done) => {
  cleanup();
  done();
});


"use strict"

import db from "../db/db";

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

export function cleanup() {
    db.serialize(() => {
        // Delete all data from the database.
        db.run("DELETE FROM users")
        //Add delete statements for other tables here
        db.run("DELETE FROM products")
        db.run("DELETE FROM carts_items")
        db.run("DELETE FROM products_reviews")
        db.run("DELETE FROM carts")
    })
}
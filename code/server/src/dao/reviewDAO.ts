import db from "../db/db"
import { resolve } from "path";
import { User } from "../components/user";
import { ProductReview } from "../components/review";
import { rejects } from "assert";
import dayjs from "dayjs";
import { ExistingReviewError, NoReviewProductError } from "../errors/reviewError";
import { Product } from "../components/product";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    addReview(model: string, user: User, score: number, comment: string): Promise<void> {
        // DA MODIFICARE UNA VOLTA CHE IL DAO DEI PRODOTTI SARÀ COMPLETATO, usare getProducts invece della query sql

        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model = ?";
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if(err) {
                        reject(err);
                    } else if (!row) {
                        reject(new NoReviewProductError);
                    } else {
                        const sql = "INSERT INTO products_reviews(model, user, score, date, comment) VALUES(?, ?, ?, ?, ?)";
                        db.run(sql, [model, user, score, dayjs().format("YYYY-MM-DD"), comment], (err: Error | null) => {
                            if (err) {
                                if (err.message.includes("FOREIGN KEY constraint failed"))
                                    reject(new ExistingReviewError);
                                reject(err);
                            }
                            resolve();
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getProductReviews(model: string): Promise<ProductReview[]> {
        // DA MODIFICARE UNA VOLTA CHE IL DAO DEI PRODOTTI SARÀ COMPLETATO, usare getProducts invece della query sql

        return new Promise<ProductReview[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model = ?";
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if(err) {
                        reject(err);
                    } else if (!row) {
                        reject(new NoReviewProductError);
                    } else {
                        const sql = "SELECT * FROM products_reviews WHERE model = ?";
                        db.all(sql, [model], (err: Error | null, rows: ProductReview[]) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(rows);
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteReview(model: string, user: User): Promise<void> {
        // DA MODIFICARE UNA VOLTA CHE IL DAO DEI PRODOTTI SARÀ COMPLETATO, usare getProducts invece della query sql

        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model = ?";
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        reject(new NoReviewProductError);
                    } else {
                        const sql = "DELETE FROM products_reviews WHERE model = ? AND user = ?";
                        db.run(sql, [model, user], (err: Error | null) => {
                            if (err) {
                                if (err.message.includes("FOREIGN KEY constraint failed"))
                                    reject(new ExistingReviewError);
                            }
                            resolve();
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteReviewsOfProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM products WHERE model = ?";
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        reject(new NoReviewProductError);
                    } else {
                        const sql = "DELETE FROM products_reviews WHERE model = ?";
                        db.run(sql, [model], (err: Error | null) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteAllReviews(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products_reviews";
                db.run(sql, [], (err: Error | null) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ReviewDAO;
import db from "../db/db"
import { User } from "../components/user";
import { ProductReview } from "../components/review";
import dayjs from "dayjs";
import { ExistingReviewError, NoReviewProductError, ProductNotFoundError } from "../errors/reviewError";
import { Product } from "../components/product";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {

    addReview(model: string, user: User, score: number, comment: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const selectSql = "SELECT COUNT(*) AS N FROM products WHERE model = ?";
                db.get(selectSql, [model], (err: Error | null, count: any) => {
                    if (err) {
                        reject(err);
                    } else if (count.N==0) {
                        reject(new ProductNotFoundError);}})

                const selectReviewSql = "SELECT COUNT(*) AS M FROM products_reviews WHERE user = ? AND model = ?";
                db.get(selectReviewSql, [user.username,model], (err: Error | null, count: any) => {
                    if (err) {
                        reject(err);
                    } else if (count.M>0) {
                        reject(new ExistingReviewError);}})
                
                const sql = "INSERT INTO products_reviews(model, user, score, date, comment) VALUES(?, ?, ?, ?, ?)";
                db.run(sql, [model, user.username, score, dayjs().format("YYYY-MM-DD"), comment], function (err: Error | null) {
                    if (err) {
                        reject(err);}
                    else{
                        resolve();
                    }});
            } catch (error) {
                reject(error);
            }
        });
    }

    getProductReviews(model: string): Promise<ProductReview[]> {
        return new Promise<ProductReview[]>((resolve, reject) => {
            try {
                const selectSql = "SELECT * FROM products WHERE model = ?";
                db.get(selectSql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        reject(new ProductNotFoundError);
                    } else {
                        const sql = "SELECT * FROM products_reviews WHERE model = ?";
                        db.all(sql, [model], (err: Error | null, rows: ProductReview[]) => {
                            if (err) {
                                reject(err);}
                            const reviews: ProductReview[] = rows.map((row: any) => new ProductReview(row.model, row.user, row.score, row.date, row.comment));
                            resolve(reviews);
                        });
                    }
                });
            } catch (error) {
                reject(error);}
        });
    }

    deleteReview(model: string, user: User): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const selectSql = "SELECT COUNT(*) AS N FROM products WHERE model = ?";
                db.get(selectSql, [model], (err: Error | null, count: any) => {
                    if (err) {
                        reject(err);
                    } else if (count.N==0) {
                        reject(new ProductNotFoundError);}})

                const selectReviewSql = "SELECT COUNT(*) AS M FROM products_reviews WHERE model = ? AND user = ?";
                db.get(selectReviewSql, [model, user.username], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);}
                    else if (row.M==0) {
                        reject(new NoReviewProductError);}});

                const sql = "DELETE FROM products_reviews WHERE model = ? AND user = ?";
                db.run(sql, [model, user.username], function (err: Error | null) {
                    if (err) {
                        reject(err);}
                    resolve();});
            } catch (error) {
                reject(error);}
        });
    }

    deleteReviewsOfProduct(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const selectSql = "SELECT * FROM products WHERE model = ?";
                db.get(selectSql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        reject(new ProductNotFoundError);
                    } else {
                        const sql = "DELETE FROM products_reviews WHERE model = ?";
                        db.run(sql, [model], function (err: Error | null) {
                            if (err) {
                                reject(err);}
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
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err);}
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ReviewDAO;
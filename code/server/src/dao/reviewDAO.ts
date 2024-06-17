import db from "../db/db";
import { User } from "../components/user";
import { ProductReview } from "../components/review";
import dayjs from "dayjs";
import {
  ExistingReviewError,
  NoReviewProductError,
  ProductNotFoundError,
  InvalidParametersError,
} from "../errors/reviewError";
import { Product } from "../components/product";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {
  checkExistingProduct(model: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const selectSql = "SELECT * FROM products WHERE model = ?";
      db.get(selectSql, [model], (err: Error | null, row: Product) => {
        if (err) {
          return reject(err);
        } else if (!row) {
          return reject(new ProductNotFoundError());
        }
        resolve();
      });
    });
  }

  checkExistingReview(model: string, user: User): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      const selectReviewSql =
        "SELECT * FROM products_reviews WHERE user = ? AND model = ?";
      db.get(
        selectReviewSql,
        [user.username, model],
        (err: Error | null, row: any) => {
          if (err) {
            return reject(err);
          } else if (row) {
            resolve(true);
          }
          resolve(false);
        }
      );
    });
  }

  addReview(
    model: string,
    user: User,
    score: number,
    comment: string
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!comment || !score || comment.trim() == "") {
          return reject(new InvalidParametersError());
        }

        await this.checkExistingProduct(model).catch((err) => {
          return reject(err);
        });

        await this.checkExistingReview(model, user)
          .then((res) => {
            if (res) {
              return reject(new ExistingReviewError());
            }
          })
          .catch((err) => {
            return reject(err);
          });

        const sql =
          "INSERT INTO products_reviews(model, user, score, date, comment) VALUES(?, ?, ?, ?, ?)";
        db.run(
          sql,
          [model, user.username, score, dayjs().format("YYYY-MM-DD"), comment],
          function (err: Error | null) {
            if (err) {
              return reject(err);
            } else {
              resolve();
            }
          }
        );
      } catch (error) {
        return reject(error);
      }
    });
  }

  getProductReviews(model: string): Promise<ProductReview[]> {
    return new Promise<ProductReview[]>(async (resolve, reject) => {
      try {
        await this.checkExistingProduct(model).catch((err) => {
          return reject(err);
        });
        const sql = "SELECT * FROM products_reviews WHERE model = ?";
        db.all(sql, [model], (err: Error | null, rows: ProductReview[]) => {
          if (err) {
            return reject(err);
          }
          const reviews: ProductReview[] = rows.map(
            (row: any) =>
              new ProductReview(
                row.model,
                row.user,
                row.score,
                row.date,
                row.comment
              )
          );
          resolve(reviews);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  deleteReview(model: string, user: User): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.checkExistingProduct(model).catch((err) => {
          return reject(err);
        });

        await this.checkExistingReview(model, user)
          .then((res) => {
            if (!res) {
              return reject(new NoReviewProductError());
            }
          })
          .catch((err) => {
            return reject(err);
          });

        const sql = "DELETE FROM products_reviews WHERE model = ? AND user = ?";
        db.run(sql, [model, user.username], function (err: Error | null) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  deleteReviewsOfProduct(model: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.checkExistingProduct(model).catch((err) => {
          return reject(err);
        });

        const sql = "DELETE FROM products_reviews WHERE model = ?";
        db.run(sql, [model], function (err: Error | null) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  deleteAllReviews(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const sql = "DELETE FROM products_reviews";
        db.run(sql, [], function (err: Error | null) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default ReviewDAO;

import db from "../db/db"
import { Product } from "../components/product"
import { ArrivalDateError, EmptyProductStockError, FiltersError, InvalidParametersError, LowProductStockError, ProductAlreadyExistsError, ProductNotFoundError, ProductSoldError } from "../errors/productError";
import dayjs from "dayjs"
import { ResultWithContext } from "express-validator/src/chain";

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {
    changes: number;
    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "INSERT INTO products (model, category, arrivalDate, quantity, details, sellingPrice) VALUES (?, ?, ?, ?, ?, ?)"
                db.run(sql, [model, category, (typeof arrivalDate === 'undefined') ? dayjs().format('YYYY-MM-DD') : arrivalDate, quantity, details, sellingPrice], function (err: Error | null) {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError)
                        reject(err)
                        return
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
                return
            }
        })
    }

    changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                //search model in database
                let sql = "SELECT quantity,arrivalDate FROM products WHERE model = ?"
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                        return
                    }
                    //check if change date is after current date or before arrival date
                    if (changeDate && (dayjs(changeDate).isAfter(dayjs()) || dayjs(changeDate).isBefore(dayjs(row.arrivalDate)))) {
                        reject(new ArrivalDateError)
                        return
                    }

                    sql = "UPDATE products SET quantity = ?, arrivalDate = ? WHERE model = ?"
                    db.run(sql, [row.quantity + newQuantity, (typeof changeDate === 'undefined') ? dayjs().format('YYYY-MM-DD') : changeDate, model], function (err: Error | null) {
                        if (err) {
                            reject(err)
                            return
                        }
                        resolve(row.quantity + newQuantity)
                    })
                })

            } catch (error) {
                reject(error)
                return
            }
        })
    }

    sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            try {
                //search model in database
                let sql = "SELECT quantity, arrivalDate FROM products WHERE model = ?"
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                        return
                    }
                    if (row.quantity == 0) {
                        reject(new EmptyProductStockError)
                        return
                    }
                    if (row.quantity < quantity) {
                        reject(new LowProductStockError)
                        return
                    }
                    if (typeof sellingDate === 'string' && (dayjs(sellingDate).isAfter(dayjs()) || dayjs(sellingDate).isBefore(dayjs(row.arrivalDate)))) {
                        reject(new ArrivalDateError)
                        return
                    }

                    sql = "UPDATE products SET quantity = ?, sellingDate = ? WHERE model = ?"
                    db.run(sql, [row.quantity - quantity, (typeof sellingDate === 'undefined') ? dayjs().format('YYYY-MM-DD') : sellingDate, model], function (err: Error | null) {
                        if (err) {
                            reject(err)
                            return
                        }
                        resolve(row.quantity - quantity)
                    })
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                let sql: string;
                const params: any[] = [];
                if (typeof grouping === 'undefined') {
                    if (typeof category === 'undefined' && typeof model === 'undefined') {
                        console.log("here2")
                        sql = "SELECT * FROM products"
                    } else {
                        console.log("here3")
                        reject(new FiltersError());
                        return;
                    }
                } else if (grouping === "category") {
                    if (typeof category !== 'undefined' && typeof model === 'undefined') {
                        sql = "SELECT * FROM products WHERE category = ?"
                        params.push(category);
                    } else {
                        reject(new FiltersError());
                        return;
                    }
                } else if (grouping === "model") {
                    if (typeof category === 'undefined' && model !== 'undefined') {
                        sql = "SELECT * FROM products WHERE model = ?"
                        params.push(model);
                    } else {
                        reject(new FiltersError());
                        return;
                    }
                } else {
                    reject(new FiltersError)
                }

                if (grouping === "model") {
                    console.log('here model')
                    // Use db.get for a single result
                    db.get(sql, params, (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (row) {
                            const product = new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity);
                            resolve([product]);
                        } else {
                            reject(new ProductNotFoundError);
                        }
                    });
                } else {
                    // Use db.all for multiple results
                    db.all(sql, params, (err: Error | null, rows: any) => {
                        console.log('here4')
                        if (err) {
                            reject(err);
                            return;
                        }
                        const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity));
                        resolve(products);
                    });
                }
            } catch (error) {
                reject(error)
            }

        })

    }

    getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                let sql: string;
                const params: any[] = [];
                if (typeof grouping === 'undefined') {
                    if (typeof category === 'undefined' && typeof model === 'undefined') {
                        sql = "SELECT * FROM products WHERE quantity > 0"
                    } else {
                        reject(new FiltersError());
                        return;
                    }
                } else if (grouping === "category") {
                    //ARRIVATO qui
                    if (typeof category !== 'undefined' && typeof model === 'undefined') {
                        sql = "SELECT * FROM products WHERE category = ? AND quantity > 0"
                        params.push(category);
                    } else {
                        reject(new FiltersError());
                        return;
                    }
                } else if (grouping === "model") {
                    if (typeof category === 'undefined' && model !== 'undefined') {
                        sql = "SELECT * FROM products WHERE model = ? AND quantity > 0"
                        params.push(model);
                    } else {
                        reject(new FiltersError());
                        return;
                    }
                } else {
                    reject(new FiltersError)
                }

                if (grouping === "model") {
                    // Use db.get for a single result
                    db.get(sql, params, (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (row) {
                            const product = new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity);
                            resolve([product]);
                        } else {
                            reject(new ProductNotFoundError);
                        }
                    });
                } else {
                    // Use db.all for multiple results
                    db.all(sql, params, (err: Error | null, rows: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity));
                        resolve(products);
                    });
                }
            } catch (error) {
                reject(error)
            }

        })
    }

    deleteAllProducts(): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products"
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteProduct(model: string): Promise<Boolean> {                                      // DUBBIO
        return new Promise<Boolean>((resolve, reject) => {
            try {
                let sql = "SELECT * FROM products WHERE model = ?"
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                        return
                    }
                })
                sql = "DELETE FROM products WHERE model = ?"
                db.run(sql, [model], function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}
export default ProductDAO
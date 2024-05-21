import db from "../db/db"
import { Product } from "../components/product"
import { EmptyProductStockError, FiltersError, LowProductStockError, ProductAlreadyExistsError, ProductNotFoundError, ProductSoldError } from "../errors/productError";

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
    registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "INSERT INTO products (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)"
                db.run(sql, [model, category, quantity, details, sellingPrice, arrivalDate], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError)
                        reject(err)
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    deleteAllProducts() {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products"
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteProduct(model: string) {                                      // DUBBIO
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products WHERE model = ?"
                db.run(sql, [model], function (err: Error | null) {
                    if (err) {
                        reject(err)
                    }
                    if (this.changes === 0) reject(new ProductNotFoundError)
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    changeProductQuantity(model: string, newQuantity: number, changeDate: string | null) {
        return new Promise<number>((resolve, reject) => {
            try {
                //search model in database
                let sql = "SELECT quantity FROM products WHERE model = ?"
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err)
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                    }
                    //update quantity
                    sql = "UPDATE products SET quantity = ?, arrivalDate = ? WHERE model = ?"
                    db.run(sql, [row.quantity + newQuantity, changeDate, model], function (err: Error | null) {
                        if (err) {
                            reject(err)
                        }
                        resolve(row.quantity + newQuantity)
                    })
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    sellProduct(model: string, quantity: number, sellingDate: string | null) {
        return new Promise<number>((resolve, reject) => {
            try {
                //search model in database
                let sql = "SELECT quantity FROM products WHERE model = ?"
                db.get(sql, [model], (err: Error | null, row: Product) => {
                    if (err) {
                        reject(err)
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                    }
                    if (row.quantity == 0) {
                        reject(new EmptyProductStockError)
                    }
                    if (row.quantity < quantity) {
                        reject(new LowProductStockError)
                    }
                    //update quantity
                    sql = "UPDATE products SET quantity = ?, sellingDate = ? WHERE model = ?"
                    db.run(sql, [row.quantity - quantity, sellingDate, model], function (err: Error | null) {
                        if (err) {
                            reject(err)
                        }
                        resolve(row.quantity - quantity)
                    })
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    getProducts(grouping: string | null, category: string | null, model: string | null) {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                let sql
                if (grouping === null) {
                    if (category === null && model === null) {
                        sql = "SELECT * FROM products"
                        db.all(sql, [], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                    }
                } else if (grouping === "category") {
                    if (category !== null && model === null) {
                        sql = "SELECT * FROM products WHERE category = ?"
                        db.all(sql, [category], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                    }
                } else if (grouping === "model") {
                    if (category === null && model !== null) {
                        sql = "SELECT * FROM products WHERE model = ?"
                        db.all(sql, [model], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                    }
                } else {
                    reject(new FiltersError)
                }
            } catch (error) {
                reject(error)
            }

        })

    }

    getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            try {
                let sql
                if (grouping === null) {
                    if (category === null && model === null) {
                        sql = "SELECT * FROM products WHERE quantity > 0"
                        db.all(sql, [], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            console.log(products)
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                        return
                    }
                } else if (grouping === "category") {
                    if (category !== null && model === null) {
                        sql = "SELECT * FROM products WHERE category = ? AND quantity > 0"
                        db.all(sql, [category], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                    }
                } else {
                    if (category === null && model !== null) {
                        sql = "SELECT * FROM products WHERE model = ? AND quantity > 0"
                        db.all(sql, [model], (err: Error | null, rows: any) => {
                            if (err) {
                                reject(err)
                            }
                            const products: Product[] = rows.map((row: any) => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
                            resolve(products)
                        })
                    } else {
                        reject(new FiltersError)
                    }
                }
            } catch (error) {
                reject(error)
            }

        })
    }
}
export default ProductDAO
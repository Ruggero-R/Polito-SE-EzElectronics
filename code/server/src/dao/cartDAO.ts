import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { Product } from "../components/product";
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError, NoCartItemsError, AlreadyActiveCart } from "../errors/cartError";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../errors/productError";
import dayjs from "dayjs";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    /**
     * Creates a new cart for a customer.
     * @param customer The username of the customer.
     * @returns A void Promise 
     */
    createCart(customer: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const checkActiveCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
                db.get(checkActiveCartSql, [customer], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (row) {
                        reject(new AlreadyActiveCart);
                        return;
                    }
                });
                const sql = "INSERT INTO carts (customer, paid, paymentDate, total) VALUES (?, 0, NULL, 0.0)";
                db.run(sql, [customer], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Retrieves the active cart for a specific user.
     * @param userId The ID of the user.
     * @returns A Promise that resolves to the active cart of the user, or null if no active cart exists.
     */
    getActiveCartByUserId(userId: string): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
                db.get(sql, [userId], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (!row) {
                        //Return an empty cart
                        resolve(new Cart(userId, false, null, 0.0, []));
                    } else {
                        //Store cart
                        const cart = new Cart(row.customer, row.paid, row.paymentDate, row.total, []);
                        //Check if cart has items
                        const sqlItems = "SELECT * FROM carts_items WHERE cart_id = ?";
                        db.all(sqlItems, [row.id], (err: Error | null, rows: any[]) => {
                            if (err) {
                                reject(err);
                                return
                            }
                            if (rows.length === 0) {
                                resolve(new Cart(userId, false, null, 0.0, []));
                            } else {
                                //Store items
                                const items = rows.map(row => new ProductInCart(row.product_id, row.quantity, row.category, row.price));
                                cart.products = items;
                                resolve(cart);
                            }
                        });
                    }
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    userHasActiveCart(userId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "SELECT paid FROM carts WHERE customer = ? AND paid = 0";
                db.get(sql, [userId], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return
                    } else {
                        resolve(row ? true : false);
                    }
                })
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Retrieves the active cart for a specific user (alias for getActiveCartByUserId).
     * @param userId The ID of the user.
     * @returns A Promise that resolves to the active cart of the user, or null if no active cart exists.
     */
    getCartById(userId: string): Promise<Cart | null> {
        return this.getActiveCartByUserId(userId);
    }

    /**
     * Retrieves all items in a specific cart.
     * @param userId The ID of the user.
     * @returns A Promise that resolves to an array of ProductInCart objects.
     */
    getCartItems(userId: string): Promise<ProductInCart[]> {
        return new Promise<ProductInCart[]>((resolve, reject) => {
            const sql = "SELECT ci.product_id, p.model, ci.quantity, p.category, p.price FROM carts_items ci JOIN products p ON ci.product_id = p.model WHERE ci.cart_id IN (SELECT id FROM carts WHERE customer = ? AND paid = 0)";
            db.all(sql, [userId], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const items = rows.map(row => new ProductInCart(row.model, row.quantity, row.category, row.price));
                    resolve(items);
                }
            });
        });
    }


    /**
    * Adds a product to a cart.
    * @param userId The ID of the user.
    * @param productModel The model of the product.
    * @param quantity The quantity of the product to add.
    * @returns A Promise that resolves when the product is added to the cart.
    */
    addProductToCart(userId: string, productModel: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                //Check if model exists
                const sqlCheckModel = "SELECT model FROM products WHERE model = ?";
                db.get(sqlCheckModel, [productModel], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row) {
                        reject(new ProductNotFoundError)
                        return;
                    } else if (row.quantity <= 0) {
                        reject(new EmptyProductStockError)
                        return;
                    } else {
                        let sellingPrice = 0;
                        let category = "";
                        //retrieve product price
                        const sqlCheckProductPrice = "SELECT sellingPrice, category FROM products WHERE model = ?";
                        db.get(sqlCheckProductPrice, [productModel], (err: Error | null, row: any) => {
                            if (err) {
                                reject(err);
                                return
                            }
                            sellingPrice = row.sellingPrice
                            category = row.category
                        })
                        //check if user has active
                        this.userHasActiveCart(userId).then((hasCart) => {
                            if (!hasCart) {
                                //create cart
                                this.createCart(userId).then(() => {
                                    const sql = "INSERT INTO carts_items (cart_id, product_id, quantity, price, category) VALUES ((SELECT id FROM carts WHERE customer = ? AND paid = 0), ?, 1, ?, ?)";
                                    db.run(sql, [userId, productModel, sellingPrice, category], function (err: Error | null) {
                                        if (err) {
                                            reject(err);
                                            return
                                        }
                                        const sqlUpdateCart = "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                                        db.run(sqlUpdateCart, [sellingPrice, userId], function (err: Error | null) {
                                            if (err) {
                                                reject(err);
                                                return
                                            }
                                            resolve()
                                        })
                                    });
                                }).catch((err) => {
                                    reject(err)
                                    return
                                })
                            } else {
                                //User already has a active cart
                                //check if a equals product is already in cart
                                const sqlCheckProduct = "SELECT * FROM carts_items WHERE cart_id IN (SELECT id FROM carts WHERE customer = ? AND paid = 0) AND product_id = ?";
                                db.get(sqlCheckProduct, [userId, productModel], (err: Error | null, row: any) => {
                                    if (err) {
                                        reject(err);
                                        return
                                    }
                                    if (row) {
                                        //Product is already in cart
                                        //check if quantity is available
                                        const cartProductQuantity = row.quantity;
                                        const sqlCheckStoreProductQuantity = "SELECT quantity FROM products WHERE model = ?";
                                        db.get(sqlCheckStoreProductQuantity, [productModel], (err: Error | null, row: any) => {
                                            if (err) {
                                                reject(err);
                                                return
                                            }
                                            if (row.quantity < cartProductQuantity + 1) {
                                                reject(new LowProductStockError)
                                                return;
                                            }
                                            //Update quantity
                                            this.updateCartItem(userId, sellingPrice, productModel, cartProductQuantity + 1).then(() => {
                                                const sqlUpdateCart = "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                                                db.run(sqlUpdateCart, [sellingPrice, userId], function (err: Error | null) {
                                                    if (err) {
                                                        reject(err);
                                                        return
                                                    }
                                                    resolve()
                                                })

                                            }).catch((err) => {
                                                reject(err)
                                            })
                                        })
                                    } else {
                                        //Product is not in cart
                                        const sql = "INSERT INTO carts_items (cart_id, product_id, quantity, price, category) VALUES ((SELECT id FROM carts WHERE customer = ? AND paid = 0), ?, 1, ?, ?)";
                                        db.run(sql, [userId, productModel, sellingPrice, category], function (err: Error | null) {
                                            if (err) {
                                                reject(err);
                                                return
                                            }
                                            const sqlUpdateCart = "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                                            db.run(sqlUpdateCart, [sellingPrice, userId], function (err: Error | null) {
                                                if (err) {
                                                    reject(err);
                                                    return
                                                }
                                                resolve()
                                            })
                                        });
                                    }
                                });
                            }
                        }).catch((err) => {
                            reject(err)
                            return
                        })
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }


    /**
     * Updates the quantity of a product in a cart.
     * @param userId The ID of the user.
     * @param productModel The model of the product.
     * @param quantity The new quantity of the product.
     * @returns A Promise that resolves when the quantity is updated.
     */
    updateCartItem(userId: string, price: number, productModel: string, quantity: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "UPDATE carts_items SET quantity = ?, price = ? WHERE cart_id = (SELECT id FROM carts WHERE customer = ? AND paid = 0) AND product_id = ?";
                db.run(sql, [quantity, price, userId, productModel], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    updateCartTotal(userId: string, price: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "UPDATE carts SET total = ? WHERE customer = ? AND  paid = 0";
                db.run(sql, [userId, price], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Marks a cart as paid and sets the payment date to the current timestamp.
     * @param userId The ID of the user who owns the cart.
     * @returns A Promise that resolves when the cart is marked as paid.
     */
    checkoutCart(userId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const sqlCheckCart = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
                db.get(sqlCheckCart, [userId], (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (!row) {
                        reject(new CartNotFoundError);
                        return;
                    } else {
                        const sqlCheckCartItems = "SELECT * FROM carts_items WHERE cart_id = ?";
                        db.all(sqlCheckCartItems, [row.id], (err: Error | null, rows: any[]) => {
                            if (err) {
                                reject(err);
                                return
                            }
                            if (rows.length === 0) {
                                reject(new EmptyCartError);
                                return;
                            } else {
                                const checkProductsAvailability = "SELECT quantity,model  FROM products WHERE model IN(SELECT product_id FROM carts_items WHERE cart_id IN(SELECT id FROM carts WHERE customer = ? AND paid = 0))";
                                db.all(checkProductsAvailability, [userId], (err: Error | null, rows: any[]) => {
                                    let productQuantity = 0;
                                    if (err) {
                                        reject(err);
                                        return
                                    }
                                    rows.forEach((product) => {
                                        productQuantity = product.quantity;
                                        if (productQuantity <= 0) {
                                            reject(new EmptyProductStockError);
                                            return;
                                        }
                                        const checkCartItems = "SELECT quantity FROM carts_items WHERE product_id = ? AND cart_id IN(SELECT id FROM carts WHERE customer = ? AND paid = 0)";
                                        db.get(checkCartItems, [product.model, userId], (err: Error | null, row: any) => {
                                            if (err) {
                                                reject(err);
                                                return
                                            }
                                            if (!row) {
                                                reject(new ProductNotInCartError);
                                                return;
                                            }
                                            if (row.quantity > productQuantity) {
                                                reject(new LowProductStockError);
                                                return;
                                            }

                                            const updateProductQuantity = "UPDATE products SET quantity = quantity - ? WHERE model = ?";
                                            db.run(updateProductQuantity, [row.quantity, product.model], function (err: Error | null) {
                                                if (err) {
                                                    reject(err);
                                                    return
                                                }
                                            });
                                        });
                                    });
                                    const sql = "UPDATE carts SET paid = 1, paymentDate = ? WHERE customer = ? AND paid = 0";
                                    db.run(sql, [dayjs().format('YYYY-MM-DD'), userId], (err: Error | null) => {
                                        if (err) {
                                            reject(err);
                                            return
                                        }
                                        resolve();

                                    });
                                });
                            }
                        });
                    }
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
    * Removes a product from a cart.
    * @param userId The ID of the user.
    * @param productModel The model of the product.
    * @returns A Promise that resolves when the product is removed from the cart.
    */
    removeProductFromCart(userId: string, productModel: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const checkExistingModelSql = "SELECT model FROM products WHERE model = ?";
                db.get(checkExistingModelSql, [productModel], (err: Error | null, model: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (!model) {
                        reject(new ProductNotFoundError);
                        return;
                    }
                    const checkActiveCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
                    db.get(checkActiveCartSql, [userId], (err: Error | null, activeCart: any) => {
                        if (err) {
                            reject(err);
                            return
                        }
                        if (!activeCart) {
                            reject(new CartNotFoundError);
                            return;
                        }
                        const checkEmptyCartSql = "SELECT * FROM carts_items WHERE cart_id = ?";
                        db.all(checkEmptyCartSql, [activeCart.id], (err: Error | null, cartItems: any[]) => {
                            if (err) {
                                reject(err);
                                return
                            }
                            if (cartItems.length === 0) {
                                reject(new NoCartItemsError);
                                return;
                            }
                            const checkProductInCartSql = "SELECT * FROM carts_items WHERE cart_id = ? AND product_id = ?";
                            db.get(checkProductInCartSql, [activeCart.id, productModel], (err: Error | null, product: any) => {
                                if (err) {
                                    reject(err);
                                    return
                                }
                                if (!product) {
                                    reject(new ProductNotInCartError);
                                    return;
                                }
                                const deleteProductSql = "DELETE FROM carts_items WHERE cart_id = ? AND product_id = ?";
                                db.run(deleteProductSql, [activeCart.id, productModel], function (err: Error | null) {
                                    if (err) {
                                        reject(err);
                                        return
                                    }
                                    const decreaseTotalSql = "UPDATE carts SET total = total - ? WHERE customer = ? AND paid = 0 AND id = ?";
                                    db.run(decreaseTotalSql, [product.price, userId, activeCart.id], function (err: Error | null) {
                                        if (err) {
                                            reject(err);
                                            return
                                        }
                                        resolve(true);
                                    });
                                });
                            });
                        });
                    });
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Clears all products from a cart.
     * @param userId The ID of the user.
     * @returns A Promise that resolves when all products are removed from the cart.
     */
    clearCart(userId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const getCartSql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
                db.get(getCartSql, [userId], (err: Error | null, cart: any) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (!cart) {
                        reject(new CartNotFoundError);
                        return;
                    }
                    const clearCartSql = "DELETE FROM carts_items WHERE cart_id = ?";
                    db.run(clearCartSql, [cart.id], function (err: Error | null) {
                        if (err) {
                            reject(err);
                            return
                        }
                        const updateTotalSql = "UPDATE carts SET total = 0 WHERE customer = ? AND paid = 0";
                        db.run(updateTotalSql, [userId], function (err: Error | null) {
                            if (err) {
                                reject(err);
                                return
                            }
                            resolve(true);
                        });
                    });
                })
            } catch (error) {
                reject(error)
            }
        })
    }


    /**
     * Deletes all carts from the database.
     * @returns A Promise that resolves when all carts are deleted.
     */
    deleteAllCarts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let sql = "DELETE FROM carts";
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    }
                })
                sql = "DELETE FROM carts_items"
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err);
                        return
                    }
                })
                resolve(true);
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * Retrieves all carts from the database.
     * @returns A Promise that resolves to an array of Cart objects.
     */
    getAllCarts(): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                const getCartsSql = "SELECT * FROM carts";
                db.all(getCartsSql, [], async (err: Error | null, user_carts: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const carts: Cart[] = await Promise.all(user_carts.map(async (user_cart) => {
                        const getProductsSql = "SELECT product_id, quantity, price, category FROM carts_items WHERE cart_id = ?";
                        return new Promise<Cart>((resolve, reject) => {
                            db.all(getProductsSql, [user_cart.id], (err: Error | null, products: any[]) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                const productsInCart: ProductInCart[] = products.map(product => {
                                    return new ProductInCart(product.product_id, product.quantity, product.category, product.price);
                                });
                                resolve(new Cart(user_cart.customer, Boolean(user_cart.paid), user_cart.paymentDate, user_cart.total, productsInCart));
                            });
                        });
                    }));
                    resolve(carts);
                });
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Retrieves all paid customer carts from the database.
     * @User The user who owns the cart.
     */
    getCustomerCarts(user: string): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            try {
                const getCartsSql = "SELECT * FROM carts WHERE customer = ? AND paid = 1";
                db.all(getCartsSql, [user], async (err: Error | null, user_carts: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const carts: Cart[] = await Promise.all(user_carts.map(async (user_cart) => {
                        const getProductsSql = "SELECT product_id, quantity, price, category FROM carts_items WHERE cart_id = ?";
                        return new Promise<Cart>((resolve, reject) => {
                            db.all(getProductsSql, [user_cart.id], (err: Error | null, products: any[]) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                const productsInCart: ProductInCart[] = products.map(product => {
                                    return new ProductInCart(product.product_id, product.quantity, product.category, product.price);
                                });
                                resolve(new Cart(user_cart.customer, Boolean(user_cart.paid), user_cart.paymentDate, user_cart.total, productsInCart));
                            });
                        });
                    }));
                    resolve(carts);
                });
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default CartDAO
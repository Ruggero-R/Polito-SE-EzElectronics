import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { Product } from "../components/product";
import {
  CartNotFoundError,
  ProductInCartError,
  ProductNotInCartError,
  WrongUserCartError,
  EmptyCartError,
  NoCartItemsError,
  LowProductStockError,
  AlreadyActiveCart,
} from "../errors/cartError";
import {
  EmptyProductStockError,
  ProductNotFoundError,
} from "../errors/productError";
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
        const checkActiveCartSql =
          "SELECT * FROM carts WHERE customer = ? AND paid = 0";
        db.get(
          checkActiveCartSql,
          [customer],
          (err: Error | null, row: any) => {
            if (err) {
              return reject(err);
            }
            if (row) {
              return reject(new AlreadyActiveCart());
            }
          }
        );
        const sql =
          "INSERT INTO carts (customer, paid, paymentDate, total) VALUES (?, 0, NULL, 0.0)";
        db.run(sql, [customer], function (err: Error | null) {
          if (err) {
            return reject(err);
          } else {
             return resolve();
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Retrieves the active cart for a specific user.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the active cart of the user, or an empty cart if no active cart exists.
   */
  getActiveCartByUserId(userId: string): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      try {
        const sql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
        db.get(sql, [userId], (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            //Return an empty cart
            resolve(new Cart(userId, false, null, 0.0, []));
          } else {
            //Store cart
            const cart = new Cart(
              row.customer,
              Boolean(row.paid),
              row.paymentDate,
              row.total,
              []
            );
            //Check if cart has items
            const sqlItems = "SELECT * FROM carts_items WHERE cart_id = ?";
            db.all(sqlItems, [row.id], (err: Error | null, rows: any[]) => {
              if (err) {
                reject(err);
                return;
              }
              if (rows.length === 0) {
                resolve(new Cart(userId, false, null, 0.0, []));
              } else {
                //Store items
                const items = rows.map(
                  (row) =>
                    new ProductInCart(
                      row.product_model,
                      row.quantity,
                      row.category,
                      row.price
                    )
                );
                cart.products = items;
                resolve(cart);
              }
            });
          }
        });
      } catch (error) {
        reject(error);
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
            return;
          } else {
            resolve(row ? true : false);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adds a product to a cart.
   * @param userId The ID of the user.
   * @param productModel The model of the product.
   * @returns A Promise that resolves when the product is added to the cart.
   */
  addProductToCart(userId: string, productModel: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      try {
        //Check if model exists
        const sqlCheckModel =
          "SELECT model, quantity FROM products WHERE model = ?";
        db.get(sqlCheckModel, [productModel], (err: Error | null, row: any) => {
          if (err) {
            return reject(err);
          }
          if (!row) {
            return reject(new ProductNotFoundError());
          } else if (row.quantity <= 0) {
            return reject(new EmptyProductStockError());
          } else {
            let sellingPrice = 0;
            let category = "";
            //retrieve product price
            const sqlCheckProductPrice =
              "SELECT sellingPrice, category FROM products WHERE model = ?";
            db.get(
              sqlCheckProductPrice,
              [productModel],
              (err: Error | null, row: any) => {
                if (err) {
                  return reject(err);
                }
                sellingPrice = row.sellingPrice;
                category = row.category;
              }
            );
            //check if user has active
            this.userHasActiveCart(userId)
              .then((hasCart) => {
                if (!hasCart) {
                  //create cart
                  this.createCart(userId)
                    .then(() => {
                      const sql =
                        "INSERT INTO carts_items (cart_id, product_model, quantity, price, category) VALUES ((SELECT id FROM carts WHERE customer = ? AND paid = 0), ?, 1, ?, ?)";
                      db.run(
                        sql,
                        [userId, productModel, sellingPrice, category],
                        function (err: Error | null) {
                          if (err) {
                            return reject(err);
                          }
                          const sqlUpdateCart =
                            "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                          db.run(
                            sqlUpdateCart,
                            [sellingPrice, userId],
                            function (err: Error | null) {
                              if (err) {
                                return reject(err);
                              }
                              resolve(true);
                            }
                          );
                        }
                      );
                    })
                    .catch((err) => {
                      return reject(err);
                    });
                } else {
                  //User already has a active cart
                  //check if a equals product is already in cart
                  const sqlCheckProduct =
                    "SELECT * FROM carts_items WHERE cart_id IN (SELECT id FROM carts WHERE customer = ? AND paid = 0) AND product_model = ?";
                  db.get(
                    sqlCheckProduct,
                    [userId, productModel],
                    (err: Error | null, row: any) => {
                      if (err) {
                        return reject(err);
                      }
                      if (row) {
                        //Product is already in cart
                        //check if quantity is available
                        const cartProductQuantity = row.quantity;
                        const sqlCheckStoreProductQuantity =
                          "SELECT quantity FROM products WHERE model = ?";
                        db.get(
                          sqlCheckStoreProductQuantity,
                          [productModel],
                          (err: Error | null, row: any) => {
                            if (err) {
                              return reject(err);
                            }
                            if (row.quantity < cartProductQuantity + 1) {
                              return reject(new LowProductStockError());
                            }
                            //Update quantity
                            this.updateCartItem(
                              userId,
                              sellingPrice,
                              productModel,
                              cartProductQuantity + 1
                            )
                              .then(() => {
                                const sqlUpdateCart =
                                  "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                                db.run(
                                  sqlUpdateCart,
                                  [sellingPrice, userId],
                                  function (err: Error | null) {
                                    if (err) {
                                      return reject(err);
                                    }
                                    resolve(true);
                                  }
                                );
                              })
                              .catch((err) => {
                                reject(err);
                              });
                          }
                        );
                      } else {
                        //Product is not in cart
                        const sql =
                          "INSERT INTO carts_items (cart_id, product_model, quantity, price, category) VALUES ((SELECT id FROM carts WHERE customer = ? AND paid = 0), ?, 1, ?, ?)";
                        db.run(
                          sql,
                          [userId, productModel, sellingPrice, category],
                          function (err: Error | null) {
                            if (err) {
                              return reject(err);
                            }
                            const sqlUpdateCart =
                              "UPDATE carts SET total = total + ? WHERE customer = ? AND paid = 0";
                            db.run(
                              sqlUpdateCart,
                              [sellingPrice, userId],
                              function (err: Error | null) {
                                if (err) {
                                  return reject(err);
                                }
                                resolve(true);
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              })
              .catch((err) => {
                return reject(err);
              });
          }
        });
      } catch (error) {
        reject(error);
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
  updateCartItem(
    userId: string,
    price: number,
    productModel: string,
    quantity: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const sql =
          "UPDATE carts_items SET quantity = ?, price = ? WHERE cart_id = (SELECT id FROM carts WHERE customer = ? AND paid = 0) AND product_model = ?";
        db.run(
          sql,
          [quantity, price, userId, productModel],
          function (err: Error | null) {
            if (err) {
              reject(err);
              return;
            } else {
              resolve();
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  updateCartTotal(userId: string, price: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const sql =
          "UPDATE carts SET total = ? WHERE customer = ? AND  paid = 0";
        db.run(sql, [userId, price], function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Marks a cart as paid and sets the payment date to the current timestamp.
   * @param userId The ID of the user who owns the cart.
   * @returns A Promise that resolves when the cart is marked as paid.
   */
  checkoutCart(userId: string): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      try {
        const sqlCheckCart =
          "SELECT * FROM carts WHERE customer = ? AND paid = 0";
        db.get(sqlCheckCart, [userId], (err: Error | null, row: any) => {
          if (err) {
            return reject(err);
          }
          if (!row) {
            return reject(new CartNotFoundError());
          } else {
            const sqlCheckCartItems =
              "SELECT * FROM carts_items WHERE cart_id = ?";
            db.all(
              sqlCheckCartItems,
              [row.id],
              (err: Error | null, rows: any[]) => {
                if (err) {
                  return reject(err);
                }
                if (rows.length === 0) {
                  return reject(new EmptyCartError());
                } else {
                  const checkProductsAvailability =
                    "SELECT quantity,model  FROM products WHERE model IN(SELECT product_model FROM carts_items WHERE cart_id IN(SELECT id FROM carts WHERE customer = ? AND paid = 0))";
                  db.all(
                    checkProductsAvailability,
                    [userId],
                    (err: Error | null, rows: any[]) => {
                      let productQuantity = 0;
                      if (err) {
                        return reject(err);
                      }
                      rows.forEach((product) => {
                        productQuantity = product.quantity;
                        if (productQuantity <= 0) {
                          return reject(new EmptyProductStockError());
                        }
                        const checkCartItems =
                          "SELECT quantity FROM carts_items WHERE product_model = ? AND cart_id IN(SELECT id FROM carts WHERE customer = ? AND paid = 0)";
                        db.get(
                          checkCartItems,
                          [product.model, userId],
                          (err: Error | null, row: any) => {
                            if (err) {
                              return reject(err);
                            }
                            if (!row) {
                              return reject(new ProductNotInCartError());
                            }
                            if (row.quantity > productQuantity) {
                              return reject(new LowProductStockError());
                            }

                            const updateProductQuantity =
                              "UPDATE products SET quantity = quantity - ? WHERE model = ?";
                            db.run(
                              updateProductQuantity,
                              [row.quantity, product.model],
                              function (err: Error | null) {
                                if (err) {
                                  return reject(err);
                                }
                              }
                            );
                          }
                        );
                      });
                      const sql =
                        "UPDATE carts SET paid = 1, paymentDate = ? WHERE customer = ? AND paid = 0";
                      db.run(
                        sql,
                        [dayjs().format("YYYY-MM-DD"), userId],
                        (err: Error | null) => {
                          if (err) {
                            return reject(err);
                          }
                          resolve(true);
                        }
                      );
                    }
                  );
                }
              }
            );
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Removes a product from a cart.
   * @param userId The ID of the user.
   * @param productModel The model of the product.
   * @returns A Promise that resolves when the product is removed from the cart.
   */
  removeProductFromCart(
    userId: string,
    productModel: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const checkExistingModelSql =
          "SELECT model FROM products WHERE model = ?";
        db.get(
          checkExistingModelSql,
          [productModel],
          (err: Error | null, model: any) => {
            if (err) {
              return reject(err);
            }
            if (!model) {
              return reject(new ProductNotFoundError());
            }

            const checkActiveCartSql =
              "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(
              checkActiveCartSql,
              [userId],
              (err: Error | null, activeCart: any) => {
                if (err) {
                  return reject(err);
                }
                if (!activeCart) {
                  return reject(new CartNotFoundError());
                }

                const checkEmptyCartSql =
                  "SELECT * FROM carts_items WHERE cart_id = ?";
                db.all(
                  checkEmptyCartSql,
                  [activeCart.id],
                  (err: Error | null, cartItems: any[]) => {
                    if (err) {
                      return reject(err);
                    }
                    if (cartItems.length === 0) {
                      return reject(new NoCartItemsError());
                    }

                    const checkProductInCartSql =
                      "SELECT * FROM carts_items WHERE cart_id = ? AND product_model = ?";
                    db.get(
                      checkProductInCartSql,
                      [activeCart.id, productModel],
                      (err: Error | null, product: any) => {
                        if (err) {
                          return reject(err);
                        }
                        if (!product) {
                          return reject(new ProductNotInCartError());
                        }

                        const deleteProductSql =
                          "DELETE FROM carts_items WHERE cart_id = ? AND product_model = ?";
                        db.run(
                          deleteProductSql,
                          [activeCart.id, productModel],
                          function (err: Error | null) {
                            if (err) {
                              return reject(err);
                            }

                            const decreaseTotalSql =
                              "UPDATE carts SET total = total - ? WHERE customer = ? AND paid = 0 AND id = ?";
                            db.run(
                              decreaseTotalSql,
                              [product.price, userId, activeCart.id],
                              function (err: Error | null) {
                                if (err) {
                                  return reject(err);
                                }
                                resolve(true);
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      } catch (error) {
        reject(error);
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
        const getCartSql =
          "SELECT * FROM carts WHERE customer = ? AND paid = 0";
        db.get(getCartSql, [userId], (err: Error | null, cart: any) => {
          if (err) {
            return reject(err);
          }
          if (!cart) {
            return reject(new CartNotFoundError());
          }
          const clearCartSql = "DELETE FROM carts_items WHERE cart_id = ?";
          db.run(clearCartSql, [cart.id], function (err: Error | null) {
            if (err) {
              return reject(err);
            }
            const updateTotalSql =
              "UPDATE carts SET total = 0 WHERE customer = ? AND paid = 0";
            db.run(updateTotalSql, [userId], function (err: Error | null) {
              if (err) {
                return reject(err);
              }
              resolve(true);
            });
          });
        });
      } catch (error) {
        reject(error);
      }
    });
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
            return reject(err);
          }
        });
        sql = "DELETE FROM carts_items";
        db.run(sql, [], function (err: Error | null) {
          if (err) {
            return reject(err);
          }
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Retrieves all carts from the database.
   * @returns A Promise that resolves to an array of Cart objects.
   */
  getAllCarts(): Promise<Cart[]> {
    return new Promise<Cart[]>((resolve, reject) => {
      try {
        const getCartsSql = "SELECT * FROM carts";
        db.all(
          getCartsSql,
          [],
          async (err: Error | null, user_carts: any[]) => {
            if (err) {
              return reject(err);
            }

            const carts: Cart[] = await Promise.all(
              user_carts.map(async (user_cart) => {
                const getProductsSql =
                  "SELECT product_model, quantity, price, category FROM carts_items WHERE cart_id = ?";

                return new Promise<Cart>((resolve, reject) => {
                  db.all(
                    getProductsSql,
                    [user_cart.id],
                    (err: Error | null, products: any[]) => {
                      if (err) {
                        return reject(err);
                      }
                      const productsInCart: ProductInCart[] = products.map(
                        (product) => {
                          return new ProductInCart(
                            product.product_model,
                            product.quantity,
                            product.category,
                            product.price
                          );
                        }
                      );
                      resolve(
                        new Cart(
                          user_cart.customer,
                          Boolean(user_cart.paid),
                          user_cart.paymentDate,
                          user_cart.total,
                          productsInCart
                        )
                      );
                    }
                  );
                });
              })
            );
            resolve(carts);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves all paid customer carts from the database.
   * @User The user who owns the cart.
   */
  getCustomerCarts(user: string): Promise<Cart[]> {
    return new Promise<Cart[]>((resolve, reject) => {
      try {
        const getCartsSql =
          "SELECT * FROM carts WHERE customer = ? AND paid = 1";
        db.all(
          getCartsSql,
          [user],
          async (err: Error | null, user_carts: any[]) => {
            if (err) {
              return reject(err);
            }
            const carts: Cart[] = await Promise.all(
              user_carts.map(async (user_cart) => {
                const getProductsSql =
                  "SELECT product_model, quantity, price, category FROM carts_items WHERE cart_id = ?";
                return new Promise<Cart>((resolve, reject) => {
                  db.all(
                    getProductsSql,
                    [user_cart.id],
                    (err: Error | null, products: any[]) => {
                      if (err) {
                        return reject(err);
                      }
                      const productsInCart: ProductInCart[] = products.map(
                        (product) => {
                          return new ProductInCart(
                            product.product_model,
                            product.quantity,
                            product.category,
                            product.price
                          );
                        }
                      );
                      resolve(
                        new Cart(
                          user_cart.customer,
                          Boolean(user_cart.paid),
                          user_cart.paymentDate,
                          user_cart.total,
                          productsInCart
                        )
                      );
                    }
                  );
                });
              })
            );
            resolve(carts);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default CartDAO;

import db from "../db/db";
import { Cart, ProductInCart } from "../components/cart";
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../errors/cartError";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {

    /**
     * Creates a new cart for a customer.
     * @param customer The username of the customer.
     * @returns A Promise that resolves to the ID of the newly created cart.
     */
    createCart(customer: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql = "INSERT INTO carts (customer, paid, paymentDate, total) VALUES (?, 0, NULL, 0)";
            db.run(sql, [customer], function (err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    /**
     * Retrieves the active cart for a specific user.
     * @param userId The ID of the user.
     * @returns A Promise that resolves to the active cart of the user, or null if no active cart exists.
     */
    getActiveCartByUserId(userId: string): Promise<Cart | null> {
        return new Promise<Cart | null>((resolve, reject) => {
            const sql = "SELECT * FROM carts WHERE customer = ? AND paid = 0";
            db.get(sql, [userId], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? new Cart(row.customer, row.paid, row.paymentDate, row.total, []) : null);
                }
            });
        });
    }

    /**
     * Retrieves a cart by its ID.
     * @param cartId The ID of the cart.
     * @returns A Promise that resolves to the cart if found, otherwise rejects with a CartNotFoundError.
     */
    getCartById(cartId: number): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
            const sql = "SELECT * FROM carts WHERE id = ?";
            db.get(sql, [cartId], (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    reject(new CartNotFoundError());
                } else {
                    resolve(new Cart(row.customer, row.paid, row.paymentDate, row.total, []));
                }
            });
        });
    }

    /**
     * Retrieves all items in a specific cart.
     * @param cartId The ID of the cart.
     * @returns A Promise that resolves to an array of ProductInCart objects.
     */
    getCartItems(cartId: number): Promise<ProductInCart[]> {
        return new Promise<ProductInCart[]>((resolve, reject) => {
            const sql = "SELECT * FROM cart_items WHERE cart_id = ?";
            db.all(sql, [cartId], (err: Error | null, rows: any[]) => {
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
     * @param cartId The ID of the cart.
     * @param productId The ID of the product.
     * @param quantity The quantity of the product to add.
     * @returns A Promise that resolves when the product is added to the cart.
     */
    addProductToCart(cartId: number, productId: number, quantity: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
            db.run(sql, [cartId, productId, quantity], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Updates the quantity of a product in a cart.
     * @param cartId The ID of the cart.
     * @param productId The ID of the product.
     * @param quantity The new quantity of the product.
     * @returns A Promise that resolves when the quantity is updated.
     */
    updateCartItemQuantity(cartId: number, productId: number, quantity: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
            db.run(sql, [quantity, cartId, productId], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Marks a cart as paid and sets the payment date to the current timestamp.
     * @param userId The ID of the user who owns the cart.
     * @returns A Promise that resolves when the cart is marked as paid.
     */
    checkoutCart(userId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "UPDATE carts SET paid = 1, paymentDate = CURRENT_TIMESTAMP WHERE customer = ? AND paid = 0";
            db.run(sql, [userId], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Removes a product from a cart.
     * @param cartId The ID of the cart.
     * @param productId The ID of the product.
     * @returns A Promise that resolves when the product is removed from the cart.
     */
    removeProductFromCart(cartId: number, productId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
            db.run(sql, [cartId, productId], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Clears all products from a cart.
     * @param cartId The ID of the cart.
     * @returns A Promise that resolves when all products are removed from the cart.
     */
    clearCart(cartId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM cart_items WHERE cart_id = ?";
            db.run(sql, [cartId], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Deletes all carts from the database.
     * @returns A Promise that resolves when all carts are deleted.
     */
    deleteAllCarts(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM carts";
            db.run(sql, [], (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Retrieves all carts from the database.
     * @returns A Promise that resolves to an array of Cart objects.
     */
    getAllCarts(): Promise<Cart[]> {
        return new Promise<Cart[]>((resolve, reject) => {
            const sql = "SELECT * FROM carts";
            db.all(sql, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const carts = rows.map(row => new Cart(row.customer, row.paid, row.paymentDate, row.total, []));
                    resolve(carts);
                }
            });
        });
    }
}

export default CartDAO
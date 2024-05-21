import { User } from "../components/user";
import CartDAO from "../dao/cartDAO";
import { Cart, ProductInCart } from "../components/cart";
import { CartNotFoundError, EmptyCartError } from "../errors/cartError";

/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CartController {
    private dao: CartDAO

    constructor() {
        this.dao = new CartDAO
    }

    /**
     * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
     * If the product is not in the cart, it should be added with a quantity of 1.
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param user - The user to whom the product should be added.
     * @param productId - The model of the product to add.
     * @returns A Promise that resolves to `true` if the product was successfully added.
     */
    async addToCart(user: User, product: string)/*: Promise<Boolean>*/ {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);

        if (!activeCart) {
            const newCartId = await this.dao.createCart(user.username);
            await this.dao.addProductToCart(newCartId, productModel, 1);
        } else {
            await this.dao.addProductToCart(activeCart.id, productId, 1);
        }
        return true;
    }


    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     */
    async getCart(user: User)/*: Cart*/ {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        await this.dao.removeProductFromCart(activeCart.id, productId);
        return true;
    }

    /**
     * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     * 
     */
    async checkoutCart(user: User) /**Promise<Boolean> */ {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        const items = await this.dao.getCartItems(activeCart.id);
        if (items.length === 0) {
            throw new EmptyCartError();
        }

        await this.dao.checkoutCart(user.username);
        return true;
    }

    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
     */
    async getCustomerCarts(user: User) { } /**Promise<Cart[]> */

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    async removeProductFromCart(user: User, product: string) /**Promise<Boolean> */ {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        await this.dao.removeProductFromCart(activeCart.id, productModel);
        return true;
    }


    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    async clearCart(user: User)/*:Promise<Boolean> */ {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        await this.dao.clearCart(activeCart.id);
        return true;
    }

    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    async deleteAllCarts() /**Promise<Boolean> */ {
        await this.dao.deleteAllCarts();
        return true;
    }

    /**
     * Retrieves all carts in the database.
     * @returns A Promise that resolves to an array of carts.
     */
    async getAllCarts() /*:Promise<Cart[]> */ {
        return this.dao.getAllCarts();
    }
}

export default CartController
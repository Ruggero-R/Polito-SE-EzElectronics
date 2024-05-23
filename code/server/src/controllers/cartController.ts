import { User } from "../components/user";
import CartDAO from "../dao/cartDAO";
import { Cart, ProductInCart } from "../components/cart";
import { CartNotFoundError, EmptyCartError, InvalidParametersError } from "../errors/cartError";

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
    * @param productModel - The model of the product to add.
    * @returns A Promise that resolves to `true` if the product was successfully added.
    */
    async addToCart(user: User, productModel: string): Promise<boolean> {
        if (!user || !(user instanceof User) || typeof productModel !== 'string' || productModel.trim() === '' || !productModel) {
            throw new InvalidParametersError;
        }
        // //TODO controllare 
        // const activeCart: any = await this.dao.getActiveCartByUserId(user.username);

        // if (!activeCart) {
        //     await this.dao.createCart(user.username);
        // }
        const res: any = await this.dao.addProductToCart(user.username, productModel);
        return res;
    }

    /**
    * Retrieves the current cart for a specific user.
    * If there is no active cart, creates a new one.
    * @param user - The user for whom to retrieve the cart.
    * @returns A Promise that resolves to the user's cart.
    */
    async getCart(user: User): Promise<Cart> {
        let activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            // If there's no active cart, create a new one
            await this.dao.createCart(user.username);
            // Retrieve the newly created cart
            activeCart = await this.dao.getActiveCartByUserId(user.username);
            if (!activeCart) {
                // If there's still no active cart, throw an error
                throw new CartNotFoundError();
            }
        }
        return activeCart;
    }

    /**
    * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
    * @param user - The user whose cart should be checked out.
    * @returns A Promise that resolves to `true` if the cart was successfully checked out.
    */
    async checkoutCart(user: User): Promise<boolean> {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        const items = await this.dao.getCartItems(user.username);
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
    async getCustomerCarts(user: User): Promise<Cart[]> {
        const allCarts = await this.dao.getAllCarts();
        const customerCarts = allCarts.filter(cart => cart.customer === user.username && cart.paid === true);
        return customerCarts;
    }

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    async removeProductFromCart(user: User, product: string): Promise<boolean> {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        await this.dao.removeProductFromCart(user.username, product);
        return true;
    }

    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    async clearCart(user: User): Promise<boolean> {
        const activeCart = await this.dao.getActiveCartByUserId(user.username);
        if (!activeCart) {
            throw new CartNotFoundError();
        }

        await this.dao.clearCart(user.username);
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
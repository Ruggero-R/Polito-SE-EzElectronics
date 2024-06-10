import CartDAO from '../../src/dao/cartDAO';
import { expect, beforeEach, describe, test, afterAll } from '@jest/globals';
import db from '../../src/db/db';
import { CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError } from "../../src/errors/cartError";
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from "../../src/errors/productError";


describe('CartDAO integration tests', () => {
    let dao: CartDAO;

    beforeEach((done) => {
        dao = new CartDAO();
        db.serialize(() => {
            db.run('DELETE FROM carts', (err) => {
                if (err) {
                    console.log(err);
                }
                db.run('DELETE FROM carts_items', (err) => {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            });
        });

    });

    /* ****************************************** *
     * Integration test for the createCart method *    
     * ****************************************** */
    test('createCart should create a new cart for a customer', async () => {
        await dao.createCart('customer1');
        const carts = await dao.getActiveCartByUserId('customer1');
        expect(carts).toBeTruthy();
        expect(carts.customer).toBe('customer1');
        expect(carts.paid).toBe(false);
        expect(carts.products.length).toBe(0);
    });

    /* ************************************************ *
     * Integration test for the addProductToCart method *    
     * ************************************************ */



    /* ***************************************************** *
     * Integration test for the getActiveCartByUserId method *    
     * ***************************************************** */



    /* ************************************************* *
     * Integration test for the userHasActiveCart method *    
     * ************************************************* */



    /* ********************************************** *
     * Integration test for the updateCartItem method *    
     * ********************************************** */



    /* *********************************************** *
     * Integration test for the updateCartTotal method *    
     * *********************************************** */



    /* ******************************************** *
     * Integration test for the checkoutCart method *    
     * ******************************************** */

    test('checkoutCart should throw EmptyCartError if the cart is empty', async () => {
        await dao.createCart('customer1');
        await expect(dao.checkoutCart('customer1')).rejects.toThrow(EmptyCartError);
    });


    /* ***************************************************** *
     * Integration test for the removeProductFromCart method *        //COME GESTIRE L'ERRORE? ProductNotInCartError o ProductNotFoundError
     * ***************************************************** */

    test('removeProductFromCart should throw ProductNotInCartError if product is not in the cart', async () => {
        await dao.createCart('customer1');
        await expect(dao.removeProductFromCart('customer1', 'prod1')).rejects.toThrow(ProductNotInCartError);
    });


    /* ***************************************** *
     * Integration test for the clearCart method *    
     * ***************************************** */



    /* ********************************************** *
     * Integration test for the deleteAllCarts method *    
     * ********************************************** */




    /* ******************************************* *
     * Integration test for the getAllCarts method *    
     * ******************************************* */




    /* ************************************************ *
     * Integration test for the getCustomerCarts method *    
     * ************************************************ */



});
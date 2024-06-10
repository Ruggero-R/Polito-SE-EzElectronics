import CartController from '../../src/controllers/cartController';
import { expect, beforeEach, describe, test } from '@jest/globals';
import db from '../../src/db/db';

describe('Cart Controller Integration Tests', () => {
    let controller: CartController;

    beforeEach((done) => {
        controller = new CartController();
        db.serialize(() => {
            db.run('DELETE FROM carts', (err) => {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });



});


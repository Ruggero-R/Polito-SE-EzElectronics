import CartDAO from '../../src/dao/cartDAO';
import { expect, beforeEach, describe, test, afterAll } from '@jest/globals';
import db from '../../src/db/db';

describe('CartDAO integration tests', () => {
    let dao: CartDAO;

    beforeEach((done) => {
        dao = new CartDAO();
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
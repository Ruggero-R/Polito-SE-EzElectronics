import ProductRoutes from "../../src/routers/productRoutes";
import { expect, beforeEach, describe, test } from '@jest/globals';
import db from '../../src/db/db';


describe('ProductRoutes', () => {
    let routes: ProductRoutes;

    beforeEach(() => {
        routes = new ProductRoutes();
    });
});
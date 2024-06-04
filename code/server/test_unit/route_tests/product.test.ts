import { body, validationResult } from 'express-validator';
import ProductRoutes from '../../src/routers/productRoutes';
import Authenticator from '../../src/routers/auth';
import ProductController from '../../src/controllers/productController';
import ErrorHandler from '../../src/helper';

import {jest, describe, beforeEach, it, expect} from '@jest/globals';
import express from 'express';
import request from 'supertest';

jest.mock('../../src/controllers/productController');


const mockProductController = new ProductController();
mockProductController.registerProducts = jest.fn() as jest.MockedFunction<typeof mockProductController.registerProducts>;

describe('ProductRoutes', () => {
    let productRoutes: ProductRoutes;
    let app = express();
    let authenticator: Authenticator;
    let errorHandler: ErrorHandler;
  
    beforeEach(() => {
      authenticator = new Authenticator(app);
      errorHandler = new ErrorHandler();
      productRoutes = new ProductRoutes(authenticator);
    });
  
    it('calls registerProducts on POST /', async () => {
        const app = express();
        app.use(productRoutes.getRouter());
      
        const response = await request(app)
          .post('/')
          .send({
            model: 'testModel',
            category: 'Smartphone',
            quantity: 10,
            details: 'testDetails',
            sellingPrice: 1000,
            arrivalDate: '2022-01-01',
          });
      
        expect(mockProductController.registerProducts).toHaveBeenCalledWith(
          'testModel',
          'Smartphone',
          10,
          'testDetails',
          1000,
          '2022-01-01'
        );
        expect(response.status).toBe(200);
    });

    

  });
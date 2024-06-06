import {expect,test,describe,beforeAll,afterAll,afterEach} from "@jest/globals";
import dayjs from "dayjs";
import ReviewController from "../../src/controllers/reviewController";
import { User,Role } from "../../src/components/user";
import ProductDao from "../../src/dao/productDAO";
import { ExistingReviewError, InvalidParametersError, NoReviewProductError, ProductNotFoundError } from "../../src/errors/reviewError";

const Controller=new ReviewController();
const Utente1=new User("Ale1","Ale","Mosca",Role.CUSTOMER,"amosca502@gmail.com","2001-12-06");
const Utente2=new User("Ale2","Ale","Mosca",Role.CUSTOMER,"amosca502@gmail.com","2001-12-06");

beforeAll(async()=>{
    await ProductDao.prototype.registerProducts("Model","Laptop",32,null,34,null);
    await ProductDao.prototype.registerProducts("Model2","Laptop",32,null,34,null);})
afterAll(async()=>{await ProductDao.prototype.deleteAllProducts();})
afterEach(async()=>{await Controller.deleteAllReviews();})

/* *********************************************** *
* Integration test for the addReview method *    
* ************************************************ */

describe("Integration test fpr addReview method",()=>{
    test("It should not work due to an invalid model",async()=>{
        await expect(Controller.addReview("   ",Utente1,5,"Ciao")).rejects.toThrow(InvalidParametersError);})

    test("It should not insert a review due to an unexisting model",async()=>{
        await expect(Controller.addReview("iPhone13",Utente1,5,"Bello")).rejects.toThrowError(ProductNotFoundError);})
    
    test("It should not insert a review due to an invalid parameter",async()=>{
        await expect(Controller.addReview("Iphone13",Utente1,5,"   ")).rejects.toThrow(InvalidParametersError);})
    
    test("It should not insert the review due to an existing review for the same tuple user-model",async()=>{
        await Controller.addReview("Model",Utente1,5,"Test1");
        await expect(Controller.addReview("Model",Utente1,5,"Hi")).rejects.toThrowError(ExistingReviewError);})
        
    test("It should insert a new review",async()=>{
        await expect(Controller.addReview("Model",Utente1,5,"Test1")).resolves.toBe(undefined);})})

/* ********************************************** *
 * Integration test for the getProductReviews method    *
 * ********************************************** */ 

describe("Integration tests for the getReviews method",()=>{
    test("It should not work due to an invalid model",async()=>{
        await expect(Controller.getProductReviews("   ")).rejects.toThrow(InvalidParametersError);})

    test("It should not get reviews due to an unexisting model",async()=>{
        await expect(Controller.getProductReviews("iPhone13")).rejects.toThrow(ProductNotFoundError);})

    test("It should get 2 reviews",async()=>{
        const Revs=[{model:"Model",user:"Ale1",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"},
                    {model:"Model",user:"Ale2",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"}]
        await Controller.addReview("Model",Utente1,5,"Bello");
        await Controller.addReview("Model",Utente2,5,"Bello");
        const response=await Controller.getProductReviews("Model");
        expect(response).toEqual(Revs);})})

/* ********************************************** *
 * Integration test for the deleteReview method    *
 * ********************************************** */

describe("Integration tests for the deleteReview method",()=>{
    test("It should not work due to an invalid model",async()=>{
        await expect(Controller.deleteReview("   ",Utente1)).rejects.toThrow(InvalidParametersError);})

    test("It should not find any review to delete due to an unexisting model",async()=>{
        await expect(Controller.deleteReview("iPhone13",Utente1)).rejects.toThrow(ProductNotFoundError)})
    
    test("It should not find any review to delete due to an unexisting pair (model-user)",async()=>{
        await expect(Controller.deleteReview("Model2",Utente1)).rejects.toThrow(NoReviewProductError);})
    
    test("It should delete the review",async()=>{
        const Revs1=[{model:"Model",user:"Ale1",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"}];
        await Controller.addReview("Model",Utente1,5,"Bello");
        await Controller.addReview("Model",Utente2,5,"Bello");
        await Controller.deleteReview("Model",Utente2);
        let Revs=await Controller.getProductReviews("Model");
        expect(Revs).toEqual(Revs1);})})

/* ********************************************** *
 * Integration test for the deleteReviewsOfProduct method*
 * ********************************************** */

describe("Integration tests for the deleteReviewsOfProduct method",()=>{
    test("It should not work due to an invalid model",async()=>{
        await expect(Controller.deleteReviewsOfProduct("   ")).rejects.toThrow(InvalidParametersError);})

    test("It should not find any review to delete due to an unexisting model",async()=>{
        await expect(Controller.deleteReviewsOfProduct("iPhone13")).rejects.toThrow(ProductNotFoundError);});
    
    test("It should delete all reviews for the given model",async()=>{
        await Controller.addReview("Model",Utente1,5,"Bello");
        await Controller.addReview("Model",Utente2,5,"Bello"); 
        await Controller.addReview("Model2",Utente1,5,"Bello");    // 2 reviews for Model, 1 for Model2
        await expect(Controller.deleteReviewsOfProduct("Model")).resolves.toBe(undefined);})})

/* ********************************************** *
 * Integration test for the deleteAllReviews method*
 * ********************************************** */

describe("Integration tests for the deleteAllReviews method",()=>{
    test("It should delete everything",async()=>{
        await Controller.addReview("Model",Utente1,5,"Bello");
        await Controller.addReview("Model2",Utente2,5,"Bello");
        await expect(Controller.deleteAllReviews()).resolves.toBeUndefined();})})




    


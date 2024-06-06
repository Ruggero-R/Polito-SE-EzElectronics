import ReviewDao from "../../src/dao/reviewDAO";
import { expect, describe, test, beforeAll, afterAll,afterEach } from '@jest/globals';
import db from "../../src/db/db";
import ProductDao from "../../src/dao/productDAO";
import { ProductNotFoundError,NoReviewProductError, InvalidParametersError, ExistingReviewError } from "../../src/errors/reviewError";
import { User,Role } from "../../src/components/user";
import dayjs from "dayjs";

const RevDAO=new ReviewDao();
const Utente1=new User("Ale1","Ale","Mosca",Role.CUSTOMER,"amosca502@gmail.com","2001-12-06");
const Utente2=new User("Ale2","Ale","Mosca",Role.CUSTOMER,"amosca502@gmail.com","2001-12-06");

beforeAll(async()=>{
    await ProductDao.prototype.registerProducts("Model","Laptop",32,null,34,null);
    await ProductDao.prototype.registerProducts("Model2","Laptop",32,null,34,null);})
afterAll(async()=>{await ProductDao.prototype.deleteAllProducts();})
afterEach(async()=>{await RevDAO.deleteAllReviews();})

function Get(){
    return new Promise((resolve,reject)=>{
        const sql="SELECT COUNT(*) AS N FROM products_reviews";
        db.get(sql,[],(err,count:any)=>{
            if(err){
                reject(err);}
            resolve(count.N);})})}

/* *********************************************** *
* Integration test for the addReview method *    
* ************************************************ */

describe("Integration tests for the addReview method",()=>{
    test("It should not insert a review due to an unexisting model",async()=>{
        await expect(RevDAO.addReview("iPhone13",Utente1,5,"Bello")).rejects.toThrowError(ProductNotFoundError);})

    test("It should not insert a review due to an invalid parameter",async()=>{
        await expect(RevDAO.addReview("Iphone13",Utente1,5,"   ")).rejects.toThrow(InvalidParametersError);})

    test("It should not insert the review due to an existing review for the same tuple user-model",async()=>{
        await RevDAO.addReview("Model",Utente1,5,"Test1");
        await expect(RevDAO.addReview("Model",Utente1,5,"Hi")).rejects.toThrowError(ExistingReviewError);})
    
    test("It should insert a new review",async()=>{
        await expect(RevDAO.addReview("Model",Utente1,125,"Test1")).resolves.toBe(undefined);})})

/* ********************************************** *
 * Integration test for the getProductReviews method    *
 * ********************************************** */ 

describe("Integration tests for the getReviews method",()=>{
    test("It should not get reviews due to an unexisting model",async()=>{
        await expect(RevDAO.getProductReviews("iPhone13")).rejects.toThrow(ProductNotFoundError);})

    test("It should get 2 reviews",async()=>{
        const Revs=[{model:"Model",user:"Ale1",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"},
                    {model:"Model",user:"Ale2",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"}]
        await RevDAO.addReview("Model",Utente1,5,"Bello");
        await RevDAO.addReview("Model",Utente2,5,"Bello");
        const response=await RevDAO.getProductReviews("Model");
        expect(response).toEqual(Revs);})})

/* ********************************************** *
 * Integration test for the deleteReview method    *
 * ********************************************** */

describe("Integration tests for the deleteReview method",()=>{
    test("It should not find any review to delete due to an unexisting model",async()=>{
        await expect(RevDAO.deleteReview("iPhone13",Utente1)).rejects.toThrow(ProductNotFoundError);})
    
    test("It should not find any review to delete due to an unexisting pair (model-user)",async()=>{
        await expect(RevDAO.deleteReview("Model2",Utente1)).rejects.toThrow(NoReviewProductError);})
    
    test("It should delete the review",async()=>{
        const Revs1=[{model:"Model",user:"Ale1",score:5,date:dayjs().format("YYYY-MM-DD"),comment:"Bello"}];
        await RevDAO.addReview("Model",Utente1,5,"Bello");
        await RevDAO.addReview("Model",Utente2,5,"Bello");
        await RevDAO.deleteReview("Model",Utente2);
        let Revs=await RevDAO.getProductReviews("Model");
        expect(Revs).toEqual(Revs1);})})

/* ********************************************** *
 * Integration test for the deleteReviewsOfProduct method*
 * ********************************************** */

describe("Integration tests for the deleteReviewsOfProduct method",()=>{
    test("It should not find any review to delete due to an unexisting model",async()=>{
        await expect(RevDAO.deleteReviewsOfProduct("iPhone13")).rejects.toThrow(ProductNotFoundError);});
    
    /*test("It should delete all reviews for the given model",async()=>{
        await RevDAO.addReview("Model",Utente1,5,"Bello");
        await RevDAO.addReview("Model",Utente2,5,"Bello"); 
        await RevDAO.addReview("Model2",Utente1,5,"Bello");    // 2 reviews for Model, 1 for Model2
        await RevDAO.deleteReviewsOfProduct("Model");
        let N=await Get();
        expect(N).toBe(1);})*/})                                // Only the review for Model2

/* ********************************************** *
 * Integration test for the deleteAllReviews method*
 * ********************************************** */

describe("Integration tests for the deleteAllReviews method",()=>{
    test("It should delete everything",async()=>{
        await RevDAO.addReview("Model",Utente1,5,"Bello");
        await RevDAO.addReview("Model2",Utente2,5,"Bello");
        await RevDAO.deleteAllReviews();
        let N=await Get();
        expect(N).toBe(0);})})
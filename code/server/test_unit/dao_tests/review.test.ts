import { test, expect, describe, jest, afterEach} from "@jest/globals";
import reviewDAO from "../../src/dao/reviewDAO";
import { User,Role } from "../../src/components/user";
import { ExistingReviewError, NoReviewProductError, ProductNotFoundError } from "../../src/errors/reviewError";

const RevDAO=new reviewDAO();
const Utente1=new User("Ale","Alessandro","Mosca",Role.ADMIN,"amosca502@gmail.com","2024-01-01");

afterEach(() => {
    jest.clearAllMocks();});

/* ********************************************** *
 *    Unit test for the addReview method    *
 * ********************************************** */

describe("Unit tests for the addReview method",()=>{
    test("It should not insert a review due to an unexisting model",async()=>{
        jest.spyOn(RevDAO,"addReview").mockRejectedValue(new ProductNotFoundError);
        expect(RevDAO.addReview("iPhone14",Utente1,5,"Molto bello")).rejects.toThrowError(ProductNotFoundError);})

    test("It should insert a new review",async()=>{
        jest.spyOn(RevDAO,"addReview").mockResolvedValue(undefined);
        expect(RevDAO.addReview("Notebook",Utente1,5,"Molto bello")).resolves.toBe(undefined);})

    test("It should not insert the review due to an existing review for the same tuple user-model",async()=>{
        jest.spyOn(RevDAO,"addReview").mockRejectedValue(new ExistingReviewError);
       expect(RevDAO.addReview("iPhone13",Utente1,5,"Hi")).rejects.toThrowError(ExistingReviewError);})})

/* ********************************************** *
 *    Unit test for the getReviews method    *
 * ********************************************** */       

describe("Unit tests for the getReviews method",()=>{
    test("It should not get reviews due to an unexisting model",async()=>{
        jest.spyOn(RevDAO,"getProductReviews").mockRejectedValue(new ProductNotFoundError);
        expect(RevDAO.getProductReviews("iPhone13")).rejects.toThrowError(ProductNotFoundError);})

    test("It should get one review",async()=>{
        const reviewObj=[{model: "iPhone13", user:"aaaa",score:2,date:"",comment:""}];
        jest.spyOn(RevDAO,"getProductReviews").mockResolvedValue(reviewObj);
        expect(RevDAO.getProductReviews("iPhone13")).resolves.toBe(reviewObj);})})

/* ********************************************** *
 *    Unit test for the deleteReview method    *
 * ********************************************** */

describe("Unit tests for the deleteReview method",()=>{
    test("It should not find any review to delete due to an unexisting model",()=>{
        jest.spyOn(RevDAO,"deleteReview").mockRejectedValue(new ProductNotFoundError);
        expect(RevDAO.deleteReview("iPhone13",Utente1)).rejects.toThrowError(ProductNotFoundError);});

    test("It should not find any review to delete due to an unexisting pair (model-user)",()=>{
        jest.spyOn(RevDAO,"deleteReview").mockRejectedValue(new NoReviewProductError);
        expect(RevDAO.deleteReview("iPhone13",Utente1)).rejects.toThrowError(NoReviewProductError);});
    
    test("It should delete the review",()=>{
        jest.spyOn(RevDAO,"deleteReview").mockResolvedValue(undefined);
        expect(RevDAO.deleteReview("iPhone13",Utente1)).resolves.toBe(undefined);})})

/* ********************************************** *
 * Unit test for the deleteReviewsOfProduct method*
 * ********************************************** */

describe("Unit tests for the deleteReviewsOfProduct method",()=>{
    test("It should not find any review to delete due to an unexisting model",()=>{
        jest.spyOn(RevDAO,"deleteReview").mockRejectedValue(new ProductNotFoundError);
        expect(RevDAO.deleteReview("iPhone13",Utente1)).rejects.toThrowError(ProductNotFoundError);});
    
    test("It should delete any review for the given model",()=>{
        jest.spyOn(RevDAO,"deleteReviewsOfProduct").mockResolvedValue(undefined);
        expect(RevDAO.deleteReviewsOfProduct("iPhone13")).resolves.toBe(undefined);})})

/* ********************************************** *
 * Unit test for the deleteAllReviews method*
 * ********************************************** */

describe("Unit tests for the deleteAllReviews method",()=>{
    test("It should not find any review to delete due to an unexisting model",()=>{
        jest.spyOn(RevDAO,"deleteAllReviews").mockResolvedValue(undefined);
        expect(RevDAO.deleteAllReviews()).resolves.toBe(undefined);})});
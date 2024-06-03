import { test, expect, describe, jest} from "@jest/globals";
import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO";
import { User,Role } from "../../src/components/user";
import { InvalidParametersError } from "../../src/errors/reviewError";

const Controller=new ReviewController();
const Utente1=new User("Ale","Alessandro","Mosca",Role.ADMIN,"amosca502@gmail.com","2024-01-01");

/* ********************************************** *
 *    Unit test for the addReview method    *
 * ********************************************** */

describe("Unit Tests for the addReview method",()=>{
    test("It should reject due a model not given",()=>{
        expect(()=>Controller.addReview("",Utente1,5,"WEEEEE")).rejects.toThrow(InvalidParametersError);})

    test("It should reject due to a negative score",()=>{
        expect(()=>Controller.addReview("model",Utente1,-12,"WWWWWW")).rejects.toThrow(InvalidParametersError);})
    
    test("It should reject due to a score not valid",()=>{
        expect(()=>Controller.addReview("model",Utente1,12,"WWWWWW")).rejects.toThrow(InvalidParametersError);})

    test("It should resolve",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"addReview").mockResolvedValue(undefined);
        expect(Controller.addReview("model",Utente1,5,"WEEEEE")).resolves.toBe(undefined);
        mock.mockClear();})

    test("It should reject due a comment not given",()=>{
        expect(()=>Controller.addReview("model",Utente1,5,"")).rejects.toThrow(InvalidParametersError);})})

/* ********************************************** *
 *    Unit test for the getProductReviews method    *
 * ********************************************** */

describe("Unit tests for the getProductReviews method",()=>{
    test("It should reject due a model not given",()=>{
        expect(()=>Controller.getProductReviews("   ")).rejects.toThrow(InvalidParametersError);})

    test("It should resolve",()=>{
        const reviewObj=[{model:"iPhone13", user:"aaaa",score:2,date:"",comment:""}];
        const mock=jest.spyOn(ReviewDAO.prototype,"getProductReviews").mockResolvedValue(reviewObj);
        expect(Controller.getProductReviews("model")).resolves.toEqual(reviewObj);
        mock.mockClear();})})

/* ********************************************** *
 *    Unit test for the deleteReview method    *
 * ********************************************** */

describe("Unit tests for the deleteReview method",()=>{
    test("It should reject due to a model not given",()=>{
        expect(Controller.deleteReview("",Utente1)).rejects.toThrow(InvalidParametersError);})   

    test("It should resolve",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"deleteReview").mockResolvedValue(undefined);
        expect(Controller.deleteReview("model",Utente1)).resolves.toBe(undefined);
        mock.mockClear();})    

    test("It should delete an existing review",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"deleteReview").mockResolvedValue(undefined);
        expect(Controller.deleteReview("model",Utente1)).resolves.toBe(undefined);
        mock.mockClear();})})

/* ********************************************** *
 *    Unit test for the deleteReviewsOfProduct method    *
 * ********************************************** */

describe("Unit tests for the deleteReviewsOfProduct method",()=>{
    test("It should reject due to a model not given",()=>{
        expect(Controller.deleteReviewsOfProduct(" ")).rejects.toThrow(InvalidParametersError);}) 
        
    test("It should resolve",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockResolvedValue(undefined);
        expect(Controller.deleteReviewsOfProduct("model")).resolves.toBe(undefined);
        mock.mockClear();})    

    test("It should delete all existing reviews for a model",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockResolvedValue(undefined);
        expect(Controller.deleteReviewsOfProduct("model")).resolves.toBe(undefined);
        mock.mockClear();})})

/* ********************************************** *
 *    Unit test for the deleteAllReviews method    *
 * ********************************************** */

describe("Unit tests for the deleteReviewsOfProduct method",()=>{
    test("It should delete all existing reviews",()=>{
        const mock=jest.spyOn(ReviewDAO.prototype,"deleteAllReviews").mockResolvedValue(undefined);
        expect(Controller.deleteAllReviews()).resolves.toBe(undefined);
        mock.mockClear();})})
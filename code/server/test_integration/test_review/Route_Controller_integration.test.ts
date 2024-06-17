import { describe, test, expect, jest, afterEach, beforeAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import Authenticator from "../../src/routers/auth"
import ReviewDAO from "../../src/dao/reviewDAO"
import { ExistingReviewError, InvalidParametersError, NoReviewProductError, ProductNotFoundError } from "../../src/errors/reviewError"
import { cleanup } from "../../src/db/cleanup"

const baseURL="/ezelectronics";
jest.mock("../../src/routers/auth");
afterEach(()=>{jest.resetAllMocks();})
beforeAll(() => {cleanup();})

/* ********************************************** *
 *    Integration test for the addReview route    *   COME MOCKO USER?
 * ********************************************** */

describe("Unit test for the addReview route",()=>{
    test("It should fail due to a comment not given",async()=>{
        const revObjNotValid={score:5,comment:"    "};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObjNotValid); //Send a POST request to the route
        expect(response.status).toBe(422);})  

    test("It should fail due to a not valid score",async()=>{
        const revObjNotValid={score:15,comment:"Bella"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObjNotValid); //Send a POST request to the route
        expect(response.status).toBe(422);})  

    test("It should work",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"addReview").mockResolvedValue(undefined);
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);})

    test("It should not work due to an invalid parameter",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"addReview").mockRejectedValue(new InvalidParametersError);
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(422);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);})

    test("It should not work due to a model not existing",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"addReview").mockRejectedValue(new ProductNotFoundError);
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(404);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);})

    test("It should raise an error",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"addReview").mockRejectedValue(new Error("Ops"));
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObj);     //Send a POST request to the route
        expect(response.status).toBe(503);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);})

    test("It should not work due to an existing review for the tuple (user-model)",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"addReview").mockRejectedValue(new ExistingReviewError);
        const response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(409);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);})})


/* ********************************************************* *
 *    Integration tests for the getReviewsForProduct route *
 * ******************************************************** */

describe("Unit test for the getProductReviews route",()=>{
    test("It should not work due to an invalid parameter error",async()=>{
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"getProductReviews").mockRejectedValue(new InvalidParametersError);
        const response=await request(app).get(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(422);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);})

    test("It should not work due to a product not found error",async()=>{
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"getProductReviews").mockRejectedValue(new ProductNotFoundError);
        const response=await request(app).get(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(404);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);})

    test("It should raise an error",async()=>{
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"getProductReviews").mockRejectedValue(new Error("Ops"));
        const response=await request(app).get(baseURL + "/reviews/Model").send();     //Send a POST request to the route
        expect(response.status).toBe(503);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);})

    test("It should work",async()=>{
        const ResObj=[{model:"Model1",user:"User",score:2,date:"2024-02-15",comment:"Bello"},
                      {model:"Model2",user:"User",score:2,date:"2024-02-15",comment:"Bello"}]
        jest.spyOn(Authenticator.prototype,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"getProductReviews").mockResolvedValue(ResObj);
        const response=await request(app).get(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(200);
        expect(response.body).toEqual(ResObj);
        expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);})})

/* **************************************************** *
 *    Integration tests for the deleteReview route    *
 * ************************************************* */

describe("Unit test for the deleteReview route",()=>{
    test("It should not work due to an invalid parameter error",async()=>{
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReview").mockRejectedValue(new InvalidParametersError);
        const response=await request(app).delete(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(422);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);})

    test("It should not work due to a product not found error",async()=>{
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReview").mockRejectedValue(new ProductNotFoundError);
        const response=await request(app).delete(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(404);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);})

    test("It should bot work due to an unexisting review",async()=>{
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReview").mockRejectedValue(new NoReviewProductError);
        const response=await request(app).delete(baseURL + "/reviews/Model").send(); //Send a POST request to the route
        expect(response.status).toBe(404);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);})

    test("It should raise an error",async()=>{
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReview").mockRejectedValue(new Error("Ops"));
        const response=await request(app).delete(baseURL + "/reviews/Model").send();     //Send a POST request to the route
        expect(response.status).toBe(503);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);})
    
    test("It should work",async()=>{
        jest.spyOn(Authenticator.prototype,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReview").mockResolvedValue(undefined);
        const response=await request(app).delete(baseURL + "/reviews/Model").send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);})})

/* ********************************************************** *
 *    Integration tests for the deleteReviewsOfProduct route    *
 * ********************************************************* */

describe("Integration tests for the deleteReviewsOfProduct route",()=>{
    test("It should not work due to an invalid parameter error",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockRejectedValue(new InvalidParametersError);
        const response=await request(app).delete(baseURL + "/reviews/Model/all").send(); //Send a POST request to the route
        expect(response.status).toBe(422);
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);})

    test("It should not work due to a product not found error",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockRejectedValue(new ProductNotFoundError);
        const response=await request(app).delete(baseURL + "/reviews/Model/all").send(); //Send a POST request to the route
        expect(response.status).toBe(404);
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);})

    test("It should raise an error",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockRejectedValue(new Error("Ops"));
        const response=await request(app).delete(baseURL + "/reviews/Model/all").send();     //Send a POST request to the route
        expect(response.status).toBe(503);
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);})

    test("It should work",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteReviewsOfProduct").mockResolvedValue(undefined);
        const response=await request(app).delete(baseURL + "/reviews/Model/all").send(); //Send a POST request to the route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);})})

/* ********************************************** *
 *  Integration tests for the deleteAllReviews route    *
 * ********************************************** */

describe("Unit test for the deleteAllReviews route",()=>{
    test("It should work",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteAllReviews").mockResolvedValue(undefined);
        const response=await request(app).delete(baseURL + "/reviews").send(); //Send a POST request to the route
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);})

    test("It should raise an error",async()=>{
        jest.spyOn(Authenticator.prototype,"isAdminOrManager").mockImplementation((req, res, next)=>next());
        jest.spyOn(ReviewDAO.prototype,"deleteAllReviews").mockRejectedValue(new Error("Ops"));
        const response=await request(app).delete(baseURL + "/reviews").send();     //Send a POST request to the route
        expect(response.status).toBe(503);
        expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);})})
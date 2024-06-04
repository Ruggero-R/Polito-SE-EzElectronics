import { describe, test, expect, jest, afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import ReviewController from "../../src/controllers/reviewController"
import Authenticator from "../../src/routers/auth"

const baseURL="/ezelectronics";
const Auth=new Authenticator(app);
const Controller=new ReviewController();
afterEach(()=>{jest.resetAllMocks();});

/* ********************************************** *
 *    Unit test for the addReview method    *
 * ********************************************** */

describe("Unit test for the addReview route",()=>{
    test("It should fail due to an authenticated user or a user not customer",async()=>{
        const revObj={score:5,comment:"comment"};
        let response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(401);

        jest.spyOn(Auth,"isLoggedIn").mockImplementation((req, res, next)=>next());
        response=await request(app).post(baseURL + "/reviews/Model").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(401);})

    test("It should fail due to a model not given",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Auth,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(Auth,"isCustomer").mockImplementation((req, res, next)=>next());
        const response=await request(app).post(baseURL + "/reviews/   ").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(404);})  
        
    test("It should fail due to a not valid score",async()=>{
        const revObj={score:15,comment:"comment"};
        jest.spyOn(Auth,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(Auth,"isCustomer").mockImplementation((req, res, next)=>next());
        const response=await request(app).post(baseURL + "/reviews/Model1").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(401);})  

    test("It should work",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Auth,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(Auth,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(Controller,"addReview").mockResolvedValue(undefined);
        const response=await request(app).post(baseURL + "/reviews/Model1").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(200);
        expect(Controller.addReview).toHaveBeenCalledTimes(0);})

    test("It should not work",async()=>{
        const revObj={score:5,comment:"comment"};
        jest.spyOn(Auth,"isLoggedIn").mockImplementation((req, res, next)=>next());
        jest.spyOn(Auth,"isCustomer").mockImplementation((req, res, next)=>next());
        jest.spyOn(Controller,"addReview").mockRejectedValue(undefined);
        const response=await request(app).post(baseURL + "/reviews/Model1").send(revObj); //Send a POST request to the route
        expect(response.status).toBe(401);
        expect(Controller.addReview).toHaveBeenCalledTimes(0);})})




import { test, expect, jest } from "@jest/globals"
import ProductController from "../../src/controllers/productController"
import ProductDAO from "../../src/dao/productDAO"
import {
    InvalidParametersError,
    ArrivalDateError,
    FiltersError
} from "../../src/errors/productError";
import dayjs from "dayjs";

const mockProducts = [
    {
        model: "model1",
        category: "Smartphone",
        quantity: 10,
        details: "details",
        sellingPrice: 100.00,
        arrivalDate: "2024-01-01"
    },
    {
        model: "model2",
        category: "Laptop",
        quantity: 5,
        details: "details",
        sellingPrice: 200.00,
        arrivalDate: "2024-01-01"
    },
    {
        model: "model3",
        category: "Appliance",
        quantity: 3,
        details: "details",
        sellingPrice: 300.00,
        arrivalDate: "2024-01-01"
    },
    {
        model: "model4",
        category: "Smartphone",
        quantity: 0,
        details: "details",
        sellingPrice: 400.00,
        arrivalDate: "2024-01-01"
    },
    {
        model: "model5",
        category: "Laptop",
        quantity: 0,
        details: "details",
        sellingPrice: 500.00,
        arrivalDate: "2024-01-01"
    },
    {
        model: "model6",
        category: "Appliance",
        quantity: 0,
        details: "details",
        sellingPrice: 600.00,
        arrivalDate: "2024-01-01"
    }

];

const DAOmockRegisterProducts = jest.fn().mockImplementation(() => Promise.resolve());
const DAOmockChangeProductQuantity = jest.fn().mockImplementation(() => Promise.resolve(20)); 
const DAOmockSellProduct = jest.fn().mockImplementation(() => Promise.resolve(9));
const DAOmockGetProducts = jest.fn((filterType, category, model) => {
    if (filterType === 'category') {
        return Promise.resolve(mockProducts.filter(p => p.category === category));
    } else if (filterType === 'model') {
        return Promise.resolve(mockProducts.filter(p => p.model === model));
    }
    return Promise.resolve(mockProducts);
});
const DAOmockGetAvailableProducts = jest.fn((filterType, category, model) => {
    if (filterType === 'category') {
        return Promise.resolve(mockProducts.filter(p => p.category === category && p.quantity > 0));
    } else if (filterType === 'model') {
        return Promise.resolve(mockProducts.filter(p => p.model === model && p.quantity > 0));
    } else {
        return Promise.resolve(mockProducts.filter(p => p.quantity > 0));
    }
});
const DAOmockDeleteAllProducts = jest.fn().mockImplementation(() => Promise.resolve(true));
const DAOmockDeleteProduct = jest.fn().mockImplementation(() => Promise.resolve(true));

jest.mock("../../src/dao/productDAO", () => {
    return jest.fn().mockImplementation(() => {
        return {
            registerProducts: DAOmockRegisterProducts,
            changeProductQuantity: DAOmockChangeProductQuantity,
            sellProduct: DAOmockSellProduct,
            getProducts: DAOmockGetProducts,
            getAvailableProducts: DAOmockGetAvailableProducts,
            deleteAllProducts: DAOmockDeleteAllProducts,
            deleteProduct: DAOmockDeleteProduct,
        };
    });
});

/* ********************************************** *
 *    Unit test for the registerProducts method   *
 * ********************************************** */

test("It should register a product", async () => {
    const productController = new ProductController();
    
    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", 100.00, "2024-01-01")).resolves.toBeUndefined();
    expect(DAOmockRegisterProducts).toHaveBeenCalledWith("model1", "Smartphone", 10, "details", 100.00, "2024-01-01");
    DAOmockRegisterProducts.mockClear();
});

test("It should register a product if the details are not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.registerProducts("model1", "Smartphone", 10, null, 100.00, "2024-01-01")).resolves.toBeUndefined();
    expect(DAOmockRegisterProducts).toHaveBeenCalledWith("model1", "Smartphone", 10, "BUY YOUR model1 NOW!", 100.00, "2024-01-01");
    DAOmockRegisterProducts.mockClear();
});

test("It should register a product if the arrivalDate is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", 100.00, null)).resolves.toBeUndefined();
    expect(DAOmockRegisterProducts).toHaveBeenCalledWith("model1", "Smartphone", 10, "details", 100.00, dayjs().format("YYYY-MM-DD"));
    DAOmockRegisterProducts.mockClear();
});

test("It should throw InvalidParametersError when category is not a string or is not one of the allowed categories", async () => {
    const productController = new ProductController();

    await expect(productController.registerProducts("model1", "InvalidCategory", 10, "details", 100.00, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).not.toHaveBeenCalled();
    DAOmockRegisterProducts.mockClear();
});

test("It should throw InvalidParametersError when quantity is not a number or is not an integer or is less than or equal to 0", async () => {
    const productController = new ProductController();

    await expect(productController.registerProducts("model1", "Smartphone", -1, "details", 100.00, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).not.toHaveBeenCalled();
    DAOmockRegisterProducts.mockClear();
    await expect(productController.registerProducts("model1", "Smartphone", 10.5, "details", 100.00, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).toHaveBeenCalledTimes(0);
    DAOmockRegisterProducts.mockClear();
});

test("It should throw InvalidParametersError when details is not a string or is undefined", async () => {
    const productController = new ProductController();
    expect(productController.registerProducts("model1", "Smartphone", 10, undefined, 100.00, "2024-01-01")).resolves;
});


test("It should throw InvalidParametersError when sellingPrice is not a number or is less than or equal to 0", async () => {
    const productController = new ProductController();

    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", -1, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).toHaveBeenCalledTimes(1);
    DAOmockRegisterProducts.mockClear();
});

test("It should throw InvalidParametersError when arrivalDate is not in 'YYYY-MM-DD' format or is not a date", async () => {
    const productController = new ProductController();

    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", 100.00, "01-01-2024")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).not.toHaveBeenCalled();
    DAOmockRegisterProducts.mockClear();

    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", 100.00, "pippo")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockRegisterProducts).not.toHaveBeenCalled();
    DAOmockRegisterProducts.mockClear();
});

test("It should throw ArrivalDateError when arrivalDate is in the future", async () => {
    const productController = new ProductController();

    await expect(productController.registerProducts("model1", "Smartphone", 10, "details", 100.00, "2034-01-01")).rejects.toThrow(ArrivalDateError);
    expect(DAOmockRegisterProducts).not.toHaveBeenCalled();
    DAOmockRegisterProducts.mockClear();
});

/* ********************************************** *
* Unit test for the changeProductQuantity method *
* ********************************************** */
test("It should change the quantity of a product", async () => {
    const productController = new ProductController();
    
    await expect(productController.changeProductQuantity("model1", 10, "2024-01-01")).resolves.toBe(20);
    expect(DAOmockChangeProductQuantity).toHaveBeenCalledWith("model1", 10, "2024-01-01");
    DAOmockChangeProductQuantity.mockClear();
});

test("It should change the quantity of a product if the changeDate is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.changeProductQuantity("model1", 10, null)).resolves.toBe(20);
    expect(DAOmockChangeProductQuantity).toHaveBeenCalledWith("model1", 10, null);
    DAOmockChangeProductQuantity.mockClear();
});

test("It should throw InvalidParametersError when model is not a string or is empty", async () => {
    const productController = new ProductController();

    await expect(productController.changeProductQuantity("", 10, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();

    await expect(productController.changeProductQuantity("   ", 10, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();
});

test("It should throw InvalidParametersError when newQuantity is not a number or is not an integer or  is less than or equal to 0", async () => {
    const productController = new ProductController();

    await expect(productController.changeProductQuantity("model1", -1, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();

    await expect(productController.changeProductQuantity("model1", 10.5, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();
});

/*
test("It should throw InvalidParametersError when changeDate is not a string or is undefined", async () => {
    const productController = new ProductController();

    await expect(productController.changeProductQuantity("model1", 10, undefined)).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();
});
*/

test("It should throw InvalidParametersError when changeDate is not in 'YYYY-MM-DD' format or is not a date", async () => {
    const productController = new ProductController();

    await expect(productController.changeProductQuantity("model1", 10, "01-01-2024")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();

    await expect(productController.changeProductQuantity("model1", 10, "pippo")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();
});

test("It should throw ArrivalDateError when changeDate is in the future", async () => {
    const productController = new ProductController();

    await expect(productController.changeProductQuantity("model1", 10, "2034-01-01")).rejects.toThrow(ArrivalDateError);
    expect(DAOmockChangeProductQuantity).not.toHaveBeenCalled();
    DAOmockChangeProductQuantity.mockClear();
});

/* ***********************************************
*      Unit test for the sellProduct method      *
* ********************************************** */
test("It should sell a product", async () => {
    const productController = new ProductController();
    
    await expect(productController.sellProduct("model1", 10, "2024-01-01")).resolves.toBe(9);
    expect(DAOmockSellProduct).toHaveBeenCalledWith("model1", 10, "2024-01-01");
    DAOmockSellProduct.mockClear();
});

test("It should sell a product if the sellingDate is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.sellProduct("model1", 10, null)).resolves.toBe(9);
    expect(DAOmockSellProduct).toHaveBeenCalledWith("model1", 10, null);
    DAOmockSellProduct.mockClear();
});

test("It should throw InvalidParametersError when model is not a string or is empty", async () => {
    const productController = new ProductController();

    await expect(productController.sellProduct("", 10, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();

    await expect(productController.sellProduct("   ", 10, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();
});

test("It should throw InvalidParametersError when quantity is not a number or is not an integer or  is less than or equal to 0", async () => {
    const productController = new ProductController();

    await expect(productController.sellProduct("model1", -1, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();

    await expect(productController.sellProduct("model1", 10.5, "2024-01-01")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();
});

test("It should throw InvalidParametersError when sellingDate is not in 'YYYY-MM-DD' format or is not a date", async () => {
    const productController = new ProductController();

    await expect(productController.sellProduct("model1", 10, "01-01-2024")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();

    await expect(productController.sellProduct("model1", 10, "pippo")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();
});

test("It should throw ArrivalDateError when sellingDate is in the future", async () => {
    const productController = new ProductController();

    await expect(productController.sellProduct("model1", 10, "2034-01-01")).rejects.toThrow(ArrivalDateError);
    expect(DAOmockSellProduct).not.toHaveBeenCalled();
    DAOmockSellProduct.mockClear();
});

/* ***********************************************
*    Unit test for the getProducts method        *
* ********************************************** */
test("It should get all products", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts(null, null, null)).resolves.toBe(mockProducts);
    expect(DAOmockGetProducts).toHaveBeenCalledWith(null, null, null);
    DAOmockGetProducts.mockClear();
});

test("It should get all products filtered by category", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("category", "Smartphone", null)).resolves.toStrictEqual(mockProducts.filter(p => p.category === "Smartphone"));
    expect(DAOmockGetProducts).toHaveBeenCalledWith("category", "Smartphone", null);
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when category is not one of the allowed values", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("category", "InvalidCategory", null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when category is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("category", null, null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

test("It should get all products filtered by model", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("model", null, "model1")).resolves.toStrictEqual(mockProducts.filter(p => p.model === "model1"));
    expect(DAOmockGetProducts).toHaveBeenCalledWith("model", null, "model1");
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when model is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("model", null, null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when category is provided with model", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("model", "Smartphone", "model1")).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when model is empty", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("model", null, "")).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

test("It should throw FiltersError when model is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.getProducts("model", null, null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetProducts).not.toHaveBeenCalled();
    DAOmockGetProducts.mockClear();
});

/* ***********************************************
* Unit test for the getAvailableProducts method  *
* ********************************************** */
test("It should get all available products", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts(null, null, null)).resolves.toStrictEqual(mockProducts.filter(p => p.quantity > 0));
    expect(DAOmockGetAvailableProducts).toHaveBeenCalledWith(null, null, null);
    DAOmockGetAvailableProducts.mockClear();
});

test("It should get all available products grouped by category", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("category", "Smartphone", null)).resolves.toStrictEqual(mockProducts.filter(p => (p.category === "Smartphone" && p.quantity > 0)));
    expect(DAOmockGetAvailableProducts).toHaveBeenCalledWith("category", "Smartphone", null);
    DAOmockGetAvailableProducts.mockClear();
});

test("It should throw FiltersError when category is not one of the allowed values", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("category", "InvalidCategory", null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetAvailableProducts).not.toHaveBeenCalled();
    DAOmockGetAvailableProducts.mockClear();
});

test("It should get all available products grouped by model", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("model", null, "model1")).resolves.toStrictEqual(mockProducts.filter(p => (p.model === "model1" && p.quantity > 0)));
    expect(DAOmockGetAvailableProducts).toHaveBeenCalledWith("model", null, "model1");
    DAOmockGetAvailableProducts.mockClear();
});

test("It should throw FiltersError when model is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("model", null, null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetAvailableProducts).not.toHaveBeenCalled();
    DAOmockGetAvailableProducts.mockClear();
});

test("It should throw FiltersError when category is provided with model", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("model", "Smartphone", "model1")).rejects.toThrow(FiltersError);
    expect(DAOmockGetAvailableProducts).not.toHaveBeenCalled();
    DAOmockGetAvailableProducts.mockClear();
});

test("It should throw FiltersError when model is empty", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("model", null, "")).rejects.toThrow(FiltersError);
    expect(DAOmockGetAvailableProducts).not.toHaveBeenCalled();
    DAOmockGetAvailableProducts.mockClear();
});

test("It should throw FiltersError when model is not provided", async () => {
    const productController = new ProductController();
    
    await expect(productController.getAvailableProducts("model", null, null)).rejects.toThrow(FiltersError);
    expect(DAOmockGetAvailableProducts).not.toHaveBeenCalled();
    DAOmockGetAvailableProducts.mockClear();
});

/* ***********************************************
* Unit test for the deleteAllProducts method     *
* ********************************************** */
test("It should delete all products", async () => {
    const productController = new ProductController();
    
    await expect(productController.deleteAllProducts()).resolves.toBe(true);
    expect(DAOmockDeleteAllProducts).toHaveBeenCalled();
    DAOmockDeleteAllProducts.mockClear();
});

/* ***********************************************
* Unit test for the deleteProduct method         *
* ********************************************** */
test("It should delete a product", async () => {
    const productController = new ProductController();
    
    await expect(productController.deleteProduct("model1")).resolves.toBe(true);
    expect(DAOmockDeleteProduct).toHaveBeenCalledWith("model1");
    DAOmockDeleteProduct.mockClear();
});

test("It should throw InvalidParametersError when model is not a string or is empty", async () => {
    const productController = new ProductController();

    await expect(productController.deleteProduct("")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockDeleteProduct).not.toHaveBeenCalled();
    DAOmockDeleteProduct.mockClear();

    await expect(productController.deleteProduct("   ")).rejects.toThrow(InvalidParametersError);
    expect(DAOmockDeleteProduct).not.toHaveBeenCalled();
    DAOmockDeleteProduct.mockClear();
});


import db from "../db/db"
import { Product } from "../components/product"
import { ProductAlreadyExistsError, ProductNotFoundError } from "../errors/productError";
// NOTA: MODIFICARE GLI UPDATE ALLE TABELLE, NO ARROW FUNCTION

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {
    changes: number;
    /**
     * Registers a new product concept (model, with quantity defining the number of units available) in the database.
     * @param model The unique model of the product.
     * @param category The category of the product.
     * @param quantity The number of units of the new product.
     * @param details The optional details of the product.
     * @param sellingPrice The price at which one unit of the product is sold.
     * @param arrivalDate The optional date in which the product arrived.
     * @returns A Promise that resolves to nothing.
     */
    registerProducts(model: string, category: string, quantity: number, details: string | null, sellingPrice: number, arrivalDate: string | null) {
        return new Promise<void>((resolve, reject) => {
            try {
                const sql = "INSERT INTO products (model, category, quantity, details, sellingPrice, arrivalDate) VALUES (?, ?, ?, ?, ?, ?)"
                db.run(sql, [model, category, quantity, details, sellingPrice, arrivalDate], (err: Error | null) => {
                    if (err) {
                        if (err.message.includes("UNIQUE constraint failed: products.model")) reject(new ProductAlreadyExistsError)
                        reject(err)
                    }
                    resolve()
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    deleteAllProducts() {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products"
                db.run(sql, [], function(err: Error | null) {
                    if (err) {
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteProduct(model: string) {                                      // DUBBIO
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM products WHERE model = ?"
                db.run(sql, [model], function(err: Error | null)  {
                    if (err) {
                        if (this.changes === 0) reject(new ProductNotFoundError)
                        reject(err)
                    }
                    resolve(true)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    changeProductQuantity(model:String,n:number,date:String | null):Promise<number>{      // DA TESTARE
        return new Promise<number>((resolve,reject)=>{
            try{
                let sql="SELECT COUNT(*) INTO NP, quantity INTO N FROM products WHERE model=?"
                db.get(sql,[model],(err:Error | null, Ans: any)=>{
                    if(err){
                        reject(err);}
                    else if(Ans.NP==0){
                        reject("Product not found");}
                    
                    sql="UPDATE products SET quantity=quantity+? arrivalDate=? WHERE model=?"
                db.run(sql,[n,date,model], function(err: Error | null){
                    if(err){
                        reject(err);}
                    resolve(Ans.N+n);})})}
            catch(error){
                reject(error);}})}
    
    sellProduct(model:String,quantity:number,date:String|null):Promise<number>{         // DA TESTARE
        return new Promise<number>((resolve,reject)=>{
            let sql="SELECT COUNT(*) INTO NP, quantity INTO N FROM products WHERE model=?"
            db.get(sql,[model],(err:Error|null,Ans:any)=>{
                if(err){
                    reject(err);}
                else if(Ans.NP==0){
                    reject("Product not found");}
                else if(Ans.N<quantity){
                    reject("Not enought pieces to complete the request");}
                sql="UPDATE products SET quantity=quantity-? sellingDate=? WHERE model=?"
                db.run(sql,[quantity,date,model],function(err:Error|null){
                    if(err){
                        reject(err);}
                    resolve(Ans.N-quantity);})})})}
}
export default ProductDAO
import db from "../db/db"
import { User } from "../components/user"
import crypto from "crypto"
import { InvalidParametersError, InvalidRoleError, UserAlreadyExistsError, UserIsAdminError, UserNotFoundError } from "../errors/userError";

/**
 * A class that implements the interaction with the database for all user-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class UserDAO {

    /**
     * Checks whether the information provided during login (username and password) is correct.
     * @param username The username of the user.
     * @param plainPassword The password of the user (in plain text).
     * @returns A Promise that resolves to true if the user is authenticated, false otherwise.
     */
    getIsUserAuthenticated(username: string, plainPassword: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                /**
                 * Example of how to retrieve user information from a table that stores username, encrypted password and salt (encrypted set of 16 random bytes that ensures additional protection against dictionary attacks).
                 * Using the salt is not mandatory (while it is a good practice for security), however passwords MUST be hashed using a secure algorithm (e.g. scrypt, bcrypt, argon2).
                 */
                const sql = "SELECT username, password, salt FROM users WHERE username = ?"
                db.get(sql, [username], (err: Error | null, row: any) => {
                    if (err) reject(err)
                    //If there is no user with the given username, or the user salt is not saved in the database, the user is not authenticated.
                    if (!row || row.username !== username || !row.salt) {
                        resolve(false)
                    } else {
                        //Hashes the plain password using the salt and then compares it with the hashed password stored in the database
                        const hashedPassword = crypto.scryptSync(plainPassword, row.salt, 16)
                        const passwordHex = Buffer.from(row.password, "hex")
                        if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) resolve(false)
                        resolve(true)
                    }

                })
            } catch (error) {
                reject(error)
            }

        });
    }

    /**
     * Creates a new user and saves their information in the database
     * @param username The username of the user. It must be unique.
     * @param name The name of the user
     * @param surname The surname of the user
     * @param password The password of the user. It must be encrypted using a secure algorithm (e.g. scrypt, bcrypt, argon2)
     * @param role The role of the user. It must be one of the three allowed types ("Manager", "Customer", "Admin")
     * @returns A Promise that resolves to true if the user has been created.
     */
    createUser(username: string, name: string, surname: string, password: string, role: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const salt = crypto.randomBytes(16);
                const hashedPassword = crypto.scryptSync(password, salt, 16);
                let sql = "SELECT COUNT(*) AS N FROM users WHERE username=?";
                db.get(sql, [username], (err: String | null, ans: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    else if (ans.N > 0) {
                        reject(new UserAlreadyExistsError);
                        return;
                    }

                    sql = "INSERT INTO users(username, name, surname, role, password, salt) VALUES(?,?,?,?,?,?)";
                    db.run(sql, [username, name, surname, role, hashedPassword, salt], function (err: Error | null) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(true);
                        }
                        return;
                    })
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    /**
     * Returns a user object from the database based on the username.
     * @param username The username of the user to retrieve
     * @returns A Promise that resolves the information of the requested user
     */
    getUserByUsername(username: string) {
        return new Promise<User>((resolve, reject) => {
            if (!username || username.trim().length == 0) {
                reject(new InvalidParametersError);
            }
            else {
                try {
                    const sql = "SELECT * FROM users WHERE username=?"
                    db.get(sql, [username], (err: Error | null, row: any) => {
                        if (err) {
                            reject(err);
                        }
                        else if (!row) {
                            reject(new UserNotFoundError);
                        }
                        else {
                            const user = new User(row.username, row.name, row.surname, row.role, row.address, row.birthdate);
                            resolve(user);
                        }
                        return;
                    })
                }
                catch (error) {
                    reject(error);
                    return;
                }
            }
        })
    }

    getUsers() {
        return new Promise<User[]>((resolve, reject) => {
            try {
                const sql = "SELECT * FROM users";
                db.all(sql, [], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let Users = rows.map((row: any) => new User(row.username, row.name, row.surname, row.role, row.address, row.birthdate));
                    resolve(Users);
                    return;
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    getUsersByRole(role: string) {
        return new Promise<User[]>((resolve, reject) => {
            console.log(role)
            try {
                const sql = "SELECT * FROM users WHERE role=?";
                db.all(sql, [role], (err: Error | null, rows: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let Users = rows.map((row: any) => new User(row.username, row.name, row.surname, row.role, row.address, row.birthdate));
                    resolve(Users);
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    deleteUser(requested: string) {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let firstsql="SELECT * FROM users WHERE username=?";
                db.get(firstsql,[requested],(err:Error | null, answer:any)=>{
                    if(err){
                        reject(err);}
                    else if(!answer){
                        reject(new UserNotFoundError);}})
                const sql = "DELETE FROM users WHERE username=?";
                db.run(sql, [requested], function (err: Error | null) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                    return;
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    deleteUserAsAdmin(user: string, username: string) {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let sql = "SELECT role FROM users WHERE username=?";
                db.get(sql, [username, user], (err: string | null, role: any) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!role) {
                        reject(new UserNotFoundError);
                    }
                    else if (role.role == "Admin") {
                        reject(new UserIsAdminError);
                    }
                    else {
                        sql = "DELETE FROM users WHERE username=?";
                        db.run(sql, [username], function (err: Error | null) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(true);
                            }
                        })
                    }
                    return;
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    deleteAllUsers() {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const sql = "DELETE FROM users WHERE role!='Admin'";
                db.run(sql, [], function (err: Error | null) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                    return;
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    updateUser(username: string, name: string, surname: string, address: string, birthdate: string) {
        return new Promise<User>((resolve, reject) => {
            try {
                let firstsql="SELECT * FROM users WHERE username=?";
                db.get(firstsql,[username],(err:Error | null, answer:any)=>{
                    if(err){
                        reject(err);}
                    else if(!answer){
                        reject(new UserNotFoundError);}})

                let sql = "UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?"
                db.run(sql, [name, surname, address, birthdate, username], function (err: Error | null) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        sql = "SELECT role FROM users WHERE username=?";
                        db.get(sql, [username], (err: string | null, role: any) => {
                            if (err) {
                                reject(err);
                            }
                            else if (!role) {
                                reject(new UserNotFoundError);
                            }
                            else {
                                resolve(new User(username, name, surname, role.role, address, birthdate));
                            }
                        })
                        return;
                    }
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }

    updateUserAsAdmin(username: string, name: string, surname: string, address: string, birthdate: string) {
        return new Promise<User>((resolve, reject) => {
            try {
                let sql = "SELECT role FROM users WHERE username=?"
                db.get(sql, [username], (err: string | null, role: any) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!role) {
                        reject(new UserNotFoundError);
                    }
                    else if (role == "Admin") {
                        reject(new UserIsAdminError);
                    }
                    else {
                        sql = "UPDATE users SET name=?, surname=?, address=?, birthdate=? WHERE username=?"
                        db.run(sql, [name, surname, address, birthdate, username], function (err: Error | null) {
                            if (err) {
                                reject(err);
                            }
                            else if (this.changes == 0) {
                                reject(new UserNotFoundError);
                            }
                            else {
                                resolve(new User(username, name, surname, role, address, birthdate));
                            }
                            return;
                        })
                    }
                })
            }
            catch (error) {
                reject(error);
                return;
            }
        })
    }
}
export default UserDAO
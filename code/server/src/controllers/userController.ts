import { UnauthorizedUserError, InvalidParametersError, InvalidRoleError } from "../errors/userError";
import { User } from "../components/user"
import UserDAO from "../dao/userDAO"
import dayjs from "dayjs";
import { ArrivalDateError } from "../errors/productError";

/**
 * Represents a controller for managing users.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class UserController {
    private dao: UserDAO

    constructor() {
        this.dao = new UserDAO
    }

    /**
     * Creates a new user.
     * @param username - The username of the new user. It must not be null and it must not be already taken.
     * @param name - The name of the new user. It must not be null.
     * @param surname - The surname of the new user. It must not be null.
     * @param password - The password of the new user. It must not be null.
     * @param role - The role of the new user. It must not be null and it can only be one of the three allowed types ("Manager", "Customer", "Admin")
     * @returns A Promise that resolves to true if the user has been created.
     */
    async createUser(username: string, name: string, surname: string, password: string, role: string) /**:Promise<Boolean> */ {
        if (!username || !name || !surname || !password || !role) {
            throw new InvalidParametersError;
        }
        else if (username.trim().length == 0 || name.trim().length == 0 || surname.trim().length == 0 || password.trim().length == 0) {
            throw new InvalidParametersError;
        }
        else if (["Manager", "Customer", "Admin"].includes(role.trim()) == false) {
            throw new InvalidRoleError(role);
        }   // Errors
        return this.dao.createUser(username.trim(), name.trim(), surname.trim(), password.trim(), role.trim());
    }

    /**
     * Returns all users.
     * @returns A Promise that resolves to an array of users.
     */
    async getUsers() /**:Promise<User[]> */ { return this.dao.getUsers(); }

    /**
     * Returns all users with a specific role.
     * @param role - The role of the users to retrieve. It can only be one of the three allowed types ("Manager", "Customer", "Admin")
     * @returns A Promise that resolves to an array of users with the specified role.
     */
    async getUsersByRole(role: string) /**:Promise<User[]> */ {
        if (!role || ["Manager", "Customer", "Admin"].includes(role.trim()) == false) {
            throw new InvalidRoleError(role);
        }
        return this.dao.getUsersByRole(role.trim());
    }

    /**
     * Returns a specific user.
     * The function has different behavior depending on the role of the user calling it:
     * - Admins can retrieve any user
     * - Other roles can only retrieve their own information
     * @param username - The username of the user to retrieve. The user must exist.
     * @returns A Promise that resolves to the user with the specified username.
     */
    async getUserByUsername(user: User, username: string) /**:Promise<User> */ {
        if (!user || !user.role || !user.username || user.username.trim().length == 0 || !username || username.trim().length == 0) {
            throw new InvalidParametersError;
        }
        else if (["Manager", "Customer", "Admin"].includes(user.role) == false) {
            throw new InvalidRoleError(user.role);
        }
        else if (user.role.trim() == "Admin" || user.username.trim() == username.trim()) {
            return this.dao.getUserByUsername(username.trim());
        }
        throw new UnauthorizedUserError;
    }

    /**
     * Deletes a specific user
     * The function has different behavior depending on the role of the user calling it:
     * - Admins can delete any non-Admin user
     * - Other roles can only delete their own account
     * @param username - The username of the user to delete. The user must exist.
     * @returns A Promise that resolves to true if the user has been deleted.
     */
    async deleteUser(user: User, username: string) /**:Promise<Boolean> */ {
        if (!user || !user.role || !user.username || user.username.trim().length == 0 || !username || username.trim().length == 0) {
            throw new InvalidParametersError;
        }
        else if (["Manager", "Customer", "Admin"].includes(user.role) == false) {
            throw new InvalidRoleError(user.role);
        }
        else if (user.username.trim() == username.trim()) {
            return this.dao.deleteUser(username.trim());
        }
        else if (user.role.trim() == "Admin") {
            return this.dao.deleteUserAsAdmin(user.username.trim(), username.trim());
        }
        throw new UnauthorizedUserError;
    }

    /**
     * Deletes all non-Admin users
     * @returns A Promise that resolves to true if all non-Admin users have been deleted.
     */
    async deleteAll() /**:Promise<Boolean> */ { return this.dao.deleteAllUsers(); }

    /**
     * Updates the personal information of one user. The user can only update their own information.
     * @param user The user who wants to update their information
     * @param name The new name of the user
     * @param surname The new surname of the user
     * @param address The new address of the user
     * @param birthdate The new birthdate of the user
     * @param username The username of the user to update. It must be equal to the username of the user parameter.
     * @returns A Promise that resolves to the updated user
     */
    async updateUserInfo(user: User, name: string, surname: string, address: string, birthdate: string, username: string) /**:Promise<User> */ {
        if (!user || !user.username || !user.role || !username || !name || !surname || !address || !birthdate) {
            throw new InvalidParametersError;
        }
        else if (user.username.trim().length == 0 || name.trim().length == 0 || surname.trim().length == 0 || address.trim().length == 0 ||
            birthdate.trim().length == 0 || username.trim().length == 0) {
            throw new InvalidParametersError;
        }
        else if (dayjs(birthdate.trim(), "YYYY-MM-DD").isValid() == false || dayjs(birthdate.trim()).isAfter(dayjs())) {
            throw new ArrivalDateError;
        }
        else if (["Manager", "Customer", "Admin"].includes(user.role.trim()) == false) {
            throw new InvalidRoleError(user.role);
        }
        else if (user.username.trim() == username.trim()) {
            return this.dao.updateUser(username.trim(), name.trim(), surname.trim(), address.trim(), birthdate.trim());
        }
        else if (user.role.trim() == "Admin") {
            return this.dao.updateUserAsAdmin(username.trim(), name.trim(), surname.trim(), address.trim(), birthdate.trim());
        }
        throw new UnauthorizedUserError;
    }
}

export default UserController
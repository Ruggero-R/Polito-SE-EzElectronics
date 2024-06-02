import UserController from "../../src/controllers/userController";
import { expect, afterEach, beforeEach, describe, test, afterAll } from '@jest/globals';
import db from '../../src/db/db';
import {
    InvalidParametersError,
    UserAlreadyExistsError,
    UserIsAdminError,
    UserNotFoundError,
    UserNotManagerError,
    UserNotCustomerError,
    UserNotAdminError,
    UnauthorizedUserError,
    InvalidRoleError
} from '../../src/errors/userError';
import { Role, User } from '../../src/components/user';

describe('User Controller Integration Tests', () => {
    let controller: UserController;

    afterEach((done) => {
        controller = new UserController();
        db.serialize(() => {
            db.run('DELETE FROM users', (err) => {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

    beforeEach((done) => {
        controller = new UserController();
        db.serialize(() => {
            db.run('DELETE FROM users', (err) => {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });
    });

    const u1 = new User("username1", "Name1", "Surname1", Role.CUSTOMER, "Address1", "2001-01-01");
    const u01 = new User("username01", "Name01", "Surname01", Role.CUSTOMER, "", "");
    const u2 = new User("username2", "Name2", "Surname2", Role.MANAGER, "Address2", "2001-01-01");
    const u3 = new User("username3", "Name3", "Surname3", Role.ADMIN, "Address3", "2001-01-01");

    test('createUser should create a user in the database', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await controller.createUser(u01.username, u01.name, u01.surname, "password", u01.role);

        const users = await controller.getUsers();
        expect(users).toEqual(expect.arrayContaining([
            expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role }),
            expect.objectContaining({ username: u01.username, name: u01.name, surname: u01.surname, role: u01.role })
        ]));
    });

    test('createUser should throw an error if the username is already taken', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await expect(controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role)).rejects.toThrow(UserAlreadyExistsError);
    });

    test('getUsers should retrieve all users', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await controller.createUser(u2.username, u2.name, u2.surname, "password", u2.role);

        const users = await controller.getUsers();
        expect(users).toEqual(expect.arrayContaining([
            expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role }),
            expect.objectContaining({ username: u2.username, name: u2.name, surname: u2.surname, role: u2.role })
        ]));
    });

    test('getUsersByRole should retrieve all users with a specific role', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await controller.createUser(u2.username, u2.name, u2.surname, "password", u2.role);
        await controller.createUser(u3.username, u3.name, u3.surname, "password", u3.role);

        const users = await controller.getUsersByRole(Role.CUSTOMER);
        expect(users).toEqual(expect.arrayContaining([
            expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role })
        ]));
    });

    test('getUsersByRole should throw an error if the role is not valid', async () => {
        await expect(controller.getUsersByRole("InvalidRole")).rejects.toThrow(InvalidRoleError);
    });

    test('getUserByUsername should retrieve a specific user', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        const user = await controller.getUserByUsername(u1, u1.username);
        expect(user).toEqual(expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role }));
    });

    test('getUserByUsername should throw InvalidParametersError if parameters are invalid', async () => {
        await expect(controller.getUserByUsername(u1, "")).rejects.toThrow(InvalidParametersError);
    });

    test('getUserByUsername should throw UnauthorizedUserError if user is not authorized', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await expect(controller.getUserByUsername(u2, u1.username)).rejects.toThrow(UnauthorizedUserError);
    });

    test('deleteUser should delete a specific user', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await controller.deleteUser(u1, u1.username);
        const users = await controller.getUsers();
        expect(users).toEqual(expect.not.arrayContaining([
            expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role })
        ]));
    });

    test('deleteUser should throw InvalidParametersError if parameters are invalid', async () => {
        await expect(controller.deleteUser(u1, "")).rejects.toThrow(InvalidParametersError);
    });

    test('deleteUser should throw UnauthorizedUserError if user is not authorized', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await expect(controller.deleteUser(u2, u1.username)).rejects.toThrow(UnauthorizedUserError);
    });

    test('deleteAllUsers should delete all non-Admin users', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await controller.createUser(u3.username, u3.name, u3.surname, "password", u3.role);
        await controller.deleteAllUsers();
        const users = await controller.getUsers();
        expect(users).toEqual(expect.arrayContaining([
            expect.objectContaining({ username: u3.username, name: u3.name, surname: u3.surname, role: u3.role })
        ]));
        expect(users).toEqual(expect.not.arrayContaining([
            expect.objectContaining({ username: u1.username, name: u1.name, surname: u1.surname, role: u1.role })
        ]));
    });

    test('updateUserInfo should update the information of a specific user', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        const updatedName = "UpdatedName";
        const updatedSurname = "UpdatedSurname";
        const updatedAddress = "UpdatedAddress";
        const updatedBirthdate = "2000-01-01";

        await controller.updateUserInfo(u1, updatedName, updatedSurname, updatedAddress, updatedBirthdate, u1.username);
        const user = await controller.getUserByUsername(u1, u1.username);
        expect(user).toEqual(expect.objectContaining({ username: u1.username, name: updatedName, surname: updatedSurname, address: updatedAddress, birthdate: updatedBirthdate }));
    });

    test('updateUserInfo should throw InvalidParametersError if parameters are missing or empty', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await expect(controller.updateUserInfo(u1, "", u1.surname, u1.address, u1.birthdate, u1.username)).rejects.toThrow(InvalidParametersError);
        await expect(controller.updateUserInfo(u1, u1.name, "", u1.address, u1.birthdate, u1.username)).rejects.toThrow(InvalidParametersError);
        await expect(controller.updateUserInfo(u1, u1.name, u1.surname, "", u1.birthdate, u1.username)).rejects.toThrow(InvalidParametersError);
        await expect(controller.updateUserInfo(u1, u1.name, u1.surname, u1.address, "", u1.username)).rejects.toThrow(InvalidParametersError);
    });

    test('updateUserInfo should throw UnauthorizedUserError if user is not authorized', async () => {
        await controller.createUser(u1.username, u1.name, u1.surname, "password", u1.role);
        await expect(controller.updateUserInfo(u2, "Name", "Surname", "Address", "2000-01-01", u1.username)).rejects.toThrow(UnauthorizedUserError);
    });
});

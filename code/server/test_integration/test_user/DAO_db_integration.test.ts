import UserDAO from "../../src/dao/userDAO";
import { expect, afterEach, describe, test, afterAll } from '@jest/globals';
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

describe('UserDAO integration tests', () => {
    let dao: UserDAO;

    afterEach((done) => {
        dao = new UserDAO();
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
    const u2 = new User("username2", "Name2", "Surname2", Role.MANAGER, "Address2", "2001-01-01");
    const u3 = new User("username3", "Name3", "Surname3", Role.ADMIN, "Address3", "2001-01-01");

    /* ****************************************** *
     * Integration test for the createUser method *    
     * ****************************************** */
    test('createUser should insert a user customer into the database', async () => {
        const username = u1.username;
        const name = u1.name;
        const surname = u1.surname;
        const address = u1.address;
        const birthdate = u1.birthdate;

        await dao.createUser(username, name, surname, address, birthdate);

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            const UserRow = row as {
                username: string,
                name: string,
                surname: string,
                role: Role,
                address: string,
                birthdate: string
            };

            expect(UserRow.username).toBe(username);
            expect(UserRow.name).toBe(name);
            expect(UserRow.surname).toBe(surname);
            expect(UserRow.role).toBe(Role.CUSTOMER);
            expect(UserRow.address).toBe(address);
            expect(UserRow.birthdate).toBe(birthdate);
        });
    });


});

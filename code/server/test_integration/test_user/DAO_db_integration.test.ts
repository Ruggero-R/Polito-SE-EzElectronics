import UserDAO from "../../src/dao/userDAO";
import { expect, beforeEach, describe, test, beforeAll } from "@jest/globals";
import db from "../../src/db/db";
import { cleanup } from "../../src/db/cleanup";
import {
  InvalidParametersError,
  UserAlreadyExistsError,
  UserIsAdminError,
  UserNotFoundError,
  UserNotManagerError,
  UserNotCustomerError,
  UserNotAdminError,
  UnauthorizedUserError,
  InvalidRoleError,
} from "../../src/errors/userError";
import { Role, User } from "../../src/components/user";

describe("UserDAO integration tests", () => {
  let dao: UserDAO;

  beforeEach((done) => {
    dao = new UserDAO();
    db.run("DELETE FROM users", (err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });
  
    beforeAll(() => {
        cleanup();
    });

  const u1 = new User(
    "username1",
    "Name1",
    "Surname1",
    Role.CUSTOMER,
    "Address1",
    "2001-01-01"
  );
  const u2 = new User(
    "username2",
    "Name2",
    "Surname2",
    Role.MANAGER,
    "Address2",
    "2001-01-01"
  );
  const u3 = new User(
    "username3",
    "Name3",
    "Surname3",
    Role.ADMIN,
    "Address3",
    "2001-01-01"
  );

  /* ****************************************** *
   * Integration test for the createUser method *
   * ****************************************** */
  test("createUser should insert a user customer into the database", async () => {
    const username = u1.username;
    const name = u1.name;
    const surname = u1.surname;
    const password = "password";
    const role = u1.role;
    const address = u1.address;
    const birthdate = u1.birthdate;

    await expect(
      dao.createUser(username, name, surname, password, role)
    ).resolves.toBe(true);

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      const UserRow = row as {
        username: string;
        name: string;
        surname: string;
        role: Role;
        address: string;
        birthdate: string;
      };

      expect(UserRow.username).toBe(username);
      expect(UserRow.name).toBe(name);
      expect(UserRow.surname).toBe(surname);
      expect(UserRow.role).toBe(role);
      expect(UserRow.address).toBe(null);
      expect(UserRow.birthdate).toBe(null);
    });
  });

  test("createUser should throw UserAlreadyExistsError for duplicate username", async () => {
    const username = u1.username;
    const name = u1.name;
    const surname = u1.surname;
    const password = "password";
    const role = u1.role;

    await dao.createUser(username, name, surname, password, role);
    await expect(
      dao.createUser(username, name, surname, password, role)
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  /* ****************************************************** *
   * Integration test for the getIsUserAuthenticated method *
   * ****************************************************** */
  test("getIsUserAuthenticated should return true for correct credentials", async () => {
    const username = u1.username;
    const name = u1.name;
    const surname = u1.surname;
    const password = "password";
    const role = u1.role;

    await dao.createUser(username, name, surname, password, role);
    await expect(dao.getIsUserAuthenticated(username, password)).resolves.toBe(
      true
    );
  });

  test("getIsUserAuthenticated should return false for incorrect password", async () => {
    const username = u1.username;
    const name = u1.name;
    const surname = u1.surname;
    const password = "password";
    const wrongPassword = "wrongpassword";
    const role = u1.role;

    await dao.createUser(username, name, surname, password, role);
    await expect(
      dao.getIsUserAuthenticated(username, wrongPassword)
    ).resolves.toBe(false);
  });

  /* ************************************************* *
   * Integration test for the getUserByUsername method *
   * ************************************************* */
  test("getUserByUsername should retrieve a user from the database", async () => {
    const username = u1.username;
    const name = u1.name;
    const surname = u1.surname;
    const password = "password";
    const role = u1.role;

    await dao.createUser(username, name, surname, password, role);
    const user = await dao.getUserByUsername(username);
    expect(user.username).toBe(username);
    expect(user.name).toBe(name);
    expect(user.surname).toBe(surname);
    expect(user.role).toBe(role);
  });

  test("getUserByUsername should throw UserNotFoundError for non-existing user", async () => {
    await expect(dao.getUserByUsername("nonexisting")).rejects.toThrow(
      UserNotFoundError
    );
  });

  /* ****************************************** *
   * Integration test for the getUsers method *
   * ****************************************** */
  test("getUsers should retrieve all users from the database", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);
    await dao.createUser(u2.username, u2.name, u2.surname, password, u2.role);
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role);

    const users = await dao.getUsers();
    expect(users.length).toBe(3);
  });

  /* ********************************************** *
   * Integration test for the getUsersByRole method *
   * ********************************************** */
  test("getUsersByRole should retrieve all users with a specific role from the database", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);
    await dao.createUser(u2.username, u2.name, u2.surname, password, u2.role);
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role);

    const customers = await dao.getUsersByRole(Role.CUSTOMER);
    expect(customers.length).toBe(1);
    expect(customers[0].username).toBe(u1.username);
  });

  /* ******************************************* *
   * Integration test for the deleteUser method *
   * ******************************************* */
  test("deleteUser should remove a user from the database", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);
    await expect(dao.deleteUser(u1.username)).resolves.toBe(true);
    await expect(dao.getUserByUsername(u1.username)).rejects.toThrow(
      UserNotFoundError
    );
  });

  test("deleteUser should throw UserNotFoundError for non-existing user", async () => {
    await expect(dao.deleteUser("nonexisting")).rejects.toThrow(
      UserNotFoundError
    );
  });

  /* *********************************************** *
   * Integration test for the deleteUserAsAdmin method *
   * *********************************************** */
  test("deleteUserAsAdmin should remove a user from the database as an admin", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role);
    await expect(dao.deleteUserAsAdmin(u3.username, u1.username)).resolves.toBe(
      true
    );
    await expect(dao.getUserByUsername(u1.username)).rejects.toThrow(
      UserNotFoundError
    );
  });

  test("deleteUserAsAdmin should throw UserIsAdminError if trying to delete an admin", async () => {
    const password = "password";
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role);
    await expect(
      dao.deleteUserAsAdmin(u3.username, u3.username)
    ).rejects.toThrow(UserIsAdminError);
  });

  /* ****************************************** *
   * Integration test for the updateUser method *
   * ****************************************** */
  test("updateUser should update user details in the database", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);

    const newName = "NewName";
    const newSurname = "NewSurname";
    const newAddress = "NewAddress";
    const newBirthdate = "1990-01-01";

    const updatedUser = await dao.updateUser(
      u1.username,
      newName,
      newSurname,
      newAddress,
      newBirthdate
    );
    expect(updatedUser.name).toBe(newName);
    expect(updatedUser.surname).toBe(newSurname);
    expect(updatedUser.address).toBe(newAddress);
    expect(updatedUser.birthdate).toBe(newBirthdate);
  });

  test("updateUser should throw UserNotFoundError for non-existing user", async () => {
    const newName = "NewName";
    const newSurname = "NewSurname";
    const newAddress = "NewAddress";
    const newBirthdate = "1990-01-01";

    await expect(
      dao.updateUser(
        "nonexisting",
        newName,
        newSurname,
        newAddress,
        newBirthdate
      )
    ).rejects.toThrow(UserNotFoundError);
  });

  /* *************************************************** *
   * Integration test for the updateUserAsAdmin method *
   * *************************************************** */
  test("updateUserAsAdmin should update user details as an admin", async () => {
    const password = "password";
    await dao.createUser(u1.username, u1.name, u1.surname, password, u1.role);
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role);

    const newName = "NewName";
    const newSurname = "NewSurname";
    const newAddress = "NewAddress";
    const newBirthdate = "1990-01-01";

    const updatedUser = await dao.updateUserAsAdmin(
      u1.username,
      newName,
      newSurname,
      newAddress,
      newBirthdate
    );
    expect(updatedUser.name).toBe(newName);
    expect(updatedUser.surname).toBe(newSurname);
    expect(updatedUser.address).toBe(newAddress);
    expect(updatedUser.birthdate).toBe(newBirthdate);
  });

  test("updateUserAsAdmin should throw UserIsAdminError if trying to update an admin", async () => {
    const password = "password";
    await dao.createUser(u3.username, u3.name, u3.surname, password, u3.role); // Create admin user

    const newName = "NewName";
    const newSurname = "NewSurname";
    const newAddress = "NewAddress";
    const newBirthdate = "1990-01-01";

    await expect(
      dao.updateUserAsAdmin(
        u3.username,
        newName,
        newSurname,
        newAddress,
        newBirthdate
      )
    ).rejects.toThrow(UserIsAdminError);
  });

  /* afterAll((done) => {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            done();
        });
    });
    */
});

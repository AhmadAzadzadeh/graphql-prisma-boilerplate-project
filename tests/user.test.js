import "cross-fetch/polyfill";
import { gql } from "apollo-boost";

import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, login, getUsers, getProfile } from "./utils/operation";

const client = getClient();

beforeEach(seedDatabase);

test("Should create new user", async () => {
    const variables = {
        data: {
            name: "Ali",
            email: "ali@test.com",
            password: "somethinglikepass"
        }
    };

    const response = await client.mutate({
        mutation: createUser,
        variables
    });
    const { data: { createUser: { user: { id } } } } = response;
    const exists = await prisma.exists.User({ id });
    expect(exists).toBe(true);
});

test("Should expose public author profiles ", async () => {
    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("admin");
});

test("Should not login with bad credentials", async () => {
    const variables = {
        data: {
            email: "reza@test.com",
            password: "reza123456789"
        }
    };
    await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test("Should not signup with short password", async () => {
    const variables = {
        data: {
            name: "new user",
            email: "newuser@example.com",
            password: "newuserpass1234567"
        }
    };
    await expect(client.mutate({mutation: createUser, variables})).rejects.toThrow();
});

test("Should fetch user profile", async () => {
    const client = getClient(userOne.jwt);
    const {data} = await client.query({query: getProfile});

    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});
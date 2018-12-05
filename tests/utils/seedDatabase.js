import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../../src/prisma";

const userOne = {
    input: {
        name: "admin",
        email: "admin@test.com",
        password: bcrypt.hashSync("adminpass1234")
    },
    user: undefined,
    jwt: undefined
};

const userTwo = {
    input: {
        name: "userTwo",
        email: "userTwo@test.com",
        password: bcrypt.hashSync("seconduserpass")
    },
    user: undefined,
    jwt: undefined
};


const seedDatabase = async () => {
    await prisma.mutation.deleteManyUsers();
    userOne.user = await prisma.mutation.createUser({ data: userOne.input });
    userOne.jwt = jwt.sign({userId: userOne.user.id}, "thisisasecret");
    userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, "thisisasecret");
}

export { seedDatabase as default, userOne, userTwo};
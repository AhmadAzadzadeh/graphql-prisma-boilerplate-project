// we are going to connect our node.js application to prisma.
import { Prisma } from "prisma-binding";

import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "endpoint",
    secret: "thisismysupersecrettext",
    fragmentReplacements
});

export { prisma as default };

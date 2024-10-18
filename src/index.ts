import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import prismaClient from "./db/connectDB";

const startServer = async () => {
  const app = express();
  app.use(express.json());
  const graphqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        sayMyName(name: String): String
      }
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hello, Graphql is called`,
        sayMyName: (_, { name }: { name: string }) => `Hey ${name}, whats up?`,
      },
      Mutation: {
        createUser: async (
          _: any,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          },
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "Random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  await graphqlServer.start();

  app.get("/", (_, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(graphqlServer));

  app.listen(6969, () => {
    console.log(`Server is running at PORT: 6969..`);
  });
};

startServer();

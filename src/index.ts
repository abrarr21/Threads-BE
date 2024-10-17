import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

const startServer = async () => {
  const app = express();
  app.use(express.json());
  const graphqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        sayMyName(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hello, Graphql is called`,
        sayMyName: (_, { name }: { name: string }) => `Hey ${name}, whats up?`,
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

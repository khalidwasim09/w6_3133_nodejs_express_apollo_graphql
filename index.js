import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import movieSchema from "./schemas/schema.js";
import movieResolvers from "./resolvers/resolvers.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();

// Local MongoDB
const DB_CONNECTION = "mongodb://127.0.0.1:27017/lab6_movies";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected
  await mongoose.connect(DB_CONNECTION);
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs: movieSchema,
    resolvers: movieResolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, async () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

    try {
      await connectDB();
      console.log("Connected to MongoDB (local)");
    } catch (error) {
      console.log(`Unable to connect to DB: ${error.message}`);
    }
  });
}

startServer();
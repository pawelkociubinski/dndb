import http from "node:http";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLSchema } from "graphql";

interface IConfig {
  schema: GraphQLSchema;
}

export class Server {
  private app = express();
  private httpServer = http.createServer(this.app);
  private apolloServer: ApolloServer;

  constructor(private config: IConfig) {
    this.apolloServer = this.createApolloServer();
  }

  async listen({ port }: { port: number }, onInit: () => void) {
    await this.apolloServer.start();
    this.createExpressApp(this.apolloServer);
    this.httpServer.listen({ port }, async () => {
      onInit();
      console.log(`🚀 http://localhost:${port}/graphql 🚀 `);
    });
  }

  private createApolloServer() {
    return new ApolloServer({
      schema: this.config.schema,

      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
  }

  private createExpressApp(server: ApolloServer) {
    this.app.use(
      cors<cors.CorsRequest>({
        origin: "*",
      })
    );
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use("/graphql", expressMiddleware(server));

    return this.app;
  }
}

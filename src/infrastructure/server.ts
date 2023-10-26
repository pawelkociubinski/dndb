import http from "node:http";
import bodyParser from "body-parser";
import express from "express";
import socketIO from "socket.io";
import cors from "cors";

export class Server {
  private static instance: Server;
  app: express.Express;
  httpServer: http.Server;
  io: socketIO.Server;

  private constructor() {
    this.app = this.createExpressApp();
    this.httpServer = this.createHttpServer(this.app);
    this.io = this.CreateSocketServer(this.httpServer);
  }

  private createExpressApp() {
    const app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    return app;
  }

  private createHttpServer(app: express.Express) {
    return http.createServer(app);
  }

  private CreateSocketServer(httpServer: http.Server) {
    return new socketIO.Server(httpServer);
  }

  static getInstance() {
    if (!Server.instance) {
      Server.instance = new Server();
    }

    return Server.instance;
  }
}

import { config } from "./infrastructure/config.js";
import { Server } from "./infrastructure/server.js";

const { io, httpServer } = Server.getInstance();

httpServer.listen({ port: config.PORT }, () => {
  console.log(`Server listening on port ${config.PORT}`);
});

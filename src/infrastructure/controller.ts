import { Server } from "socket.io";

export class SocketController {
  constructor(private io: Server) {}
}

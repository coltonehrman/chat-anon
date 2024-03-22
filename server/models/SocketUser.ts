import { randomUUID } from "crypto";
import User from "../../common/models/User";

/** {@link User} for socket.io */
class SocketUser extends User {
  socketId: string;
  constructor(id: string, createdAt: number, socketId: string) {
    super(id, createdAt);
    this.socketId = socketId;
  }

  static createRandomWithSocket(socketId: string): SocketUser {
    return new SocketUser(randomUUID(), Date.now(), socketId);
  }
}
export default SocketUser;

import SocketUser from "../models/SocketUser";
import UserConnection from "../models/UserConnection";

/** Control connections between {@link User}s */
class UserConnector {
  /** Currently active users
   * - key is {@link User.id} (Used for O(1) access speed)
   * - value is {@link User} */
  users: { [id: string]: UserConnection } = {};

  existsById(id: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.users, id);
  }
  exists(user: SocketUser): boolean {
    return this.existsById(user.id);
  }

  getById(id: string): UserConnection | null {
    if (this.existsById(id)) return this.users[id];
    return null;
  }

  /** Find any {@link User} waiting to connect
   * @param selfId if provided, the {@link User} with this id will be skipped (Use to skip self)
   * @returns waiting {@link User} or null if none are waiting */
  getWaitingUser(selfId: string | null = null): SocketUser | null {
    const foundUserConnection = Object.values(this.users).find(
      (userConnection) => {
        //? Skip if ignored this id
        if (userConnection.user.id == selfId) return false;
        //? Check if can connect
        return !userConnection.isConnected;
      }
    );
    return foundUserConnection?.user || null;
  }

  removeUserById(id: string): boolean {
    if (this.existsById(id)) return false;
    const userConection = this.users[id];
    if (userConection.isConnected) userConection.disconnect();
    delete this.users[id];
    return true;
  }
  removeUser(user: SocketUser): boolean {
    return this.removeUserById(user.id);
  }

  addUser(user: SocketUser): boolean {
    if (this.exists(user)) return false;
    this.users[user.id] = new UserConnection(user, null);
    return true;
  }

  /** Connect the provided {@link user} to the id of another user
   * @param user
   * @param otherId
   * @returns true if found both users and connected */
  connectUsers(user: SocketUser, userOther: SocketUser): boolean {
    if (user.id == userOther.id) return false;
    const userConnection = this.getById(user.id);
    const userConnectionOther = this.getById(userOther.id);

    if (
      !userConnection ||
      !userConnectionOther ||
      userConnection?.isConnected ||
      userConnectionOther?.isConnected
    ) {
      //? didnt find the 1st or 2nd user
      //? 1st or 2nd user is already connected
      return false;
    }

    userConnection.connectTo(userOther.id);
    userConnectionOther.connectTo(user.id);

    return true;
  }
  /** Disconnect the provided {@link user} from {@link userOther}
   * @returns true if found both users and disconnected */
  disconnectUsers(user: SocketUser, userOther: SocketUser): boolean {
    if (user.id == userOther.id) return false;
    const userConnection = this.getById(user.id);
    const userConnectionOther = this.getById(userOther.id);

    if (!userConnection || !userConnectionOther) return false;

    return userConnection.disconnect() && userConnectionOther.disconnect();
  }
  /**
   * Connect the provided {@link user} to any {@link User} waiting to connect
   * @returns The other {@link User} or null if none are waiting
   */
  connectToWaitingUser(user: SocketUser): SocketUser | null {
    const userOther = this.getWaitingUser(user.id);
    if (!userOther) return null;
    const connected = this.connectUsers(user, userOther);
    if (!connected) return null;
    return userOther;
  }
}

export default UserConnector;

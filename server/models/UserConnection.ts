import SocketUser from "./SocketUser";

/** Connection info between 2 {@link User}s
 * - ⚠️ Note: This is only informational. It does NOT manage the actual connection.
 * @see {@link UserConnector}
 * @see {@link SocketUser}
 */
class UserConnection {
  user: SocketUser;
  connectedTo: string | null;
  constructor(user: SocketUser, connectedTo: string | null = null) {
    this.user = user;
    this.connectedTo = connectedTo;
  }

  public get isConnected(): boolean {
    return !!this.connectedTo;
  }

  disconnect(): boolean {
    if (!this.isConnected) return false;
    this.connectedTo = null;
    return true;
  }

  connectTo(other: string): boolean {
    if (this.connectedTo) return false;
    this.connectedTo = other;
    return true;
  }
}
export default UserConnection;

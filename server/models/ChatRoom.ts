import { Server as IOServer } from "socket.io";
import User from "./User";
import { randomUUID } from "crypto";
import IOEvents from "../socket.io/IOEvents";
import assert from "assert";

class ChatRoom {
  private ioServer: IOServer;

  private _id: string;
  /** Unique ID (used in {@link IOServer.to} room events) */
  public get id(): string {
    return this._id;
  }

  private _userCap: number;
  /** Max number of {@link User}s in {@link _users} map */
  public get userCap(): number {
    return this._userCap;
  }

  /** {@link User}s in this {@link ChatRoom}
   * - key is {@link User.id} for O(1) access speed */
  private _users: Map<string, User>;

  constructor(ioServer: IOServer, userCap: number = 2, user: User) {
    assert(userCap > 1, "userCap must be >1");
    this.ioServer = ioServer;
    this._id = `ChatRoom_${randomUUID()}`;
    this._userCap = userCap;
    this._users = new Map();
    this.addUser(user);

    //? I think this event is useless for now unless u wanna use it in client in some fancy way
    //? So it is here just in case you want to use it
    // this.ioServer.emit(IOEvents.createdRoom, { roomId: this.id });
  }

  public get isFull(): boolean {
    return this._users.size === this._userCap;
  }

  get usersIds(): string[] {
    return Array.from(this._users.keys());
  }

  hasUserById(userId: string): boolean {
    return this._users.has(userId);
  }
  hasUser(user: User): boolean {
    return this.hasUserById(user.id);
  }
  getUserById(userId: string): User | undefined {
    return this._users.get(userId);
  }

  private addRemoveInfo(userId: string) {
    return {
      userCap: this.userCap,
      userIds: this.usersIds, //? all users in this room
      userId, //? user affected
    };
  }
  /** Add a {@link User} to this {@link ChatRoom}
   * - This will emit {@link IOEvents.joinedRoom} (socket.io event) in this room
   * @returns true if added */
  addUser(user: User): boolean {
    if (this.isFull) return false;
    if (this.hasUserById(user.id)) return false;

    user.joinChatRoom(this.id);
    this._users.set(user.id, user);

    this.ioServer
      .to(this.id) //? only in this room
      .emit(IOEvents.joinedRoom, this.addRemoveInfo(user.id));
    return true;
  }

  /** Remove the {@link user} from this {@link ChatRoom}
   * - This will emit {@link IOEvents.leftRoom} (socket.io event) in this room
   * @returns true if the user is in this room and was removed */
  removeUser(user: User): boolean {
    if (!user.isInChatRoom(this.id)) return false;
    if (!this.hasUser(user)) return false;
    //? Leave this room first
    user.socket.leave(this.id);
    this._users.delete(user.id);

    this.ioServer
      .to(this.id) //? only in this room
      .emit(IOEvents.leftRoom, this.addRemoveInfo(user.id));

    return true;
  }

  /** This regex will match the pattern of a {@link ChatRoom.id}:
   * - Starts with "ChatRoom_"
   * - after there will be a UUID (8-4-4-4-12 hex characters)
   * > Example: ChatRoom_12345678-1234-1234-1234-1234567890ab
   */
  static get roomIdRegex(): RegExp {
    return /^ChatRoom_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  }
  /** Test if {@link roomId} is a valid {@link ChatRoom.id} (matches {@link ChatRoom.roomIdRegex}) */
  static isIdForChatRoom(roomId: string): boolean {
    return ChatRoom.roomIdRegex.test(roomId);
  }
}

export default ChatRoom;

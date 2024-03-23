import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import ChatRoom from "./ChatRoom";

/** Represents a user connected to the server through a {@link Socket} (socket.io)*/
class User {
  private _socket: Socket;
  /** {@link Socket} that the user is connected to */
  public get socket(): Socket {
    return this._socket;
  }

  private _id: string;
  public get id(): string {
    return this._id;
  }

  private _createdAt: number;
  public get createdAt(): number {
    return this._createdAt;
  }

  private _chatRoomId: string | undefined;
  public get chatRoomId(): string | undefined {
    return this._chatRoomId;
  }

  constructor(socket: Socket, id: string, createdAt: number) {
    this._socket = socket;
    this._id = id;
    this._createdAt = createdAt;
  }

  /** Check if this user is in the specified {@link roomId}
   * @returns true if user is in the specified room */
  isInChatRoom(roomId: string): boolean {
    return this.chatRoomId === roomId;
  }
  /** Join a {@link ChatRoom.id} (socket io room)
   * @returns true if joined */
  joinChatRoom(roomId: string): boolean {
    if (!ChatRoom.isIdForChatRoom(roomId)) return false;
    this._chatRoomId = roomId;
    const leftThisRoom = this.leaveChatRoom(this.chatRoomId);
    if (!leftThisRoom) {
      //? If failed to leave current room then I messed up and should fix it
      throw new Error("Could not leave current chat room");
    }
    this.socket.join(roomId);
    return true;
  }

  /** Leave the current socket.io room or {@link roomId} if specified
   * @returns true if left or not in a room. false if not in the specified room */
  leaveChatRoom(roomId: string | undefined = undefined): boolean {
    //? Cancel if roomId specified and it doesn't match
    if (roomId && roomId !== this.chatRoomId) return false;
    //? make sure the user is in a room
    if (this.chatRoomId === undefined) return true;
    //? otherwise, leave
    this.socket.leave(this.chatRoomId);
    this._chatRoomId = undefined;
    return true;
  }

  /** Create a new {@link User} with random {@link User.id} and current date as {@link User.createdAt}
   * @param socket The {@link Socket} that the user is connected to
   * @returns a new {@link User} instance */
  static create(socket: Socket): User {
    return new User(socket, randomUUID(), Date.now());
  }
}
export default User;

import { Server as IOServer } from "socket.io";
import ChatRoom from "../models/ChatRoom";
import User from "../models/User";

/** Controller for {@link ChatRoom}s
 * - {@link User} can only be in one {@link ChatRoom}
 */
class ChatRoomController {
  private ioServer: IOServer;

  /** Map of all rooms
   * - key is {@link ChatRoom.id} (Used for O(1) access speed) */
  private rooms: Map<string, ChatRoom>;

  constructor(ioServer: IOServer) {
    this.ioServer = ioServer;
    this.rooms = new Map();
  }

  findRoomOfUser(userId: string): ChatRoom | undefined {
    for (const [, room] of this.rooms) {
      if (room.hasUserById(userId)) return room;
    }
  }

  /** Add a {@link User} to a random {@link ChatRoom} having space
   * - Or create a new one if no room has space or if no room exists
   * - Note: socket.io events will be triggered while this is doing what it does
   * @param userCapIfNew the {@link ChatRoom._userCap} if creating a new {@link ChatRoom}
   * @returns The {@link ChatRoom} of {@link user}
   */
  addUserToValidChatRoom(user: User, userCapIfNew: number = 2): ChatRoom {
    const roomsWithSpace: ChatRoom[] = [];
    for (const room of this.rooms.values()) {
      //? room must must have space
      //? user must not be in the room
      const valid = !room.isFull && !room.hasUser(user);
      if (valid) roomsWithSpace.push(room);
    }

    // A room will either be found or created

    //? no rooms found having space (or no rooms at all)
    if (!roomsWithSpace.length) {
      //? Create a new room and auto add the user
      const room = new ChatRoom(this.ioServer, userCapIfNew, user);
      this.rooms.set(room.id, room);
      return room;
    }

    //? found 1 or more rooms with space

    //? select a random room for fairness
    const randomIndex = Math.floor(Math.random() * roomsWithSpace.length);
    const room = roomsWithSpace[randomIndex];
    const added = room.addUser(user);
    if (!added) {
      //? This shouldn't happen, if it ever happens it means I messed up and should fix it
      throw new Error(`Could not add user to room: room.id=${room.id} user.id=${user.id}`);
    }
    return room;
  }

  /** Find and remove a {@link User} from their {@link ChatRoom}
   * - ⚠️ Room will be removed if it ends up empty (you should not use it if empty)
   * @returns The {@link ChatRoom} of {@link user} or undefined if not found
   */
  removeUser(user: User): ChatRoom | undefined {
    const room = this.findRoomOfUser(user.id);
    if (!room) return; //? User is not in any room
    const removed = room.removeUser(user);
    if (!removed) {
      //? This shouldn't happen, if it ever happens it means I messed up and should fix it
      throw new Error(`Could not remove user from room: room.id=${room.id}, user.id=${user.id}`);
    }
    if (room.usersIds.length === 0) this.rooms.delete(room.id);
    return room;
  }
}

export default ChatRoomController;

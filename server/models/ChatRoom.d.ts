import { Server as IOServer } from "socket.io";
import User from "./User";
declare class ChatRoom {
    private ioServer;
    private _id;
    /** Unique ID (used in {@link IOServer.to} room events) */
    get id(): string;
    private _userCap;
    /** Max number of {@link User}s in {@link _users} map */
    get userCap(): number;
    /** {@link User}s in this {@link ChatRoom}
     * - key is {@link User.id} for O(1) access speed */
    private _users;
    constructor(ioServer: IOServer, userCap: number | undefined, user: User);
    get isFull(): boolean;
    get usersIds(): string[];
    hasUserById(userId: string): boolean;
    hasUser(user: User): boolean;
    getUserById(userId: string): User | undefined;
    private addRemoveInfo;
    /** Add a {@link User} to this {@link ChatRoom}
     * - This will emit {@link IOEvents.joinedRoom} (socket.io event) in this room
     * @returns true if added */
    addUser(user: User): boolean;
    /** Remove the {@link user} from this {@link ChatRoom}
     * - This will emit {@link IOEvents.leftRoom} (socket.io event) in this room
     * @returns true if the user is in this room and was removed */
    removeUser(user: User): boolean;
    /** This regex will match the pattern of a {@link ChatRoom.id}:
     * - Starts with "ChatRoom_"
     * - after there will be a UUID (8-4-4-4-12 hex characters)
     * > Example: ChatRoom_12345678-1234-1234-1234-1234567890ab
     */
    static get roomIdRegex(): RegExp;
    /** Test if {@link roomId} is a valid {@link ChatRoom.id} (matches {@link ChatRoom.roomIdRegex}) */
    static isIdForChatRoom(roomId: string): boolean;
}
export default ChatRoom;

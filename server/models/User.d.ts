import { Socket } from "socket.io";
/** Represents a user connected to the server through a {@link Socket} (socket.io)*/
declare class User {
    private _socket;
    /** {@link Socket} that the user is connected to */
    get socket(): Socket;
    private _id;
    get id(): string;
    private _createdAt;
    get createdAt(): number;
    private _chatRoomId;
    get chatRoomId(): string | undefined;
    constructor(socket: Socket, id: string, createdAt: number);
    /** Check if this user is in the specified {@link roomId}
     * - if {@link roomId} is undefined, then check if user is in any room
     * @returns true if user is in the specified room */
    isInChatRoom(roomId?: string | undefined): boolean;
    /** Join a {@link ChatRoom.id} (socket io room)
     * @returns true if joined */
    joinChatRoom(roomId: string): boolean;
    /** Leave the current socket.io room or {@link roomId} if specified
     * @returns true if left or not in a room. false if not in the specified room */
    leaveChatRoom(roomId?: string | undefined): boolean;
    /** Create a new {@link User} with random {@link User.id} and current date as {@link User.createdAt}
     * @param socket The {@link Socket} that the user is connected to
     * @returns a new {@link User} instance */
    static create(socket: Socket): User;
}
export default User;

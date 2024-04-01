import ChatRoom from "../models/ChatRoom";
import { Server as IOServer } from "socket.io";
import User from "../models/User";
/** Controller for {@link ChatRoom}s
 * - {@link User} can only be in one {@link ChatRoom}
 */
declare class ChatRoomController {
    private ioServer;
    /** Map of all rooms
     * - key is {@link ChatRoom.id} (Used for O(1) access speed) */
    private rooms;
    constructor(ioServer: IOServer);
    findRoomOfUser(userId: string): ChatRoom | undefined;
    /** Add a {@link User} to a random {@link ChatRoom} having space
     * - Or create a new one if no room has space or if no room exists
     * - Note: socket.io events will be triggered while this is doing what it does
     * @param userCapIfNew the {@link ChatRoom._userCap} if creating a new {@link ChatRoom}
     * @returns The {@link ChatRoom} of {@link user}
     */
    addUserToValidChatRoom(user: User, userCapIfNew?: number): ChatRoom;
    /** Find and remove a {@link User} from their {@link ChatRoom}
     * - ⚠️ Room will be removed if it ends up empty (you should not use it if empty)
     * @returns The {@link ChatRoom} of {@link user} or undefined if not found
     */
    removeUser(user: User): ChatRoom | undefined;
}
export default ChatRoomController;

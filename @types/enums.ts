/** Events names for socket.io
 * - Used to avoid strings and typos */

export const enum IOEvents {
  /** Connected to the server */
  connection = "connection",
  /** Disconnected from the server */
  disconnect = "disconnect",
  /** new room was created for user (since no rooms were found, or all were full) */
  createdRoom = "createdRoom",
  /** User wants to join a room */
  joinRoom = "joinRoom",
  /** User has joined a room */
  joinedRoom = "joinedRoom",
  /** User is waiting for other user to join */
  waiting = "waiting",
  /** User chose to leave room */
  leaveRoom = "leaveRoom",
  /** User has left a room */
  leftRoom = "leftRoom",
  /** Send a message to room */
  sendMessage = "sendMessage",
  /** New message was recieved in a room */
  newMessage = "newMessage",
  /** Number of connected clients updated */
  clientsCount = "clientsCount",

  typing = 'typing',

  stoppedTyping = 'stopppedTyping',
  
  
}

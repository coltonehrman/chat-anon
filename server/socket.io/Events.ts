/** Events names for socket.io
 * - Used to avoid strings and typos */
enum Events {
  /** Joined the server */
  join = "join",
  /** Left the server */
  leave = "leave",
  /** Waiting for another user to join */
  waiting = "waiting",
  /** Connected 2 users */
  paired = "paired",
}

export default Events;

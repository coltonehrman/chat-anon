import { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { IOEvents } from "../../@types/enums.ts";
import { socket } from "../socket";

function ChatInterface() {
  const [isWaiting, setIsWaiting] = useState(true);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  


  let typingTimer: NodeJS.Timeout | null = null;

const typingStartedHandler = () => {
  setIsTyping(true)
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    setIsTyping(false);
  }, 5000); // Adjust the debounce time as needed
};

const typingStoppedHandler = () => {
  

    setIsTyping(false);
 
};


  useEffect(() => {
    socket.emit(IOEvents.joinRoom);
  }, []);

  useEffect(() => {
    const newMessageHandler = (data: any) => {
      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });
    };

    const joinedRoomHandler = ({ userIds }: { userIds: string[] }) => {
      if (userIds.length > 1) {
        return setIsWaiting(false);
      }
    };

    const leftRoomHandler = ({ userIds }: { userIds: string[] }) => {
      if (userIds.length === 1) {
        setIsWaiting(true);
        setNotification("User left chat room");
      }
    };

    socket.on(IOEvents.newMessage, newMessageHandler);
    socket.on(IOEvents.joinedRoom, joinedRoomHandler);
    socket.on(IOEvents.leftRoom, leftRoomHandler);
    socket.on(IOEvents.typing, typingStartedHandler);
    socket.on(IOEvents.stoppedTyping, typingStoppedHandler);

    return () => {
      socket.off(IOEvents.newMessage, newMessageHandler);
      socket.off(IOEvents.joinedRoom, leftRoomHandler);
      socket.off(IOEvents.leftRoom, joinedRoomHandler);
      socket.off(IOEvents.typing, typingStartedHandler);
      socket.off(IOEvents.stoppedTyping, typingStoppedHandler);
    };
  }, []);

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit(IOEvents.sendMessage, textMessage);
    setTextMessage("");
  };

  const leaveRoom: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    socket.emit(IOEvents.leaveRoom);
    location.replace("/");
  };

  if (isWaiting) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>

        <div className="modal-card">
          {notification && (
            <div className="notification is-warning is-light mx-auto">
              <button
                className="delete"
                onClick={() => setNotification(null)}
              ></button>
              {notification}
            </div>
          )}
          <header className="modal-card-head">
            <p className="modal-card-title">Waiting for someone to join...</p>
            <div className="loader-wrapper">
              <div className="loader is-loading is-size-3"></div>
            </div>
          </header>
          <footer className="modal-card-foot">
            <div className="buttons">
              <button className="button" onClick={leaveRoom}>
                Leave
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container mt-4">
        <div className="columns">
          <div className="column is-one-fifth">
            <h3 className="is-size-3">Actions</h3>
            <button className="button is-light" onClick={leaveRoom}>
              Leave
            </button>
          </div>
          <div className="column">
            <ul className="is-flex is-flex-direction-column mb-2">
              {messages.map((m, i) => (
                <li key={i} className="mb-2">
                  <div
                    className={`box is-inline-block ${
                      m.from === socket.id
                        ? "is-pulled-right"
                        : "is-pulled-left"
                    }`}
                  >
                    {m.message}
                  </div>
                </li>
              ))}
            </ul>

            <form method="POST" action="/chat" onSubmit={sendMessage}>
              {isTyping && <p>Other user is typing...</p>}

              <div className="field has-addons block">
                <p className="control is-expanded">
                  <input
                    type="text"
                    name="message"
                    value={textMessage}
                    onChange={({ target: { value } }) => {
                      setTextMessage(value);
                      if (value.trim() !== "") {
                        typingStartedHandler(); 
                      } else {
                        
                        typingStoppedHandler(); 
                      }
                    }}
                    className="input"
                  />
                </p>

                <p className="control">
                  <button className="button is-primary has-text-white">
                    Send
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export { ChatInterface };

import { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { socket } from "../socket";

function ChatInterface() {
  const [isWaiting, setIsWaiting] = useState(true);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.emit("joinRoom");
  }, []);

  useEffect(() => {
    const newMessageHandler = (data: any) => {
      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });

      console.log(data);
    };

    const joinedRoomHandler = ({ userIds }: { userIds: string[] }) => {
      if (userIds.length > 1) {
        return setIsWaiting(false);
      }
    };

    socket.on("newMessage", newMessageHandler);
    socket.on("joinedRoom", joinedRoomHandler);

    return () => {
      socket.off("newMessage", newMessageHandler);
      socket.off("joinedRoom", joinedRoomHandler);
    };
  }, []);

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", textMessage);
    setTextMessage("");
  };

  if (isWaiting) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Waiting for someone to join...</p>
            <div className="loader-wrapper">
              <div className="loader is-loading is-size-3"></div>
            </div>
          </header>
          <footer className="modal-card-foot">
            <div className="buttons">
              <button className="button">Leave</button>
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
        <ul className="is-flex is-flex-direction-column mb-2">
          {messages.map((m, i) => (
            <li key={i} className="mb-2">
              <div
                className={`box is-inline-block ${
                  m.from === socket.id ? "is-pulled-right" : "is-pulled-left"
                }`}
              >
                {m.message}
              </div>
            </li>
          ))}
        </ul>

        <form method="POST" action="/chat" onSubmit={sendMessage}>
          <div className="field has-addons block">
            <p className="control is-expanded">
              <input
                type="text"
                name="message"
                value={textMessage}
                onChange={({ target: { value } }) => setTextMessage(value)}
                className="input"
              />
            </p>

            <p className="control">
              <button className="button is-primary">Send</button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export { ChatInterface };

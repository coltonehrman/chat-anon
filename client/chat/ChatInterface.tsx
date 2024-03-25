import { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { socket } from "../socket";

function ChatInterface() {
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

    socket.on("newMessage", newMessageHandler);

    return () => {
      socket.off("newMessage", newMessageHandler);
    };
  }, []);

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", textMessage);
    setTextMessage("");
  };

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

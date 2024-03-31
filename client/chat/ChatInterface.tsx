import { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { socket } from "../socket";
import { text } from "stream/consumers";

function ChatInterface() {
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const [profanityList, setProfanityList] = useState<string[]>([]);

  useEffect(() => {
    fetch("NSFWList.txt")
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load the list!')
        }
        return response.text();
      })
      .then((text) => {
        const list = (text).split("\n").map((word: string) => word.trim());
        setProfanityList(list);
      })
      .catch(error => console.error("Error loading profanity list: ", error));
  }, []);

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
    const filteredMessage = filterProfanity(textMessage);
    // socket.emit("sendMessage", textMessage);
    socket.emit("sendMessage", filteredMessage);
    setTextMessage("");
  };

  const filterProfanity = (message: string): string => {
    let listMessage = message.split(" ");
    let filteredMessage = "";
    for (let j = 0; j < profanityList.length; j++) {
      for (let i = 0; i < listMessage.length; i++) {
        if (profanityList[j] === listMessage[i]) {
          listMessage[i] = "***";
        }
      }
    }
    for (let i = 0; i < listMessage.length; i++) {
      filteredMessage += (listMessage[i] + " ");
    }
    console.log(filteredMessage);
    return filteredMessage;
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

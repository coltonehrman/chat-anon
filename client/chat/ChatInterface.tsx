import { useEffect, useState } from "react";

import { Header } from "../components/Header";
import { IOEvents } from "../../@types/enums.ts";
import { socket } from "../socket";
import { text } from "stream/consumers";

function ChatInterface() {
  const [isWaiting, setIsWaiting] = useState(true);
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

  const [notification, setNotification] = useState<string | null>(null);

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
        setNotification("User left chat room")
      }
    };

    socket.on(IOEvents.newMessage, newMessageHandler);
    socket.on(IOEvents.joinedRoom, joinedRoomHandler);
    socket.on(IOEvents.leftRoom, leftRoomHandler);

    return () => {
      socket.off(IOEvents.newMessage, newMessageHandler);
      socket.off(IOEvents.joinedRoom, leftRoomHandler);
      socket.off(IOEvents.leftRoom, joinedRoomHandler);
    };
  }, []);

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const filteredMessage = filterProfanity(textMessage);
    socket.emit(IOEvents.sendMessage, filteredMessage);
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

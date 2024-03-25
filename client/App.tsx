import "./App.css";

import { useEffect, useState } from "react";

import { BackgroundAnimation } from "./BackgroundAnimation";
import { Header } from "./components/Header";
import { socket } from "./socket";

function App() {
  const [clientsCount, setClientsCount] = useState<number | null>(null);

  useEffect(() => {
    const clientCountHandler = (count: number) => {
      setClientsCount(count);
    };

    socket.on("clientsCount", clientCountHandler);

    return () => {
      socket.off("clientsCount", clientCountHandler);
    };
  }, []);

  return (
    <>
      <BackgroundAnimation />
      <Header />
      <div className="startContainer">
        <div className="userIconContainer">
          <i className="fas fa-user"></i>
          <div>{clientsCount}</div>
        </div>

        <a href="/chat/" className="startButton">
          <i className="fas fa-comments"></i>
          <span>Start Chat</span>
        </a>
      </div>
    </>
  );
}

export default App;

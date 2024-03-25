import "./App.css";

import { BackgroundAnimation } from "./BackgroundAnimation";
import { Header } from "./components/Header";

function App() {
  return (
    <>
      <BackgroundAnimation />
      <Header />
      <div className="startContainer">
        <div className="userIconContainer">
          <i className="fas fa-user"></i>
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

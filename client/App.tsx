import "./App.css";

import { BackgroundAnimation } from "./BackgroundAnimation";

function App() {
  return (
    <>
      <BackgroundAnimation />
      <div className="navigation">
        <h1 className="siteName">Chat-Anon</h1>
        <nav>
          <a href="">FAQ</a>
          <a href="">Contact Us</a>
        </nav>
      </div>
      <div className="startContainer">
        <div className="userIconContainer">
          <i className="fas fa-user"></i>
        </div>
        <button className="startButton">
          <i className="fas fa-comments"></i>
          <span>Start Chat</span>
        </button>
      </div>
    </>
  );
}

export default App;

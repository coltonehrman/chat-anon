function ChatInterface() {
  return (
    <>
      <div className="chat-screen">
        <ul>
          <li className="my-message">Message 1</li>
          <li className="stranger-message">Message 2</li>
          <li className="stranger-message">Message 3</li>
        </ul>
      </div>

      <form method="POST" action="/chat">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export { ChatInterface };

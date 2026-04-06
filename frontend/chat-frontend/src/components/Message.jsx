const Message = ({ msg, currentUser }) => {
  return (
    <div
      style={{
        margin: "8px 0",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "60%",
        background: msg.sender === currentUser ? "#7C3AED" : "#e5e7eb",
        color: msg.sender === currentUser ? "white" : "black",
        marginLeft: msg.sender === currentUser ? "auto" : "0",
      }}
    >
      {msg.isDeletedForEveryone ? "🚫 Message deleted" : msg.content}

      {msg.isPinned && <span> 📌</span>}
    </div>
  );
};

export default Message;

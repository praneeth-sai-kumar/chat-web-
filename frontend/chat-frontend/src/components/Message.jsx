const Message = ({ msg, currentUser, onDelete, onDeleteAll, onPin }) => {
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
      {msg.isDeletedForEveryone ? "Message deleted" : msg.content}

      {msg.isPinned && <div>📌 Pinned</div>}

      <div style={{ marginTop: "5px" }}>
        <button onClick={() => onPin(msg._id)}>Pin</button>
        <button onClick={() => onDelete(msg._id)}>Delete</button>
        <button onClick={() => onDeleteAll(msg._id)}>DFE</button>
      </div>
    </div>
  );
};

export default Message;

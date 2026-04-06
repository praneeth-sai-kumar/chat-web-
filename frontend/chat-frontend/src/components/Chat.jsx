import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Sidebar from "./Sidebar";
import Message from "./Message";

const socket = io("https://chat-web-ihak.onrender.com");

const Chat = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // register
  useEffect(() => {
    socket.emit("register", user);
  }, [user]);

  // load messages
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `https://chat-web-ihak.onrender.com/api/messages?user1=${user}&user2=${selectedUser}`,
      );
      setMessages(res.data);
    };

    fetchMessages();
  }, [selectedUser, user]);

  // socket listeners
  useEffect(() => {
    const handleMessage = (msg) => {
      if (
        (msg.sender === user && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === user)
      ) {
        setMessages((prev) => {
          const exists = prev.find((m) => m._id === msg._id);
          if (exists) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receiveMessage", handleMessage);

    socket.on("messageDeleted", (msg) => {
      if (
        (msg.sender === user && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === user)
      ) {
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
      }
    });

    socket.on("messagePinned", (msg) => {
      if (
        (msg.sender === user && msg.receiver === selectedUser) ||
        (msg.sender === selectedUser && msg.receiver === user)
      ) {
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
      }
    });

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("messageDeleted");
      socket.off("messagePinned");
    };
  }, [selectedUser, user]);

  // actions
  const sendMessage = () => {
    if (!input || !selectedUser) return;

    socket.emit("sendMessage", {
      sender: user,
      receiver: selectedUser,
      content: input,
    });

    setInput("");
  };

  const deleteForMe = (id) => {
    socket.emit("deleteMessage", {
      messageId: id,
      type: "me",
      username: user,
    });
  };

  const deleteForEveryone = (id) => {
    socket.emit("deleteMessage", {
      messageId: id,
      type: "everyone",
      username: user,
    });
  };

  const pinMessage = (id) => {
    socket.emit("pinMessage", id);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        currentUser={user}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px", background: "#7C3AED", color: "white" }}>
          {selectedUser || "Select user"}
        </div>

        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
          {messages.map((msg) => (
            <Message
              key={msg._id}
              msg={msg}
              currentUser={user}
              onDelete={deleteForMe}
              onDeleteAll={deleteForEveryone}
              onPin={pinMessage}
            />
          ))}
        </div>

        <div style={{ display: "flex", padding: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

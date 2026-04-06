import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ currentUser, selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(
        "https://chat-web-ihak.onrender.com/api/users",
      );
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username !== currentUser &&
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        width: "260px",
        background: "#ede9fe",
        height: "100vh",
      }}
    >
      <h3 style={{ padding: "15px", color: "#7C3AED" }}>Chats</h3>

      <input
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "90%",
          margin: "10px",
          padding: "8px",
          borderRadius: "5px",
        }}
      />

      {/* 👥 Users */}
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user.username)}
          style={{
            padding: "12px",
            cursor: "pointer",
            borderBottom: "1px solid #ddd",
            background: selectedUser === user.username ? "#ddd" : "transparent",
          }}
        >
          {user.username} {user.isOnline && "🟢"}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

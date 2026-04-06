import { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (!username) return;

    await axios.post("https://chat-web-ihak.onrender.com/api/users/register", {
      username,
    });

    localStorage.setItem("username", username);
    setUser(username);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ color: "#7C3AED" }}>💬 Violet Chat</h2>

      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{ background: "#7C3AED", color: "white", padding: "10px" }}
      >
        Join
      </button>
    </div>
  );
};

export default Login;

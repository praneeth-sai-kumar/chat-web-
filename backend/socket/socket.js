const User = require("../models/User");
const Message = require("../models/Message");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", async (username) => {
      await User.findOneAndUpdate(
        { username },
        { isOnline: true, socketId: socket.id },
        { upsert: true },
      );

      console.log(username, "is online");

      const undeliveredMessages = await Message.find({
        receiver: username,
        isDelivered: false,
      });

      for (let msg of undeliveredMessages) {
        socket.emit("receiveMessage", msg);
        msg.isDelivered = true;
        await msg.save();
      }
    });

    // 🔥 SEND MESSAGE (FINAL FIXED VERSION)
    socket.on("sendMessage", async ({ sender, receiver, content }) => {
      try {
        const receiverUser = await User.findOne({ username: receiver });

        const message = await Message.create({
          sender,
          receiver,
          content,
          isDelivered: receiverUser?.isOnline || false,
        });

        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("receiveMessage", message);
        }

        socket.emit("receiveMessage", message);
      } catch (error) {
        console.error("Send message error:", error);
      }
    });

    socket.on("deleteMessage", async ({ messageId, type, username }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (type === "everyone") {
          message.isDeletedForEveryone = true;
          message.content = "This message was deleted";
        } else if (type === "me") {
          if (!message.deletedFor.includes(username)) {
            message.deletedFor.push(username);
          }
        }

        await message.save();

        // 🔥 send only to sender + receiver
        const senderUser = await User.findOne({ username: message.sender });
        const receiverUser = await User.findOne({ username: message.receiver });

        if (senderUser?.socketId) {
          io.to(senderUser.socketId).emit("messageDeleted", message);
        }

        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("messageDeleted", message);
        }
      } catch (error) {
        console.error("Delete message error:", error);
      }
    });

    socket.on("pinMessage", async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        message.isPinned = !message.isPinned;
        await message.save();

        const senderUser = await User.findOne({ username: message.sender });
        const receiverUser = await User.findOne({ username: message.receiver });

        if (senderUser?.socketId) {
          io.to(senderUser.socketId).emit("messagePinned", message);
        }

        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("messagePinned", message);
        }
      } catch (error) {
        console.error("Pin message error:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false, socketId: null },
        );
        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  });
};

module.exports = setupSocket;

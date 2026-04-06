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
    });

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
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("deleteMessage", async ({ messageId, type, username }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (type === "everyone") {
          message.isDeletedForEveryone = true;
          message.content = "Message deleted";
        } else if (type === "me") {
          if (!message.deletedFor.includes(username)) {
            message.deletedFor.push(username);
          }
        }

        await message.save();

        const senderUser = await User.findOne({ username: message.sender });
        const receiverUser = await User.findOne({ username: message.receiver });

        if (senderUser?.socketId) {
          io.to(senderUser.socketId).emit("messageDeleted", message);
        }

        if (receiverUser?.socketId) {
          io.to(receiverUser.socketId).emit("messageDeleted", message);
        }
      } catch (err) {
        console.error(err);
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
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", async () => {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false, socketId: null },
      );
    });
  });
};

module.exports = setupSocket;

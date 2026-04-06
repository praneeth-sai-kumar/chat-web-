const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  deleteMessage,
  pinMessage,
} = require("../controllers/messageController");

router.post("/", sendMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);
router.patch("/:id/pin", pinMessage);

module.exports = router;

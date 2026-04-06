const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({ username });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username isOnline");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

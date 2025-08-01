const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: { name, email } });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(200).json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { registerUser, loginUser };

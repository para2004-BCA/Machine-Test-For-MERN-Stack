const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Agent", agentSchema);

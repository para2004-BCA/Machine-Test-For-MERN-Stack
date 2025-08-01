const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Agent = require("../models/Agent");
const Distribution = require("../models/DistributedList"); // Import distribution model

// Create a new agent
const createAgent = async (req, res) => {
  try {
    const { agentName, email, phone, password } = req.body;

    if (!agentName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: "Agent with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new Agent({
      agentName,
      email,
      phone,
      password: hashedPassword
    });

    await newAgent.save();

    const { password: _, ...agentData } = newAgent.toObject();

    res.status(201).json({
      message: "Agent created successfully",
      agent: agentData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all distributions assigned to a specific agent
const getAgentDistribution = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if agent exists
    const agentExists = await Agent.findById(agentId);
    if (!agentExists) {
      return res.status(404).json({ error: "Agent not found" });
    }

    // Find distributions assigned to this agent
    const distributions = await Distribution.find({ assignedAgent: agentId });

    res.status(200).json(distributions);
  } catch (err) {
    console.error("Error in getAgentDistribution:", err);
    res.status(500).json({ error: "Failed to fetch distribution data" });
  }
};

module.exports = {
  createAgent,
  getAgentDistribution
};

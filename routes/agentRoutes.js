const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

// Create a new agent
router.post("/create", agentController.createAgent);

// Get distributed files for a specific agent
router.get("/:agentId/distribution", agentController.getAgentDistribution);

module.exports = router;

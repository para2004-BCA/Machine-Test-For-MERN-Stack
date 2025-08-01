const express = require('express');
const router = express.Router();

// Dummy route for agent distribution
router.get('/', (req, res) => {
  res.json({ message: 'Agent distribution data' });
});

module.exports = router;

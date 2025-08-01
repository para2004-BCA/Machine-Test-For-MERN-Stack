// models/DistributedList.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  firstName: String,
  phone: Number,
  notes: String,
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  }
});

module.exports = mongoose.model('DistributedItem', itemSchema);

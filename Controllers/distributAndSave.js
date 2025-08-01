// controllers/distributeAndSave.js
const Distribution = require('../models/DistributedList');

async function distributeAndSave(items, res) {
  const agents = [1, 2, 3, 4, 5]; // Example agent IDs
  const total = items.length;
  const perAgent = Math.floor(total / agents.length);
  const remainder = total % agents.length;

  const distributed = [];

  let index = 0;
  for (let i = 0; i < agents.length; i++) {
    let count = perAgent + (i < remainder ? 1 : 0);
    const assigned = items.slice(index, index + count).map((item) => ({
      ...item,
      agentId: agents[i],
    }));
    distributed.push(...assigned);
    index += count;
  }

  await Distribution.insertMany(distributed);
  res.status(200).json({ message: 'Data distributed and saved successfully' });
}

module.exports = distributeAndSave;

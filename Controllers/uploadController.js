const csv = require('csvtojson');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const DistributedItem = require('../models/DistributedList');
const Agent = require('../models/Agent');

const uploadAndDistribute = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    let data = [];

    // Parse file based on type
    if (ext === '.csv') {
      data = await csv().fromFile(file.path);
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);
    } else {
      fs.unlinkSync(file.path); // clean up
      return res.status(400).json({ error: 'Invalid file type. Only CSV, XLSX, and XLS are allowed.' });
    }

    // Remove file after reading
    fs.unlinkSync(file.path);

    // Validate file content
    if (!data.length || !data[0].FirstName || !data[0].Phone) {
      return res.status(400).json({ error: 'Missing required fields (FirstName or Phone) in file' });
    }

    // Fetch 5 agents from database
    const agents = await Agent.find().limit(5);
    if (agents.length < 5) {
      return res.status(400).json({ error: 'At least 5 agents are required for distribution' });
    }

    // Distribute items evenly
    const totalItems = data.length;
    const baseCount = Math.floor(totalItems / agents.length);
    let remainder = totalItems % agents.length;

    let index = 0;

    for (let i = 0; i < agents.length; i++) {
      const extra = remainder > 0 ? 1 : 0;
      const count = baseCount + extra;

      const itemsForAgent = data.slice(index, index + count);
      const preparedItems = itemsForAgent.map(item => ({
        firstName: item.FirstName,
        phone: item.Phone,
        notes: item.Notes || '',
        agentId: agents[i]._id,
      }));

      await DistributedItem.insertMany(preparedItems); // insert all items at once

      index += count;
      remainder--;
    }

    res.status(200).json({ message: 'File uploaded and tasks distributed successfully' });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process and distribute file data' });
  }
};

module.exports = { uploadAndDistribute };

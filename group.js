const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// Create a group
router.post('/create', async (req, res) => {
  try {
    const { name, description } = req.body;
    // Step 4 example: Create a group
    const group = new Group({ name, description });
    await group.save();
    res.status(201).json({ group });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const response = await axios.post('https://fincraft-ml.onrender.com/api/analyze', {
      expenses: req.body.expenses
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error connecting to AI service:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

module.exports = router;

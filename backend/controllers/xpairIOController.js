const pool = require('../models/db');

// Get all Xpair IOs (for dropdowns)
exports.getAllXpairIOs = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT xpair_io_id, xpair_io_name FROM xpair_io_master ORDER BY xpair_io_name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching xpair IOs' });
  }
};

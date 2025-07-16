const pool = require('../models/db');
const { buildJSON } = require('../utils/jsonBuilder');

exports.getXpairData = async (req, res) => {
  const { xpair_io_name } = req.body;

  if (!xpair_io_name) {
    return res.status(400).json({ error: 'xpair_io_name is required' });
  }

  try {
    // Get IO details
    const { rows: ioDetails } = await pool.query(
      `SELECT * FROM xpair_io_master WHERE xpair_io_name = $1`,
      [xpair_io_name]
    );

    if (ioDetails.length === 0) {
      return res.status(404).json({ error: 'Invalid xpair_io_name' });
    }

    const xpair_io_id = ioDetails[0].xpair_io_id;

    // Get attributes in proper hierarchy order
    const { rows: attributes } = await pool.query(
      `SELECT * FROM xpair_attribute_master 
       WHERE xpair_io_id = $1 
       ORDER BY placement_sequence ASC`,
      [xpair_io_id]
    );

    // Get attribute definitions
    const { rows: attributeMasters } = await pool.query(
      `SELECT * FROM attribute_master`
    );

    // Create attribute map
    const attributeMap = {};
    attributeMasters.forEach(attr => {
      attributeMap[attr.attribute_id] = attr;
    });

    // Build the JSON structure
    const output = buildJSON(attributes, {}, attributeMap);

    return res.json(output);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getXpairStatus = async (req, res) => {
  const { xpair_name, aip_participant_id } = req.body;

  if (!xpair_name || !aip_participant_id) {
    return res.status(400).json({ error: 'xpair_name and aip_participant_id are required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT status FROM xpair_master WHERE xpair_name = $1 AND aip_participant_id = $2`,
      [xpair_name, aip_participant_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'xpair not found' });
    }

    const status = rows[0].status === 1 ? 'active' : 'inactive';
    return res.json({ status });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

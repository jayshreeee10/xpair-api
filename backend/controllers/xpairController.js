// const pool = require('../models/db');
// const { buildJSON } = require('../utils/jsonBuilder');

// exports.getXpairData = async (req, res) => {
//   const { xpair_io_name } = req.body;

//   if (!xpair_io_name) {
//     return res.status(400).json({ error: "xpair_io_name is required" });
//   }

//   try {
//     const { rows: ioDetails } = await pool.query(
//       `SELECT * FROM xpair_io_master WHERE xpair_io_name = $1`,
//       [xpair_io_name]
//     );

//     if (ioDetails.length === 0) {
//       return res.status(404).json({ error: 'Invalid xpair_io_name' });
//     }
//     const xpair_io_id = ioDetails[0].xpair_io_id;
//     const { rows: attributes } = await pool.query(
//       `SELECT * FROM xpair_attribute_master WHERE xpair_io_id = $1 ORDER BY placement_sequence ASC`,
//       [xpair_io_id]
//     );

//     const { rows: attributeMasters } = await pool.query(
//       `SELECT * FROM attribute_master`
//     );

//     const attributeMap = {};
//     attributeMasters.forEach(attr => {
//       attributeMap[attr.attribute_id] = attr;
//     });

//     const output = buildJSON(attributes, {}, attributeMap);

//     // return res.json({
//     //   io_details: ioDetails[0],
//     //   data: output
//     // });


//     return res.json(output);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };







const pool = require('../models/db');
const { buildJSON } = require('../utils/jsonBuilder');

exports.getCropSowingData = async (req, res) => {
  const { xpair_io_name = 'o2' } = req.body; // Default to crop sowing data

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
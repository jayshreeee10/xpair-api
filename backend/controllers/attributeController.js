const pool = require('../models/db');

// Get all attributes
exports.getAllAttributes = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM attribute_master ORDER BY attribute_id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single attribute
exports.getAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM attribute_master WHERE attribute_id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create attribute
exports.createAttribute = async (req, res) => {
  try {
    const { 
      attribute_name, 
      data_type, 
      min_length, 
      max_length, 
      is_numeric, 
      is_date, 
      is_timestamp, 
      enum: enumValues 
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO attribute_master (
        attribute_name, data_type, min_length, max_length, 
        is_numeric, is_date, is_timestamp, enum
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        attribute_name, 
        data_type, 
        min_length, 
        max_length, 
        is_numeric, 
        is_date, 
        is_timestamp, 
        enumValues
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update attribute
exports.updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      attribute_name, 
      data_type, 
      min_length, 
      max_length, 
      is_numeric, 
      is_date, 
      is_timestamp, 
      enum: enumValues 
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE attribute_master SET 
        attribute_name = $1, 
        data_type = $2, 
        min_length = $3, 
        max_length = $4, 
        is_numeric = $5, 
        is_date = $6, 
        is_timestamp = $7, 
        enum = $8
      WHERE attribute_id = $9 RETURNING *`,
      [
        attribute_name, 
        data_type, 
        min_length, 
        max_length, 
        is_numeric, 
        is_date, 
        is_timestamp, 
        enumValues,
        id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete attribute
exports.deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM attribute_master WHERE attribute_id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }
    
    res.json({ message: 'Attribute deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getAttributeList = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT attribute_id, attribute_name FROM attribute_master ORDER BY attribute_name'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching attribute list:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

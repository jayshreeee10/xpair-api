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
        console.log('Raw request body:', req.body);

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

        // Check if attribute exists
        const existingAttribute = await pool.query(
            'SELECT * FROM attribute_master WHERE attribute_name = $1',
            [attribute_name]
        );

        if (existingAttribute.rows.length > 0) {
            return res.status(400).json({ error: 'Attribute with this name already exists' });
        }

        // Convert boolean strings to actual booleans
        const isNumericBool = is_numeric === 'TRUE';
        const isDateBool = is_date === 'TRUE';
        const isTimestampBool = is_timestamp === 'TRUE';

        // Handle enum values - send as array or null
        // const enumParam = (enumValues && enumValues.length > 0) ? enumValues : null;

        const enumParam = (Array.isArray(enumValues) && enumValues.length > 0)
  ? JSON.stringify(enumValues)
  : null;


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
                isNumericBool, 
                isDateBool, 
                isTimestampBool, 
                enumParam
            ]
        );

        console.log('Saved attribute:', rows[0]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating attribute:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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

    // Convert enum array to PostgreSQL JSONB format
    const enumJson = enumValues && enumValues.length > 0 ? JSON.stringify(enumValues) : null;

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
        enumJson,  // Use the converted JSON string
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

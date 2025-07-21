const pool = require('../models/db');

// Get all Xpair attributes
exports.getAllXpairAttributes = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM xpair_attribute_master ORDER BY xpair_attribute_id');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single Xpair attribute
exports.getXpairAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("👉 Received ID from frontend:", id);
        const { rows } = await pool.query(
            'SELECT * FROM xpair_attribute_master WHERE xpair_attribute_id = $1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Xpair attribute not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new Xpair attribute
exports.createXpairAttribute = async (req, res) => {
    try {
        const {
            xpair_io_id,
            attribute_id,
            level,
            is_master_node,
            is_master_node_array,
            master_node_attribute_id,
            placement_sequence,
            is_mandatory
        } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO xpair_attribute_master (
        xpair_io_id,
        attribute_id,
        level,    
        is_master_node,
        is_master_node_array,
        master_node_attribute_id,
        placement_sequence,
        is_mandatory
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                xpair_io_id,
                attribute_id,
                level,
                is_master_node,
                is_master_node_array,
                master_node_attribute_id,
                placement_sequence,
                is_mandatory
            ]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Xpair attribute
exports.updateXpairAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            xpair_io_id,
            attribute_id,
            level,
            is_master_node,
            is_master_node_array,
            master_node_attribute_id,
            placement_sequence,
            is_mandatory
        } = req.body;

        const { rows } = await pool.query(
            `UPDATE xpair_attribute_master SET
         xpair_io_id=$1,
      attribute_id=$2,
      level=$3,    
      is_master_node=$4,
      is_master_node_array=$5,
      master_node_attribute_id=$6,
      placement_sequence=$7,
      is_mandatory=$8
      WHERE xpair_attribute_id = $9 RETURNING *`,
            [
                xpair_io_id,
                attribute_id,
                level,
                is_master_node,
                is_master_node_array,
                master_node_attribute_id,
                placement_sequence,
                is_mandatory,
                id
            ]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Xpair attribute not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Xpair attribute
exports.deleteXpairAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query(
            'DELETE FROM xpair_attribute_master WHERE xpair_attribute_id = $1',
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Xpair attribute not found' });
        }

        res.json({ message: 'Xpair attribute deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
import React, { useEffect, useState } from 'react';
import {
  TextField, MenuItem, Button, Box, Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getAttributeList,
  getXpairIOList,
  createXpairAttribute,getJsonPreviewByIOName
} from '../../../services/api';
import JsonPreview from './JsonPreview';

const booleanOptions = ['TRUE', 'FALSE'];
const levelOptions = [0, 1, 2, 3];

const validationSchema = Yup.object({
  xpair_io_id: Yup.number().required('Required'),
  attribute_id: Yup.number().required('Required'),
  level: Yup.number().required('Required'),
  is_master_node: Yup.string().oneOf(booleanOptions),
  is_master_node_array: Yup.string().oneOf(booleanOptions),
  master_node_attribute_id: Yup.number().nullable(),
  placement_sequence: Yup.number().required('Required'),
  is_mandatory: Yup.string().oneOf(booleanOptions),
});

const XpairCreateInlineForm = ({ xpairIoIdFromRoute, onCreated }) => {
  const [jsonPreview, setJsonPreview] = useState({});
const [lastInsertedPath, setLastInsertedPath] = useState([]);

  const [xpairIOs, setXpairIOs] = useState([]);
  const [attributes, setAttributes] = useState([]);


  const formik = useFormik({
    initialValues: {
      xpair_io_id: xpairIoIdFromRoute || '',
      attribute_id: '',
      level: 0,
      is_master_node: 'FALSE',
      is_master_node_array: 'FALSE',
      master_node_attribute_id: null,
      placement_sequence: '',
      is_mandatory: 'TRUE',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          master_node_attribute_id: values.master_node_attribute_id || null,
        };
        await createXpairAttribute(payload);
        onCreated();
        resetForm();
      } catch (error) {
        console.error('Error creating xpair attribute:', error);
      }
    },
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      const [ioList, attrList] = await Promise.all([
        getXpairIOList(),
        getAttributeList()
      ]);
      setXpairIOs(ioList);
      setAttributes(attrList);
    };
    fetchDropdowns();
  }, []);
  useEffect(() => {
    const fetchJson = async () => {
      if (!xpairIoIdFromRoute) return;

      const selectedIO = xpairIOs.find(io => io.xpair_io_id === Number(xpairIoIdFromRoute));
      if (!selectedIO) return;

      try {
        const preview = await getJsonPreviewByIOName(selectedIO.xpair_io_name);
        setJsonPreview(preview);
      } catch (error) {
        console.error('Failed to fetch JSON preview', error);
      }
    };

    fetchJson();
  }, [xpairIoIdFromRoute, xpairIOs]);
useEffect(() => {
  if (!formik.values.attribute_id) return;

const simulateJson = () => {
  const attr = attributes.find(
    (a) => a.attribute_id === Number(formik.values.attribute_id)
  );
  if (!attr) return;

  const attrName = attr.attribute_name;
  const level = Number(formik.values.level) || 0;

  const path = [];

  // Case 1: If master node is selected
  if (formik.values.master_node_attribute_id) {
    const masterAttr = attributes.find(
      (a) => a.attribute_id === Number(formik.values.master_node_attribute_id)
    );
    if (masterAttr) {
      const masterName = masterAttr.attribute_name;
      path.push(masterName); // Nest under master node
    }
  } else {
    // Case 2: Use level nesting
    for (let i = 0; i < level; i++) {
      path.push(`level_${i}`);
    }
  }

  path.push(attrName); // Final field

  const updated = structuredClone(jsonPreview);

  // Remove previous path
  if (lastInsertedPath.length > 0) {
    removeFieldFromJson(updated, lastInsertedPath);
  }

  // Insert new path
  const result = insertFieldIntoJson(updated, path, null);

  setJsonPreview(result);
  setLastInsertedPath(path); // Track it
};



  simulateJson();
}, [formik.values.attribute_id, formik.values.level, formik.values.master_node_attribute_id]);
  const fieldStyle = {
    width: 120,
    '& .MuiInputBase-root': { height: 32 },
    '& .MuiInputBase-input': { fontSize: 12, padding: '6px 10px' },
    '& .MuiInputLabel-root': { fontSize: 12 },
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2, background: '#f9f9f9', borderRadius: 2, mb: 3 }}>
      <Grid container spacing={1}>
        <Grid item>
          <TextField
            select label="Xpair IO" name="xpair_io_id"
            value={formik.values.xpair_io_id}
            onChange={formik.handleChange}
            error={formik.touched.xpair_io_id && Boolean(formik.errors.xpair_io_id)}
            helperText={formik.touched.xpair_io_id && formik.errors.xpair_io_id}
            disabled={!!xpairIoIdFromRoute}
            sx={fieldStyle}
          >
            {xpairIOs.map((io) => (
              <MenuItem key={io.xpair_io_id} value={io.xpair_io_id}>
                {io.xpair_io_id} ({io.xpair_io_name})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            select label="Attribute" name="attribute_id"
            size='small'
            value={formik.values.attribute_id}
            onChange={formik.handleChange}
            error={formik.touched.attribute_id && Boolean(formik.errors.attribute_id)}
            helperText={formik.touched.attribute_id && formik.errors.attribute_id}
            sx={fieldStyle}
            InputLabelProps={{ shrink: true }}
          >
            {attributes.map((attr) => (
              <MenuItem key={attr.attribute_id} value={attr.attribute_id}>
                {attr.attribute_id} ({attr.attribute_name})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            select label="Level" name="level"
            value={formik.values.level}
            onChange={formik.handleChange}
            sx={fieldStyle}
          >
            {levelOptions.map((lvl) => (
              <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            label="Placement Sequence" type="number" name="placement_sequence"
            value={formik.values.placement_sequence}
            onChange={formik.handleChange}
            size='small'
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 140,
              '& .MuiInputBase-root': { height: 32 },
              '& .MuiInputBase-input': { fontSize: 12, padding: '6px 10px' },
              '& .MuiInputLabel-root': { fontSize: 12 },
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Master Node Attribute ID" type="number" name="master_node_attribute_id"
            value={formik.values.master_node_attribute_id || ''}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 150,
              '& .MuiInputBase-root': { height: 32 },
              '& .MuiInputBase-input': { fontSize: 12, padding: '6px 10px' },
              '& .MuiInputLabel-root': { fontSize: 12 },
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            select label="Is Master Node" name="is_master_node"
            value={formik.values.is_master_node}
            onChange={formik.handleChange}
            sx={fieldStyle}
            size='small'
          >
            {booleanOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            select label="Is Master Node Array" name="is_master_node_array"
            value={formik.values.is_master_node_array}
            onChange={formik.handleChange}
            sx={fieldStyle}
            size='small'
          >
            {booleanOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            select label="Is Mandatory" name="is_mandatory"
            value={formik.values.is_mandatory}
            onChange={formik.handleChange}
            sx={fieldStyle}
            size='small'
          >
            {booleanOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box textAlign="right" mt={2}>
       
        <Button type="submit" variant="contained" color="primary" size="small">
          Create Xpair Attribute
        </Button>
      </Box>
       <JsonPreview data={jsonPreview} />
    </Box>
  );
};

export default XpairCreateInlineForm;
function insertFieldIntoJson(base, pathArray, value = null) {
  const obj = { ...base };

  let current = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];

    if (i === pathArray.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  return obj;
}
function removeFieldFromJson(obj, pathArray) {
  const path = [...pathArray];
  const keyToRemove = path.pop();

  let current = obj;
  for (const key of path) {
    if (!current[key]) return;
    current = current[key];
  }

  delete current[keyToRemove];
}

import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Autocomplete
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createAttribute, updateAttribute } from '../../services/api';

const dataTypes = ['String', 'Number', 'Object', 'Array', 'Boolean'];
const booleanOptions = ['TRUE', 'FALSE'];

const validationSchema = Yup.object({
  attribute_name: Yup.string().required('Required'),
  data_type: Yup.string().required('Required').oneOf(dataTypes),
  min_length: Yup.number().nullable(),
  max_length: Yup.number().nullable(),
  is_numeric: Yup.string().oneOf(booleanOptions),
  is_date: Yup.string().oneOf(booleanOptions),
  is_timestamp: Yup.string().oneOf(booleanOptions),
  enum: Yup.array().of(Yup.string()).nullable(),
});

const AttributeForm = ({ open, onClose, onSubmit, mode, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      attribute_name: '',
      data_type: 'String',
      min_length: null,
      max_length: null,
      is_numeric: 'FALSE',
      is_date: 'FALSE',
      is_timestamp: 'FALSE',
      enum: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          min_length: values.min_length || null,
          max_length: values.max_length || null,
        };
        
        if (mode === 'create') {
          await createAttribute(payload);
        } else {
          await updateAttribute(initialValues.attribute_id, payload);
        }
        
        onSubmit();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New Attribute' : 'Edit Attribute'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="attribute_name"
            name="attribute_name"
            label="Attribute Name"
            value={formik.values.attribute_name}
            onChange={formik.handleChange}
            error={formik.touched.attribute_name && Boolean(formik.errors.attribute_name)}
            helperText={formik.touched.attribute_name && formik.errors.attribute_name}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            id="data_type"
            name="data_type"
            label="Data Type"
            value={formik.values.data_type}
            onChange={formik.handleChange}
          >
            {dataTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            id="min_length"
            name="min_length"
            label="Min Length"
            type="number"
            value={formik.values.min_length || ''}
            onChange={formik.handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            id="max_length"
            name="max_length"
            label="Max Length"
            type="number"
            value={formik.values.max_length || ''}
            onChange={formik.handleChange}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Is Numeric</FormLabel>
            <RadioGroup
              row
              id="is_numeric"
              name="is_numeric"
              value={formik.values.is_numeric}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
              <FormControlLabel value="FALSE" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Is Date</FormLabel>
            <RadioGroup
              row
              id="is_date"
              name="is_date"
              value={formik.values.is_date}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
              <FormControlLabel value="FALSE" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Is Timestamp</FormLabel>
            <RadioGroup
              row
              id="is_timestamp"
              name="is_timestamp"
              value={formik.values.is_timestamp}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
              <FormControlLabel value="FALSE" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formik.values.enum || []}
            onChange={(event, newValue) => {
              formik.setFieldValue('enum', newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Enum Values"
                placeholder="Add enum value and press Enter"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AttributeForm;
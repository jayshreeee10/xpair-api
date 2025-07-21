import React, { useEffect, useState } from 'react';
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
    Radio
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    getAttributeList,//dropdown
    getXpairIOList,//dropdown
    createXpairAttribute,
    updateXpairAttribute
} from '../../services/api';

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

const XpairForm = ({ open, onClose, onSubmit, mode, initialValues ,xpairIoIdFromRoute}) => {
    const [xpairIOs, setXpairIOs] = useState([]);
    const [attributes, setAttributes] = useState([]);

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

    const formik = useFormik({
        initialValues: initialValues || {
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
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    master_node_attribute_id: values.master_node_attribute_id || null,
                };
                    await updateXpairAttribute(initialValues.xpair_attribute_id, payload);
                
                onSubmit();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {mode === 'create' ? 'Create Xpair Attribute' : 'Edit Xpair Attribute'}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        id="xpair_io_id"
                        name="xpair_io_id"
                        label="Xpair IO"
                        value={formik.values.xpair_io_id}
                        onChange={formik.handleChange}
                        error={formik.touched.xpair_io_id && Boolean(formik.errors.xpair_io_id)}
                        helperText={formik.touched.xpair_io_id && formik.errors.xpair_io_id}
                        disabled={!!xpairIoIdFromRoute}
                    >
                        {xpairIOs.map((io) => (
                            <MenuItem key={io.xpair_io_id} value={io.xpair_io_id}>
                                {io.xpair_io_id} ({io.xpair_io_name})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        id="attribute_id"
                        name="attribute_id"
                        label="Attribute"
                        value={formik.values.attribute_id}
                        onChange={formik.handleChange}
                        error={formik.touched.attribute_id && Boolean(formik.errors.attribute_id)}
                        helperText={formik.touched.attribute_id && formik.errors.attribute_id}
                    >
                        {attributes.map((attr) => (
                            <MenuItem key={attr.attribute_id} value={attr.attribute_id}>
                                {attr.attribute_id} ({attr.attribute_name})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        id="level"
                        name="level"
                        label="Level"
                        value={formik.values.level}
                        onChange={formik.handleChange}
                    >
                        {levelOptions.map((lvl) => (
                            <MenuItem key={lvl} value={lvl}>
                                {lvl}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        margin="normal"
                        id="placement_sequence"
                        name="placement_sequence"
                        label="Placement Sequence"
                        type="number"
                        value={formik.values.placement_sequence}
                        onChange={formik.handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        id="master_node_attribute_id"
                        name="master_node_attribute_id"
                        label="Master Node Attribute ID (Optional)"
                        type="number"
                        value={formik.values.master_node_attribute_id || ''}
                        onChange={formik.handleChange}
                    />

                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Is Master Node</FormLabel>
                        <RadioGroup
                            row
                            name="is_master_node"
                            value={formik.values.is_master_node}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
                            <FormControlLabel value="FALSE" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Is Master Node Array</FormLabel>
                        <RadioGroup
                            row
                            name="is_master_node_array"
                            value={formik.values.is_master_node_array}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
                            <FormControlLabel value="FALSE" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Is Mandatory</FormLabel>
                        <RadioGroup
                            row
                            name="is_mandatory"
                            value={formik.values.is_mandatory}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="TRUE" control={<Radio />} label="Yes" />
                            <FormControlLabel value="FALSE" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
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

export default XpairForm;

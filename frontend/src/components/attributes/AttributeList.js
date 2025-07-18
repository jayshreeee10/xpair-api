import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography
} from '@mui/material';

import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

import { Link } from 'react-router-dom';
import { getAttributes, deleteAttribute } from '../../services/api';
import AttributeForm from './AttributeForm';

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const data = await getAttributes();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        console.warn('Expected array but got:', typeof data);
        // Convert object to array if needed
        const dataArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAttributes(dataArray);
      } else {
        setAttributes(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (attribute) => {
    setAttributeToDelete(attribute);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAttribute(attributeToDelete.attribute_id);
      fetchAttributes();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleEditClick = (attribute) => {
    setInitialValues(attribute);
    setFormMode('edit');
    setOpenForm(true);
  };

  const handleCreateClick = () => {
    setInitialValues(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleFormSubmit = () => {
    setOpenForm(false);
    fetchAttributes();
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleCreateClick}
        sx={{ mb: 2 }}
      >
        Add Attribute
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Data Type</TableCell>
              <TableCell>Min Length</TableCell>
              <TableCell>Max Length</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.attribute_id}>
                <TableCell>{attribute.attribute_id}</TableCell>
                <TableCell>{attribute.attribute_name}</TableCell>
                <TableCell>{attribute.data_type}</TableCell>
                <TableCell>{attribute.min_length}</TableCell>
                <TableCell>{attribute.max_length}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditClick(attribute)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(attribute)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Attribute</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{attributeToDelete?.attribute_name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <AttributeForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialValues={initialValues}
      />
    </div>
  );
};

export default AttributeList;
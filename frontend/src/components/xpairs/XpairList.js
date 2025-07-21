import React, { useState, useEffect } from 'react';
import XpairCreateInlineForm from './components/XpairCreateInlineForm';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, TextField, Grid, Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
  getXpairAttributes,
  deleteXpairAttribute,
  getAttributeList,
  getXpairIOList
} from '../../services/api';
import { useParams } from 'react-router-dom';
import XpairForm from './XpairForm';

const XpairList = () => {
  const [refresh, setRefresh] = useState(false);
  const { ioId: xpairIoIdFromRoute } = useParams(); 
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [xpairIOs, setXpairIOs] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [filters, setFilters] = useState({
    xpair_io_id: '',
    attribute_id: '',
    level: '',
    is_master_node: '',
    is_master_node_array: '',
    master_node_attribute_id: '',
    placement_sequence: '',
    is_mandatory: '',

  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [xpairList, ioList, attrList] = await Promise.all([
      getXpairAttributes(),
      getXpairIOList(),
      getAttributeList()
    ]);

    setData(xpairList);
    // setFiltered(xpairList);
    setXpairIOs(ioList);
    setAttributes(attrList);
    if (xpairIoIdFromRoute) {
    setFilters(prev => ({ ...prev, xpair_io_id: xpairIoIdFromRoute }));
  } else {
    setFiltered(xpairList);
  }
  };
  useEffect(() => {
    const applyFilters = () => {
      let result = [...data];

      Object.keys(filters).forEach((key) => {
        const filterVal = filters[key];
        if (filterVal !== '') {
          result = result.filter((item) => {
            const itemVal = item[key];

            // Boolean fields fix
            if (filterVal === 'TRUE') return itemVal === true || itemVal === 1;
            if (filterVal === 'FALSE') return itemVal === false || itemVal === 0;

            // Everything else
            return String(itemVal) === String(filterVal);
          });
        }
      });

      setFiltered(result);
    };



    applyFilters();
  }, [filters, data]);

  const handleDeleteClick = (attribute) => {
    setAttributeToDelete(attribute);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteXpairAttribute(attributeToDelete.xpair_attribute_id);
    setOpenDeleteDialog(false);
    fetchAll();
  };

  const handleEditClick = (attribute) => {
    setInitialValues(attribute);
    setFormMode('edit');
    setOpenForm(true);
  };

  // const handleCreateClick = () => {
  //   setInitialValues(null);
  //   setFormMode('create');
  //   setOpenForm(true);
  // };

  const handleFormSubmit = () => {
    setOpenForm(false);
    fetchAll();
  };

  return (
    <div>
      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreateClick}
        sx={{ mb: 2 }}
      >
        Add Xpair Attribute
      </Button> */}
      <Box sx={{ mb: 2 }}>
  <XpairCreateInlineForm
    xpairIoIdFromRoute={xpairIoIdFromRoute}
    onCreated={fetchAll} // or handleFormSubmit if you'd like
  />
</Box>


      {/* Table */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} sx={{
          
          maxWidth: 1500,
          overflowX: 'auto',
          fontSize: '0.85rem',
        }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Xpair IO Id</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Attribute Id</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Level</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Master Node</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Master Node Array</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Master Node Attribute ID</TableCell>
                <TableCell sx={{ textAlign: 'center' }} >Placement Sequence</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Mandatory</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap',textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.xpair_attribute_id}>
                  <TableCell >
                    {/* {xpairIOs.find(io => io.xpair_io_id === item.xpair_io_id)?.xpair_io_name} */}
                    {item.xpair_io_id} ({xpairIOs.find(io => io.xpair_io_id === item.xpair_io_id)?.xpair_io_name})
                  </TableCell>
                  <TableCell >
                    {/* {attributes.find(attr => attr.attribute_id === item.attribute_id)?.attribute_name} */}
                    {item.attribute_id} ({attributes.find(attr => attr.attribute_id === item.attribute_id)?.attribute_name})
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.level}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.is_master_node === 1 ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.is_master_node_array === 1 ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.master_node_attribute_id ?? '—'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.placement_sequence}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{item.is_mandatory ? 'Yes' : 'No'}</TableCell>

                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton color="primary" onClick={() => handleEditClick(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Xpair Attribute</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Xpair Attribute?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog */}
      <XpairForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialValues={initialValues}
        xpairIoIdFromRoute={xpairIoIdFromRoute}
      />
    </div>
  );
};

export default XpairList;

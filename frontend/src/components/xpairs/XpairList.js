// import React, { useState, useEffect } from 'react';
// import XpairCreateInlineForm from './components/XpairCreateInlineForm';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
//   MenuItem, TextField, Grid, Box
// } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
// import {
//   getXpairAttributes,
//   deleteXpairAttribute,
//   getAttributeList,
//   getXpairIOList
// } from '../../services/api';
// import { useParams } from 'react-router-dom';
// import XpairForm from './XpairForm';

// const XpairList = () => {
//   const [refresh, setRefresh] = useState(false);
//   const { ioId: xpairIoIdFromRoute } = useParams(); 
//   const [data, setData] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [xpairIOs, setXpairIOs] = useState([]);
//   const [attributes, setAttributes] = useState([]);
//   const [filters, setFilters] = useState({
//     xpair_io_id: '',
//     attribute_id: '',
//     level: '',
//     is_master_node: '',
//     is_master_node_array: '',
//     master_node_attribute_id: '',
//     placement_sequence: '',
//     is_mandatory: '',

//   });

//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [attributeToDelete, setAttributeToDelete] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [formMode, setFormMode] = useState('create');
//   const [initialValues, setInitialValues] = useState(null);

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     const [xpairList, ioList, attrList] = await Promise.all([
//       getXpairAttributes(),
//       getXpairIOList(),
//       getAttributeList()
//     ]);

//     setData(xpairList);
//     // setFiltered(xpairList);
//     setXpairIOs(ioList);
//     setAttributes(attrList);
//     if (xpairIoIdFromRoute) {
//     setFilters(prev => ({ ...prev, xpair_io_id: xpairIoIdFromRoute }));
//   } else {
//     setFiltered(xpairList);
//   }
//   };
//   useEffect(() => {
//     const applyFilters = () => {
//       let result = [...data];

//       Object.keys(filters).forEach((key) => {
//         const filterVal = filters[key];
//         if (filterVal !== '') {
//           result = result.filter((item) => {
//             const itemVal = item[key];

//             // Boolean fields fix
//             if (filterVal === 'TRUE') return itemVal === true || itemVal === 1;
//             if (filterVal === 'FALSE') return itemVal === false || itemVal === 0;

//             // Everything else
//             return String(itemVal) === String(filterVal);
//           });
//         }
//       });

//       setFiltered(result);
//     };



//     applyFilters();
//   }, [filters, data]);

//   const handleDeleteClick = (attribute) => {
//     setAttributeToDelete(attribute);
//     setOpenDeleteDialog(true);
//   };

//   const handleDeleteConfirm = async () => {
//     await deleteXpairAttribute(attributeToDelete.xpair_attribute_id);
//     setOpenDeleteDialog(false);
//     fetchAll();
//   };

//   const handleEditClick = (attribute) => {
//     setInitialValues(attribute);
//     setFormMode('edit');
//     setOpenForm(true);
//   };

//   // const handleCreateClick = () => {
//   //   setInitialValues(null);
//   //   setFormMode('create');
//   //   setOpenForm(true);
//   // };

//   const handleFormSubmit = () => {
//     setOpenForm(false);
//     fetchAll();
//   };

//   return (
//     <div>
//       {/* <Button
//         variant="contained"
//         color="primary"
//         startIcon={<AddIcon />}
//         onClick={handleCreateClick}
//         sx={{ mb: 2 }}
//       >
//         Add Xpair Attribute
//       </Button> */}
//       <Box sx={{ mb: 2 }}>
//   <XpairCreateInlineForm
//     xpairIoIdFromRoute={xpairIoIdFromRoute}
//     onCreated={fetchAll} // or handleFormSubmit if you'd like
//   />
// </Box>


//       {/* Table */}
//       <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//         <TableContainer component={Paper} sx={{
          
//           maxWidth: 1500,
//           overflowX: 'auto',
//           fontSize: '0.85rem',
//         }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }}>Xpair IO Id</TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }}>Attribute Id</TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }}>Level</TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }}>Master Node</TableCell>
//                 <TableCell sx={{ textAlign: 'center' }}>Master Node Array</TableCell>
//                 <TableCell sx={{ textAlign: 'center' }}>Master Node Attribute ID</TableCell>
//                 <TableCell sx={{ textAlign: 'center' }} >Placement Sequence</TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }}>Mandatory</TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap',textAlign: 'center' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filtered.map((item) => (
//                 <TableRow key={item.xpair_attribute_id}>
//                   <TableCell >
//                     {/* {xpairIOs.find(io => io.xpair_io_id === item.xpair_io_id)?.xpair_io_name} */}
//                     {item.xpair_io_id} ({xpairIOs.find(io => io.xpair_io_id === item.xpair_io_id)?.xpair_io_name})
//                   </TableCell>
//                   <TableCell >
//                     {/* {attributes.find(attr => attr.attribute_id === item.attribute_id)?.attribute_name} */}
//                     {item.attribute_id} ({attributes.find(attr => attr.attribute_id === item.attribute_id)?.attribute_name})
//                   </TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.level}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.is_master_node === 1 ? 'Yes' : 'No'}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.is_master_node_array === 1 ? 'Yes' : 'No'}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.master_node_attribute_id ?? '—'}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.placement_sequence}</TableCell>
//                   <TableCell sx={{ textAlign: 'center' }}>{item.is_mandatory ? 'Yes' : 'No'}</TableCell>

//                   <TableCell>
//                     <Box display="flex" gap={1}>
//                       <IconButton color="primary" onClick={() => handleEditClick(item)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDeleteClick(item)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
//         <DialogTitle>Delete Xpair Attribute</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this Xpair Attribute?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Form Dialog */}
//       <XpairForm
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         onSubmit={handleFormSubmit}
//         mode={formMode}
//         initialValues={initialValues}
//         xpairIoIdFromRoute={xpairIoIdFromRoute}
//       />
//     </div>
//   );
// };

// export default XpairList;




import React, { useState, useEffect } from 'react';
import XpairCreateInlineForm from './components/XpairCreateInlineForm';
import {
  Button,
  Modal,
  Table,
  Tag,
  Input,
  Spin,
  message
} from 'antd';
import {
  getXpairAttributes,
  deleteXpairAttribute,
  getAttributeList,
  getXpairIOList
} from '../../services/api';
import { useParams } from 'react-router-dom';
import XpairForm from './XpairForm';
import './XpairList.css';

const { Search } = Input;

const XpairList = () => {
  const { ioId: xpairIoIdFromRoute } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [xpairIOs, setXpairIOs] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const showMessage = (type, content) => {
    message[type](content, 3);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [xpairList, ioList, attrList] = await Promise.all([
          getXpairAttributes(),
          getXpairIOList(),
          getAttributeList()
        ]);
        
        setData(xpairList);
        setXpairIOs(ioList);
        setAttributes(attrList);
        
        if (xpairIoIdFromRoute) {
          setFilteredData(xpairList.filter(item => item.xpair_io_id === Number(xpairIoIdFromRoute)));
        } else {
          setFilteredData(xpairList);
        }
        showMessage('success', 'Data loaded successfully');
      } catch (error) {
        console.error('Fetch error:', error);
        showMessage('error', 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [xpairIoIdFromRoute]);

  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(item => {
        const attr = attributes.find(a => a.attribute_id === item.attribute_id);
        return attr?.attribute_name?.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    } else {
      if (xpairIoIdFromRoute) {
        setFilteredData(data.filter(item => item.xpair_io_id === Number(xpairIoIdFromRoute)));
      } else {
        setFilteredData(data);
      }
    }
  }, [searchText, data, xpairIoIdFromRoute, attributes]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteXpairAttribute(selectedAttribute.xpair_attribute_id);
      setFilteredData(filteredData.filter(item => item.xpair_attribute_id !== selectedAttribute.xpair_attribute_id));
      showMessage('success', 'Attribute deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete attribute');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedAttribute(record);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSuccess = async () => {
    try {
      setFormLoading(true);
      const updatedData = await getXpairAttributes();
      setData(updatedData);
      
      if (xpairIoIdFromRoute) {
        setFilteredData(updatedData.filter(item => item.xpair_io_id === Number(xpairIoIdFromRoute)));
      } else {
        setFilteredData(updatedData);
      }
      
      showMessage('success', `Attribute ${formMode === 'create' ? 'created' : 'updated'} successfully`);
    } catch (error) {
      console.error('Refresh error:', error);
      showMessage('error', `Failed to ${formMode === 'create' ? 'create' : 'update'} attribute`);
    } finally {
      setFormLoading(false);
      setIsFormOpen(false);
    }
  };

  const columns = [
    {
      title: 'Xpair IO',
      dataIndex: 'xpair_io_id',
      key: 'xpair_io_id',
      render: (id) => {
        const io = xpairIOs.find(item => item.xpair_io_id === id);
        return io ? `${io.xpair_io_name} (${id})` : id;
      }
    },
    {
      title: 'Attribute Name',
      key: 'attribute_name',
      render: (_, record) => {
        const attr = attributes.find(item => item.attribute_id === record.attribute_id);
        return attr?.attribute_name || '—';
      }
    },
    {
      title: 'Attribute ID',
      dataIndex: 'attribute_id',
      key: 'attribute_id',
      align: 'center'
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
    },
    {
      title: 'Placement Sequence',
      dataIndex: 'placement_sequence',
      key: 'placement_sequence',
      align: 'center'
    },
    {
      title: 'Master Node',
      dataIndex: 'is_master_node',
      key: 'is_master_node',
      align: 'center',
      render: (value) => (
        <Tag className={value ? 'xpair-tag-yes' : 'xpair-tag-no'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Master Array',
      dataIndex: 'is_master_node_array',
      key: 'is_master_node_array',
      align: 'center',
      render: (value) => (
        <Tag className={value ? 'xpair-tag-yes' : 'xpair-tag-no'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Mandatory',
      dataIndex: 'is_mandatory',
      key: 'is_mandatory',
      align: 'center',
      render: (value) => (
        <Tag className={value ? 'xpair-tag-yes' : 'xpair-tag-no'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <div className="xpair-action-buttons">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="xpair-action-button"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              setSelectedAttribute(record);
              setIsDeleteModalOpen(true);
            }}
            className="xpair-action-button"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="xpair-container">
      <div className="xpair-header">
        <h2>Xpair Attributes</h2>
        {!xpairIoIdFromRoute && (
          <Button
            type="primary"
            onClick={() => {
              setSelectedAttribute(null);
              setFormMode('create');
              setIsFormOpen(true);
            }}
          >
            Add Attribute
          </Button>
        )}
      </div>

      <XpairCreateInlineForm
        xpairIoIdFromRoute={xpairIoIdFromRoute}
        onCreated={handleFormSuccess}
      />

      <Spin spinning={loading}>
        <div className="xpair-table-section">
          <div className="xpair-table-header">
            <Search
              placeholder="Search by attribute name"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />
          </div>
          <div className="xpair-table-container">
            <Table
              className="xpair-table"
              columns={columns}
              dataSource={filteredData}
              rowKey="xpair_attribute_id"
              bordered
              scroll={{ x: true }}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
      </Spin>

      <Modal
        className="xpair-modal"
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={deleteLoading}
      >
        <p>Are you sure you want to delete this attribute?</p>
      </Modal>

      <XpairForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSuccess}
        mode={formMode}
        initialValues={selectedAttribute}
        xpairIoIdFromRoute={xpairIoIdFromRoute}
        loading={formLoading}
      />
    </div>
  );
};

export default XpairList;
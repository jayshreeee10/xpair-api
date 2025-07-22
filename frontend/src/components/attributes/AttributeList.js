import React, { useState, useEffect } from 'react';
import { 
  Button,
  message,
  Table,
  Input,
  Space,
  Modal,
  Tag,
  
} from 'antd';


import { 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { getAttributes, deleteAttribute } from '../../services/api';
import AttributeForm from './AttributeForm';
import './AttributeList.css';

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
      
      if (!Array.isArray(data)) {
        console.warn('Expected array but got:', typeof data);
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
      message.error('Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  const renderEnumValues = (enums) => {
    if (!enums || enums.length === 0) return '-';
    
    // Handle case where enums might be a string (JSON) or already an array
    let enumArray = enums;
    if (typeof enums === 'string') {
      try {
        enumArray = JSON.parse(enums);
      } catch (e) {
        console.error('Error parsing enum values:', e);
        return '-';
      }
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {enumArray.map((value, index) => (
          <Tag key={index} color="blue">
            {value}
          </Tag>
        ))}
      </div>
    );
  };

  const handleDeleteClick = (attribute) => {
    setAttributeToDelete(attribute);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAttribute(attributeToDelete.attribute_id);
      fetchAttributes();
      setOpenDeleteModal(false);
      message.success('Attribute deleted successfully');
    } catch (error) {
      console.error('Error deleting attribute:', error);
      message.error('Failed to delete attribute');
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
    message.success(`Attribute ${formMode === 'create' ? 'created' : 'updated'} successfully`);
  };

  const filteredAttributes = attributes.filter(attr =>
    attr.attribute_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'attribute_id',
      key: 'attribute_id',
      sorter: (a, b) => a.attribute_id - b.attribute_id,
    },
    {
      title: 'Name',
      dataIndex: 'attribute_name',
      key: 'attribute_name',
      sorter: (a, b) => a.attribute_name.localeCompare(b.attribute_name),
    },
    {
      title: 'Data Type',
      dataIndex: 'data_type',
      key: 'data_type',
    },
    {
      title: 'Min Length',
      dataIndex: 'min_length',
      key: 'min_length',
      render: (value) => value || '-',
    },
    {
      title: 'Max Length',
      dataIndex: 'max_length',
      key: 'max_length',
      render: (value) => value || '-',
    },
    {
      title: 'Enum Values',
      dataIndex: 'enum',
      key: 'enum',
      render: renderEnumValues,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="attribute-list-container">
      <div className="attribute-list-header">
        <Input.Search
          placeholder="Search by attribute name"
          allowClear
          enterButton
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateClick}
        >
          Add Attribute
        </Button>
      </div>

      <Table
        className="attribute-table"
        columns={columns}
        dataSource={filteredAttributes}
        rowKey="attribute_id"
        loading={loading}
        pagination={{
          pageSize: 7,
          showSizeChanger: false,
        }}
        scroll={{ x: true }}
      />

      <Modal
        title="Delete Attribute"
        open={openDeleteModal}
        onOk={handleDeleteConfirm}
        onCancel={() => setOpenDeleteModal(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete "{attributeToDelete?.attribute_name}"?</p>
      </Modal>

      <AttributeForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialValues={initialValues}
        onError={(message) => {
          message.error(message);
        }}
      />
    </div>
  );
};

export default AttributeList;
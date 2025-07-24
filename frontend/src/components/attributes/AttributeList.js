import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Button,
  message,
  Table,
  Input,
  Space,
  Modal,
  Tag,
  Spin
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { getAttributes, deleteAttribute } from '../../services/api';
import AttributeForm from './AttributeForm';
import './AttributeList.css';

const renderEnumValues = (enums) => {
  if (!enums || enums.length === 0) return '-';
  
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

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [initialValues, setInitialValues] = useState(null);

  const fetchAttributes = useCallback(async () => {
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
      message.error('Failed to fetch attributes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const handleDeleteClick = useCallback((attribute) => {
    setAttributeToDelete(attribute);
    setOpenDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      setDeleteLoading(true);
      await deleteAttribute(attributeToDelete.attribute_id);
      await fetchAttributes();
      message.success(`Attribute "${attributeToDelete.attribute_name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting attribute:', error);
      message.error(`Failed to delete attribute "${attributeToDelete.attribute_name}"`);
    } finally {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
    }
  }, [attributeToDelete, fetchAttributes]);

  const handleEditClick = useCallback((attribute) => {
    setInitialValues(attribute);
    setFormMode('edit');
    setOpenForm(true);
  }, []);

  const handleCreateClick = useCallback(() => {
    setInitialValues(null);
    setFormMode('create');
    setOpenForm(true);
  }, []);

  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await fetchAttributes();
      message.success(`Attribute ${formMode === 'create' ? 'created' : 'updated'} successfully`);
      setOpenForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(`Failed to ${formMode === 'create' ? 'create' : 'update'} attribute`);
    } finally {
      setLoading(false);
    }
  }, [fetchAttributes, formMode]);

  const filteredAttributes = useMemo(() => 
    attributes.filter(attr =>
      attr.attribute_name.toLowerCase().includes(searchText.toLowerCase())
    ), [attributes, searchText]);

  const columns = useMemo(() => [
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
  ], [handleEditClick, handleDeleteClick]);

  const deleteModal = (
    <Modal
      title="Delete Attribute"
      open={openDeleteModal}
      onOk={handleDeleteConfirm}
      onCancel={() => setOpenDeleteModal(false)}
      okText="Delete"
      cancelText="Cancel"
      confirmLoading={deleteLoading}
    >
      <p>Are you sure you want to delete "{attributeToDelete?.attribute_name}"?</p>
    </Modal>
  );

  const attributeForm = (
    <AttributeForm 
      open={openForm} 
      onClose={() => setOpenForm(false)} 
      onSubmit={handleFormSubmit}
      mode={formMode}
      initialValues={initialValues}
      loading={loading}
      onError={(message) => {
        message.error(message);
      }}
    />
  );

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

      <Spin spinning={loading}>
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
      </Spin>

      {deleteModal}
      {attributeForm}
    </div>
  );
};

export default AttributeList;
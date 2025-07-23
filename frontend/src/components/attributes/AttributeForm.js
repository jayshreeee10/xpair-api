// import React, { useEffect, useState } from 'react';
// import { 
//   Modal,
//   Form,
//   Input,
//   Select,
//   Radio,
//   Button,
//   Tag,
//   AutoComplete,
//   message
// } from 'antd';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { createAttribute, updateAttribute, getAttributes } from '../../services/api';
// import './AttributeList.css';

// const { Option } = Select;
// const { TextArea } = Input;

// const dataTypes = ['String', 'Number', 'Object', 'Array', 'Boolean'];
// const booleanOptions = ['TRUE', 'FALSE'];

// const AttributeForm = ({ open, onClose, onSubmit, mode, initialValues, onError }) => {
//   const [form] = Form.useForm();
//   const [attributeNames, setAttributeNames] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAttributeNames = async () => {
//       try {
//         setLoading(true);
//         const response = await getAttributes();
//         const names = Array.isArray(response) ? 
//           response.map(attr => attr.attribute_name) : 
//           Object.values(response).map(attr => attr.attribute_name);
//         setAttributeNames(names);
//       } catch (error) {
//         console.error('Error fetching attribute names:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open) {
//       fetchAttributeNames();
//     }
//   }, [open]);

//   useEffect(() => {
//     if (initialValues) {
//       const formattedValues = {
//         attribute_name: initialValues.attribute_name || '',
//         data_type: initialValues.data_type || 'String',
//         min_length: initialValues.min_length || null,
//         max_length: initialValues.max_length || null,
//         is_numeric: initialValues.is_numeric || 'FALSE',
//         is_date: initialValues.is_date || 'FALSE',
//         is_timestamp: initialValues.is_timestamp || 'FALSE',
//         enum: Array.isArray(initialValues.enum) ? 
//               initialValues.enum : 
//               (typeof initialValues.enum === 'string' ? 
//                JSON.parse(initialValues.enum) : 
//                []),
//       };
//       form.setFieldsValue(formattedValues);
//     } else {
//       form.resetFields();
//     }
//   }, [initialValues, form]);

//   const validationSchema = Yup.object({
//     attribute_name: Yup.string()
//       .required('Attribute name is required')
//       .test(
//         'unique-name',
//         'An attribute with this name already exists',
//         (value) => {
//           if (mode === 'edit' && value === initialValues?.attribute_name) {
//             return true;
//           }
//           return !attributeNames.includes(value);
//         }
//       ),
//     data_type: Yup.string().required('Data type is required').oneOf(dataTypes),
//     min_length: Yup.number().nullable().min(0, 'Must be positive'),
//     max_length: Yup.number()
//       .nullable()
//       .min(Yup.ref('min_length'), 'Max length must be greater than or equal to min length'),
//     is_numeric: Yup.string().oneOf(booleanOptions),
//     is_date: Yup.string().oneOf(booleanOptions),
//     is_timestamp: Yup.string().oneOf(booleanOptions),
//     enum: Yup.array().of(Yup.string()).nullable(),
//   });

//   const handleSubmit = async (values) => {
//     try {
//       await validationSchema.validate(values, { abortEarly: false });
      
//       const payload = {
//         ...values,
//         min_length: values.min_length || null,
//         max_length: values.max_length || null,
//         enum: values.enum && values.enum.length > 0 ? values.enum : null
//       };

//       if (mode === 'create') {
//         await createAttribute(payload);
//       } else {
//         await updateAttribute(initialValues.attribute_id, payload);
//       }
      
//       onSubmit();
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         const errors = {};
//         error.inner.forEach(err => {
//           errors[err.path] = err.message;
//         });
//         form.setFields(
//           Object.keys(errors).map(key => ({
//             name: key,
//             errors: [errors[key]]
//           }))
//         );
//       } else if (error.message === 'An attribute with this name already exists') {
//         form.setFields([{
//           name: 'attribute_name',
//           errors: [error.message]
//         }]);
//       } else {
//         onError(error.response?.data?.error || 'An error occurred');
//       }
//     }
//   };

//   return (
//     <Modal
//       title={mode === 'create' ? 'Create New Attribute' : 'Edit Attribute'}
//       open={open}
//       onCancel={onClose}
//       footer={[
//         <Button key="back" onClick={onClose}>
//           Cancel
//         </Button>,
//         <Button 
//           key="submit" 
//           type="primary" 
//           loading={loading}
//           onClick={() => form.submit()}
//         >
//           {mode === 'create' ? 'Create' : 'Update'}
//         </Button>,
//       ]}
//       width={800}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//       >
//         <Form.Item
//           label="Attribute Name"
//           name="attribute_name"
//           rules={[{ required: true, message: 'Please input the attribute name!' }]}
//         >
//           <Input placeholder="Enter attribute name" />
//         </Form.Item>

//         <Form.Item
//           label="Data Type"
//           name="data_type"
//           rules={[{ required: true, message: 'Please select a data type!' }]}
//         >
//           <Select placeholder="Select data type">
//             {dataTypes.map(type => (
//               <Option key={type} value={type}>{type}</Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Min Length" name="min_length">
//           <Input type="number" min={0} placeholder="Enter min length" />
//         </Form.Item>

//         <Form.Item label="Max Length" name="max_length">
//           <Input type="number" min={0} placeholder="Enter max length" />
//         </Form.Item>

//         <Form.Item label="Is Numeric" name="is_numeric">
//           <Radio.Group>
//             <Radio value="TRUE">Yes</Radio>
//             <Radio value="FALSE">No</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Is Date" name="is_date">
//           <Radio.Group>
//             <Radio value="TRUE">Yes</Radio>
//             <Radio value="FALSE">No</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Is Timestamp" name="is_timestamp">
//           <Radio.Group>
//             <Radio value="TRUE">Yes</Radio>
//             <Radio value="FALSE">No</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Enum Values" name="enum">
//           <Select
//             mode="tags"
//             style={{ width: '100%' }}
//             placeholder="Add enum values"
//             tokenSeparators={[',']}
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AttributeForm;





import React, { useEffect, useState } from 'react';
import { 
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Tag,
  message,
  Select 
} from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createAttribute, updateAttribute, getAttributes } from '../../services/api';
import './AttributeList.css';

const { TextArea } = Input;

const booleanOptions = ['TRUE', 'FALSE'];

const AttributeForm = ({ open, onClose, onSubmit, mode, initialValues, onError }) => {
  const [form] = Form.useForm();
  const [attributeNames, setAttributeNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttributeNames = async () => {
      try {
        setLoading(true);
        const response = await getAttributes();
        const names = Array.isArray(response) ? 
          response.map(attr => attr.attribute_name) : 
          Object.values(response).map(attr => attr.attribute_name);
        setAttributeNames(names);
      } catch (error) {
        console.error('Error fetching attribute names:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchAttributeNames();
    }
  }, [open]);

  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        attribute_name: initialValues.attribute_name || '',
        data_type: initialValues.data_type || '',
        min_length: initialValues.min_length || null,
        max_length: initialValues.max_length || null,
        is_numeric: initialValues.is_numeric || 'FALSE',
        is_date: initialValues.is_date || 'FALSE',
        is_timestamp: initialValues.is_timestamp || 'FALSE',
        enum: Array.isArray(initialValues.enum) ? 
              initialValues.enum : 
              (typeof initialValues.enum === 'string' ? 
               JSON.parse(initialValues.enum) : 
               []),
      };
      form.setFieldsValue(formattedValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  // const validationSchema = Yup.object({
  //   attribute_name: Yup.string()
  //     .required('Attribute name is required')
  //     .test(
  //       'unique-name',
  //       'An attribute with this name already exists',
  //       (value) => {
  //         if (mode === 'edit' && value === initialValues?.attribute_name) {
  //           return true;
  //         }
  //         return !attributeNames.includes(value);
  //       }
  //     ),
  //   data_type: Yup.string()
  //     .required('Data type is required')
  //     .matches(/^[a-zA-Z]+$/, 'Data type must contain only letters'),
  //   min_length: Yup.number().nullable().min(0, 'Must be positive'),
  //   max_length: Yup.number()
  //     .nullable()
  //     .min(Yup.ref('min_length'), 'Max length must be greater than or equal to min length'),
  //   is_numeric: Yup.string().oneOf(booleanOptions),
  //   is_date: Yup.string().oneOf(booleanOptions),
  //   is_timestamp: Yup.string().oneOf(booleanOptions),
  //   enum: Yup.array().of(Yup.string()).nullable(),
  // });

  
  const validationSchema = Yup.object({
  attribute_name: Yup.string()
    .required('Attribute name is required')
    .test(
      'unique-name',
      'An attribute with this name already exists',
      (value) => {
        if (mode === 'edit' && value === initialValues?.attribute_name) {
          return true;
        }
        return !attributeNames.includes(value);
      }
    ),
  data_type: Yup.string()
    .required('Data type is required')
    .matches(/^[a-zA-Z]+$/, 'Data type must contain only letters'),
  min_length: Yup.number().nullable().min(0, 'Must be positive'),
  max_length: Yup.number()
    .nullable()
    .min(Yup.ref('min_length'), 'Max length must be greater than or equal to min length'),
  is_numeric: Yup.string()
    .oneOf(booleanOptions)
    .required('Is Numeric is required'),
  is_date: Yup.string()
    .oneOf(booleanOptions)
    .required('Is Date is required'),
  is_timestamp: Yup.string()
    .oneOf(booleanOptions)
    .required('Is Timestamp is required'),
  enum: Yup.array().of(Yup.string()).nullable(),
});

  
  const handleSubmit = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      
      const payload = {
        ...values,
        min_length: values.min_length || null,
        max_length: values.max_length || null,
        enum: values.enum && values.enum.length > 0 ? values.enum : null
      };

      if (mode === 'create') {
        await createAttribute(payload);
      } else {
        await updateAttribute(initialValues.attribute_id, payload);
      }
      
      onSubmit();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        form.setFields(
          Object.keys(errors).map(key => ({
            name: key,
            errors: [errors[key]]
          }))
        );
      } else if (error.message === 'An attribute with this name already exists') {
        form.setFields([{
          name: 'attribute_name',
          errors: [error.message]
        }]);
      } else {
        onError(error.response?.data?.error || 'An error occurred');
      }
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create New Attribute' : 'Edit Attribute'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Attribute Name"
          name="attribute_name"
          rules={[{ required: true, message: 'Please input the attribute name!' }]}
        >
          <Input placeholder="Enter attribute name" />
        </Form.Item>

        <Form.Item
          label="Data Type"
          name="data_type"
          rules={[
            { required: true, message: 'Please input the data type!' },
            { 
              pattern: /^[a-zA-Z]+$/, 
              message: 'Data type must contain only letters' 
            }
          ]}
        >
          <Input placeholder="Enter data type (letters only)" />
        </Form.Item>

        <Form.Item label="Min Length" name="min_length">
          <Input type="number" min={0} placeholder="Enter min length" />
        </Form.Item>

        <Form.Item label="Max Length" name="max_length">
          <Input type="number" min={0} placeholder="Enter max length" />
        </Form.Item>

        <Form.Item label="Is Numeric" name="is_numeric"
        rules={[{ required: true, message: 'Please select whether it is numeric!' }]}>
          <Radio.Group>
            <Radio value="TRUE">Yes</Radio>
            <Radio value="FALSE">No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Is Date" name="is_date" 
        rules={[{ required: true, message: 'Please select whether it is a date!' }]}>
          <Radio.Group>
            <Radio value="TRUE">Yes</Radio>
            <Radio value="FALSE">No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Is Timestamp" name="is_timestamp"
        rules={[{ required: true, message: 'Please select whether it is a timestamp!' }]}>
          <Radio.Group>
            <Radio value="TRUE">Yes</Radio>
            <Radio value="FALSE">No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Enum Values" name="enum">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add enum values"
            tokenSeparators={[',']}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttributeForm;
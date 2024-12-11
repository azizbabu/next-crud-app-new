import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCommon } from '@/store';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AppForm = ({ currentUser, onSubmit, formRef }) => {
  const [form] = useForm();
  let { countryList } = useSelector(selectCommon);

  countryList = countryList.map(item => ({
    ...item,
    label: item.text_en,
  }));

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name_en: currentUser.name_en,
        name_bn: currentUser.name_bn,
        email: currentUser.email,
        username: currentUser.username,
        mobile: currentUser.mobile,
        birth_date: currentUser.birth_date ? moment(currentUser.birth_date) : null,
        country_id: currentUser.country_id,
        photo: currentUser.photo,
      });
    } else {
      form.resetFields();
    }
  }, [currentUser, form]);

  const handleFormSubmit = async (values) => {
    const formData = { ...values, birth_date: moment(values.birth_date).format("YYYY-MM-DD") }; // Handle photo later
    onSubmit(formData);
  };

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      layout="vertical"
      ref={formRef}
    >
      <Form.Item
        name="name_en"
        label="Name (English)"
        rules={[{ required: true, message: 'Please input name in English!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name_bn"
        label="Name (Bangla)"
        rules={[{ required: true, message: 'Please input name in Bangla!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: 'email', message: 'Please input a valid email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: 'Please input username!' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username should be alphanumeric and can contain underscores.' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="Mobile"
        rules={[{ required: true, message: 'Please input mobile number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birth_date"
        label="Birth Date"
        rules={[{ required: true, message: 'Please input birth date!' }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="photo"
        label="Photo"
        valuePropName="file"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList;
        }}
        extra="Upload photo (optional)"
      >
        <Upload
          name="photo"
          listType="picture-card"
          showUploadList={false}
          action=""
          beforeUpload={(file) => {
            // Convert to base64 before upload
            const reader = new FileReader();
            reader.onload = (e) => {
              form.setFieldsValue({
                photo: e.target.result,
              });
            };
            reader.readAsDataURL(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        {currentUser && currentUser.photo && (
          <img 
            src={`${API_BASE_URL}/download-attachment?file=${currentUser.photo}`} 
            alt="User profile" 
            width="70"
          />
        )}
      </Form.Item>

      <Form.Item
        name="country_id"
        label="Country"
        rules={[{ required: true, message: 'Please select country!' }]}
      >
        <Select placeholder="Select a post">
          {countryList.map((obj) => (
            <Select.Option key={obj.value} value={obj.value}>
              {obj.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AppForm;

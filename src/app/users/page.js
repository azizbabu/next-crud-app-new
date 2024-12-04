"use client";
import React, { useEffect, useState } from 'react';
import { Table, Popconfirm, Button, Flex, Typography, Modal, Form, Input, DatePicker, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import axios from 'axios';
import qs from 'qs';
import Link from 'next/link';
import CustomButton from '@/app/components/CustomButton';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useSelector } from 'react-redux';
import { selectCommon } from '@/store/store';
const { Title } = Typography;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let currentDate = new Date().toISOString().slice(0, 10)

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  let { countryList } = useSelector(selectCommon);

  countryList = countryList.map(item => {
    return Object.assign({}, item, { label: item.text_en })
  })
  console.log('countryList 2', countryList)
  // Fetching users
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/users/list?${qs.stringify({
        page: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      })}`)
      .then((response) => {
        const { data: results, current_page, total, per_page } = response.data.data;
        setData(results);
        setLoading(false);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            current: current_page,
            total: total,
            pageSize: per_page,
          },
        }));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Handle Delete
  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/destroy/${id}`);
      if (response.data.success) {
        setData((prevData) => prevData.filter((obj) => obj.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  // Open the modal (for create or edit)
  const openModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      form.setFieldsValue({
        name_en: user.name_en,
        name_bn: user.name_bn,
        email: user.email,
        username: user.username,
        mobile: user.mobile,
        birth_date: user.birth_date ? moment(user.birth_date) : null,
        country_id: user.country_id,
        photo: user.photo,
      });
    } else {
      setCurrentUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle Form Submission
  const handleFormSubmit = async (values) => {
    console.log('values', values)
    
    const formData = { ...values, birth_date: moment(values.birth_date).format("YYYY-MM-DD") }; // Handle photo later
    
    // If editing, send update request
    if (currentUser) {
      try {
        const response = await axios.put(`${API_BASE_URL}/users/update/${currentUser.id}`, formData);
        if (response.data.success) {
          message.success('User updated successfully');
          fetchData();
          setIsModalVisible(false);
        } else {
          message.error('Failed to update user');
        }
        
      } catch (err) {
        message.error('Failed to update user');
      }
    } else {
      // If creating, send create request
      try {
        const response = await axios.post(`${API_BASE_URL}/users/store`, formData);
        if (response.data.success) {
          message.success('User created successfully');
          fetchData();
          setIsModalVisible(false);
        } else {
          message.error('Failed to create user');
        }
      } catch (err) {
        message.error('Failed to create user');
      }
    }
  };

  // Fetch Data on Page Load
  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  // Handle Table Changes (Pagination, Sorting, etc.)
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'key',
      render: (text, record, index) => index + 1 + (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
    },
    {
      title: 'Name',
      dataIndex: 'name_en',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (status === 1 ? 'Active' : 'Inactive'),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div>
          <Flex gap="small">
            <Button type="primary" onClick={() => openModal(record)}>Edit</Button>
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => deleteItem(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger">Delete</Button>
            </Popconfirm>
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ marginBottom: '16px' }}>Users</Title>
      <Button type="primary" style={{ marginBottom: '16px' }} onClick={() => openModal()}>
        Create User
      </Button>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={{
          current: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          total: tableParams.pagination.total,
          onChange: (page, pageSize) => {
            setTableParams((prev) => ({
              ...prev,
              pagination: {
                ...prev.pagination,
                current: page,
                pageSize,
              },
            }));
          },
        }}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* Modal for Create/Edit */}
      <Modal
        title={currentUser ? 'Edit User' : 'Create User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
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
                  console.log('e.target.result', e.target.result)
                };
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {currentUser && currentUser.photo ? (
              <img 
              src={`${API_BASE_URL}/download-attachment?file=${currentUser.photo}`} 
              alt="User profile" 
              width="70"
            />
            ) : ('')}
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
      </Modal>
    </>
  );
};

export default Users;

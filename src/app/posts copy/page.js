"use client";
import React, { useEffect, useState } from 'react';
import { Table, Popconfirm, Button, Flex, Typography } from 'antd';
import axios from 'axios';
import qs from 'qs';
import Link from 'next/link'; // Assuming you're using Next.js for routing
import CustomButton from '@/app/components/CustomButton';
const { Title } = Typography;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const getRandomuserParams = (params) => ({
//   results: params.pagination?.pageSize,
//   page: params.pagination?.current,
//   ...params,
// });

const Posts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  // const fetchData = () => {
  //   setLoading(true);
  //   axios
  //     .get(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
  //     .then((response) => {
  //       const results = response.data.results;
  //       setData(results);
  //       setLoading(false);
  //       setTableParams((prev) => ({
  //         ...prev,
  //         pagination: {
  //           ...prev.pagination,
  //           total: 200, // Mock total
  //         },
  //       }));
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // };

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/posts/list?${qs.stringify({
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

  const deletePost = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/destroy/${id}`);
      if (response.data.success) {
        setData((prevData) => prevData.filter((post) => post.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // Clear data when page size changes
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'key', // Assuming this is your unique identifier
      render: (text, record, index) => index + 1 + (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
    },
    {
      title: 'Title',
      dataIndex: 'title_en',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (status === 1 ? 'Active' : 'Inactive'),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(), // Format date as needed
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div>
          <Flex gap="small">
            <Link href={`/posts/edit/${record.id}`} passHref>
              <Button type="primary">Edit</Button>
            </Link>
            <Link href={`/posts/show/${record.id}`} passHref>
              <CustomButton color="green">Show</CustomButton>
            </Link>
            <Popconfirm
              title="Are you sure you want to delete this post?"
              onConfirm={() => deletePost(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid">Delete</Button>
            </Popconfirm>
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ marginBottom: '16px' }}>Posts</Title>
      <Link href={`/posts/create`} passHref>
        <Button type="primary" style={{ marginBottom: '16px' }}>Create</Button>
      </Link>
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
    </>
  );
};

export default Posts;


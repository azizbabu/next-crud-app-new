"use client";  // Ensure this component is a client component
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Popconfirm, Button, Flex, Typography } from 'antd';
import axios from 'axios';
import qs from 'qs';
import Link from 'next/link';
import { setPosts, setLoading, setError } from '@/store/postsSlice';
import CustomButton from '@/app/components/CustomButton';
const { Title } = Typography;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Posts = () => {
  const dispatch = useDispatch();
  const { postList, loading, error } = useSelector((state) => state.posts);
  const [tableParams, setTableParams] = React.useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    dispatch(setLoading(true));  // Set loading state to true
    axios
      .get(`${API_BASE_URL}/posts/list?${qs.stringify({
        page: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      })}`)
      .then((response) => {
        const { data: results, current_page, total, per_page } = response.data.data;

        // Ensure results is always an array
        dispatch(setPosts(Array.isArray(results) ? results : []));
        dispatch(setLoading(false));

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
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(setError(error.message));  // Store error in Redux state
      });
  };

  const deletePost = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/destroy/${id}`);
      if (response.data.success) {
        // Remove post from Redux store
        dispatch(setPosts(postList.filter((post) => post.id !== id)));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
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

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      dispatch(setPosts([]));  // Clear data on page size change
    }
  };

  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'key', // Assuming this is your unique identifier
      render: (text, record, index) => index + 1 + (tableParams.pagination.current - 1) * tableParams.pagination.pageSize,
      width: '10%'
    },
    {
      title: 'Title',
      dataIndex: 'title_en',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (status === 1 ? 'Active' : 'Inactive'),
      width: '10%'
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
      width: '15%'
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
      width: '20%'
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
        dataSource={postList} // Use the postList from Redux
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

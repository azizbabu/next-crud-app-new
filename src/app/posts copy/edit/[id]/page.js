"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Form, Input, Button, message, Spin } from 'antd';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PostEdit({ params }) {
  const router = useRouter();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/show/${params.id}`);
        setPostData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const onFinish = async (values) => {
    const formData = {
      title_en: values.title_en,
      title_bn: values.title_bn,
      content_en: values.content_en,
      content_bn: values.content_bn,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/posts/update/${params.id}`, formData);
      if (response.data.success) {
        message.success('Post updated successfully!');
        router.push('/posts');
      } else {
        message.error('Failed to update post. Please try again.');
      }
    } catch (err) {
      console.error("Error updating post:", err);
      message.error('Failed to update post. Please try again.');
    }
  };

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <div>Error loading post: {error.message}</div>;

  return (
    <Form
      layout="vertical"
      initialValues={{
        title_en: postData?.title_en || '',
        title_bn: postData?.title_bn || '',
        content_en: postData?.content_en || '',
        content_bn: postData?.content_bn || '',
      }}
      onFinish={onFinish}
      style={{ maxWidth: '600px', margin: 'auto' }}
    >
      <h2 className='font-bold text-yellow-500 py-2 underline'>Form Edit</h2>
      
      <Form.Item
        label="Title (English)"
        name="title_en"
        rules={[{ required: true, message: 'Title (English) is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Title (Bangla)"
        name="title_bn"
        rules={[{ required: true, message: 'Title (Bangla) is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Content (English)"
        name="content_en"
        rules={[{ required: true, message: 'Content (English) is required' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Content (Bangla)"
        name="content_bn"
        rules={[{ required: true, message: 'Content (Bangla) is required' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}


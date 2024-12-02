
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addPost } from '@/store/postsSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PostCreate() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/store`, {
        title_en: values.title_en,
        title_bn: values.title_bn,
        content_en: values.content_en,
        content_bn: values.content_bn,
      });

      if (response.data.success) {
        message.success('Post added successfully!');
        dispatch(addPost(response.data.data)); // Dispatch to Redux store
        router.push('/posts');
      } else {
        message.error('Failed to add post. Please try again.');
      }
    } catch (error) {
      console.error("Error adding post:", error);
      message.error('Failed to add post. Please try again.');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: '600px', margin: 'auto' }}
    >
      <h2 className='font-bold text-yellow-500 py-2 underline'>Form Add</h2>
      
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


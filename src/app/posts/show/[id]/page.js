"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert, Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Detail({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/show/${params.id}`);
        console.log('Fetched post data:', response.data.data); // Log the fetched data directly
        setPost(response.data.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching post:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Alert message="Error loading post" description={error.message} type="error" showIcon />;
  if (!post) return <Alert message="No post found" type="warning" showIcon />;

  return (
    <div className='w-full'>
      <Card>
        <Title level={2} className='text-center'>{post.title_en}</Title>
        <Paragraph className='w-full max-w-4xl m-auto'>
          <div dangerouslySetInnerHTML={{ __html: post.content_en }}></div>
        </Paragraph>
      </Card>
    </div>
  );
}


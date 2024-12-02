import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';

const CustomLinkButton = ({ color, size, shape, children, href, ...props }) => {
  const buttonStyle = {
    backgroundColor: color,
    borderColor: color,
    color: '#fff', // Set text color based on the background
    display: 'inline-block', // Ensure it behaves like a button
  };

  return (
    <Link href={href} passHref>
      <Button style={buttonStyle} {...props}>
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
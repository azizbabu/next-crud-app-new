import React from 'react';
import { Button } from 'antd';

const CustomButton = ({ color, size, shape, children, ...props }) => {
    const buttonStyle = {
        backgroundColor: color,
        borderColor: color,
        color: '#fff',
    };

    return (
        <Button style={buttonStyle} size={size} shape={shape} {...props}>
        {children}
        </Button>
    );
};

export default CustomButton;
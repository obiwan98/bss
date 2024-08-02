import { Typography } from 'antd';
import React from 'react';
import './LogoText.css';

const { Text } = Typography;

function LogoText() {
  return (
  	<div className="logo-text">
      <Text className="logo-title">BSS</Text>
    </div>
  );
}

export default LogoText;

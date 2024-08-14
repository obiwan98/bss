import { Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import './LogoText.css';

const { Text } = Typography;

const LogoText = () => {
  return (
  	<div className="logo-text">
      <Link to="/"><Text className="logo-title">BSS</Text></Link>
    </div>
  );
}

export default LogoText;

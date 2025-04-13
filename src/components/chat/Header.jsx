import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Header = () => {
  return (
    <div style={{ 
      background: '#1a1a1a', 
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      width: '100%',
      zIndex: 999,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      height: 64
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          AI Review Responder
        </Title>
      </div>
    </div>
  );
};

export default Header; 

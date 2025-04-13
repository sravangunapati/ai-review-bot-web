import React from 'react';
import { Input, Button, ConfigProvider } from 'antd';
import { ArrowUpOutlined, PlusOutlined } from '@ant-design/icons';

const InputArea = ({ 
  input, 
  onInputChange, 
  onSend, 
  loading, 
  showNewChat, 
  onNewReview,
  conversationState
}) => {
  if (showNewChat || conversationState === 'complete') {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <Button
          type="text"
          onClick={onNewReview}
          style={{
            borderRadius: '20px',
            padding: '0 24px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(250, 249, 249, 0.94)';
            e.currentTarget.style.setProperty('color', 'black', 'important');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.setProperty('color', 'white', 'important');
          }}
        >
          <PlusOutlined />
          Add a new Review
        </Button>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
            colorText: 'white',
          },
        },
      }}
    >
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '4px',
        width: '100%'
      }}>
        <Input
          placeholder={conversationState === 'rating' ? "Enter rating (1-5)..." : "Type your review here..."}
          value={input}
          onChange={onInputChange}
          onPressEnter={onSend}
          disabled={loading}
          style={{
            border: 'none',
            background: 'transparent',
            boxShadow: 'none',
            color: 'white',
          }}
          suffix={
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              onClick={onSend}
              loading={loading}
              disabled={loading || (conversationState === 'rating' && (!input.trim() || !/^[1-5]$/.test(input.trim())))}
              style={{
                color: input.trim() ? '#1890ff' : '#d9d9d9'
              }}
            />
          }
        />
      </div>
    </ConfigProvider>
  );
};

export default InputArea; 

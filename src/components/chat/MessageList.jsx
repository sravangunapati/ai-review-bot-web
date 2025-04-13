import React from 'react';
import { List } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const MessageList = ({ messages }) => {
  console.log(messages);
  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto', 
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <List
        dataSource={messages}
        style={{ width: '100%', maxWidth: '800px' }}
        renderItem={(item) => (
          <List.Item style={{ 
            color: 'white',
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            justifyContent: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }}>
            <List.Item.Meta
              avatar={item.role === 'user' ? <UserOutlined style={{ color: 'white', fontSize: '24px' }} /> : <RobotOutlined style={{ color: 'white', fontSize: '24px' }} />}
              title={<span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{item.role}</span>}
              description={<span style={{ 
                color: 'white',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                display: 'block',
                maxWidth: '100%',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>{item.content}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default MessageList; 

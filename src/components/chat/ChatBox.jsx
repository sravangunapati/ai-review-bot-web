import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import InputArea from './InputArea';

const ChatBox = ({ selectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChatId) {
      fetchChatMessages(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/chat/${chatId}`);
      if (response.data && response.data.data) {
        const chatData = response.data.data;
        const formattedMessages = chatData.map(msg => [
          {
            type: 'user',
            content: msg.user_input,
            timestamp: new Date().toISOString()
          },
          {
            type: 'assistant',
            content: msg.assistant_response,
            timestamp: new Date().toISOString()
          }
        ]).flat();
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      message.error('Failed to load chat messages');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        user_input: input,
        chat_id: selectedChatId
      });

      if (response.data) {
        const assistantMessage = {
          type: 'assistant',
          content: response.data.assistant_response,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  maxWidth: '70%',
                  background: message.type === 'user' 
                    ? 'rgba(24, 144, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  wordBreak: 'break-word'
                }}
              >
                {message.content}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '4px'
              }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
      <InputArea
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSend={handleSend}
        loading={loading}
        showNewChat={!selectedChatId}
        onNewChat={() => setMessages([])}
      />
    </div>
  );
};

export default ChatBox; 

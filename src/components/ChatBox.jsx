// give me a chat box component that is a chatgpt ui
import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, message } from 'antd';
import axios from 'axios';
import Sidebar from './chat/Sidebar';
import Header from './chat/Header';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';
import { FileTextOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversationState, setConversationState] = useState('initial'); // 'initial', 'rating', 'review', 'complete'
  const sidebarRef = React.useRef();

  // Reset chat state on page reload
  useEffect(() => {
    setMessages([]);
    setInput('');
    setShowNewChat(true);
    setSelectedChat(null);
    setConversationState('initial');
    handleNewReview();
  }, []);

  const handleChatSelect = async (chatId) => {
    setSelectedChat(chatId);
    setShowNewChat(false);
    setConversationState('initial');
    try {
      const response = await axios.get(`http://127.0.0.1:5000/chat/${chatId}`);
      if (response.data) {
        const chatData = response.data;
        setMessages(chatData.messages);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      message.error('Failed to load chat messages');
    }
  };

  const handleSend = async () => {
    if (!input.trim() && conversationState !== 'rating') return;

    const newUserMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      if (conversationState === 'initial') {
        const assistantMessage = { 
          role: 'assistant', 
          content: 'Please enter your rating (1-5) for this review.' 
        };
        setMessages([...updatedMessages, assistantMessage]);
        setConversationState('rating');
      } else if (conversationState === 'rating') {
        const rating = parseInt(input.trim());
        if (isNaN(rating) || rating < 1 || rating > 5) {
          message.error('Please enter a valid rating between 1 and 5');
          setMessages(updatedMessages.slice(0, -1));
          return;
        }
        const assistantMessage = { 
          role: 'assistant', 
          content: 'Thank you for the rating. Please enter your review text.' 
        };
        setMessages([...updatedMessages, assistantMessage]);
        setConversationState('review');
      } else if (conversationState === 'review') {
        if (!input.trim()) {
          message.error('Please enter a review text');
          setMessages(updatedMessages.slice(0, -1));
          return;
        }
        const response = await axios.post('http://127.0.0.1:5000/process_review', {
          rating: parseInt(messages[messages.length - 2].content), // Get rating from previous message
          review_text: input.trim(),
        });

        const assistantMessage = { 
          role: 'assistant', 
          content: response.data.response 
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        setConversationState('complete');

        try {
          await axios.post('http://127.0.0.1:5000/save_messages', {
            messages: finalMessages.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp
            }))
          });
          
          if (sidebarRef.current) {
            sidebarRef.current.refreshReviews();
          }
        } catch (error) {
          console.error('Error saving messages:', error);
          message.error('Failed to save chat history');
        }
      }
    } catch (error) {
      message.error('Failed to process your request. Please try again.');
      console.error('Error:', error);
      const assistantMessage = { 
        role: 'assistant', 
        content: error.response?.data?.message || 'An error occurred' 
      };
      setMessages([...updatedMessages, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setShowNewChat(true);
    setSelectedChat(null);
    setConversationState('initial');
  };

  const handleNewReview = () => {
    setMessages([]);
    setInput('');
    setShowNewChat(false);
    setSelectedChat(null);
    setConversationState('rating');
    
    const initialMessage = {
      role: 'assistant',
      content: 'Please enter your rating (1-5) for this review.'
    };
    setMessages([initialMessage]);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: 'rgba(255, 255, 255, 0.15)',
            itemSelectedColor: '#fff',
            itemHoverBg: 'rgba(255, 255, 255, 0.08)',
            itemHoverColor: '#fff',
            itemBg: 'transparent',
            itemColor: 'rgba(255, 255, 255, 0.65)',
            subMenuItemBg: 'transparent',
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(255, 255, 255, 0.15)',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#1a1a1a' }}>
        <Sidebar 
          ref={sidebarRef}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          showSearch={showSearch}
          onSearchToggle={setShowSearch}
          onChatSelect={handleChatSelect}
          onNewReview={handleNewReview}
        />
        <Layout style={{ 
          marginLeft: collapsed ? 80 : 250,
          transition: 'margin-left 0.2s',
          background: '#1a1a1a'
        }}>
          <Header />
          <Content style={{ 
            margin: '24px 16px', 
            padding: 24, 
            background: '#1a1a1a', 
            minHeight: 280,
            marginTop: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              maxWidth: '800px',
              width: '100%',
              height: 'calc(100vh - 200px)', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              justifyContent: 'center'
            }}>
              {(selectedChat || messages.length > 0) && (
                <>
                  {messages.length > 0 && <MessageList messages={messages} />}
                  <InputArea
                    input={input}
                    onInputChange={(e) => setInput(e.target.value)}
                    onSend={handleSend}
                    loading={loading}
                    showNewChat={selectedChat ? true : false}
                    onNewReview={handleNewReview}
                    conversationState={conversationState}
                  />
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default ChatBox;

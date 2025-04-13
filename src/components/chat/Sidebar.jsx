import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Menu } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  WechatOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  withCredentials: false
});

const Sidebar = forwardRef(({ collapsed, onCollapse, onChatSelect, onNewReview }, ref) => {
  const [reviews, setReviews] = useState({
    positive: [],
    negative: []
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/all_reviews');
      const {
        data: {
          data: reviewResponse = []
        }
      } = response;
      console.log(reviewResponse);
      if (reviewResponse && Array.isArray(reviewResponse)) {
        const positiveReviews = reviewResponse
          .filter(review => review.rating >= 3)
          .map((review, index) => ({
            key: `positive${index + 1}`,
            icon: <FileTextOutlined />,
            label: review.title || `Review ${index + 1}`,
            reviewId: review.id
          }));

        const negativeReviews = reviewResponse
          .filter(review => review.rating < 3)
          .map((review, index) => ({
            key: `negative${index + 1}`,
            icon: <FileTextOutlined />,
            label: review.title || `Review ${index + 1}`,
            reviewId: review.id
          }));

        setReviews({
          positive: positiveReviews,
          negative: negativeReviews
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshReviews: fetchReviews
  }));

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    onNewReview();
  }, []);

  const menuItems = [
    {
      key: 'new-review',
      icon: <PlusOutlined />,
      label: 'New Review',
      onClick: onNewReview
    },
    {
      key: 'reviews',
      icon: <WechatOutlined />,
      label: 'Reviews',
      children: [
        {
          key: 'positive-reviews',
          label: `Positive Reviews (${reviews.positive?.length || 0})`,
          children: reviews.positive || [],
          type: 'submenu',
          icon: <FileTextOutlined />
        },
        {
          key: 'negative-reviews',
          label: `Negative Reviews (${reviews.negative?.length || 0})`,
          children: reviews.negative || [],
          type: 'submenu',
          icon: <FileTextOutlined />
        }
      ],
      popupClassName: 'chat-submenu',
      type: 'submenu',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key !== 'reviews' && e.key !== 'insights' && e.key !== 'new-review' && 
        e.key !== 'positive-reviews' && e.key !== 'negative-reviews') {
      const selectedReview = [...(reviews.positive || []), ...(reviews.negative || [])]
        .find(review => review.key === e.key);
      if (selectedReview) {
        onChatSelect(selectedReview.reviewId);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 1000,
      background: '#1a1a1a',
      width: collapsed ? 80 : 250,
      transition: 'width 0.2s',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: onCollapse,
          style: { 
            fontSize: '16px',
            color: 'white',
            cursor: 'pointer'
          }
        })}
      </div>
      <div style={{ 
        flex: 1, 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['new-review']}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              borderRight: 'none',
              height: '100%'
            }}
          />
        </div>
      </div>
      <style>
        {`
          .ant-menu-submenu-popup {
            max-height: 300px;
            overflow-y: auto;
          }
          .ant-menu-submenu-popup .ant-menu {
            max-height: 300px;
            overflow-y: auto;
          }
          .ant-menu-submenu-popup::-webkit-scrollbar {
            width: 6px;
          }
          .ant-menu-submenu-popup::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }
          .ant-menu-submenu-popup::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .ant-menu-submenu-popup {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1);
          }
          .ant-menu-item {
            margin: 0 !important;
            padding: 0 16px 0 32px !important;
          }
          .ant-menu-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
          }
          .ant-menu-item-selected {
            background: rgba(255, 255, 255, 0.15) !important;
          }
          .ant-menu-inline {
            height: 100%;
          }
          .ant-menu {
            overflow-y: auto;
            overflow-x: hidden;
          }
          .ant-menu::-webkit-scrollbar {
            width: 6px;
          }
          .ant-menu::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }
          .ant-menu::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .ant-menu {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1);
          }
          .ant-menu-submenu-title {
            padding: 0 16px !important;
          }
          .ant-menu-submenu {
            margin: 0 !important;
          }
          .ant-menu-submenu-arrow {
            color: rgba(255, 255, 255, 0.65) !important;
          }
          .ant-menu-submenu-selected > .ant-menu-submenu-title {
            color: white !important;
          }
          .ant-menu-submenu:hover > .ant-menu-submenu-title {
            color: white !important;
          }
          .ant-menu-inline .ant-menu-item {
            padding-left: 48px !important;
          }
          .ant-menu-inline .ant-menu-item:first-child {
            margin-top: 4px !important;
          }
          .ant-menu-submenu .ant-menu-submenu-title {
            padding-left: 32px !important;
          }
        `}
      </style>
    </div>
  );
});

export default Sidebar; 

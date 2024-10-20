import { AppstoreOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

const AppMenu = () => {
  const [current, setCurrent] = useState('');
  const navigate = useNavigate();

  const items = [
    {
      label: '도서 관리',
      key: 'sub1',
      icon: <BookOutlined />,
      children: [{ label: '도서 조회', key: '1', path: '/management/BookList' }],
    },
    {
      label: '도서 승인 관리',
      key: 'sub2',
      icon: <AppstoreOutlined />,
      children: [{ label: '승인 관리', key: '4', path: '/approval/list' }],
    },
    {
      label: '사용자 관리',
      key: 'sub3',
      icon: <TeamOutlined />,
      children: [{ label: '사용자 목록', key: '5', path: '/users/UserList' }],
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
    // 여기에 경로 변경 로직 추가
    const item = items.flatMap((group) => group.children).find((child) => child.key === e.key);
    if (item && item.path) {
      navigate(item.path); // useNavigate로 경로 변경
    }
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={items} />;
};

export default AppMenu;

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
      children: [
        { label: '도서 등록', key: '1', path: '/books/BookAdd' },
        { label: '도서 조회', key: '2', path: '/books/BookList' },
        { label: '도서 통계', key: '3', path: '/books/statistics' },
      ],
    },
    {
      label: '도서 승인 관리',
      key: 'sub2',
      icon: <AppstoreOutlined />,
      children: [
        { label: '승인 요청', key: '4', path: '/approvals/pending' },
        { label: '승인 완료', key: '5', path: '/approvals/approved' },
        { label: '반려', key: '6', path: '/approvals/rejected' },
      ],
    },
    {
      label: '사용자 관리',
      key: 'sub3',
      icon: <TeamOutlined />,
      children: [
        { label: '사용자 목록', key: '7', path: '/users/UserList' },
      ],
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
    // 여기에 경로 변경 로직 추가
    const item = items
      .flatMap((group) => group.children)
      .find((child) => child.key === e.key);
      if (item && item.path) {
        navigate(item.path); // useNavigate로 경로 변경
      }
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={items} />;
};

export default AppMenu;

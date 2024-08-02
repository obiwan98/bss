import { AppstoreOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

function AppMenu() {
  return (
    <Menu mode="horizontal" theme="dark" style={{ lineHeight: '64px', flex: 1 }}>
      <Menu.SubMenu key="sub1" icon={<BookOutlined />} title="도서 관리">
        <Menu.Item key="1"><a href="/books/add">도서 추가</a></Menu.Item>
        <Menu.Item key="2"><a href="/books/list">도서 목록</a></Menu.Item>
        <Menu.Item key="3"><a href="/books/statistics">도서 통계</a></Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="도서 승인 관리">
        <Menu.Item key="4"><a href="/approvals/pending">승인 대기</a></Menu.Item>
        <Menu.Item key="5"><a href="/approvals/approved">승인 완료</a></Menu.Item>
        <Menu.Item key="6"><a href="/approvals/rejected">반려</a></Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="sub3" icon={<TeamOutlined />} title="사용자 관리">
        <Menu.Item key="7"><a href="/users/List">사용자 목록</a></Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
}

export default AppMenu;

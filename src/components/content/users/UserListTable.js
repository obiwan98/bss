import { Button, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const UserListTable = ({ users, columns, isAdmin, onDelete, onShowModal }) => {
  const tableColumns = [
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
      width: 300,
      align: 'center',
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      align: 'center',
    },
    {
      title: '역할',
      dataIndex: ['role', 'roleName'],
      key: 'roleName',
      width: 200,
      align: 'center',
    },
    {
      title: '팀',
      dataIndex: ['group', 'team'],
      key: 'team',
      width: 200,
      align: 'center',
    },
    {
      title: '가입일',
      dataIndex: 'signupDate',
      key: 'signupDate',
      render: (signupDate) => dayjs(signupDate).format('YYYY-MM-DD'),
      width: 200,
      align: 'center',
    },
    {
      title: '수정',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => onShowModal(record)}>
          상세 정보
        </Button>
      ),
      width: 200,
      align: 'center',
    },
  ];

  if (isAdmin) {
    tableColumns.push({
      title: '삭제',
      key: 'delete',
      render: (text, record) => (
        <Button type="primary" onClick={() => onDelete(record._id)}>
          삭제
        </Button>
      ),
      align: 'center',
    });
  }

  return (
    <Table
      dataSource={users}
      columns={tableColumns}
      rowKey={(record) => record._id}
      pagination={{ pageSize: 5 }}
      style={{ marginTop: 20 }}
    />
  );
};

export default UserListTable;

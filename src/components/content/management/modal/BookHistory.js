import { useState, useRef, forwardRef, useImperativeHandle } from 'react';

import { Table, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import './css/BookHistory.css';

import BookReviewWrite from './BookReviewWrite';

const historyRawData = [
  {
    id: 0,
    user: '이해진',
    startDate: '2024-08-01',
    endDate: '2024-08-26',
    state: false,
  },
  {
    id: 1,
    user: '정경진',
    startDate: '2024-09-01',
    endDate: '20240-09-08',
    state: false,
  },
  {
    id: 2,
    user: '김미란',
    startDate: '2024-09-09',
    endDate: '20240-09-20',
    state: true,
  },
  {
    id: 3,
    user: '고범준',
    startDate: '2024-09-21',
    endDate: '20240-09-30',
    state: true,
  },
];

const BookHistory = forwardRef((_, ref) => {
  const [historyData, setHistoryData] = useState(historyRawData);
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  const bookReviewWriteRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      if (expandedRowKey !== null) {
        handleReviewClick(expandedRowKey);

        bookReviewWriteRef?.current.resetForm();
      }
    },
  }));

  const expandedRowRender = (record) => <BookReviewWrite ref={bookReviewWriteRef} id={record.id} />;

  const handleReviewClick = (id) =>
    setExpandedRowKey((prevExpandedRowKey) => (prevExpandedRowKey === id ? null : id));

  const columns = [
    {
      title: '사용자',
      dataIndex: 'user',
      key: 'user',
      align: 'center',
    },
    {
      title: '열람 기간',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, recode) => `${recode.startDate} ~ ${recode.endDate}`,
      align: 'center',
    },
    {
      title: '상태',
      dataIndex: 'state',
      key: 'state',
      render: (state) => (
        <span style={{ color: state ? 'blue' : 'red' }}>{state ? '열람 중' : '기간 만료'}</span>
      ),
      align: 'center',
    },
    {
      title: '비고',
      key: 'action',
      render: (_, recode) =>
        !recode.state && (
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleReviewClick(recode.id)}
          >
            리뷰 작성
          </Button>
        ),
      align: 'center',
    },
  ];

  return (
    <div className="bookHistory-container">
      <div className="bookHistory-form">
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: expandedRowRender,
            expandedRowKeys: expandedRowKey === null ? [] : [expandedRowKey],
            onExpand: (expanded, record) => {
              setExpandedRowKey(expanded ? record.id : null);
            },
          }}
          dataSource={historyData}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
});

export default BookHistory;

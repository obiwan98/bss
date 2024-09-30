import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Table, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import './css/BookHistory.css';

import BookReviewWrite from './BookReviewWrite';

const BookHistory = forwardRef(({ bookData }, ref) => {
  const { user } = useUser();

  const [history, setHistory] = useState([]);
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

  const expandedRowRender = () => <BookReviewWrite ref={bookReviewWriteRef} id={bookData._id} />;

  const handleReviewClick = (id) =>
    setExpandedRowKey((prevExpandedRowKey) => (prevExpandedRowKey === id ? null : id));

  useEffect(() => setHistory(bookData.history), [bookData]);

  const columns = [
    {
      title: '사용자',
      dataIndex: 'registeredBy',
      key: 'registeredBy',
      align: 'center',
    },
    {
      title: '이용 기간',
      dataIndex: 'usagePeriod',
      key: 'usagePeriod',
      render: (_, record) =>
        `${dayjs(record.startDate).format('YYYY-MM-DD')} ~ ${dayjs(record.endDate).format('YYYY-MM-DD')}`,
      align: 'center',
    },
    {
      title: '상태',
      dataIndex: 'state',
      key: 'state',
      render: (_, record) => {
        const isExpired = dayjs(record.endDate).isBefore(dayjs());

        return (
          <span style={{ color: !isExpired ? 'blue' : 'red' }}>
            {!isExpired ? '열람 중' : '기간 만료'}
          </span>
        );
      },
      align: 'center',
    },
    {
      title: '후기',
      key: 'action',
      render: (_, record) => {
        const isCurrentUser = user._id === record.user;
        const isExpired = dayjs(record.endDate).isBefore(dayjs());

        return (
          isCurrentUser &&
          isExpired && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleReviewClick(record._id)}
            >
              작성
            </Button>
          )
        );
      },
      align: 'center',
    },
  ];

  return (
    <div className="bookHistory-container">
      <div className="bookHistory-form">
        <Table
          columns={columns}
          dataSource={history}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: expandedRowRender,
            expandedRowKeys: expandedRowKey === null ? [] : [expandedRowKey],
          }}
        />
      </div>
    </div>
  );
});

export default BookHistory;

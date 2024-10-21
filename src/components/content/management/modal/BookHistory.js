import { useState, useEffect } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Table, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import BookReviewWrite from './BookReviewWrite';

import './css/BookHistory.css';

const BookHistory = ({ bookHistory: { bookData, handleBookData } }) => {
  const { user } = useUser();

  const { _id } = user;

  const [bookReview, setBookReview] = useState(null);
  const [isRowExpanded, setIsRowExpanded] = useState(false);
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  const isBookReview = !!bookReview;

  const expandedRowRender = () =>
    isRowExpanded && (
      <BookReviewWrite
        key={expandedRowKey}
        bookReviewWrite={{
          bookData,
          bookReview,
          handleBookData,
        }}
      />
    );

  const handleReviewClick = (id) => {
    setIsRowExpanded(expandedRowKey === id ? false : true);
    setExpandedRowKey(expandedRowKey === id ? null : id);
  };

  useEffect(() => {
    const filteredReview = bookData.reviews?.find((item) => _id === item.user);

    expandedRowKey && handleReviewClick(expandedRowKey);
    setBookReview(filteredReview);
  }, [bookData]);

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
        const isCurrentUser = _id === record.user;
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
              {!isBookReview ? '작성' : '수정'}
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
          dataSource={bookData.history}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRowKey === null ? [] : [expandedRowKey],
          }}
        />
      </div>
    </div>
  );
};

export default BookHistory;

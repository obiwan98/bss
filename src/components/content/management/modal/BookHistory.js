import { useState, useEffect } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Table, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import axios from 'axios';
import dayjs from 'dayjs';

import BookReviewWrite from './BookReviewWrite';

import './css/BookHistory.css';

const BookHistory = ({ bookData }) => {
  const { user } = useUser();

  const { _id } = user;

  const [bookHistory, setBookHistory] = useState(null);
  const [bookReview, setBookReview] = useState(null);
  const [isRowExpanded, setIsRowExpanded] = useState(false);
  const [expandedRowKey, setExpandedRowKey] = useState(null);

  const isBookReview = !!bookReview;

  const expandedRowRender = () =>
    isRowExpanded && (
      <BookReviewWrite
        bookReviewWrite={{
          bookData,
          bookReview,
          handleBookData,
        }}
      />
    );

  const handleBookData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/management/bookList/${bookData._id}`
      );

      const filteredReview = response.data.reviews?.find((item) => _id === item.user);

      expandedRowKey && handleReviewClick(expandedRowKey);
      setBookHistory(response.data.history);
      setBookReview(filteredReview);
    } catch (error) {
      message.error('도서 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleReviewClick = (id) => {
    setIsRowExpanded(!isRowExpanded);
    setExpandedRowKey((prevExpandedRowKey) => (prevExpandedRowKey === id ? null : id));
  };

  useEffect(() => {
    handleBookData();
  }, []);

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
          dataSource={bookHistory}
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

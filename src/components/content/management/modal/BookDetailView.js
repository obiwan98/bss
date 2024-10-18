import { useState } from 'react';

import { Tabs, message } from 'antd';

import BookAdd from './BookAdd';
import BookCover from './BookCover';
import BookHistory from './BookHistory';
import BookReview from './BookReview';

import axios from 'axios';

import './css/BookDetailView.css';

const tabConfig = [
  { id: 'add', label: '도서 정보', component: BookAdd, props: 'bookAdd' },
  { id: 'history', label: '열람 이력', component: BookHistory, props: 'bookHistory' },
  { id: 'review', label: '후기', component: BookReview, props: 'bookReview' },
];

const BookDetailView = ({ bookData }) => {
  const [activeTabKey, setActiveTabKey] = useState('add');
  const [activeBookData, setActiveBookData] = useState(bookData);

  const handleBookData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/management/bookList/${bookData._id}`
      );

      setActiveBookData(response.data);
    } catch (error) {
      message.error('도서 정보를 가져오는데 실패하였습니다.');
    }
  };

  return (
    <div className="bookDetailView-container">
      <h2>도서 상세정보</h2>
      <div className="bookDetailView-form">
        <BookCover bookData={activeBookData} />
        <Tabs
          type="card"
          activeKey={activeTabKey}
          items={tabConfig.map((tab) => ({
            label: tab.label,
            key: tab.id,
            children: (
              <tab.component {...{ [tab.props]: { bookData: activeBookData, handleBookData } }} />
            ),
          }))}
          onChange={(key) => setActiveTabKey(key)}
        />
      </div>
    </div>
  );
};

export default BookDetailView;

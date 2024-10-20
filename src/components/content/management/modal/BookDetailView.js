import { useState } from 'react';

import { Tabs } from 'antd';

import BookAdd from './BookAdd';
import BookCover from './BookCover';
import BookHistory from './BookHistory';
import BookReview from './BookReview';

import './css/BookDetailView.css';

const tabConfig = [
  { id: 'add', label: '도서 정보', component: BookAdd },
  { id: 'history', label: '열람 이력', component: BookHistory },
  { id: 'review', label: '후기', component: BookReview },
];

const BookDetailView = ({ bookData }) => {
  const [activeTabKey, setActiveTabKey] = useState('add');

  return (
    <div className="bookDetailView-container">
      <h2>도서 상세정보</h2>
      <div className="bookDetailView-form">
        <BookCover bookData={bookData} />
        <Tabs
          type="card"
          activeKey={activeTabKey}
          items={tabConfig.map((tab) => ({
            label: tab.label,
            key: tab.id,
            children: <tab.component bookData={bookData} />,
          }))}
          onChange={(key) => setActiveTabKey(key)}
        />
      </div>
    </div>
  );
};

export default BookDetailView;

import { useState, useRef } from 'react';

import { Tabs } from 'antd';

import BookCover from './BookCover';
import BookAdd from './BookAdd';
import BookReview from './BookReview';
import BookHistory from './BookHistory';

import './css/BookDetailView.css';

const tabConfigurations = [
  { id: 'detailView', label: '도서 정보', component: BookAdd },
  { id: 'review', label: '후기', component: BookReview },
  { id: 'history', label: '열람 이력', component: BookHistory },
];

const BookDetailView = ({ bookData }) => {
  const [activeTabKey, setActiveTabKey] = useState('detailView');
  const [isActiveHistory, setIsActiveHistory] = useState(false);

  const bookAddRef = useRef(null);
  const bookHistoryRef = useRef(null);

  const renderTabContent = (id) => {
    const tabConfig = tabConfigurations.find((item) => item.id === id);

    return (
      tabConfig && (
        <tabConfig.component
          {...(tabConfig.component === BookAdd
            ? { ref: bookAddRef }
            : tabConfig.component === BookHistory && {
                ref: bookHistoryRef,
              })}
          bookData={bookData}
        />
      )
    );
  };

  return (
    <div className="bookDetailView-container">
      <h2>도서 상세정보</h2>
      <div className="bookDetailView-form">
        <BookCover bookData={bookData} />
        <Tabs
          type="card"
          activeKey={activeTabKey}
          items={tabConfigurations.map((tab) => ({
            label: tab.label,
            key: tab.id,
            children: renderTabContent(tab.id),
          }))}
          onChange={(key) => {
            setActiveTabKey(key);
            key === 'history' && setIsActiveHistory(true);
          }}
        />
      </div>
    </div>
  );
};

export default BookDetailView;

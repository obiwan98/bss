import { useState, useEffect } from 'react';

import { List, Avatar, Rate } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import './css/BookReview.css';

const tagsData = [
  { key: 5, class: 'grate', text: '추천', icon: <SmileOutlined /> },
  { key: 4, class: 'good', text: '최고', icon: <SmileOutlined /> },
  { key: 3, class: 'neutral', text: '보통', icon: <MehOutlined /> },
  { key: 2, class: 'poor', text: '별로', icon: <FrownOutlined /> },
  { key: 1, class: 'bad', text: '최악', icon: <FrownOutlined /> },
];

const getTagData = (key) => {
  const tag = tagsData.find((tag) => tag.key === key);

  return {
    class: tag?.class,
    icon: tag?.icon,
    text: tag?.text,
  };
};

const BookReview = ({ bookData }) => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => setReviewData(bookData.review), [bookData]);

  return (
    <div className="bookReview-container">
      <div className="bookReview-form">
        <List
          itemLayout="vertical"
          size="small"
          dataSource={reviewData}
          pagination={{ pageSize: 3 }}
          renderItem={(item) => {
            const tagData = getTagData(item.tag);

            return (
              <List.Item key={item._id}>
                <List.Item.Meta
                  avatar={<Avatar size={'large'}>{item.registeredBy}</Avatar>}
                  title={
                    <>
                      <Rate value={item.rate} allowHalf disabled />
                      <div className="gap">/</div>
                      <div className={`tag-content ${tagData.class}`}>
                        <div className="tag-icon">{tagData.icon}</div>
                        <div className="tag-text">{tagData.text}</div>
                      </div>
                      <span>{dayjs(item.registrationDate).format('YYYY-MM-DD')}</span>
                    </>
                  }
                />
                {item.comment}
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

export default BookReview;

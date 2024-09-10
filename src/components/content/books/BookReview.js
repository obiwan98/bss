import { useState, useEffect } from "react";

import { List, Avatar, Rate } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

import "./css/BookReview.css";

const tagsData = [
  { key: 0, class: "grate", text: "추천", icon: <SmileOutlined /> },
  { key: 1, class: "good", text: "최고", icon: <SmileOutlined /> },
  { key: 2, class: "neutral", text: "보통", icon: <MehOutlined /> },
  { key: 3, class: "poor", text: "별로", icon: <FrownOutlined /> },
  { key: 4, class: "bad", text: "최악", icon: <FrownOutlined /> },
];

const reviewRawData = [
  {
    id: 0,
    user: "이해진",
    rate: 5,
    tagKey: 0,
    comment: "추천합니다.",
    registrationDate: "2024-08-27",
  },
  {
    id: 1,
    user: "정경진",
    rate: 3,
    tagKey: 2,
    comment: "괜찮습니다.",
    registrationDate: "2024-09-01",
  },
  {
    id: 2,
    user: "김미란",
    rate: 2,
    tagKey: 3,
    comment: "별로입니다.",
    registrationDate: "2024-09-05",
  },
  {
    id: 3,
    user: "고범준",
    rate: 1,
    tagKey: 4,
    comment: "최악입니다.",
    registrationDate: "2024-09-10",
  },
];

const BookReview = () => {
  const [reviewData, setReviewData] = useState(reviewRawData);

  useEffect(() => {}, []);

  return (
    <div className="bookReview-container">
      <List
        itemLayout="vertical"
        size="small"
        pagination={{ pageSize: 3 }}
        dataSource={reviewData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={40}>{item.user}</Avatar>}
              title={
                <>
                  <Rate value={item.rate} allowHalf disabled />
                  <div className="tag-gap">/</div>
                  <div className={`tag-content ${tagsData[item.tagKey].class}`}>
                    <div className="tag-icon">{tagsData[item.tagKey].icon}</div>
                    <div className="tag-text">{tagsData[item.tagKey].text}</div>
                  </div>
                  <span>{item.registrationDate}</span>
                </>
              }
            />
            {item.comment}
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookReview;

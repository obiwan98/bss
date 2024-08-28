import { useState } from "react";

import { List, Avatar } from "antd";

const reviewRawData = [
  { id: 0, title: "추천", user: "이해진", comment: "강추" },
  { id: 1, title: "좋음", user: "정경진", comment: "무난" },
  { id: 2, title: "별로", user: "김미란", comment: "별로임" },
  { id: 3, title: "최악", user: "고범준", comment: "최악임" },
];

const BookReview = () => {
  const [reviewData, setReviewData] = useState(reviewRawData);

  return (
    <div>
      <List
        itemLayout="vertical"
        size="small"
        pagination={{ pageSize: 3 }}
        dataSource={reviewData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={40}>{item.user}</Avatar>}
              title={item.title}
            />
            {item.comment}
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookReview;

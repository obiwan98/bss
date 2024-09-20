import { useState, useEffect } from 'react';
import { Image, Rate } from 'antd';

import './css/BookCover.css';

const BookCover = ({ bookData }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setImageUrl(
      bookData?.cover ? `${process.env.REACT_APP_API_URL}/uploads/${bookData.cover}` : ''
    );
    setRating(3.5);
  }, [bookData]);

  return (
    <div className="bookCover-container">
      <div className="bookCover-form">
        {imageUrl ? (
          <>
            <Image src={imageUrl} preview={false} alt="책표지" />
            <div className="rate-form">
              <span>리뷰 평점:</span>
              <Rate value={rating} allowHalf disabled />
              <span>{rating.toFixed(1)}</span>
            </div>
          </>
        ) : (
          <div className="rate-form-noImage">
            <span className="rating-label">리뷰 평점</span>
            <span className="rating-value">{rating.toFixed(1)}</span>
            <Rate value={rating} allowHalf disabled />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCover;

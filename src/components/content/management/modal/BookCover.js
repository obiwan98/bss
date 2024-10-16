import { useState, useEffect } from 'react';

import { Image, Rate } from 'antd';

import './css/BookCover.css';

const BookCover = ({ bookData }) => {
  const { reviews } = bookData;

  const [imageUrl, setImageUrl] = useState(null);
  const [rate, setRate] = useState(0);

  const handleImageCheck = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });

      response.ok && setImageUrl(url);
    } catch (error) {
      setImageUrl(null);
    }
  };

  const handleRateAverage = (reviews) => {
    const average =
      reviews.length !== 0
        ? Math.round((reviews.reduce((acc, review) => acc + review.rate, 0) / reviews.length) * 2) /
          2
        : 0;

    setRate(average);
  };

  const handleCoverReset = () => {
    setImageUrl(null);
    setRate(0);
  };

  useEffect(() => {
    handleCoverReset();

    bookData?.coverFile
      ? handleImageCheck(`${process.env.REACT_APP_API_URL}/uploads/${bookData.coverFile}`)
      : bookData?.coverUrl && setImageUrl(bookData.coverUrl);
    reviews && handleRateAverage(reviews);
  }, [bookData, reviews]);

  return (
    <div className="bookCover-container">
      <div className="bookCover-form">
        {imageUrl ? (
          <>
            <Image src={imageUrl} preview={false} alt="책표지" />
            <div className="rate-form">
              <span>리뷰 평점:</span>
              <Rate value={rate} allowHalf disabled />
              <span>{rate.toFixed(1)}</span>
            </div>
          </>
        ) : (
          <div className="rate-form-noImage">
            <span className="rating-label">리뷰 평점</span>
            <span className="rating-value">{rate.toFixed(1)}</span>
            <Rate value={rate} allowHalf disabled />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCover;

import { useState } from 'react';

import BookAdd from './BookAdd';
import BookSearchAPI from '../../approval/modal/BookSearchAPI';

import './css/BookRegistration.css';

const BookRegistration = ({ bookData }) => {
  const [autoBookData, setAutoBookData] = useState(null);

  const handleAutoBookData = (autoBookData) => setAutoBookData(autoBookData);

  return (
    <div className="bookRegistration-container">
      <h2>도서 등록</h2>
      <div className="bookRegistration-form">
        <BookAdd
          bookAdd={{
            autoBookData,
            bookData,
          }}
        />
        <BookSearchAPI handleAutoBookData={handleAutoBookData} />
      </div>
    </div>
  );
};

export default BookRegistration;

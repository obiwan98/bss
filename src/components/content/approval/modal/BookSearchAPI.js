import React, { useEffect, useState } from 'react';
import { Alert, Avatar, List, Spin, Radio, Input, Button } from 'antd';
import axios from 'axios';
import './BookSearchModal.css';

const BookSearchAPI = ({ handleAutoBookData }) => {
  /** 검색방법1 - 제목+저자+ISBN */
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState();
  const [selectedTitle, setSelectedTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [errorMessage1, setErrorMessage1] = useState('');

  /** 제목+저자 조회 */
  useEffect(() => {
    if (selectedTitle) {
      setLoading(true);
      // API를 호출하여 선택한 카테고리의 도서를 가져옵니다.
      axios
        .post(process.env.REACT_APP_API_URL + '/api/external/aladinSearch', {
          query: selectedTitle,
          maxResults: '50',
        })
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching books:', error);
          setErrorMessage1(
            `Error fetching books: ${error.response ? error.response.data.error : error.message}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedTitle]);

  const handleRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  return (
    <div className="bookSearchAPI-container">
      <h2>도서 검색 제목 / 저자 / ISBN</h2>
      <div className="bookSearchAPI-form">
        <div className="bookSearch-header">
          <Search className="bookSearch_searchbar" onSearch={setSelectedTitle} />
          <Button type="primary" onClick={() => handleAutoBookData(radioValue)}>
            저장
          </Button>
        </div>
        <div className="bookSearch-body">
          {errorMessage1 && <Alert message={errorMessage1} type="error" showIcon />}
          <div className="bookSearch_modal">
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <Radio.Group onChange={handleRadioChange} value={radioValue}>
                <List
                  dataSource={books}
                  renderItem={(book) => (
                    /** 라디오공간부터 확보 */
                    <Radio name="report-book" value={book} className="book_radio">
                      <List.Item key={book.isbn13}>
                        <List.Item.Meta
                          avatar={<Avatar src={book.cover} shape="square" size={64} />}
                          title={book.title}
                          description={book.author}
                        />
                      </List.Item>
                    </Radio>
                  )}
                />
              </Radio.Group>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchAPI;

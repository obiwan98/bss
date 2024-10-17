import React, { useEffect, useState } from 'react';
import { Alert, Avatar, List, Spin, Radio, Input, Button, message } from 'antd';
import axios from 'axios';
import './BookSearchModal.css';

const BookSearchAPI = ({ handleAutoBookData }) => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
          setErrorMessage();
        })
        .catch((error) => {
          console.error('Error fetching books:', error);
          setErrorMessage(
            `Error fetching books: ${error.response ? error.response.data.error : error.message}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedTitle]);

  const handleAutoSave = () => {
    if (!radioValue) {
      message.info('도서를 선택해주세요.');
    } else {
      handleAutoBookData(radioValue);

      // useState 초기화
      setBooks([]);
      setRadioValue('');
      setSearchValue('');
      setSelectedTitle('');
    }
  };

  const handleRadioChange = (e) => setRadioValue(e.target.value);

  return (
    <div className="bookSearchAPI-container">
      <h2>도서 검색 (제목 / 저자 / ISBN)</h2>
      <div className="bookSearchAPI-form">
        <div className="bookSearch-header">
          <Search
            className="bookSearch_searchbar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={setSelectedTitle}
          />
          <Button type="primary" onClick={handleAutoSave}>
            저장
          </Button>
        </div>
        <div className="bookSearch-body">
          {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
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

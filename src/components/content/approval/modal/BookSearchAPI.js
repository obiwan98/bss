import { Alert, Avatar, Input, List, Radio, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './BookSearchModal.css';

const BookSearchAPI = ({ modalData }) => {
    /** 검색방법1 - 제목+저자+ISBN */
    const { Search } = Input;
    const [loading, setLoading] = useState(false);
    const [radioValue, setRadioValue] = useState();
    const [selectedTitle, setSelectedTitle] = useState('');
    const [books, setBooks] = useState([]);
    const [errorMessage1, setErrorMessage] = useState('');
  
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
          console.log(response.data.books);
          setBooks(response.data.books);
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

    const handleRadioChange = (e) => {
        console.log('radio checked', e.target.value);
        setRadioValue(e.target.value);
    };

    useEffect(() => {
        modalData(radioValue);
    },[radioValue]);
  
  return (
    <>
        <Search onSearch={setSelectedTitle} className='bookSearch_searchbar'></Search>
        {errorMessage1 && <Alert message={errorMessage1} type="error" showIcon />}
        <div className="bookSearch_modal">
        {loading ? 
        (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
            </div>
        ) : 
        (
        <Radio.Group onChange={handleRadioChange} value={radioValue}>
            <List
            dataSource={books}
            renderItem={book => (
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
    </>
  );
};
export default BookSearchAPI;
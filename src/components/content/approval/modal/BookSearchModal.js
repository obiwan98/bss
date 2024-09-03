import React, { useEffect, useState } from 'react';
import { Alert, Avatar, List, Spin, Tag, Button, Modal, Radio, Input } from 'antd';
import axios from 'axios';
import "./BookSearchModal.css";

const App = ({ getData }) => {
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState();
  const { Search } = Input;
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  /** 등록 버튼 */
  const handleOk = () => {
    getData([
      radioValue.title,       // 상품명
      radioValue.link,        // 상품 링크 URL
      radioValue.author,      // 저자/아티스트
      radioValue.pubDate,     // 출간일(출시일)
      radioValue.description, // 상품설명(요약)
      radioValue.isbn13,      // 13자리 ISBN
      radioValue.priceSales,  // 판매가
      radioValue.cover,       // 커버(표지)
      radioValue.publisher,   // 출판사(제작사/출시사)
    ]);
    setIsModalOpen(false);
  };

  /** 취소 버튼 */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /** 제목+저자 조회 */
  useEffect(() => {
    if (selectedTitle) {
      setLoading(true);
      // API를 호출하여 선택한 카테고리의 도서를 가져옵니다.
      axios.post(process.env.REACT_APP_API_URL + '/api/external/aladinSearch', {
        query: selectedTitle,
        maxResults : "50",
      }).then(response => {
        setBooks(response.data);
      }).catch(error => {
        console.error('Error fetching books:', error);
        setErrorMessage(`Error fetching books: ${error.response ? error.response.data.error : error.message}`);
      }).finally(()=>{ setLoading(false); });
    }
  }, [selectedTitle]);

  /** 태그 조회 */
  useEffect(() => {
	  axios.get(process.env.REACT_APP_API_URL + '/api/external/aladinTag').then(response => {
      setTags(response.data);
      if (response.data.length > 0) {
        setSelectedTag(response.data[0].Code);
      }
    }).catch(error => {
      console.error('Error fetching tags:', error);
      setErrorMessage(`Error fetching tags : ${error.response ? error.response.data.error : error.message}`);
    });
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setLoading(true);
      // API를 호출하여 선택한 카테고리의 도서를 가져옵니다.
      axios.post(process.env.REACT_APP_API_URL + '/api/external/aladinSearch', {
        query: selectedTag,
        maxResults : "50",
      }).then(response => {
        setBooks(response.data);
      }).catch(error => {
        console.error('Error fetching books:', error);
        setErrorMessage(`Error fetching books: ${error.response ? error.response.data.error : error.message}`);
      }).finally(()=>{ setLoading(false); });
    }
  }, [selectedTag]);
  
  const handleTagClick = value => {
    setSelectedTag(value);
  };

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        도서조회
      </Button>

      {/* 아래와 같이 뽑아 쓸수있음. */}
      {/* <h2>{"상품명 : " + choiceBookInfo[0]}</h2>
      <h2>{"상품 링크 URL : " + choiceBookInfo[1]}</h2>
      <h2>{"저자/아티스트 : " + choiceBookInfo[2]}</h2>
      <h2>{"출간일(출시일) : " + choiceBookInfo[3]}</h2>
      <h2>{"상품설명(요약) : " + choiceBookInfo[4]}</h2>
      <h2>{"10자리 ISBN : " + choiceBookInfo[5]}</h2>
      <h2>{"13자리 ISBN : " + choiceBookInfo[6]}</h2>
      <h2>{"판매가 : " + choiceBookInfo[7]}</h2>
      <h2>{"커버(표지) : " + choiceBookInfo[8]}</h2>
      <h2>{"출판사(제작사/출시사) : " + choiceBookInfo[9]}</h2> */}

      <Modal
        title="도서 검색"
        open={isModalOpen}
        okText="등록"
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

        <div className='bookSearch_tag'>
          {tags.map(tag => (
            <Tag
              key={tag.Code}
              color={selectedTag === tag.Code ? 'blue' : 'default'}
              onClick={() => handleTagClick(tag.Code)}
              style={{ cursor: 'pointer', marginBottom: '8px' }}
            >
              {tag.Name}
            </Tag>
          ))}
        </div>

        <Search onSearch={setSelectedTitle}></Search>

        <div className="bookSearch_modal">
          {loading ? 
          (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : 
          (
          <Radio.Group onChange={onChange} value={radioValue}>
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
      </Modal>
    </>
  );
};
export default App;
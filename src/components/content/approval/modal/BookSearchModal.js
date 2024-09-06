import React, { useEffect, useState } from 'react';
import { Alert, Avatar, List, Spin, Tag, Button, Modal, Radio, Input, Space } from 'antd';
import axios from 'axios';
import "./BookSearchModal.css";

const BookSearchModal = ({ getData }) => {
  
  const [selectedTitle, setSelectedTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedIsbn, setSelectedIsbn] = useState('');
  const [isbnBooks, setIsbnBooks] = useState([]);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState();
  const { Search } = Input;
  /** 모달 검색 방법 */
  const [state, setState] = useState('1');
  const [search1,setSearch1] = useState({display: 'none'});
  const [search2,setSearch2] = useState({display: 'none'});
  const [search3,setSearch3] = useState({display: 'none'});
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  /** 등록 버튼 */
  const handleOk = () => {
    // radioValue.title,       // 상품명
    // radioValue.link,        // 상품 링크 URL
    // radioValue.author,      // 저자/아티스트
    // radioValue.pubDate,     // 출간일(출시일)
    // radioValue.description, // 상품설명(요약)
    // radioValue.isbn13,      // 13자리 ISBN
    // radioValue.priceSales,  // 판매가
    // radioValue.cover,       // 커버(표지)
    // radioValue.publisher,   // 출판사(제작사/출시사)
    getData(radioValue);
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

  /** 카테고리 조회 */
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

  /** ISBN 조회 */
  useEffect(() => {
    if (selectedIsbn) {
      setLoading(true);
      // API를 호출하여 선택한 카테고리의 도서를 가져옵니다.
      axios.post(process.env.REACT_APP_API_URL + '/api/external/aladinLookUp', {
        ItemId: selectedIsbn,
      }).then(response => {
        setIsbnBooks(response.data);
      }).catch(error => {
        console.error('Error fetching isbnBooks:', error);
        setErrorMessage(`Error fetching isbnBooks: ${error.response ? error.response.data.error : error.message}`);
      }).finally(()=>{ setLoading(false); });
    }
  }, [selectedIsbn]);

  const handleTagClick = value => {
    setSelectedTag(value);
  };

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  /** 도서검색 종류 선택 */
  const handleSizeChange = (e) => {
    setState(e.target.value);
  };

  useEffect(() => {
    getSearchView();
  }, [state]);

  const getSearchView = () => {
    try {
      console.log(state);
      if(state === '1'){
        setSearch1({display: 'block'});
        setSearch2({display: 'none'});
        setSearch3({display: 'none'});
      } else if(state === '2'){
        setSearch1({display: 'none'});
        setSearch2({display: 'block'});
        setSearch3({display: 'none'});
      } else if(state === '3'){
        setSearch1({display: 'none'});
        setSearch2({display: 'none'});
        setSearch3({display: 'block'});
      }
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        도서조회
      </Button>

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
        <div className='bookSearch_method'>
          <Space>
            <Radio.Group value={state} onChange={handleSizeChange} buttonStyle="solid">
              <Radio.Button value="1">제목+저자 검색</Radio.Button>
              <Radio.Button value="2">ISBN 조회</Radio.Button>
              <Radio.Button value="3">수동 저장</Radio.Button>
            </Radio.Group>
          </Space>
        </div>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

        <div style={search1}>
          <Search onSearch={setSelectedTitle} className='bookSearch_searchbar'></Search>
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
        </div>

        <div style={search2}>
          <Search onSearch={setSelectedIsbn} className='bookSearch_searchbar'></Search>
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
                dataSource={isbnBooks}
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
        </div>

        <div style={search3}>
          <p>테스트3</p>
        </div>

      </Modal>
    </>
  );
};
export default BookSearchModal;
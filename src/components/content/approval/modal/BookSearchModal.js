import React, { useEffect, useState } from 'react';
import { Alert, Avatar, List, Spin, Button, Modal, Radio, Input, Space, Descriptions, Divider } from 'antd';
import axios from 'axios';
import "./BookSearchModal.css";

const BookSearchModal = ({ getData }) => {
  /** 모달 */
  const [isModalOpen, setIsModalOpen] = useState();
  /** 모달 - 입력 종류 */
  const [type, setType] = useState('1');
  /** 검색방법1 - 제목+저자 */
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState();
  const [search,setSearch] = useState({display: 'none'});
  const [selectedTitle, setSelectedTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [errorMessage1, setErrorMessage1] = useState('');
  /** 검색방법2 - ISBN */
  const [directInput,setDirectInput] = useState({display: 'none'});
   // 신청 정보
   const [inputTitle, setInputTitle] = useState('');
   const [inputLink, setInputLink] = useState('');
   const [inputAuthor, setInputAuthor] = useState('');
   const [inputPubDate, setInputPubDate] = useState('');
   const [inputDescription, setInputDescription] = useState('');
   const [inputIsbn13, setInputIsbn13] = useState('');
   const [inputPriceSales, setInputPriceSales] = useState('');
   const [inputCover, setInputCover] = useState('');
   const [inputPublisher, setInputPublisher] = useState('');
  
  /** 모달 열기 */
  const showModal = () => {
    setIsModalOpen(true);
  };

  /** 모달 - 입력 종류 선택 */
  const handleSizeChange = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    getSearchView();
  }, [type]);

  const getSearchView = () => {
    try {
      console.log(type);
      if(type === '1'){
        setSearch({display: 'block'});
        setDirectInput({display: 'none'});
      } else if(type === '2'){
        setSearch({display: 'none'});
        setDirectInput({display: 'block'});
      }
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
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
        setErrorMessage1(`Error fetching books: ${error.response ? error.response.data.error : error.message}`);
      }).finally(()=>{ setLoading(false); });
    }
  }, [selectedTitle]);

  const handleRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  const handleTitleChange = (e) => {
    setInputTitle(e.target.value);
  };
  const handleLinkChange = (e) => {
    setInputLink(e.target.value);
  };
  const handleAuthorChange = (e) => {
    setInputAuthor(e.target.value);
  };
  const handlePubDateChange = (e) => {
    setInputPubDate(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setInputDescription(e.target.value);
  };
  const handleIsbn13Change = (e) => {
    setInputIsbn13(e.target.value);
  };
  const handlePriceSalesChange = (e) => {
    setInputPriceSales(e.target.value);
  };
  const handleCoverChange = (e) => {
    setInputCover(e.target.value);
  };
  const handlePublisherChange = (e) => {
    setInputPublisher(e.target.value);
  };

  /** 수동 저장 폼 */
  const reqItems = [
    {
      key: 'inputTitle',
      label: '도서명',
      children: (
        <Input
          value={inputTitle}
          onChange={handleTitleChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputLink',
      label: '상품 링크 URL',
      children: (
        <Input
          value={inputLink}
          onChange={handleLinkChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputAuthor',
      label: '저자/아티스트',
      children: (
        <Input
          value={inputAuthor}
          onChange={handleAuthorChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputPubDate',
      label: '출간일(출시일)',
      children: (
        <Input
          value={inputPubDate}
          onChange={handlePubDateChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputPubDate',
      label: '상품설명(요약)',
      children: (
        <Input
          value={inputDescription}
          onChange={handleDescriptionChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputIsbn13',
      label: '13자리 ISBN',
      children: (
        <Input
          value={inputIsbn13}
          onChange={handleIsbn13Change}
        />
      ),
      span: 3,
    },
    {
      key: 'inputPriceSales',
      label: '판매가',
      children: (
        <Input
          value={inputPriceSales}
          onChange={handlePriceSalesChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputCover',
      label: '커버(표지)',
      children: (
        <Input
          value={inputCover}
          onChange={handleCoverChange}
        />
      ),
      span: 3,
    },
    {
      key: 'inputPublisher',
      label: '출판사(제작사/출시사)',
      children: (
        <Input
          value={inputPublisher}
          onChange={handlePublisherChange}
        />
      ),
      span: 3,
    },
  ];

  useEffect(() => {
    if (inputTitle !== '') {
      setRadioValue({title: inputTitle});
      console.log(radioValue);
    }
  }, [radioValue]);

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
    if(radioValue !== undefined){
      getData(radioValue);
    }
    setIsModalOpen(false);
  };

  /** 취소 버튼 */
  const handleCancel = () => {
    setIsModalOpen(false);
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
            <Radio.Group value={type} onChange={handleSizeChange} buttonStyle="solid">
              <Radio.Button value="1">제목 / 저자 / ISBN 검색</Radio.Button>
              <Radio.Button value="2">수동 입력</Radio.Button>
            </Radio.Group>
          </Space>
        </div>

        <div style={search}>
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
        </div>

        <div style={directInput}>
          <div>
          <Descriptions bordered items={reqItems} className="bookSearch_Descriptions"/>
          <Divider
            style={{
              borderColor: '#7cb305',
            }}
          ></Divider>
        </div>
        </div>

      </Modal>
    </>
  );
};
export default BookSearchModal;
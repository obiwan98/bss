import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

import { Select, Input, Button, message } from 'antd';

import axios from 'axios';

import BookList from './BookList';
import BookModal from './BookModal';

import './css/BookSearch.css';

const BookSearch = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { Option } = Select;
  const { Search } = Input;

  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState('');
  const [bookData, setBookData] = useState(null);
  const [bookList, setBookList] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`);

      setGroups(response.data);
    } catch (error) {
      message.error('그룹 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleBookSearch = async (value) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books/bookList`, {
        params: {
          title: value,
          group: activeGroup,
        },
      });

      setBookList(response.data);
    } catch (error) {
      message.error('도서 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleShowModal = (recode) => {
    setBookData(recode);
    setIsModalVisible(true);
  };

  const handleCloseModal = (refresh) => {
    setIsModalVisible(false);
    refresh && handleBookSearch();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchGroups();
    }
  }, [user, navigate]);

  return (
    <div className="bookSearch-container">
      <h2>도서 조회</h2>
      <div className="bookSearch-form">
        <Select value={activeGroup} onChange={(value) => setActiveGroup(value)}>
          <Option value="">전체</Option>
          {groups.map((group) => (
            <Option key={group._id} value={group._id}>
              {group.team}
            </Option>
          ))}
        </Select>
        <Search placeholder="도서명을 입력해 주세요." onSearch={handleBookSearch} enterButton />
        <Button type="primary" onClick={() => handleShowModal(null)}>
          추가
        </Button>
      </div>
      <BookList bookList={bookList} onClick={handleShowModal} />
      <BookModal bookData={bookData} open={isModalVisible} onCancel={handleCloseModal} />
    </div>
  );
};

export default BookSearch;

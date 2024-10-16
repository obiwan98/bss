import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

import { Modal, message } from 'antd';

import axios from 'axios';

import BookListBody from '../../components/content/management/BookListBody';
import BookListHeader from '../../components/content/management/BookListHeader';
import BookListModal from '../../components/content/management/BookListModal';

const BookList = () => {
  const navigate = useNavigate();

  const { user } = useUser();

  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState('');
  const [bookData, setBookData] = useState(null);
  const [bookList, setBookList] = useState('');
  const [modalType, setModalType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`);

      setGroups(response.data.groups);
    } catch (error) {
      message.error('그룹 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleActiveGroup = (group) => setActiveGroup(group);

  const handleBookSearch = async (title) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/management/bookList`, {
        params: {
          title,
          group: activeGroup,
        },
      });

      setBookList(response.data);
    } catch (error) {
      message.error('도서 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleBookDelete = (id) => {
    Modal.confirm({
      title: '도서를 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okType: 'danger',
      okText: '삭제',
      cancelText: '취소',
      onOk() {
        axios
          .delete(`${process.env.REACT_APP_API_URL}/api/management/bookDelete/${id}`)
          .then(() => {
            message.success('도서를 삭제하였습니다.');

            handleBookSearch();
          })
          .catch((error) => {
            console.error('도서 삭제를 실패하였습니다.');
          });
      },
      onCancel() {
        message.info('도서 삭제를 취소하였습니다.');
      },
    });
  };

  const handleShowModal = (modalType, bookData) => {
    setModalType(modalType);
    setBookData(bookData);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    handleBookSearch();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchGroups();
    }
  }, [user, navigate]);

  return (
    <div className="bookList-container">
      <h2>도서 조회</h2>
      <div className="bookList-form">
        <BookListHeader
          bookListHeader={{
            groups,
            activeGroup,
            handleActiveGroup,
            handleBookSearch,
            handleShowModal,
          }}
        />
        <BookListBody bookListBody={{ bookList, handleShowModal, handleBookDelete }} />
        <BookListModal bookListModal={{ modalType, bookData, isModalVisible, handleCloseModal }} />
      </div>
    </div>
  );
};

export default BookList;

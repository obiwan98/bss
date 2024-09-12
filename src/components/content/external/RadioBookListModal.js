import { Alert, Input, Modal } from 'antd';
import React, { useState } from 'react';
import useFetchBooksByQuery from '../../../hooks/useFetchBooksByQuery';
import RadioBookList from './RadioBookList';
const { Search } = Input;

const RadioBookListModal = ({ isOpen, onClose, onBookSelect  }) => {

  const [selectedTitle, setSelectedTitle] = useState('');
  const [radioValue, setRadioValue] = useState(null);
  const { books, loading: booksLoading, errorMessage  } = useFetchBooksByQuery(selectedTitle);

  // 확인 버튼 클릭 시 검색 결과를 부모에게 전달
  const handleOk = () => {
    if (radioValue) {
      onBookSelect(radioValue);  // 선택된 책을 부모에게 전달
    }
    onClose();  // 모달 닫기
  };

  return (
    <Modal
      title="도서 검색"
      open={isOpen}
      onOk={handleOk}  // 확인 버튼 클릭 시 모달 닫기
      onCancel={onClose}  // 취소 또는 바깥 클릭 시 모달 닫기
      width={1000}
    >
      <div>
        {/* 제목 검색 */}
        <Search onSearch={setSelectedTitle} className="bookSearch_searchbar" />
      </div>

      {/* 오류 메시지 표시 */}
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

      {/* 책 목록 + Radio 선택 */}
      <div style={{ height: '340px', overflowY: 'auto' }}>
        <RadioBookList books={books}  loading={booksLoading} radioValue={radioValue} onChange={(e) => setRadioValue(e.target.value)} />
      </div>
    </Modal>
  );
};

export default RadioBookListModal;

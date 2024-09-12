import { Button } from 'antd';
import React, { useState } from 'react';
import RadioBookListModal from '../components/content/external/RadioBookListModal';

const test = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 모달에서 전달된 검색 결과를 처리하는 콜백 함수
  const handleSearchResult = (book) => {
    setSelectedBook(book);
    setIsModalOpen(false);  // 모달 닫기
  };

  return (
    <>
      {/* 도서 조회 버튼 */}
      <Button type="primary" onClick={showModal}>
        도서 조회
      </Button>

      <RadioBookListModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookSelect={handleSearchResult}  // 검색 결과 콜백 전달
      />

      {/* 선택된 책 정보 표시 */}
      {selectedBook && (
        <div style={{ marginTop: '20px' }}>
          <h3>선택된 도서 정보</h3>
          <p><strong>제목:</strong> {selectedBook.title}</p>
          <p><strong>저자:</strong> {selectedBook.author}</p>
        </div>
      )}
    </>
  );
};

export default test;

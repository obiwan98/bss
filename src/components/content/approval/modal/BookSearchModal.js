import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import "./BookSearchModal.css";
import BookSearchAPI from "./BookSearchAPI";
import BookDirectInput from "./BookDirectInput";

const BookSearchModal = ({ isModalOpen, handleCancel, getData }) => {
  const [title, setTitle] = useState();
  const [modalData, setModalData] = useState();
  const [search, setSearch] = useState({display: 'none'});
  const [directInfo, setdirectInfo] = useState({display: 'none'});
  
  useEffect(() => {
    getSearchView();
  }, [isModalOpen.type]);

  const getSearchView = () => {
    try {
      if(isModalOpen.type === '1'){
        setTitle("도서 검색 제목 / 저자 / ISBN");
        setSearch({display: 'block'});
        setdirectInfo({display: 'none'});
      } else if(isModalOpen.type === '2'){
        setTitle("수동 입력");
        setSearch({display: 'none'});
        setdirectInfo({display: 'block'});
      }
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
  };
  
  /** 모달 데이터 받아오기 */
  function modalDataValue(data){
    setModalData(data);
  }

  /** 등록 버튼 */
  function handleOk(){
    getData(modalData);
    handleCancel(false);
  }

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen.open}
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
        <div style={search}>
          <BookSearchAPI modalData={modalDataValue} />
        </div>

        <div style={directInfo}>
          <BookDirectInput modalData={modalDataValue} />
        </div>
      </Modal>
    </>
  );
};
export default BookSearchModal;
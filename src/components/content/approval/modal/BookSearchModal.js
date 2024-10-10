import { Modal } from 'antd';
import BookSearchAPI from './BookSearchAPI';
import './BookSearchModal.css';

const BookSearchModal = ({ isModalOpen, handleCancel, getData }) => {
  const handleAutoBookData = (autoBookData) => {
    getData(autoBookData);
    handleCancel(false);
  };

  return (
    <Modal
      width={1000}
      open={isModalOpen.open}
      footer={null}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <BookSearchAPI handleAutoBookData={handleAutoBookData} />
    </Modal>
  );
};

export default BookSearchModal;

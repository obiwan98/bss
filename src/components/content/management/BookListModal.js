import { Modal } from 'antd';

import BookAdd from './modal/BookAdd';
import BookDetailView from './modal/BookDetailView';

const BookListModal = ({ bookListModal: { bookData, isModalVisible, handleCloseModal } }) => {
  const ModalComponent = !bookData ? BookAdd : BookDetailView;

  return (
    <Modal width={800} open={isModalVisible} footer={null} onCancel={handleCloseModal}>
      <ModalComponent bookData={bookData} />
    </Modal>
  );
};

export default BookListModal;

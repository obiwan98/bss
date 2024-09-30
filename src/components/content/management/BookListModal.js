import { Modal } from 'antd';

import BookDetailView from './modal/BookDetailView';
import BookRegistration from './modal/BookRegistration';
import BookRental from './modal/BookRental';

const modalConfig = {
  registration: { width: 1000, component: BookRegistration },
  detailView: { width: 800, component: BookDetailView },
  rental: { width: 800, component: BookRental },
};

const BookListModal = ({
  bookListModal: { modalType, bookData, isModalVisible, handleCloseModal },
}) => {
  const { width: modalWidth, component: ModalComponent } = modalConfig[modalType] || {};

  return (
    <Modal width={modalWidth} open={isModalVisible} footer={null} onCancel={handleCloseModal}>
      {ModalComponent && <ModalComponent bookData={bookData} />}
    </Modal>
  );
};

export default BookListModal;

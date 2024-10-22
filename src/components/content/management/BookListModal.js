import { Modal } from 'antd';

import BookRegistration from './modal/BookRegistration';
import BookDetailView from './modal/BookDetailView';
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
    <Modal
      width={modalWidth}
      open={isModalVisible}
      footer={null}
      onCancel={() => handleCloseModal(modalType !== 'registration' ? true : false)}
      destroyOnClose={true}
    >
      {ModalComponent && <ModalComponent bookData={bookData} />}
    </Modal>
  );
};

export default BookListModal;

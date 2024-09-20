import { Modal } from 'antd';

import BookAdd from './BookAdd';
import BookDetailView from './BookDetailView';

const BookModal = ({ bookData, open, onCancel }) => {
  const ModalComponent = !bookData ? BookAdd : BookDetailView;

  return (
    <Modal width={800} open={open} footer={null} onCancel={() => onCancel(false)}>
      <ModalComponent bookData={bookData} onCancel={onCancel} />
    </Modal>
  );
};

export default BookModal;

import { Modal } from 'antd';

import BookAdd from './BookAdd';

const BookModal = ({ bookData, open, onCancel }) => {
  return (
    <Modal width={800} open={open} footer={null} onCancel={() => onCancel(false)}>
      <BookAdd bookData={bookData} onCancel={onCancel} />
    </Modal>
  );
};

export default BookModal;

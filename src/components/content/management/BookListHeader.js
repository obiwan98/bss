import { Select, Input, Button, message } from 'antd';

import './css/BookListHeader.css';

const BookListHeader = ({
  bookListHeader: { groups, activeGroup, handleActiveGroup, handleBookSearch, handleShowModal },
}) => {
  const { Option } = Select;
  const { Search } = Input;

  return (
    <div className="bookList-header-container">
      <div className="bookList-header-form">
        <Select value={activeGroup} onChange={handleActiveGroup}>
          <Option value="">전체</Option>
          {groups.map((group) => (
            <Option key={group._id} value={group._id}>
              {group.team}
            </Option>
          ))}
        </Select>
        <Search placeholder="도서명을 입력해 주세요." onSearch={handleBookSearch} enterButton />
        <Button type="primary" onClick={() => handleShowModal(null)}>
          추가
        </Button>
      </div>
    </div>
  );
};

export default BookListHeader;

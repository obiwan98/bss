import { Avatar, List, Spin } from 'antd';
import React from 'react';

const BookList = ({ books, loading }) => {
  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={books}
          renderItem={book => (
            <List.Item key={book.isbn13}>
              <List.Item.Meta
                avatar={<Avatar src={book.cover} shape="square" size={64} />}
                title={<a href={book.link} target="_blank" rel="noopener noreferrer">{book.title}</a>}
                description={book.author}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default BookList;

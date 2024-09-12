import { Avatar, List, Radio, Spin } from 'antd';
import React from 'react';

const RadioBookList = ({ books, loading, radioValue, onChange }) => {
  return (
    <div>
      {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Radio.Group onChange={onChange} value={radioValue}>
            <List
              dataSource={books}
              renderItem={(book) => (
                <Radio value={book} style={{ display: 'block', marginBottom: '10px' }}>
                  <List.Item key={book.isbn13}>
                    <List.Item.Meta
                      avatar={<Avatar src={book.cover} shape="square" size={64} />}
                      title={book.title}
                      description={book.author}
                    />
                  </List.Item>
                </Radio>
              )}
            />
          </Radio.Group>
        )}
    </div>
  );
};

export default RadioBookList;

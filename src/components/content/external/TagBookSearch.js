import { Alert, Avatar, List, Spin, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TagBookSearch = () => {
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
	  axios.get(process.env.REACT_APP_API_URL + '/api/external/aladinTag').then(response => {
      setTags(response.data);
      if (response.data.length > 0) {
        setSelectedTag(response.data[0].Code);
      }
    }).catch(error => {
      console.error('Error fetching tags:', error);
      setErrorMessage(`Error fetching tags : ${error.response ? error.response.data.error : error.message}`);
    });
  }, []);
  
  useEffect(() => {
    if (selectedTag) {
      setLoading(true);
      // API를 호출하여 선택한 카테고리의 도서를 가져옵니다.
      axios.post(process.env.REACT_APP_API_URL + '/api/external/aladinSearch', {
        query: selectedTag,
        maxResults : "50",
      }).then(response => {
        setBooks(response.data);
      }).catch(error => {
        console.error('Error fetching books:', error);
        setErrorMessage(`Error fetching books: ${error.response ? error.response.data.error : error.message}`);
      }).finally(()=>{ setLoading(false); });
    }
  }, [selectedTag]);
  
  const handleTagClick = value => {
    setSelectedTag(value);
  };
  
  return (
		<>
      <h2 className="signup-title">키워드 별 도서(알라딘서점)</h2>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <div style={{ marginBottom: '20px' }}>
        {tags.map(tag => (
          <Tag
            key={tag.Code}
            color={selectedTag === tag.Code ? 'blue' : 'default'}
            onClick={() => handleTagClick(tag.Code)}
            style={{ cursor: 'pointer', marginBottom: '8px' }}
          >
            {tag.Name}
          </Tag>
        ))}
      </div>
      <div style={{ height: '340px', overflowY: 'auto' }}>
        {loading ? 
        (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
          </div>
        ) : 
        (
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
		</>
	);
}
  
export default TagBookSearch;
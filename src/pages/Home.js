import { Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import BookList from '../components/content/external/BookList';
import SimpleBarChart from "../components/content/external/SimpleBarChart";
import SimpleLineChart from "../components/content/external/SimpleLineChart";
import TagList from '../components/content/external/TagList';

import useFetchBooksByQuery from '../hooks/useFetchBooksByQuery'; // 선택된 태그로 책 데이터를 가져오는 훅
import useFetchTags from '../hooks/useFetchTags'; // 태그 데이터를 가져오는 훅

const Home = () => {
  const { tags, errorMessage: tagsError } = useFetchTags(); // 태그 데이터 훅
  const [selectedTag, setSelectedTag] = useState('');

  // 태그가 불러와진 후, 초기 선택된 태그 설정
  useEffect(() => {
    if (tags.length > 0 && !selectedTag) {
      setSelectedTag(tags[0].Code); // 첫 번째 태그를 초기값으로 설정
    }
  }, [tags, selectedTag]);
  
  const { books, loading: booksLoading, errorMessage: booksError } = useFetchBooksByQuery(selectedTag); // 선택된 태그로 책 데이터를 가져오는 훅

  const handleTagClick = (tagCode) => {
    setSelectedTag(tagCode);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          padding: "20px",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
        }}
      >
        <h2 className="signup-title">키워드 별 도서(알라딘서점)</h2>
        {tagsError && <Alert message={tagsError} type="error" showIcon />}
        {booksError && <Alert message={booksError} type="error" showIcon />}
        <div style={{ marginBottom: '20px' }}>
          <TagList tags={tags} selectedTag={selectedTag} handleTagClick={handleTagClick} />
        </div>
        <div style={{ height: '340px', overflowY: 'auto' }}>
          <BookList books={books} loading={booksLoading} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, borderBottom: "1px solid #f0f0f0" }}>
          <h2>선그림 테스트</h2>
          <SimpleLineChart />
        </div>
        <div style={{ flex: 1, paddingTop: "20px" }}>
          <h2>막대그림 테스트</h2>
          <SimpleBarChart />
        </div>
      </div>
    </div>
  );
};

export default Home;

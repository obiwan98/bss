import { Alert, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BookList from '../components/content/external/BookList';
import SimpleBarChart from "../components/content/external/SimpleBarChart";
import TagList from '../components/content/external/TagList';

import ApprovalItem from '../components/content/approval/ApprovalSimpleItem';
import useFetchBooksByQuery from '../hooks/useFetchBooksByQuery'; // 선택된 태그로 책 데이터를 가져오는 훅
import useFetchTags from '../hooks/useFetchTags'; // 태그 데이터를 가져오는 훅

const Home = () => {
  const [dataList, setDataList] = useState([]);
  // useFetchTags에서 selectedTag 관리하도록 함
  const { tags, selectedTag, setSelectedTag, loading: tagsLoading, errorMessage: tagsError } = useFetchTags();
  const { books, loading: booksLoading, errorMessage: booksError } = useFetchBooksByQuery(selectedTag); // 선택된 태그로 책 데이터를 가져오는 훅

  const handleTagClick = (tagCode) => {
    setSelectedTag(tagCode);
  };
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const approvalListResponse = await axios.get(
        process.env.REACT_APP_API_URL + `/api/approvals/list/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataList(approvalListResponse.data.slice(0,3));
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
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
        {tagsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
          </div>
        ) : (
          Array.isArray(tags) && tags.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              <TagList tags={tags} selectedTag={selectedTag} handleTagClick={handleTagClick} />
            </div>
          ) : (
            <div>No tags available</div>
          )
        )}
        <div style={{ height: '340px', overflowY: 'auto' }}>
          {booksLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : (
            Array.isArray(books) && books.length > 0 ? (
              <BookList books={books} />
            ) : (
              <div>No books available</div>
            )
          )}
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
          <h2>팀별 승인 요청 현황(TOP 3)</h2>
          <ApprovalItem data={dataList}></ApprovalItem>
        </div>
        <div style={{ flex: 1, paddingTop: "20px" }}>
          <h2>팀별 보유 도서 수</h2>
          <SimpleBarChart />
        </div>
      </div>
    </div>
  );
};

export default Home;

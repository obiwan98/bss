import React, { useEffect, useState } from 'react';
import { Input, Descriptions, Divider } from 'antd';
import "./BookSearchModal.css";

const BookDirectInput = ({ modalData }) => {
  /** 검색방법2 - 수동 입력 */
  const [directInfo, setDirectInfo] = useState({title:'', link:'', author:'', isbn13:'', priceSales:''});
  
  /** 수동 저장 폼 */
  const reqItems = [
    {
      key: 'title',
      label: '도서명',
      children: (
        <Input
          value={directInfo.title}
          onChange={(e) => (setDirectInfo({...directInfo, title:e.target.value}))}
        />
      ),
      span: 3,
    },
    {
      key: 'link',
      label: '상품 링크 URL',
      children: (
        <Input
          value={directInfo.link}
          onChange={(e) => (setDirectInfo({...directInfo, link:e.target.value}))}
        />
      ),
      span: 3,
    },
    {
      key: 'author',
      label: '저자/아티스트',
      children: (
        <Input
          value={directInfo.author}
          onChange={(e) => (setDirectInfo({...directInfo, author:e.target.value}))}
        />
      ),
      span: 3,
    },
    {
      key: 'isbn13',
      label: '13자리 ISBN',
      children: (
        <Input
          value={directInfo.isbn13}
          onChange={(e) => (setDirectInfo({...directInfo, isbn13:e.target.value}))}
        />
      ),
      span: 3,
    },
    {
      key: 'priceSales',
      label: '판매가',
      children: (
        <Input
          value={directInfo.priceSales}
          onChange={(e) => (setDirectInfo({...directInfo, priceSales:e.target.value}))}
        />
      ),
      span: 3,
    },
  ];

  useEffect(() => {
      modalData(directInfo);
  },[directInfo]);

  return (
    <>
        <div>
          <Descriptions bordered items={reqItems} className="bookSearch_Descriptions"/>
          <Divider
            style={{
              borderColor: '#7cb305',
            }}
          ></Divider>
        </div>
    </>
  );
};
export default BookDirectInput;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Form, Input, Rate, Flex, Tag, Mentions, Button, message } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookReviewWrite.css';

const tagsData = [
  { key: 5, class: 'grate', text: '추천', icon: <SmileOutlined /> },
  { key: 4, class: 'good', text: '최고', icon: <SmileOutlined /> },
  { key: 3, class: 'neutral', text: '보통', icon: <MehOutlined /> },
  { key: 2, class: 'poor', text: '별로', icon: <FrownOutlined /> },
  { key: 1, class: 'bad', text: '최악', icon: <FrownOutlined /> },
];

const maxLength = 1000;

const BookReviewWrite = ({ bookReviewWrite: { bookData, bookReview, handleBookData } }) => {
  const { user } = useUser();

  const [form] = Form.useForm();
  const [activeTag, setActiveTag] = useState(0);
  const [value, setValue] = useState('');
  const [count, setCount] = useState(0);
  const [labelHeight, setLabelHeight] = useState(0);
  const [mentionsHeight, setMentionsHeight] = useState(0);

  const labelRef = useRef(null);
  const mentionsRef = useRef(null);

  const isBookReview = !!bookReview;

  const handleTagChange = (key) => {
    const newActiveTag = activeTag === key ? null : key;

    setActiveTag(newActiveTag);
    form.setFieldsValue({ tag: newActiveTag });
  };

  const handleMentionsChange = (text) => {
    if (text.length > maxLength) {
      message.error(`최대 ${maxLength}자까지만 입력 가능합니다.`);
    } else {
      setValue(text);
      setCount(text.length);
    }
  };

  const handleBookReviewWrite = async (values) => {
    const { _id, group, name } = user;

    try {
      const { id, rate, tag, comment } = values;

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/management/bookReviewWrite/${bookData._id}`,
        {
          id,
          user: _id,
          group: group._id,
          rate,
          tag,
          comment,
          registrationDate: dayjs(),
          registeredBy: name,
        }
      );

      message.success(response.data.message);

      handleBookData();
    } catch (error) {
      message.error('리뷰 작성을 실패하였습니다.');
    }
  };

  const handleBookReviewWriteReset = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      id: bookReview?._id || '',
      rate: bookReview?.rate || 0,
      tag: bookReview?.tag || 0,
      comment: bookReview?.comment || '',
    });

    setActiveTag(bookReview?.tag || 0);
    setValue(bookReview?.comment || '');
    setCount(bookReview?.comment.length || 0);
  }, [form, bookReview]);

  useEffect(() => {
    const labelTarget = labelRef?.current;
    const mentionsTarget = mentionsRef?.current;

    setLabelHeight(labelTarget.offsetHeight + 8);
    setMentionsHeight(mentionsTarget.offsetHeight);

    handleBookReviewWriteReset();
  }, [handleBookReviewWriteReset]);

  return (
    <div className="bookReviewWrite-container">
      <div className="bookReviewWrite-form">
        <Form layout="vertical" form={form} onFinish={handleBookReviewWrite}>
          <Form.Item label="" name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="도서 별점" name="rate">
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            label="추천 태그"
            name="tag"
            rules={[{ required: true, message: '추천 태그를 선택해 주세요.' }]}
          >
            <Flex gap={20} align="center" wrap>
              {tagsData.map((tag) => (
                <Tag.CheckableTag
                  key={tag.key}
                  checked={activeTag === tag.key}
                  onChange={() => handleTagChange(tag.key)}
                >
                  <div className={`tag-content ${tag.class}`}>
                    <div className="tag-icon">{tag.icon}</div>
                    <div className="tag-text">{tag.text}</div>
                  </div>
                </Tag.CheckableTag>
              ))}
            </Flex>
          </Form.Item>
          <div className="mentions-form">
            <Form.Item
              label={<span ref={labelRef}>리뷰 작성</span>}
              name="comment"
              rules={[{ required: true, message: '후기를 작성해 주세요.' }]}
            >
              <div ref={mentionsRef} className="mentions-body">
                <Mentions
                  rows={2}
                  value={value}
                  placeholder="후기를 작성해 주세요."
                  onChange={handleMentionsChange}
                  allowClear
                />
                <div className="mentions-footer">
                  <span className="count">{count}</span>
                  <span className="total">{maxLength}</span>
                </div>
              </div>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginTop: `${labelHeight}px`,
                height: `${mentionsHeight}px`,
              }}
            >
              {!isBookReview ? '등록' : '변경'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default BookReviewWrite;

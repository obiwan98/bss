import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Form, Rate, Flex, Tag, Mentions, Button, message } from 'antd';
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

const BookReviewWrite = forwardRef(({ id }, ref) => {
  const { user } = useUser();

  const [form] = Form.useForm();
  const [selectedTag, setSelectedTag] = useState(null);
  const [labelHeight, setLabelHeight] = useState(0);
  const [mentionsHeight, setMentionsHeight] = useState(0);
  const [value, setValue] = useState('');
  const [count, setCount] = useState(0);

  const labelRef = useRef(null);
  const mentionsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      form.resetFields();

      setSelectedTag(null);
      setValue('');
      setCount(0);
    },
  }));

  const handleTagChange = (key) => {
    const newSelectedTag = selectedTag === key ? null : key;

    setSelectedTag(newSelectedTag);
    form.setFieldsValue({ tag: newSelectedTag });
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
      const { rate, tag, comment } = values;

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/management/reviewWrite/${id}`,
        {
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
    } catch (error) {
      message.error('리뷰 작성을 실패하였습니다.');
    }
  };

  useEffect(() => {
    const labelTarget = labelRef?.current;
    const mentionsTarget = mentionsRef?.current;

    labelTarget && setLabelHeight(labelTarget.offsetHeight + 8);
    mentionsTarget && setMentionsHeight(mentionsTarget.offsetHeight);
  }, []);

  return (
    <div className="bookReviewWrite-container">
      <div className="bookReviewWrite-form">
        <Form layout="vertical" form={form} onFinish={handleBookReviewWrite}>
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
                  checked={selectedTag === tag.key}
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
                height: `${mentionsHeight}px`,
                marginTop: `${labelHeight}px`,
              }}
            >
              등록
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
});

export default BookReviewWrite;

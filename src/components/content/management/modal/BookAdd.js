import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Form, Row, Col, Input, Upload, DatePicker, Select, Space, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookAdd.css';

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);

const BookAdd = ({ bookData, autoBookData }) => {
  const { user } = useUser();
  const { Option } = Select;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [coverHeight, setCoverHeight] = useState(0);
  const [activeBookData, setActiveBookData] = useState(null);

  const coverRef = useRef(null);

  const isDetailView = !!bookData;

  const handleUploadChange = ({ file, fileList: newFileList }) => {
    const isFileRemoved = file.status === 'removed';
    const isFileValid = allowedImageTypes.has(file.type);

    isFileRemoved
      ? message.info(`${file.name} 파일이 삭제되었습니다.`)
      : !isFileValid && message.error('이미지 파일만 업로드할 수 있습니다.');

    setFileList(isFileRemoved || isFileValid ? newFileList : []);
  };

  const handleBookData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/management/bookList/${bookData._id}`
      );

      setActiveBookData(response.data);
    } catch (error) {
      message.error('도서 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleBookSave = async (values) => {
    const { group, name } = user;

    try {
      const {
        id,
        title,
        link,
        description,
        author,
        cover,
        isbn,
        publisher,
        publicationDate,
        count,
      } = values;
      const newFileList = cover?.fileList || [];

      const response = await axios({
        method: !isDetailView ? 'post' : 'put',
        url: `${process.env.REACT_APP_API_URL}/api/management/${!isDetailView ? 'bookAdd' : `bookUpdate/${id}`}`,
        data: {
          title,
          link,
          description,
          author,
          cover: newFileList[0]?.originFileObj || '',
          isbn,
          publisher,
          publicationDate,
          count,
          ...(!isDetailView && {
            registrationDate: dayjs(),
            group: group._id,
            registeredBy: name,
          }),
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success(response.data.message);

      !isDetailView ? setActiveBookData(null) : handleBookData();
    } catch (error) {
      message.error(`도서 ${!isDetailView ? '등록' : '변경'}을 실패하였습니다.`);
    }
  };

  const handleBookReset = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      id: activeBookData?._id || '',
      link: activeBookData?.link || '',
      title: activeBookData?.title || '',
      description: activeBookData?.description || '',
      author: activeBookData?.author || '',
      cover: setFileList([]),
      isbn: activeBookData?.isbn || '',
      publisher: activeBookData?.publisher || '',
      publicationDate: activeBookData?.publicationDate
        ? dayjs(activeBookData.publicationDate)
        : activeBookData?.pubDate
          ? dayjs(activeBookData.pubDate)
          : dayjs(),
      count: activeBookData?.count || 1,
    });
  }, [form, activeBookData]);

  useEffect(() => setActiveBookData(bookData || autoBookData), [bookData, autoBookData]);

  useEffect(() => {
    const coverTarget = coverRef?.current;

    handleBookReset();

    if (coverTarget) {
      const resizeObserver = new ResizeObserver(() => setCoverHeight(coverTarget.offsetHeight));

      resizeObserver.observe(coverTarget);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [activeBookData, handleBookReset]);

  return (
    <div className="bookAdd-container">
      <div className="bookAdd-form">
        <Form layout="vertical" form={form} variant="filled" onFinish={handleBookSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="" name="id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item label="" name="link" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="도서명"
                name="title"
                rules={[{ required: true, message: '도서명을 입력해 주세요.' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="책 소개" name="description">
                <Input />
              </Form.Item>
              <Form.Item label="저자" name="author">
                <Input />
              </Form.Item>
              <div ref={coverRef}>
                <Form.Item label="책표지" name="cover">
                  <Upload
                    listType={fileList.length > 0 ? 'picture' : 'picture-card'}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                  >
                    {fileList.length < 1 && (
                      <button type="button">
                        <PlusOutlined />
                        <div>Click or Drag File to Upload</div>
                      </button>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item label="도서번호" name="isbn">
                <Input />
              </Form.Item>
              <Form.Item label="출판사" name="publisher">
                <Input />
              </Form.Item>
              <Form.Item
                label="발행일"
                name="publicationDate"
                rules={[{ required: true, message: '발행일을 입력해 주세요.' }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item label="수량" name="count" style={{ height: `${coverHeight}px` }}>
                <Select>
                  {new Array(5).fill(null).map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button type="primary" htmlType="submit">
              {!isDetailView ? '등록' : '변경'}
            </Button>
            <Button
              type="default"
              onClick={() => (!isDetailView ? setActiveBookData(null) : handleBookReset())}
            >
              초기화
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default BookAdd;

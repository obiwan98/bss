import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

import { Row, Col, Form, Input, Upload, Select, DatePicker, Space, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookAdd.css';

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);

const BookAdd = forwardRef(({ bookData, onCancel }, ref) => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { Option } = Select;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [coverHeight, setCoverHeight] = useState(0);

  const coverRef = useRef(null);

  const isDetailView = !!bookData;

  useImperativeHandle(ref, () => ({
    resetForm: () => onReset(),
  }));

  const handleUploadChange = ({ file, fileList: newFileList }) => {
    const isFileRemoved = file.status === 'removed';
    const isFileValid = allowedImageTypes.has(file.type);

    isFileRemoved
      ? message.info(`${file.name} 파일이 삭제되었습니다.`)
      : !isFileValid && message.error('이미지 파일만 업로드할 수 있습니다.');

    setFileList(isFileRemoved || isFileValid ? newFileList : []);
  };

  const handleBookAdd = async (values) => {
    const { group } = user;

    try {
      const { title, author, cover, publisher, publicationDate, count } = values;
      const newFileList = cover?.fileList || [];

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/management/bookAdd`,
        {
          title,
          author,
          cover: newFileList[0]?.originFileObj || '',
          publisher,
          publicationDate,
          count,
          registrationDate: dayjs(),
          group: group._id,
          registeredBy: user.name,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      message.success(response.data.message);

      onCancel(true);
    } catch (error) {
      message.error('도서 등록을 실패하였습니다.');
    }
  };

  const handleBookUpdate = async (values) => {
    const { id, title, author, cover, publisher, publicationDate, count } = values;
    const newFileList = cover?.fileList || [];

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/management/bookUpdate/${id}`,
        {
          title,
          author,
          cover: newFileList[0]?.originFileObj || '',
          publisher,
          publicationDate,
          count,
        }
      );

      message.success(response.data.message);

      onCancel(true);
    } catch (error) {
      message.error('도서 변경을 실패하였습니다.');
    }
  };

  const onReset = useCallback(async () => {
    form.resetFields();
    form.setFieldsValue({
      id: bookData?._id || '',
      title: bookData?.title || '',
      author: bookData?.author || '',
      cover: setFileList([]),
      publisher: bookData?.publisher || '',
      publicationDate: dayjs(bookData?.publicationDate) || dayjs(),
      count: bookData?.count || 1,
    });
  }, [form, bookData]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const coverTarget = coverRef?.current;

      onReset();

      if (coverTarget) {
        const resizeObserver = new ResizeObserver(() => setCoverHeight(coverTarget.offsetHeight));

        resizeObserver.observe(coverTarget);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, [user, navigate, onReset]);

  return (
    <div className="bookAdd-container">
      {!isDetailView && <h2>도서 등록</h2>}
      <div className="bookAdd-form">
        <Form
          layout="vertical"
          form={form}
          variant="filled"
          onFinish={!isDetailView ? handleBookAdd : handleBookUpdate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="" name="id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="도서명"
                name="title"
                rules={[{ required: true, message: '도서명을 입력해 주세요.' }]}
              >
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
            <Button type="default" onClick={onReset}>
              초기화
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
});

export default BookAdd;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import {
  Row,
  Col,
  Form,
  Input,
  Upload,
  Select,
  DatePicker,
  Rate,
  Tabs,
  Space,
  Button,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import BookReview from "./BookReview";

import axios from "axios";
import dayjs from "dayjs";

import "./css/BookAdd.css";
import BookHistory from "./BookHistory";

const reviewCategories = [
  { key: "review", category: "책 리뷰" },
  { key: "history", category: "열람 이력" },
];

function getComponentByKey(key) {
  switch (key) {
    case "review":
      return <BookReview />;
    case "history":
      return <BookHistory />;
    default:
      return null;
  }
}

const BookAdd = ({ isModal = false, data, onClose }) => {
  const navigate = useNavigate();
  const isDetailView = isModal && data;

  const { user, setUser } = useUser();
  const { Option } = Select;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [rating, setRating] = useState(0);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setImageUrl("");
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const reader = new FileReader();
      const file = newFileList[0].originFileObj;

      reader.readAsDataURL(file);
      reader.onload = () => setPreviewImage(reader.result);
    } else {
      setPreviewImage(null);
    }
  };

  const handleBookAdd = async (values) => {
    console.log("values: ", values);
    try {
      const { title, author, cover, publisher, registrationDate, group } =
        values;
      const { fileList: newFileList } = cover;

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/books/bookAdd",
        {
          title,
          author,
          cover: newFileList[0].originFileObj,
          publisher,
          group,
          registDate: registrationDate,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success(response.data.message);
      onReset();

      if (onClose) onClose(true);
    } catch (error) {}
  };

  const handleBookUpdate = async (values) => {
    const { _id, title, author, publisher, group } = values;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/books/bookUpdate/${_id}`,
        {
          title,
          author,
          publisher,
          group,
          registDate: dayjs(),
        }
      );

      message.success(response.data.message);
    } catch (error) {
      message.error("도서 정보 변경에 실패했습니다.");
    }

    onClose(true);
  };

  const onReset = useCallback(() => {
    const url =
      isModal && data?.cover
        ? `${process.env.REACT_APP_API_URL}/uploads/${data.cover}`
        : "";

    const { group } = user;

    setFileList([]);
    setImageUrl(url);
    setPreviewImage("");

    form.resetFields();
    form.setFieldsValue({
      _id: data?._id || "",
      title: data?.title || "",
      author: data?.author || "",
      publisher: data?.publisher || "",
      registrationDate: dayjs(),
      team: group.team,
      group: group._id,
      registeredBy: user.name,
    });
  }, [isModal, data, user, form]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      onReset();
    }
  }, [user, navigate, onReset]);

  return (
    <div className="bookAdd-container">
      <h2>{isDetailView ? "도서 상세정보" : "도서 등록"}</h2>
      <div className="bookAdd-form">
        <Form
          layout="vertical"
          form={form}
          variant="filled"
          onFinish={isDetailView ? handleBookUpdate : handleBookAdd}
        >
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="_id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="도서명"
                name="title"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="저자" name="author">
                <Input />
              </Form.Item>
              <Form.Item label="출판사" name="publisher">
                <Input />
              </Form.Item>
              <Form.Item
                label="수량"
                name="count"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Select style={{ width: "20%" }}>
                  <Option value="0">0</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="등록일"
                name="registrationDate"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item label="팀" name="team" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="그룹" name="group" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="등록자"
                name="registeredBy"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <div className="bookCover-container">
                {previewImage || imageUrl ? (
                  <img src={previewImage || imageUrl} alt="미리보기" />
                ) : null}
                <Form.Item name="cover">
                  <Upload
                    className="upload-form"
                    listType={previewImage ? "picture" : "picture-card"}
                    maxCount={1}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                  >
                    {previewImage ? null : (
                      <button type="button" style={{ border: 0, background: "none" }}>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>
                          Click or Drag File to Upload
                        </div>
                      </button>
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item name="rate">
                  <div className="rate-form">
                    <span>책 리뷰 평점:</span>
                    <Rate
                      allowHalf
                      value={rating}
                      onChange={(value) => setRating(value)}
                    />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                </Form.Item>
              </div>
            </Col>
            <Col span={10}>
              <div className="review-container">
                <Tabs
                  type="card"
                  items={reviewCategories.map((review) => ({
                    label: review.category,
                    key: review.key,
                    children: getComponentByKey(review.key),
                  }))}
                />
              </div>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isDetailView ? "변경" : "등록"}
              </Button>
              <Button onClick={onReset}>초기화</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default BookAdd;

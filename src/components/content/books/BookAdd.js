import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import { Form, Input, DatePicker, Space, Button, message } from "antd";

import axios from "axios";
import dayjs from "dayjs";

const BookAdd = ({ data, onClose }) => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const [form] = Form.useForm();

  const handleAdd = async (values) => {
    try {
      const { title, author, publisher, registrationDate, group } = values;

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/books/bookAdd",
        {
          title,
          author,
          publisher,
          group,
          registDate: registrationDate,
        }
      );

      alert(response.data.message);
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
    const { group } = user;

    form.resetFields();
    form.setFieldsValue({
      _id: data ? data._id : "",
      title: data ? data.title : "",
      author: data ? data.author : "",
      publisher: data ? data.publisher : "",
      registrationDate: dayjs(),
      team: group.team,
      group: group._id,
      registeredBy: user.name,
    });
  }, [form, user, data]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      onReset();
    }
  }, [user, navigate, onReset]);

  return (
    <div className="book-add-container">
      <h2>{data ? "도서 변경" : "도서 등록"}</h2>
      <Form
        layout="vertical"
        form={form}
        variant="filled"
        onFinish={data ? handleBookUpdate : handleAdd}
        style={{ maxWidth: 600 }}
      >
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
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {data ? "변경" : "등록"}
            </Button>
            <Button onClick={onReset}>초기화</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookAdd;

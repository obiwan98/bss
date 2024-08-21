import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

import { Form, Input, DatePicker, Select, Button, Space } from "antd";

import axios from "axios";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const { Option } = Select;

const BookAdd = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchRolesAndGroups = async () => {
      try {
        const groupsResponse = await axios.get(
          process.env.REACT_APP_API_URL + "/api/groups"
        );

        setGroups(groupsResponse.data);
      } catch (error) {}
    };

    fetchRolesAndGroups();
  }, [isLoggedIn, navigate]);

  return (
    <div className="book-add-container">
      <h2>도서 등록</h2>
      <Form
        {...formItemLayout}
        form={form}
        variant="filled"
        style={{ maxWidth: 600, marginTop: 45 }}
      >
        <Form.Item
          label="도서명"
          name="Title"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="저자" name="Author">
          <Input />
        </Form.Item>
        <Form.Item label="출판사" name="Publisher">
          <Input />
        </Form.Item>
        <Form.Item
          label="등록일"
          name="RegistrationDate"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="등록자"
          name="RegisteredBy"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Select>
            <Option value="">전체</Option>
            {groups.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.team} {/* 팀 이름 표시 */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
            <Button htmlType="button" onClick={onReset}>
              초기화
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookAdd;

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  Space,
  Button,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import axios from "axios";
import dayjs from "dayjs";

import "./css/BookAdd.css";

const BookAdd = forwardRef(({ bookData, onClose }, ref) => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const { Option } = Select;

  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [coverHeight, setCoverHeight] = useState(0);

  const coverRef = useRef(null);

  const isDetailView = !!bookData;

  useImperativeHandle(ref, () => ({
    resetForm: () => onReset(),
  }));

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/groups`
      );

      setGroups(response.data);
    } catch (error) {}
  };

  const handleGroupChange = async (value) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allUsers = response.data;
        const groupUsers = allUsers.filter((user) => user.group._id === value);

        setUsers(groupUsers);
      }
    } catch (error) {}
  };
  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleBookAdd = async (values) => {
    try {
      const { title, author, cover, publisher, registrationDate, group } =
        values;
      const newFileList = cover?.fileList || [];

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/books/bookAdd",
        {
          title,
          author,
          cover: newFileList[0]?.originFileObj || "",
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
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleBookUpdate = async (values) => {
    const { id, title, author, publisher, group } = values;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/books/bookUpdate/${id}`,
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

  const onReset = useCallback(async () => {
    const { group } = user;

    await handleGroupChange(group._id);

    form.resetFields();
    form.setFieldsValue({
      id: bookData?._id || "",
      title: bookData?.title || "",
      author: bookData?.author || "",
      cover: setFileList([]),
      publisher: bookData?.publisher || "",
      count: bookData?.count || 1,
      registrationDate: dayjs(),
      group: group._id,
      registeredBy: user.name,
    });
  }, [user, form, bookData]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      const coverTarget = coverRef?.current;

      fetchGroups();
      onReset();

      if (coverTarget) {
        const resizeObserver = new ResizeObserver(() =>
          setCoverHeight(coverTarget.offsetHeight)
        );

        resizeObserver.observe(coverTarget);

        return () => resizeObserver.disconnect();
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
          onFinish={isDetailView ? handleBookUpdate : handleBookAdd}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="" name="id" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="도서명"
                name="title"
                rules={[{ required: true, message: "도서명을 입력해 주세요." }]}
              >
                <Input />
              </Form.Item>
              <div ref={coverRef}>
                <Form.Item label="책표지" name="cover">
                  <Upload
                    listType={fileList.length > 0 ? "picture" : "picture-card"}
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
              <Form.Item label="수량" name="count" rules={[{ required: true }]}>
                <Select>
                  {new Array(5).fill(null).map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="팀"
                name="group"
                rules={[{ required: true, message: "팀을 선택해 주세요." }]}
              >
                <Select onChange={(value) => handleGroupChange(value)}>
                  {groups.map((group) => (
                    <Option key={group._id} value={group._id}>
                      {group.team}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="저자" name="author">
                <Input />
              </Form.Item>
              <Form.Item
                label="출판사"
                name="publisher"
                style={{ height: `${coverHeight}px` }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="등록일"
                name="registrationDate"
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                label="등록자"
                name="registeredBy"
                rules={[{ required: true }]}
              >
                <Select>
                  {users.map((user) => (
                    <Option key={user._id} value={user.name}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button type="primary" htmlType="submit">
              {isDetailView ? "변경" : "등록"}
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

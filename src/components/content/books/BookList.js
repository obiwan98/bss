import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import {
  Select,
  Input,
  Button,
  Table,
  Modal,
  Tabs,
  Space,
  message,
} from "antd";

import axios from "axios";
import dayjs from "dayjs";

import BookCover from "./BookCover";
import BookAdd from "./BookAdd";
import BookReview from "./BookReview";
import BookHistory from "./BookHistory";

import "./css/BookList.css";

const tabConfigurations = [
  { id: "DetailView", label: "도서 정보", component: BookAdd },
  { id: "Review", label: "후기", component: BookReview },
  { id: "History", label: "열람 이력", component: BookHistory },
];

const BookList = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const { Option } = Select;
  const { Search } = Input;

  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [bookData, setBookData] = useState(null);
  const [bookList, setBookList] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("DetailView");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const bookAddRef = useRef(null);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/groups`
      );

      setGroups(response.data);
    } catch (error) {}
  };

  const handleSearch = async (value) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/books/bookList`,
        {
          params: {
            title: value,
            group: activeGroup,
          },
        }
      );

      setBookList(response.data);
    } catch (error) {}
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "해당 도서를 삭제하시겠습니까?",
      content: "이 작업은 되돌릴 수 없습니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        axios
          .delete(`${process.env.REACT_APP_API_URL}/api/books/bookDelete/${id}`)
          .then(() => {
            message.success("삭제 성공");

            handleSearch();
          })
          .catch((error) => {
            console.error("Error deleting book:", error);
          });
      },
      onCancel() {
        message.error("삭제 취소");
      },
    });
  };

  const renderTabContent = (id, data, onClose) => {
    const tabConfig = tabConfigurations.find((item) => item.id === id);

    return (
      tabConfig && (
        <tabConfig.component
          {...(tabConfig.component === BookAdd && { ref: bookAddRef })}
          bookData={data}
          onClose={onClose}
        />
      )
    );
  };

  const showModal = (recode) => {
    setBookData(recode);
    setIsModalVisible(true);
  };

  const handleCancel = (refresh) => {
    bookAddRef?.current.resetForm();

    setActiveTabKey("DetailView");
    setIsModalVisible(false);

    refresh && handleSearch();
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchGroups();
    }
  }, [user, navigate]);

  const columns = [
    {
      title: "도서명",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "저자",
      dataIndex: "author",
      key: "author",
      align: "center",
    },
    {
      title: "출판사",
      dataIndex: "publisher",
      key: "publisher",
      align: "center",
    },
    {
      title: "등록일",
      dataIndex: "registDate",
      key: "registDate",
      render: (registDate) => dayjs(registDate).format("YYYY-MM-DD"),
      align: "center",
    },
    {
      title: "비고",
      key: "action",
      render: (_, recode) => (
        <Space>
          <Button type="primary" onClick={() => showModal(recode)}>
            상세
          </Button>
          <Button danger onClick={() => handleDelete(recode._id)}>
            삭제
          </Button>
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div className="bookList-container">
      <h2>도서 조회</h2>
      <div className="bookList-form">
        <div className="bookSearch-form">
          <Select
            value={activeGroup}
            onChange={(value) => setActiveGroup(value)}
          >
            <Option value="">전체</Option>
            {groups.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.team}
              </Option>
            ))}
          </Select>
          <Search
            placeholder="도서명을 입력해 주세요."
            onSearch={handleSearch}
            enterButton
          />
          <Button type="primary" onClick={() => showModal(null)}>
            추가
          </Button>
        </div>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={bookList}
          pagination={{ pageSize: 5 }}
        />
        <Modal
          width={800}
          open={isModalVisible}
          footer={null}
          onCancel={() => handleCancel(false)}
        >
          {bookData ? (
            <>
              <h2>도서 상세정보</h2>
              <div className="detailView-form">
                <BookCover bookData={bookData} />
                <Tabs
                  type="card"
                  activeKey={activeTabKey}
                  items={tabConfigurations.map((tab) => ({
                    label: tab.label,
                    key: tab.id,
                    children: renderTabContent(tab.id, bookData, handleCancel),
                  }))}
                  onChange={(key) => setActiveTabKey(key)}
                />
              </div>
            </>
          ) : (
            <BookAdd
              ref={bookAddRef}
              bookData={bookData}
              onClose={handleCancel}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BookList;

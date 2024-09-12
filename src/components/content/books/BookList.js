import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  List,
  Modal,
  Rate,
  Select,
  Space,
  Tabs,
  message,
} from "antd";

import axios from "axios";
import dayjs from "dayjs";

import BookAdd from "./BookAdd";
import BookCover from "./BookCover";
import BookHistory from "./BookHistory";
import BookReview from "./BookReview";

import "./css/BookList.css";

const tabConfigurations = [
  { id: "detailView", label: "도서 정보", component: BookAdd },
  { id: "review", label: "후기", component: BookReview },
  { id: "history", label: "열람 이력", component: BookHistory },
];

const tagsData = [
  { key: 0, class: "grate", text: "추천", icon: <SmileOutlined /> },
  { key: 1, class: "good", text: "최고", icon: <SmileOutlined /> },
  { key: 2, class: "neutral", text: "보통", icon: <MehOutlined /> },
  { key: 3, class: "poor", text: "별로", icon: <FrownOutlined /> },
  { key: 4, class: "bad", text: "최악", icon: <FrownOutlined /> },
];

const BookList = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const { Option } = Select;
  const { Search } = Input;

  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [bookData, setBookData] = useState(null);
  const [bookList, setBookList] = useState("");
  const [activeTabKey, setActiveTabKey] = useState("detailView");
  const [isActiveHistory, setIsActiveHistory] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const bookAddRef = useRef(null);
  const bookHistoryRef = useRef(null);

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
          {...(tabConfig.component === BookAdd
            ? { ref: bookAddRef }
            : tabConfig.component === BookHistory && {
                ref: bookHistoryRef,
              })}
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
    isActiveHistory && bookHistoryRef?.current.resetForm();

    setActiveTabKey("detailView");
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
        <div className="bookData-form">
          <List
            itemLayout="vertical"
            pagination={{ pageSize: 3 }}
            dataSource={bookList}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <div className="bookData-header">
                  <div className="cover">
                    <Image
                      src={
                        item.cover
                          ? `${process.env.REACT_APP_API_URL}/uploads/${item.cover}`
                          : "error"
                      }
                      alt="책표지"
                      preview={false}
                      fallback="data:image/png;base64,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"
                    />
                  </div>
                </div>
                <div className="bookData-body">
                  <div className="title">
                    <h2>{item.title}</h2>
                  </div>
                  <div className="author">
                    {item.author}
                    <span>저자</span>
                  </div>
                  <div className="publisher">{`출판사: ${item.publisher}`}</div>
                  <div className="count">{`수량: ${item.count}`}</div>
                  <div className="rate-form">
                    <Rate value={3.5} count={1} allowHalf disabled />
                    <span>{(3.5).toFixed(1)}</span>
                    <div className="gap">/</div>
                    <div className={`tag-content ${tagsData[0].class}`}>
                      <div className="tag-icon">{tagsData[0].icon}</div>
                      <div className="tag-text">{tagsData[0].text}</div>
                    </div>
                  </div>
                  <div className="registDate">
                    {`등록일: ${dayjs(item.registDate).format("YYYY-MM-DD")}`}
                  </div>
                  <div className="tag-form"></div>
                </div>
                <div className="bookData-state">
                  <button className="state blinking-text">대여 가능</button>
                  <div className="remainCount">{`잔여 수량: ${item.count}`}</div>
                </div>
                <div className="bookData-footer">
                  <Space>
                    <Button type="primary" onClick={() => showModal(item)}>
                      수정
                    </Button>
                    <Button danger onClick={() => handleDelete(item._id)}>
                      삭제
                    </Button>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </div>
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
                  onChange={(key) => {
                    setActiveTabKey(key);
                    key === "history" && setIsActiveHistory(true);
                  }}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import { Button, Table, Modal, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import axios from "axios";
import dayjs from "dayjs";

import BookAdd from "./BookAdd";

const BookList = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const [bookList, setBookList] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/books/bookList`
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

  const showModal = (recode) => {
    setBookData(recode);
    setIsModalVisible(true);
  };

  const handleCancel = (refresh) => {
    setIsModalVisible(false);

    if (refresh) handleSearch();
  };

  useEffect(() => {
    if (!user) navigate("/login");
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
    <div className="book-list-container">
      <h2>도서 조회</h2>
      <div className="book-filter-container">
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          조회
        </Button>
        <span
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button type="primary" onClick={() => showModal(null)}>
            추가
          </Button>
        </span>
      </div>
      <Table
        dataSource={bookList}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
        style={{ marginTop: 20 }}
      />
      <Modal
        width={1000}
        open={isModalVisible}
        footer={null}
        onCancel={() => handleCancel(false)}
      >
        <BookAdd
          isModal={isModalVisible}
          data={bookData}
          onClose={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default BookList;

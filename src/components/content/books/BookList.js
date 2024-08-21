import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

import { Form, Select, Button, Table, Modal } from "antd";
import BookAdd from "./BookAdd";

const BookList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="book-list-container">
      <h2>도서 조회</h2>
      <div className="book-filter-container">
        <Select></Select>
        <Button type="primary">조회</Button>
        <span
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button type="primary" onClick={showModal}>등록</Button>
          <Button htmlType="button">삭제</Button>
        </span>
      </div>
      <Table />
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        <BookAdd />
      </Modal>
    </div>
  );
};

export default BookList;

import React from "react";
import { Badge, Button, Descriptions, Divider, Input, Form } from "antd";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

import "../../../App.css";

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

const ApprovalEdit = () => {
  // return "승인상세화면 공통(요청상태에 따라 UI 구성) 승인요청중 : 결제승인 & 결제반려 버튼 노출, 승인완료 : 구매완료처리 버튼, 결제의견 노출, 반려 : 결제의견 노출, 승인및구매완료 : ";
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/approvals/pending",
        {
          data: inputValue,
        }
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error(
        "Error during pending:",
        error.response ? error.response.data : error.message
      );
      // setErrorMessage(`Error signing up: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const [items, setItems] = useState([
    {
      key: "1",
      label: "신청자명",
      children: (
        <Input
          placeholder="Basic usage"
          value={user !== null ? user.name : "DEFAULT NAME"}
          // onChange={handleInputChange}
        />
      ),
    },
    {
      key: "2",
      label: "신청부서",
      children: (
        <Input
          placeholder="Basic usage"
          value={
            user !== null
              ? [user.group.part] + "/" + [user.group.team]
              : "DEFAULT PART"
          }
          // onChange={handleInputChange}
        />
      ),
    },
    {
      key: "3",
      label: "신청일자",
      children: formatDate(new Date()),
    },
    {
      key: "4",
      label: "도서정보",
      children: (
        <Input
          placeholder="Basic usage"
          value="USE ALADIN API"
          // onChange={handleInputChange}
        />
      ),
      span: 4,
    },
    {
      key: "6",
      label: "결재상태",
      children: <Badge status="processing" text="승인요청" value={1} />,
      span: 3,
    },
  ]);

  // Sample Save
  const saveItems = () => {
    // Prepare the data to send
    const dataToSend = items.map((item) => ({
      key: item.key,
      label: item.label,
      value: item.children.props?.value || item.children, // Extract value if available
    }));

    console.log(dataToSend);

    axios
      .post(process.env.REACT_APP_API_URL + "/api/approvals/pending", {
        items: dataToSend,
      })
      .then((response) => {
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div>
      <h1>승인 요청</h1>
      <Form>
        <Divider
          style={{
            borderColor: "#7cb305",
          }}
        ></Divider>
        <Descriptions title="" bordered className="custom-descriptions">
          {items.map((item) => (
            <Descriptions.Item
              key={item.key}
              label={item.label}
              span={item.span}
            >
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Divider
          style={{
            borderColor: "#7cb305",
          }}
        ></Divider>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={saveItems}>
            요청서 작성
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ApprovalEdit;

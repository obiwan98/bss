import { useState, useRef } from "react";
import { Radio, Button, Input, Space, Table, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ApprovalItem from "./ApprovalItem";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";

const ApprovalList = () => {
  const [category, setCategory] = useState("1");
  const nav = useNavigate();

  const handleSizeChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="test-container">
      <Radio.Group value={category} onChange={handleSizeChange}>
        <Radio.Button value="1">승인요청</Radio.Button>
        <Radio.Button value="2">승인완료</Radio.Button>
        <Radio.Button value="3">반려</Radio.Button>
      </Radio.Group>
      <Divider style={{ borderColor: "#7cb305" }}></Divider>
      <ApprovalItem category={category}></ApprovalItem>
      <Divider style={{ borderColor: "#7cb305" }}></Divider>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => nav("/approvals/pending/new")}
          style={{ marginRight: "15px" }}
        >
          요청서 작성
        </Button>
      </div>
    </div>
  );
};

export default ApprovalList;

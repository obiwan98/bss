import { useState, useRef } from "react";
import { Radio, Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ApprovalItem from "./ApprovalItem";
import Highlighter from "react-highlight-words";

const ApprovalList = () => {
  const [category, setCategory] = useState("1");
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
      <ApprovalItem></ApprovalItem>
    </div>
  );
};

export default ApprovalList;

import React from "react";
import { Badge, Button, Descriptions, Divider, Input, Form } from "antd";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useLocation, useParams } from "react-router-dom";

import "../../../App.css";

// 현재 일자 출력
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
  const { user, setUser } = useUser(); // 유저 기본정보 세팅
  const { param } = useParams();
  const navigate = useNavigate();

  // 승인 요청사항 할당
  const [commentValue, setCommentValue] = useState("");
  const handleCommentChange = (e) => {
    setCommentValue(e.target.value);
  };

  const reqItems = [
    {
      key: "name",
      label: "신청자명",
      children: user !== null ? user.name : "N/A",
    },
    {
      key: "group",
      label: "신청부서",
      children:
        user !== null ? [user.group.part] + "/" + [user.group.team] : "N/A",
    },
    {
      key: "regdate",
      label: "신청일자",
      children: formatDate(new Date()),
    },
    {
      key: "bookinfo",
      label: "도서정보",
      children: <Input placeholder="Basic usage" value="USE ALADIN API" />,
      span: 3,
    },
    {
      key: "comment",
      label: "요청사항",
      children: (
        <Input
          placeholder="Enter your comment"
          value={commentValue}
          onChange={handleCommentChange}
        />
      ),
      span: 2,
    },
    {
      key: "state",
      label: "결재상태",
      children: <Badge status="processing" text="승인요청" value={1} />,
    },
  ];

  const confirmItems = [
    {
      key: "1",
      label: "결재자명",
      children: "N/A",
    },
    {
      key: "2",
      label: "결재일시",
      children: "N/A",
    },

    {
      key: "3",
      label: "결재의견",
      children: "N/A",
    },
  ];

  const paymentItems = [
    {
      key: "1",
      label: "구매자명",
      children: "N/A",
    },
    {
      key: "2",
      label: "구매금액",
      children: "N/A",
    },
    {
      key: "3",
      label: "구매일자",
      children: "N/A",
    },
    {
      key: "4",
      label: "구매정보",
      children: "N/A",
    },
  ];

  // 요청서 작성(신규)
  const onClickSave = () => {
    const approval = reqItems.map((item) => ({
      key: item.key,
      label: item.label,
      value: item.children.props?.value || item.children,
    }));

    const totItem = {
      reqItems: approval,
      etc: {
        email: user?.email || "test1541@cj.net",
      },
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/api/approvals/pending", {
        data: totItem,
      })
      .then((response) => {
        console.log("Data saved successfully:", response.data);
        alert(response.data.message);
        // navigate('/');
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  // 승인
  const onClickApproval = () => {
    return alert("Approval");
  };

  // 반려
  const onClickReject = () => {
    return alert("Reject");
  };

  return (
    <div>
      <h1>승인 요청</h1>
      <Divider
        style={{
          borderColor: "#7cb305",
        }}
      ></Divider>
      <div className="req-container">
        <Descriptions
          title="신청 정보"
          bordered
          className="custom-descriptions"
        >
          {reqItems.map((item) => (
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
      </div>
      <div
        className="confirm-container"
        style={{ display: param === "new" ? "none" : "inline-block" }}
      >
        <Descriptions
          title="결재 정보"
          bordered
          className="custom-descriptions"
        >
          {confirmItems.map((item) => (
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
      </div>
      <div
        className="payment-container"
        style={{ display: param === "new" ? "none" : "inline-block" }}
      >
        <Descriptions
          title="구매 정보"
          bordered
          className="custom-descriptions"
        >
          {paymentItems.map((item) => (
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
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {param === "new" && (
          <Button
            type="primary"
            onClick={onClickSave}
            style={{ marginRight: "15px" }}
          >
            저장
          </Button>
        )}
        <Button
          type="primary"
          onClick={onClickApproval}
          style={{ marginRight: "15px", display: "none" }}
        >
          승인
        </Button>
        <Button
          type="primary"
          danger
          onClick={onClickReject}
          style={{ display: "none" }}
        >
          반려
        </Button>
      </div>
    </div>
  );
};

export default ApprovalEdit;

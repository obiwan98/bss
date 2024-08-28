import { render } from "@testing-library/react";
import { Button, Table } from "antd";
import { useState } from "react";

const historyRawData = [
  {
    id: 0,
    user: "이해진",
    startDate: "2024-08-01",
    endDate: "2024-08-26",
    state: false,
  },
  {
    id: 1,
    user: "정경진",
    startDate: "2024-08-27",
    endDate: "20240-09-01",
    state: true,
  },
];

const BookHistory = () => {
  const [historyData, setHistoryData] = useState(historyRawData);

  const columns = [
    {
      title: "사용자",
      dataIndex: "user",
      key: "user",
      align: "center",
    },
    {
      title: "열람 기간",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, recode) => `${recode.startDate} ~ ${recode.endDate}`,
      align: "center",
    },
    {
      title: "상태",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        <span style={{ color: state ? "blue" : "red" }}>
          {state ? "열람 중" : "기간 만료"}
        </span>
      ),
      align: "center",
    },
    {
      title: "비고",
      key: "action",
      render: (_, recode) =>
        recode.state ? null : (
          <Button type="primary" onClick={() => {}}>
            리뷰 쓰기
          </Button>
        ),
      align: "center",
    },
  ];

  return (
    <div>
      <Table
        dataSource={historyData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BookHistory;

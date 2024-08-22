import { useState, useRef } from "react";
import { Button, Input, Space, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";

const data = [
  {
    key: "1",
    name: "이장열",
    deptname: "CGV팀",
    bookname: "리액트 마스터1",
    date: "2024-08-20",
  },
  {
    key: "2",
    name: "박광연",
    deptname: "CGV팀",
    bookname: "리액트 마스터2",
    date: "2024-08-20",
  },
  {
    key: "3",
    name: "신혜경",
    deptname: "CGV팀",
    bookname: "리액트 마스터3",
    date: "2024-08-20",
  },
  {
    key: "4",
    name: "최슬범",
    deptname: "CGV팀",
    bookname: "리액트 마스터4",
    date: "2024-08-20",
  },
  {
    key: "5",
    name: "이장열",
    deptname: "CGV팀",
    bookname: "리액트 마스터5",
    date: "2024-08-20",
  },
  {
    key: "6",
    name: "박광연",
    deptname: "CGV팀",
    bookname: "리액트 마스터6",
    date: "2024-08-20",
  },
  {
    key: "7",
    name: "신혜경",
    deptname: "CGV팀",
    bookname: "리액트 마스터",
    date: "2024-08-20",
  },
  {
    key: "8",
    name: "최슬범",
    deptname: "CGV팀",
    bookname: "리액트 마스터7",
    date: "2024-08-20",
  },
  {
    key: "9",
    name: "이장열",
    deptname: "CGV팀",
    bookname: "리액트 마스터8",
    date: "2024-08-20",
  },
  {
    key: "10",
    name: "이장열",
    deptname: "CGV팀",
    bookname: "리액트 마스터9",
    date: "2024-08-20",
  },
];

const ApprovalItem = () => {
  const nav = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "요청자",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "부서명",
      dataIndex: "deptname",
      key: "deptname",
      width: "20%",
      ...getColumnSearchProps("deptname"),
    },
    {
      title: "도서명",
      dataIndex: "bookname",
      key: "bookname",
      width: "30%",
      ...getColumnSearchProps("bookname"),
    },
    {
      title: "요청일자",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date"),
    },
    {
      title: "button",
      dataIndex: "button",
      render: (_, record) => {
        return (
          <Typography.Link
            onClick={() => nav("/approval/edit")}
            disabled={false}
          >
            상세보기
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <div className="testSub1-container">
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    </div>
  );
};

export default ApprovalItem;

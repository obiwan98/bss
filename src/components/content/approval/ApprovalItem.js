import { useState, useRef, useEffect } from "react";
import { Button, Input, Space, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [approval, setApproval] = useState([]);
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

  // 최초 렌더링 시, 승인 리스트 전체 조회
  useEffect(() => {
    const fetchApprovalList = async () => {
      try {
        const approvalResponse = await axios.get(
          process.env.REACT_APP_API_URL + "/api/approvals"
        );
        setApproval(approvalResponse.data);
        console.log(approvalResponse.data);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    fetchApprovalList();
  }, []);

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

  // 날짜변환
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // 상세보기
  const onClickDetails = (id) => {
    nav(`/approvals/pending/${id}`);
  };

  const columns = [
    {
      title: "Approval Unique ID",
      dataIndex: "_id",
      key: "_id",
      width: "10%",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "User ID",
      dataIndex: "user",
      key: "user",
      width: "10%",
      ...getColumnSearchProps("user"),
    },
    {
      title: "신청자명",
      dataIndex: "username",
      key: "user",
      width: "10%",
      ...getColumnSearchProps("user"),
    },
    {
      title: "도서명",
      dataIndex: ["book", "name"],
      key: "bookname",
      width: "40%",
      ...getColumnSearchProps("bookname"),
    },
    {
      title: "요청일자",
      dataIndex: "regdate",
      key: "date",
      render: (text) => formatDate(text),
      // ...getColumnSearchProps("date"),
    },
    {
      title: "button",
      dataIndex: "button",
      render: (_, record) => {
        return (
          <Typography.Link
            onClick={() => onClickDetails(record._id)} // Pass the _id here
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
      <Table
        columns={columns}
        dataSource={approval}
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default ApprovalItem;

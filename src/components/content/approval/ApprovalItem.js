import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, Tag } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';

const ApprovalItem = ({ data }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const dataList = data.map((item, index) => {
    let data = {
      _id: item._id,
      key: index + 1,
      username: item.user.name,
      email: item.user.email,
      deptname: item.group.team,
      bookname: item.book.name,
      date:
        item.regdate.length >= 19
          ? item.regdate.substring(0, 10) + ' ' + item.regdate.substring(11, 19)
          : '',
      state: item.state === '2' ? (typeof item.payment === 'undefined' ? '2' : '4') : item.state,
    };

    return data;
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
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
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: '_id',
      dataIndex: '_id',
      key: '_id',
      hidden: true,
    },
    {
      title: '순번',
      dataIndex: 'key',
      key: 'key',
      rowScope: 'row',
    },
    {
      title: '요청자',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username'),
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '부서명',
      dataIndex: 'deptname',
      key: 'deptname',
    },
    {
      title: '도서명',
      dataIndex: 'bookname',
      key: 'bookname',
      ...getColumnSearchProps('bookname'),
    },
    {
      title: '요청일자',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '요청상태',
      dataIndex: 'state',
      render: (state) => {
        let color;
        let text;

        if (state === '1') {
          color = 'geekblue';
          text = '승인요청';
        } else if (state === '2') {
          color = 'green';
          text = '승인완료';
        } else if (state === '3') {
          color = 'volcano';
          text = '반려';
        } else if (state === '4') {
          color = 'volcano';
          text = '구매완료';
        }

        return (
          <Tag color={color} key={state}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '',
      dataIndex: 'button',
      render: (_, record) => {
        let stateData = data.find((e) => e._id === record._id);

        return (
          <Typography.Link
            onClick={() => navigate(`/approval/edit/${record._id}`, { state: stateData })}
            disabled={false}
          >
            상세보기
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <div className="approval-item-container">
      <Table columns={columns} dataSource={dataList} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ApprovalItem;

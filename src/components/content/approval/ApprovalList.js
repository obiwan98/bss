import { useState, useEffect } from 'react';
import { Radio, Space, Button, Flex } from 'antd';
import ApprovalItem from './ApprovalItem';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const ApprovalList = () => {
  const [dataList, setDataList] = useState([]); // 필터링된 사용자 데이터를 저장
  const { user } = useUser();
  const [state, setState] = useState('1');
  const navigate = useNavigate();

  const handleSizeChange = (e) => {
    setState(e.target.value);
  };

  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const approvalListResponse = await axios.get(
        process.env.REACT_APP_API_URL + `/api/approvals/list/${state}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataList(approvalListResponse.data);
    } catch (error) {
      console.error('Error fetching dataList:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, []);

  useEffect(() => {
    getData();
  }, [state]);

  return (
    <>
      <div className="approval-list-container">
        <Space
          style={{
            marginBottom: 16,
          }}
        >
          <Radio.Group value={state} onChange={handleSizeChange}>
            <Radio.Button value="1">승인요청</Radio.Button>
            <Radio.Button value="2">승인완료</Radio.Button>
            <Radio.Button value="3">반려</Radio.Button>
          </Radio.Group>
        </Space>
        <Button
          type="primary"
          style={{ float: 'right' }}
          onClick={() => navigate('/approval/edit/new')}
        >
          요청하기
        </Button>
        <ApprovalItem data={dataList}></ApprovalItem>
      </div>
    </>
  );
};

export default ApprovalList;

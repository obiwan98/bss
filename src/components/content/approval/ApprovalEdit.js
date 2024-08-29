import React, { useEffect } from 'react';
import { Badge, Button, Descriptions, Divider, Input, Form, message, Modal } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useLocation, useParams } from 'react-router-dom';

import '../../../App.css';

// 현재 일자 출력
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

const ApprovalEdit = () => {
  // return "승인상세화면 공통(요청상태에 따라 UI 구성) 승인요청중 : 결제승인 & 결제반려 버튼 노출, 승인완료 : 구매완료처리 버튼, 결제의견 노출, 반려 : 결제의견 노출, 승인및구매완료 : ";
  const { user, setUser } = useUser(); // 유저 기본정보 세팅
  const { param } = useParams();
  const { state } = useLocation();
  const { confirm } = Modal;
  const navigate = useNavigate();

  const [approvalTitle, setApprovalTitle] = useState('승인 요청');
  const [approvalId, setApprovalId] = useState('');
  const [descriptionDisplay, setDescriptionDisplay] = useState('none');
  const [buttonDisplay, setButtonDisplay] = useState('none');

  const [userName, setUserName] = useState('N/A');
  const [userDept, setUserDept] = useState('N/A');
  const [userEmail, setUserEmail] = useState('N/A');
  const [regDate, setRegDate] = useState(formatDate(new Date()));
  const [commentValue, setCommentValue] = useState('');
  const [badgeStatus, setBadgeStatus] = useState('processing');
  const [badgeText, setBadgeText] = useState('승인요청');
  const [badgeValue, setBadgeValue] = useState(1);

  // 렌더링 시 초기 세팅
  useEffect(() => {
    // 로그인 체크
    if (!user) {
      navigate('/login');
      return;
    }

    // 신청 정보 Description Initialize
    const updateReqItems = () => {
      const isNew = param === 'new';
      const record = isNew ? {} : state?.record || {};

      const defaultBadgeStatus = 'processing';
      const defaultBadgeText = '승인요청';
      const defaultBadgeValue = 1;

      const badgeStates = {
        1: 'processing',
        2: 'success',
        3: 'error',
        4: 'success',
      };

      const badgeTexts = {
        1: '승인요청',
        2: '승인완료',
        3: '반려',
        4: '승인완료',
      };

      setApprovalId(record._id);
      setUserName(isNew ? user?.name || 'N/A' : record.username || 'N/A');
      setUserDept(
        isNew
          ? user?.group
            ? `${user.group.part}/${user.group.team}`
            : 'N/A'
          : record.deptname || 'N/A'
      );
      setUserEmail(isNew ? user?.email || 'N/A' : record.email || 'N/A');
      setRegDate(isNew ? formatDate(new Date()) : formatDate(record.date || new Date()));

      if (isNew) {
        setCommentValue('');
        setBadgeStatus(defaultBadgeStatus);
        setBadgeText(defaultBadgeText);
        setBadgeValue(defaultBadgeValue);
      } else {
        setApprovalTitle('승인 상세');
        const badgeState = parseInt(record.state) || defaultBadgeValue;
        setBadgeStatus(badgeStates[badgeState] || 'default');
        setBadgeText(badgeTexts[badgeState] || '');
        setBadgeValue(badgeState);
      }
    };

    updateReqItems();

    // 권한에 따른 Description 활성화
    const checkDescriptionDisplay = () => {
      return param !== 'new' &&
        (user.role.role === 'Admin' ||
          user.role.role === 'TeamLeader' ||
          user.role.role === 'BookManager')
        ? 'block'
        : 'none';
    };

    // 권한에 따른 Button 활성화
    const checkButtonDisplay = () => {
      return param !== 'new' &&
        (user.role.role === 'Admin' || user.role.role === 'TeamLeader') &&
        badgeValue === 1
        ? 'block'
        : 'none';
    };

    setDescriptionDisplay(checkDescriptionDisplay);
    setButtonDisplay(checkButtonDisplay);
  }, []);

  // 승인 요청사항 할당
  const handleCommentChange = (e) => {
    setCommentValue(e.target.value);
  };

  // Description Item
  const reqItems = [
    {
      key: 'name',
      label: '신청자명',
      children: userName,
    },
    {
      key: 'group',
      label: '신청부서',
      children: userDept,
    },
    {
      key: 'regdate',
      label: '신청일자',
      children: regDate,
    },
    {
      key: 'bookinfo',
      label: '도서정보',
      // 도서 정보는 현재 샘플 데이터로 넣고, 모달 창 작업 완료됐을 때 모달에서 받은 값을 JSON으로 치환할 것
      children: JSON.stringify({ bookName: 'TESTBOOK' }),
      span: 3,
    },
    {
      key: 'comment',
      label: '요청사항',
      children: (
        <Input
          placeholder="Enter your comment"
          value={commentValue}
          onChange={handleCommentChange}
          disabled={false}
        />
      ),
      span: 2,
    },
    {
      key: 'state',
      label: '결재상태',
      children: <Badge status={badgeStatus} text={badgeText} value={badgeValue} />,
    },
  ];

  const confirmItems = [
    {
      key: '1',
      label: '결재자명',
      children: 'N/A',
    },
    {
      key: '2',
      label: '결재일시',
      children: 'N/A',
    },

    {
      key: '3',
      label: '결재의견',
      children: 'N/A',
    },
  ];

  const paymentItems = [
    {
      key: '1',
      label: '구매자명',
      children: 'N/A',
    },
    {
      key: '2',
      label: '구매금액',
      children: 'N/A',
    },
    {
      key: '3',
      label: '구매일자',
      children: 'N/A',
    },
    {
      key: '4',
      label: '구매정보',
      children: 'N/A',
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
        email: user?.email || 'test1541@cj.net',
      },
    };

    axios
      .post(process.env.REACT_APP_API_URL + '/api/approvals/save', {
        data: totItem,
      })
      .then((response) => {
        console.log('Data saved successfully:', response.data);
        alert(response.data.message);
        navigate('/approval/list');
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  // 삭제
  const onClickDelete = () => {
    confirm({
      title: '해당 요청을 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        const token = localStorage.getItem('token');
        if (!token) return;
        axios
          .delete(`${process.env.REACT_APP_API_URL}/api/approvals/${approvalId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            message.success('해당 요청이 삭제되었습니다.', 2);
            navigate('/approval/list');
          })
          .catch((error) => {
            console.error('Error deleting approval:', error);
          });
      },
      onCancel() {
        console.log('삭제 취소됨');
      },
    });
  };

  // 승인
  const onClickApproval = () => {
    return alert('Approval');
  };

  // 반려
  const onClickReject = () => {
    return alert('Reject');
  };

  return (
    <div>
      <h1>{approvalTitle}</h1>
      <Divider
        style={{
          borderColor: '#7cb305',
        }}
      ></Divider>
      <div className="req-container">
        <Descriptions title="신청 정보" bordered className="custom-descriptions">
          {reqItems.map((item) => (
            <Descriptions.Item key={item.key} label={item.label} span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        ></Divider>
      </div>
      <div className="confirm-container" style={{ display: descriptionDisplay }}>
        <Descriptions title="결재 정보" bordered className="custom-descriptions">
          {confirmItems.map((item) => (
            <Descriptions.Item key={item.key} label={item.label} span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        ></Divider>
      </div>
      <div
        className="payment-container"
        style={{
          display: descriptionDisplay,
        }}
      >
        <Descriptions title="구매 정보" bordered className="custom-descriptions">
          {paymentItems.map((item) => (
            <Descriptions.Item key={item.key} label={item.label} span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        ></Divider>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          onClick={onClickApproval}
          style={{
            marginRight: '15px',
            display: buttonDisplay,
          }}
        >
          승인
        </Button>
        <Button
          type="primary"
          danger
          onClick={onClickReject}
          style={{
            marginRight: '15px',
            display: buttonDisplay,
          }}
        >
          반려
        </Button>
        <Button
          type="primary"
          onClick={onClickSave}
          style={{
            marginRight: '15px',
            display: param === 'new' ? 'block' : 'none',
          }}
        >
          저장
        </Button>
        <Button
          type="primary"
          danger
          onClick={onClickDelete}
          style={{
            marginRight: '15px',
            display:
              // email 체크 부분은 추후 user의 id로 체크로 바꿔야함
              param !== 'new' && user.email === userEmail && badgeValue === 1 ? 'block' : 'none',
          }}
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default ApprovalEdit;

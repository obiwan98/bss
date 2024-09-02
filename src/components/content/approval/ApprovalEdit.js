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

function generateRandomString(length = 24) {
  // Define the characters to use: lowercase letters and digits
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Initialize an empty string to accumulate the result
  let result = '';

  // Generate the random string
  for (let i = 0; i < length; i++) {
    // Get a random index from the characters string
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Append the character at the random index to the result string
    result += characters[randomIndex];
  }

  return result;
}

const ApprovalEdit = () => {
  // return "승인상세화면 공통(요청상태에 따라 UI 구성) 승인요청중 : 결제승인 & 결제반려 버튼 노출, 승인완료 : 구매완료처리 버튼, 결제의견 노출, 반려 : 결제의견 노출, 승인및구매완료 : ";
  const { user, setUser } = useUser(); // 유저 기본정보 세팅
  const { param } = useParams();
  const { state } = useLocation();
  const { confirm } = Modal;
  const navigate = useNavigate();

  const [descriptionDisplay, setDescriptionDisplay] = useState('none');
  const [buttonDisplay, setButtonDisplay] = useState('none');

  const [approvalTitle, setApprovalTitle] = useState('승인 요청');
  const [approvalId, setApprovalId] = useState('');

  // 신청 정보
  const [userName, setUserName] = useState('N/A');
  const [userDept, setUserDept] = useState('N/A');
  const [userEmail, setUserEmail] = useState('N/A');
  const [regDate, setRegDate] = useState(formatDate(new Date()));
  const [commentValue, setCommentValue] = useState('');
  const [badgeStatus, setBadgeStatus] = useState('processing');
  const [badgeText, setBadgeText] = useState('승인요청');
  const [badgeValue, setBadgeValue] = useState(1);

  // 결재 정보
  const [confirmUserName, setConfirmUserName] = useState('N/A');
  const [confirmDate, setConfirmDate] = useState(formatDate(new Date()));
  const [confirmComment, setConfirmComent] = useState('N/A');

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
      const record = isNew ? {} : state || {};

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

      console.log(state);

      const rndUniqueId = generateRandomString();
      const badgeState = parseInt(record.state) || defaultBadgeValue;

      // Step 1. 신규 / 기존 데이터 구분하여 셋팅
      setApprovalTitle(isNew ? '승인 요청' : '승인 상세');
      setApprovalId(isNew ? rndUniqueId : state?._id);
      setUserName(isNew ? user?.name || 'N/A' : state?.user.name || 'N/A');
      setUserDept(
        isNew
          ? user?.group
            ? `${user?.group.part || 'N/A'}/${user?.group.team || 'N/A'}`
            : 'N/A'
          : (state?.group.part || 'N/A') + '/' + (state?.group.team || 'N/A')
      );
      setUserEmail(isNew ? user?.email || 'N/A' : state?.user.email || 'N/A');
      setRegDate(isNew ? formatDate(new Date()) : formatDate(state?.regdate || new Date()));
      setCommentValue(isNew ? '' : state?.comment || 'N/A');

      setBadgeStatus(isNew ? defaultBadgeStatus : badgeStates[badgeState] || 'default');
      setBadgeText(isNew ? defaultBadgeText : badgeTexts[badgeState] || '');
      setBadgeValue(isNew ? defaultBadgeValue : badgeState);

      if (!isNew) {
        // 기존 데이터 + ( 관리자 / 팀장 ) + 승인 요청
        if ((user.role.role === 'Admin' || user.role.role === 'TeamLeader') && badgeState === 1) {
          setConfirmUserName(user?.name || 'N/A');
          setConfirmDate(formatDate(new Date()));
          setConfirmComent('');
        }

        // 승인 완료 이후는 조건 없이 데이터 바인딩
        if (badgeState !== 1) {
          setConfirmUserName(state?.confirm?.user?.name || 'N/A');
          setConfirmDate(formatDate(state?.confirm?.date || new Date()));
          setConfirmComent(state?.confirm?.comment || 'N/A');
        }
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

  const handleCommentChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleConfirmCommentChange = (e) => {
    setConfirmComent(e.target.value);
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
      key: 'confirmUserName',
      label: '결재자명',
      children: confirmUserName,
    },
    {
      key: 'confirmDate',
      label: '결재일자',
      children: confirmDate,
    },

    {
      key: 'confirmComment',
      label: '결재의견',
      children: (
        <Input
          placeholder="Enter your comment"
          value={confirmComment}
          onChange={handleConfirmCommentChange}
          disabled={false}
        />
      ),
    },
  ];

  const paymentItems = [
    {
      key: 'paymentUserName',
      label: '구매자명',
      children: 'N/A',
    },
    {
      key: 'paymentDate',
      label: '구매일자',
      children: 'N/A',
    },
    {
      key: 'paymentPrice',
      label: '구매금액',
      children: 'N/A',
    },
    {
      key: 'paymentInfo',
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
          .delete(`${process.env.REACT_APP_API_URL}/api/approvals/${approvalId}`)
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

  // 승인 / 반려 / 구매 등록
  const onClickApproval = (approvalType) => {
    try {
      const approval = confirmItems.map((item) => ({
        key: item.key,
        label: item.label,
        value: item.children.props?.value || item.children,
      }));

      const totItem = {
        confirmItems: approval,
        etc: {
          email: user?.email || 'test1541@cj.net',
          param: approvalType,
        },
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/api/approvals/${approvalId}`, {
          data: totItem,
        })
        .then((response) => {
          alert(response.data.message);
          navigate('/approval/list');
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    } catch (error) {
      console.error('Error updating approval:', error);
      message.error('승인 정보를 업데이트하는 중 오류가 발생했습니다.', 2);
    }
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
          display: param !== 'new' && badgeValue !== 1 ? 'block' : 'none',
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
          onClick={() => onClickApproval('approve')}
          style={{
            marginRight: '15px',
            display:
              // 기존 데이터 + ( 관리자 / 팀장 ) + 승인 요청
              param !== 'new' &&
              (user.role.role === 'Admin' || user.role.role === 'TeamLeader') &&
              badgeValue === 1
                ? 'block'
                : 'none',
          }}
        >
          승인
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => onClickApproval('reject')}
          style={{
            marginRight: '15px',
            display:
              // 기존 데이터 + ( 관리자 / 팀장 ) + 승인 요청
              param !== 'new' &&
              (user.role.role === 'Admin' || user.role.role === 'TeamLeader') &&
              badgeValue === 1
                ? 'block'
                : 'none',
          }}
        >
          반려
        </Button>
        <Button
          type="primary"
          onClick={onClickSave}
          style={{
            marginRight: '15px',
            // 신규 데이터
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
              // 기존 데이터 + 본인 + 승인 요청
              param !== 'new' && user.email === userEmail && badgeValue === 1 ? 'block' : 'none',
          }}
        >
          삭제
        </Button>
        <Button
          type="primary"
          onClick={() => onClickApproval('buy')}
          style={{
            marginRight: '15px',
            display:
              // 기존 데이터 + ( 관리자 / 팀장 / 도서관리자 ) + 승인 완료
              param !== 'new' &&
              (user.role.role === 'Admin' ||
                user.role.role === 'TeamLeader' ||
                user.role.role === 'BookManager') &&
              badgeValue === 2
                ? 'block'
                : 'none',
          }}
        >
          구매 등록
        </Button>
      </div>
    </div>
  );
};

export default ApprovalEdit;

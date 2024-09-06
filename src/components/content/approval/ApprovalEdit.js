import React, { useEffect } from 'react';
import { Badge, Button, Descriptions, Divider, Input, Form, message, Modal } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useLocation, useParams } from 'react-router-dom';
import BookSearchModal from './modal/BookSearchModal';

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

// 초기값 난수  생성
function generateRandomString(length = 24) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
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

  const [approvalTitle, setApprovalTitle] = useState('승인 요청');
  const [approvalId, setApprovalId] = useState('');

  // 신청 정보
  const [userName, setUserName] = useState('N/A');
  const [userDept, setUserDept] = useState('N/A');
  const [userEmail, setUserEmail] = useState('N/A');
  const [regDate, setRegDate] = useState(formatDate(new Date()));
  const [bookTitle, setBookTitle] = useState('N/A');
  const [bookPrice, setBookPrice] = useState(0);
  const [commentValue, setCommentValue] = useState('');
  const [badgeStatus, setBadgeStatus] = useState('processing');
  const [badgeText, setBadgeText] = useState('승인요청');
  const [badgeValue, setBadgeValue] = useState(1);

  // 결재 정보
  const [confirmUserName, setConfirmUserName] = useState('N/A');
  const [confirmDate, setConfirmDate] = useState(formatDate(new Date()));
  const [confirmComment, setConfirmComment] = useState('N/A');

  // 구매 정보
  const [paymentUserName, setPaymentUserName] = useState('N/A');
  const [paymentDate, setPaymentDate] = useState(formatDate(new Date()));
  const [paymentPrice, setPaymentPrice] = useState(0);
  const [paymentReceiptInfo, setPaymentReceiptInfo] = useState('N/A');
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState('N/A');

  // 도서정보 API
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
        4: '구매완료',
      };

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

      // Step 2. 상태값 및 권한에 따른 제어
      if (!isNew) {
        // 기존 데이터 + ( 관리자 / 팀장 ) + 승인 요청
        if ((user.role.role === 'Admin' || user.role.role === 'TeamLeader') && badgeState === 1) {
          setConfirmUserName(user?.name || 'N/A');
          setConfirmDate(formatDate(new Date()));
          setConfirmComment('');
        }

        setBookTitle(state?.book?.name || 'N/A');
        setBookPrice(state?.book?.price || 0);

        // 승인 요청 이후
        if (badgeState !== 1) {
          setConfirmUserName(state?.confirm?.user?.name || 'N/A');
          setConfirmDate(formatDate(state?.confirm?.date || new Date()));
          setConfirmComment(state?.confirm?.comment || 'N/A');

          // 구매 정보는 승인완료 일때는 로그인 유저 정보 셋팅, 그 외에는 컬렉션 데이터로 바인딩
          if (
            user.role.role === 'Admin' ||
            user.role.role === 'TeamLeader' ||
            user.role.role === 'BookManager'
          ) {
            if (badgeState === 2) {
              setPaymentUserName(user?.name || 'N/A');
              setPaymentDate(formatDate(new Date()));
              setPaymentPrice(0);
              setPaymentReceiptInfo('N/A');
            } else {
              setPaymentUserName(state?.payment?.user?.name || 'N/A');
              setPaymentDate(formatDate(state?.payment?.date || new Date()));
              setPaymentPrice(state?.payment?.price || 0);
              setPaymentReceiptInfo(state?.payment?.receiptInfo || 'N/A');
            }
          }
        }
      }
    };

    updateReqItems();
  }, []);

  // 권한에 따른 Description 활성화
  const descriptionDisplay = (category) => {
    // 결재 정보
    if (category === 'confirm') {
      // 신규 데이터
      if (param === 'new') {
        return 'none';
      }

      // 기존 데이터 + 승인 요청
      if (param !== 'new' && badgeValue === 1) {
        // 관리자 / 팀장
        if (user.role.role === 'Admin' || user.role.role === 'TeamLeader') {
          return 'block';
        }
        return 'none';
      } else {
        return 'block';
      }
    }

    // 구매 정보
    if (category === 'payment') {
      // 기존 데이터 + 승인 완료 이후
      if (param !== 'new' && badgeValue !== 1) {
        // 사원
        if (user.role.role === 'Employee') {
          if (badgeValue === 4) return 'block';
        }

        // 관리자 / 팀장 / 도서 관리자
        if (
          user.role.role === 'Admin' ||
          user.role.role === 'TeamLeader' ||
          user.role.role === 'BookManager'
        )
          return 'block';
      }
      return 'none';
    }
  };

  // 권한에 따른 Button 활성화
  const buttonDisplay = (approvalType) => {
    // 저장
    // 신규 데이터
    if (approvalType === 'save') {
      if (param === 'new') {
        return 'block';
      }
      return 'none';
    }

    // 삭제
    // 기존 데이터 + 본인 + 승인 요청
    else if (approvalType === 'delete') {
      if (param !== 'new' && user.email === userEmail && badgeValue === 1) {
        return 'block';
      }
      return 'none';
    }

    // 승인 / 반려
    // 기존 데이터 + 관리자 / 팀장  + 승인 요청
    if (approvalType === 'approve' || approvalType === 'reject') {
      if (
        param !== 'new' &&
        (user.role.role === 'Admin' || user.role.role === 'TeamLeader') &&
        badgeValue === 1
      ) {
        return 'block';
      }
      return 'none';
    }

    // 구매 등록
    // 기존 데이터 + 관리자 / 팀장 / 도서관리자 + 승인 완료
    if (approvalType === 'payment') {
      if (
        param !== 'new' &&
        (user.role.role === 'Admin' ||
          user.role.role === 'TeamLeader' ||
          user.role.role === 'BookManager') &&
        badgeValue === 2
      ) {
        return 'block';
      }
      return 'none';
    }
  };

  // 도서정보 핸들링
  const handleDataChange = (data) => {
    setShowInput(true);
    setInputValue(data);
  };

  // 요청사항 핸들링
  const handleCommentChange = (e) => {
    setCommentValue(e.target.value);
  };

  // 결재의견 핸들링
  const handleConfirmCommentChange = (e) => {
    setConfirmComment(e.target.value);
  };

  // 구매가격 핸들링
  const handlePaymentPriceChange = (e) => {
    setPaymentPrice(e.target.value);
  };

  const renderContent = () => {
    // 도서조회 모달 창에서 작업이 끝난 데이터를 반환
    if (showInput) {
      return (
        <div>
          {inputValue.title || 'N/A'}
          <br />
          <br />
          판매가 : {inputValue.priceSales || 'N/A'}원
          <br />
          <br />
          저자 : {inputValue.author || 'N/A'}
          <br />
          <br />
          <a href={inputValue.link} target="_blank" rel="">
            도서 미리보기
          </a>
          <br />
          <br />
          <BookSearchModal getData={handleDataChange} />
        </div>
      );
    }

    // 신규 작성일 때 도서조회 API 활성화
    if (param === 'new') {
      return <BookSearchModal getData={handleDataChange} />;
    }

    // 기존 데이터 + 승인 요청 상태일 때 도서조회 API 활성화
    if (badgeValue === 1) {
      return (
        <div>
          {bookTitle || 'N/A'}
          <br />
          <br />
          판매가 : {bookPrice || 0}원
          <br />
          <br />
          <BookSearchModal getData={handleDataChange} />
        </div>
      );
    }

    // 도서정보에 기본적으로 보여줄 데이터
    return (
      <div>
        {bookTitle || 'N/A'}
        <br />
        <br />
        판매가 : {bookPrice || 'N/A'}원
      </div>
    );
  };

  // 신청 정보 Description Item
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
      // children: JSON.stringify({ bookName: 'TESTBOOK' }),
      inputValue: JSON.stringify({ inputValue }),
      children: renderContent(),
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

  // 결재 정보 Description Item
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

  // 구매 정보 Description Item
  const paymentItems = [
    {
      key: 'paymentUserName',
      label: '구매자명',
      children: paymentUserName,
    },
    {
      key: 'paymentDate',
      label: '구매일자',
      children: paymentDate,
    },
    {
      key: 'paymentPrice',
      label: '구매금액',
      children: (
        <Input
          placeholder="Enter the price"
          value={paymentPrice}
          onChange={handlePaymentPriceChange}
          disabled={false}
        />
      ),
    },
    {
      key: 'paymentReceiptInfo',
      label: '구매정보',
      children: paymentReceiptInfo,
    },
  ];

  // 요청서 작성(신규)
  const onClickSave = () => {
    try {
      const approval = reqItems.map((item) => ({
        key: item.key,
        label: item.label,
        value: item.inputValue || item.children.props?.value || item.children,
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
    } catch (error) {
      console.error('Error updating approval:', error);
      message.error('승인 정보를 업데이트하는 중 오류가 발생했습니다.', 2);
    }
  };

  // 삭제
  const onClickDelete = () => {
    try {
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
    } catch (error) {
      console.error('Error updating approval:', error);
      message.error('삭제 중 오류가 발생했습니다.', 2);
    }
  };

  // 승인 / 반려 / 구매 등록
  const onClickApproval = (approvalType) => {
    try {
      const itemsToMap = approvalType !== 'payment' ? confirmItems : paymentItems;

      const approval = itemsToMap.map((item) => ({
        key: item.key,
        label: item.label,
        value: item.children.props?.value || item.children,
      }));

      const totItem = {
        data: approval,
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
      <div
        className="confirm-container"
        style={{
          display: descriptionDisplay('confirm'),
        }}
      >
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
      <div className="payment-container" style={{ display: descriptionDisplay('payment') }}>
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
            display: buttonDisplay('approve'),
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
            display: buttonDisplay('reject'),
          }}
        >
          반려
        </Button>
        <Button
          type="primary"
          onClick={onClickSave}
          style={{
            marginRight: '15px',
            display: buttonDisplay('save'),
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
            display: buttonDisplay('delete'),
          }}
        >
          삭제
        </Button>
        <Button
          type="primary"
          onClick={() => onClickApproval('payment')}
          style={{
            marginRight: '15px',
            display: buttonDisplay('payment'),
          }}
        >
          구매 등록
        </Button>
      </div>
    </div>
  );
};

export default ApprovalEdit;
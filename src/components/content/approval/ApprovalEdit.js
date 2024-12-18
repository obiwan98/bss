import { UploadOutlined } from '@ant-design/icons';
import { Badge, Button, Descriptions, Divider, Input, message, Modal, Upload } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { sendEmail } from '../../../utils/api';
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

// 초기값 난수 생성
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
  const { user } = useUser(); // 유저 기본정보 세팅
  const { param } = useParams();
  const { state } = useLocation();
  const { confirm } = Modal;
  const navigate = useNavigate();

  const [stateData, setStateData] = useState({
    approvalTitle: '승인 요청',
    approvalId: '',

    // 신청 정보
    userName: 'N/A',
    userDept: 'N/A',
    userEmail: 'N/A',
    regDate: formatDate(new Date()),

    // 신청 정보 - 도서 정보
    bookTitle: 'N/A',
    bookPrice: 0,
    bookAuthor: 'N/A',
    bookISBN: 'N/A',
    commentValue: '',
    badgeStatus: 'processing',
    badgeText: '승인요청',
    badgeValue: 1,

    // 결재 정보
    confirmUserName: 'N/A',
    confirmDate: formatDate(new Date()),
    confirmComment: '',

    // 구매 정보
    paymentUserName: 'N/A',
    paymentDate: formatDate(new Date()),
    paymentPrice: 0,
    paymentReceiptInfo: 'N/A',
    paymentReceiptImgUrl: 'N/A',

    // 도서조회 API
    showInput: false,
    inputValue: '',
  });

  /** 모달 */
  const [isModalOpen, setIsModalOpen] = useState({ open: '', type: '' });
  /** 모달 열기 */
  const showModal1 = () => setIsModalOpen({ open: true, type: '1' });
  /** 모달 닫기 */
  const hideModal = () => setIsModalOpen({ ...isModalOpen, open: false });

  const [imageInfo, setImageInfo] = useState(null);
  const [leader, setLeader] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

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

    setStateData((prevState) => ({
      ...prevState,
      approvalTitle: isNew
        ? '승인 요청'
        : badgeState === 1
          ? '승인 요청 상세'
          : badgeState === 2
            ? '승인 완료 상세'
            : badgeState === 3
              ? '반려 상세'
              : badgeState === 4
                ? '구매 완료 상세'
                : '',
      approvalId: isNew ? rndUniqueId : state?._id,

      // 신청 정보
      userName: isNew ? user?.name || 'N/A' : state?.user.name || 'N/A',
      userDept: isNew
        ? user?.group
          ? `${user?.group.part || 'N/A'}/${user?.group.team || 'N/A'}`
          : 'N/A'
        : (state?.group.part || 'N/A') + '/' + (state?.group.team || 'N/A'),
      userEmail: isNew ? user?.email || 'N/A' : state?.user.email || 'N/A',
      regDate: isNew ? formatDate(new Date()) : formatDate(state?.regdate || new Date()),

      // 신청 정보 - 도서 정보
      bookTitle: isNew ? 'N/A' : state?.book?.name || 'N/A',
      bookPrice: isNew ? 0 : state?.book?.price || 0,
      bookAuthor: isNew ? 'N/A' : state?.book?.author || 'N/A',
      bookISBN: isNew ? 'N/A' : state?.book?.ISBN || 'N/A',
      commentValue: isNew ? '' : state?.comment || 'N/A',
      badgeStatus: isNew ? defaultBadgeStatus : badgeStates[badgeState] || 'default',
      badgeText: isNew ? defaultBadgeText : badgeTexts[badgeState] || '',
      badgeValue: isNew ? defaultBadgeValue : badgeState,

      // 결재 정보
      confirmUserName:
        badgeState === 1 && (user.role.role === 'Admin' || user.role.role === 'TeamLeader')
          ? user?.name || 'N/A'
          : state?.confirm?.user?.name || 'N/A',
      confirmDate:
        badgeState === 1 ? formatDate(new Date()) : formatDate(state?.confirm?.date || new Date()),
      confirmComment: badgeState === 1 ? '' : state?.confirm?.comment || 'N/A',

      // 구매 정보
      paymentUserName: badgeState === 2 ? user?.name || 'N/A' : state?.payment?.user?.name || 'N/A',
      paymentDate:
        badgeState === 2 ? formatDate(new Date()) : formatDate(state?.payment?.date || new Date()),
      paymentPrice: badgeState === 2 ? 0 : state?.payment?.price || 0,
      paymentReceiptInfo: badgeState === 4 ? state?.payment?.receiptImgUrl || 'N/A' : 'N/A',
    }));

    // 로그인한 유저의 리더 갖고오기
    const leaderInfo = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL +
            `/api/users/group/${user?.group?._id}/role/66a0bbfe8d7e45a08668b30f/info`
        );

        if (response.data.leaders.length > 0) {
          if (response.data.leaders.length === 1) {
            setLeader(response.data.leaders[0]);
          } else {
            setLeader(response.data.leaders);
          }
        } else {
          setLeader(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    leaderInfo();
  }, [param, state, user, navigate]);

  const {
    approvalTitle,
    approvalId,
    userName,
    userDept,
    userEmail,
    regDate,
    commentValue,
    badgeStatus,
    badgeText,
    badgeValue,
    bookTitle,
    bookPrice,
    bookAuthor,
    bookISBN,
    confirmUserName,
    confirmDate,
    confirmComment,
    paymentUserName,
    paymentDate,
    paymentPrice,
    paymentReceiptInfo,
    paymentReceiptImgUrl,
    showInput,
    inputValue,
  } = stateData;

  // 권한에 따른 Description 활성화
  const descriptionDisplay = (category) => {
    // 결재 정보
    if (category === 'confirm') {
      if (param === 'new') return 'none';
      if (param !== 'new' && badgeValue === 1) {
        return user.role.role === 'Admin' || user.role.role === 'TeamLeader' ? 'block' : 'none';
      }
      return 'block';
    }

    // 구매 정보
    if (category === 'payment') {
      if (param !== 'new' && badgeValue !== 1) {
        if (user.role.role === 'Employee' && badgeValue === 4) return 'block';
        if (
          (user.role.role === 'Admin' ||
            user.role.role === 'TeamLeader' ||
            user.role.role === 'BookManager') &&
          (badgeValue !== 3 || state?.payment?.user?.name !== undefined)
        ) {
          return 'block';
        }
      }
      return 'none';
    }
  };

  // 권한에 따른 Button 활성화
  const buttonDisplay = (approvalType) => {
    // 저장
    if (approvalType === 'save') {
      return param === 'new' ? 'block' : 'none';
    }

    // 삭제
    if (approvalType === 'delete') {
      return param !== 'new' && user.email === userEmail && badgeValue === 1 ? 'block' : 'none';
    }

    // 승인, 반려
    if (approvalType === 'approve' || approvalType === 'reject') {
      return param !== 'new' &&
        (user.role.role === 'Admin' || user.role.role === 'TeamLeader') &&
        badgeValue === 1
        ? 'block'
        : 'none';
    }

    // 구매 등록
    if (approvalType === 'payment') {
      return param !== 'new' &&
        (user.role.role === 'Admin' ||
          user.role.role === 'TeamLeader' ||
          user.role.role === 'BookManager') &&
        badgeValue === 2
        ? 'block'
        : 'none';
    }
  };

  // 이벤트 핸들링
  // 도서조회 API
  const handleDataChange = (data) =>
    setStateData((prevState) => ({
      ...prevState,
      showInput: true,
      inputValue: data,

      // 하기 두 값은 메일 송신 시 개별 사용하기 위함
      bookPrice: data.priceSales,
      bookTitle: data.title,
    }));
  // 신청 정보 - 요청사항
  const handleCommentChange = (e) =>
    setStateData((prevState) => ({ ...prevState, commentValue: e.target.value }));
  // 결재 정보 - 결재의견
  const handleConfirmCommentChange = (e) =>
    setStateData((prevState) => ({ ...prevState, confirmComment: e.target.value }));
  // 구매 정보 - 구매금액
  const handlePaymentPriceChange = (e) =>
    setStateData((prevState) => ({ ...prevState, paymentPrice: e.target.value }));
  // 구매 정보 업로드
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/approvals/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.filePath) {
        message.success(`이미지가 정상적으로 업로드 되었습니다. : ${response.data.filePath}`);
        setImageInfo({
          url: response.data.filePath,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      } else {
        throw new Error('파일 경로를 다시 확인하시기 바랍니다.');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleImageUpload = ({ file, onSuccess, onError }) => {
    uploadImage(file)
      .then(() => {
        onSuccess(file);
      })
      .catch((err) => {
        onError(err);
      });
  };

  const handleImageDownload = (alt) => {
    const fileUrl = `${process.env.REACT_APP_API_URL}/downloads/${alt}`;

    fetch(fileUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', alt || 'downloaded-image');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // 링크 삭제
        window.URL.revokeObjectURL(url); // 메모리 정리
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const renderBookContent = () => {
    // 도서조회 모달 창에서 작업이 끝난 데이터를 반환
    if (showInput) {
      return (
        <div>
          {inputValue.title || 'N/A'}
          <br />
          <br />
          판매가 : {inputValue.priceSales.toLocaleString('ko-KR') || 'N/A'}원
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
          <BookSearchModal
            isModalOpen={isModalOpen}
            handleCancel={hideModal}
            getData={handleDataChange}
          />
          <Button type="primary" onClick={showModal1}>
            도서검색
          </Button>
        </div>
      );
    }

    // 신규 작성일 때 도서조회 API 활성화
    if (param === 'new') {
      return (
        <>
          <BookSearchModal
            isModalOpen={isModalOpen}
            handleCancel={hideModal}
            getData={handleDataChange}
          />
          <Button type="primary" onClick={showModal1}>
            도서검색
          </Button>
        </>
      );
    }

    // 기존 데이터 + 승인 요청 상태일 때 도서조회 API 활성화
    if (badgeValue === 1) {
      return (
        <div>
          {bookTitle || 'N/A'}
          <br />
          <br />
          저자 : {bookAuthor || 'N/A'}
          <br />
          <br />
          판매가 : {bookPrice.toLocaleString('ko-KR') || 0}원
          <br />
          <br />
          ISBN : {bookISBN || 'N/A'}
        </div>
      );
    }

    // 도서정보에 기본적으로 보여줄 데이터
    return (
      <div>
        {bookTitle || 'N/A'}
        <br />
        <br />
        저자 : {bookAuthor || 'N/A'}
        <br />
        <br />
        판매가 : {bookPrice.toLocaleString('ko-KR') || 0}원
        <br />
        <br />
        ISBN : {bookISBN || 'N/A'}
      </div>
    );
  };

  const renderPaymentContent = () => {
    if (stateData.badgeValue === 2) {
      return (
        <div>
          <Upload
            customRequest={handleImageUpload}
            accept="image/*" // Accept only image files
            showUploadList={false} // Hide the default upload list
          >
            <Button type="primary" icon={<UploadOutlined />}>
              첨부파일 업로드
            </Button>
          </Upload>

          <div style={{ marginTop: '20px' }}>첨부파일 : {imageInfo?.url}</div>
        </div>
      );
    }

    if (badgeValue === 4) {
      return (
        <div>
          첨부파일 :
          <a
            onClick={(e) => {
              if (paymentReceiptInfo === 'N/A') {
                e.preventDefault();
              } else {
                handleImageDownload(paymentReceiptInfo);
              }
            }}
            style={{
              pointerEvents: paymentReceiptInfo === 'N/A' ? 'none' : 'auto',
              color: paymentReceiptInfo === 'N/A' ? 'gray' : 'blue', // 'N/A'일 때 색상 변경
              textDecoration: paymentReceiptInfo === 'N/A' ? 'none' : 'underline', // 'N/A'일 때 링크 스타일 제거
            }}
          >
            {paymentReceiptInfo}
          </a>
        </div>
      );
    }
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
      key: 'bookInfo',
      label: '도서정보',
      // 도서 정보는 현재 샘플 데이터로 넣고, 모달 창 작업 완료됐을 때 모달에서 받은 값을 JSON으로 치환할 것
      // children: JSON.stringify({ bookName: 'TESTBOOK' }),
      inputValue: JSON.stringify({ inputValue }),
      children: renderBookContent(),
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
      label: '구매정보(사진)',
      children: renderPaymentContent(),
    },
  ];

  // 유효성 체크
  const validateApprovalItems = (item) => {
    if (item.key === 'bookInfo') {
      if (inputValue === '') {
        return '도서정보 입력은 필수입니다.';
      }
    }

    if (item.key === 'confirmComment') {
      if (confirmComment === '') {
        return '결재의견 입력은 필수입니다.';
      }
    }

    if (item.key === 'paymentPrice') {
      if (parseInt(paymentPrice) === 0) {
        return '구매금액 입력은 필수입니다.';
      }

      if (parseInt(bookPrice) < parseInt(paymentPrice)) {
        return '구매금액은 판매가를 초과할 수 없습니다.';
      }
    }

    //if (item.key === 'paymentReceiptInfo') {
    //  if (imageInfo === null) {
    //    return '구매정보 입력은 필수입니다.';
    //  }
    //}

    return null;
  };

  // 요청서 작성(신규)
  const onClickSave = () => {
    try {
      const approval = reqItems.map((item) => {
        const validationMessage = validateApprovalItems(item);
        if (validationMessage) {
          message.warning(validationMessage, 5);
          return null;
        }

        return {
          key: item.key,
          label: item.label,
          value:
            item.inputValue ||
            (item.children.props?.value === '' ? 'No Comment' : item.children.props?.value) ||
            item.children,
        };
      });

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

          // Send-mail 예비 로직
          if (response.status === 201) {
            // 도서 정보
            const bookInfo = {
              title: bookTitle,
              price: bookPrice,
              requestDetails: commentValue,
            };
            sendEmail('approvalRequest', user, bookInfo, badgeValue, confirmComment);
          }
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    } catch (error) {
      console.error('Error saving approval:', error);
    }
  };

  // 삭제
  const onClickDelete = () => {
    try {
      confirm({
        title: '해당 요청을 회수하시겠습니까?',
        content: '이 작업은 되돌릴 수 없습니다.',
        okText: '회수',
        okType: 'danger',
        cancelText: '취소',
        onOk() {
          const token = localStorage.getItem('token');
          if (!token) return;

          axios
            .delete(`${process.env.REACT_APP_API_URL}/api/approvals/${approvalId}`)
            .then(() => {
              message.success('해당 요청이 회수되었습니다.', 2);
              navigate('/approval/list');
            })
            .catch((error) => {
              console.error('Error deleting approval:', error);
            });
        },
        onCancel() {
          console.log('회수 취소됨');
        },
      });
    } catch (error) {
      console.error('Error updating approval:', error);
      message.error('회수 중 오류가 발생했습니다.', 2);
    }
  };

  // 승인 / 반려 / 구매 등록
  const onClickApproval = (approvalType) => {
    try {
      const itemsToMap = approvalType !== 'payment' ? confirmItems : paymentItems;

      const approval = [];
      for (const item of itemsToMap) {
        const validationMessage = validateApprovalItems(item);
        if (validationMessage) {
          message.warning(validationMessage, 5);
          return; // 유효성 검사에서 오류가 발생하면 함수 종료
        }

        let filePath = item.key === 'paymentReceiptInfo' ? imageInfo?.name || 'N/A' : undefined;

        approval.push({
          key: item.key,
          label: item.label,
          value: filePath || item.children.props?.value || item.children,
        });
      }

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
          // Send-mail 예비 로직
          if (response.status === 201) {
            // 도서 정보
            if (approvalType === 'approve' || approvalType === 'reject') {
              const bookInfo = {
                title: bookTitle,
                price: bookPrice,
                requestDetails: commentValue,
              };

              sendEmail(
                'approvalRequest',
                user,
                bookInfo,
                approvalType === 'approve' ? '2' : approvalType === 'reject' ? '3' : '',
                confirmComment
              );
            }
          }
          navigate('/approval/list');
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    } catch (error) {
      console.error('Error updating approval:', error);
      // message.error('승인 정보를 업데이트하는 중 오류가 발생했습니다.', 2);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center' }}>
        <h1>{approvalTitle}</h1>
        <Button
          type="link"
          style={{ marginRight: '15px' }}
          onClick={() => navigate('/approval/list')}
        >
          목록으로
        </Button>
      </div>
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
          회수
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

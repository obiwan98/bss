import axios from 'axios';
import dayjs from 'dayjs';

/**
 * 역할 데이터를 가져오는 함수
 */
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Error fetching roles');
  }
};

/**
 * 그룹 데이터를 가져오는 함수
 */
export const fetchGroups = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw new Error('Error fetching groups');
  }
};

/**
 * 태그 데이터를 가져오는 함수
 */
export const fetchTags = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/external/aladinTag`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Error fetching tags');
  }
};

/**
 * 선택한 query에 맞는 책 데이터를 가져오는 함수
 */
export const fetchBooksByQuery = async (query) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/external/aladinSearch`, {
      query: query,
      maxResults: '50',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books by query:', error);
    throw new Error('Error fetching books');
  }
};

export const leaderInfo = async (user) => {
  try {
    const response = await axios.get(
      process.env.REACT_APP_API_URL +
        `/api/users/group/${user?.group?._id}/role/66a0bbfe8d7e45a08668b30f/info`
    );
    return response.data.leaders.length > 0 ? response.data.leaders : null;
  } catch (error) {
    console.log(error);
  }
};

export const sendEmail = async (templateName, user, bookInfo, badgeValue, confirmComment) => {
  // 송신
  const sender = {
    applicantName: user.name,
    department: user.group.team,
    email: user.email,
  };

  const leader = await leaderInfo(user);
  const badgeTexts = {
    1: '승인 요청',
    2: '승인 완료',
    3: '반려',
    4: '구매 완료',
  };
  const getBadgeText = (badgeValue) => badgeTexts[badgeValue] || '알 수 없음';
  const leaderEmails = Array.isArray(leader)
  ? leader.map((l) => l.email).join(', ')
  : leader?.email || 'N/A';

  // 수신
  const recipient = {
    to: badgeValue === "1" ? leaderEmails : sender.email,
    subject: 
      templateName === "approvalRequest" ? '결재 ' + getBadgeText(badgeValue) + ' 합니다.' :
      templateName === "rentalRequest" ? '도서 대여 요청합니다.' : '',
  };

  // 결재 정보
  const approvalInfo = {
    approverName: leaderEmails,
    approvalDetails: confirmComment,
    status: getBadgeText(badgeValue),
    date: dayjs(new Date()).format('YYYY-MM-DD')
  };

  const reqBody = {
    templateName: templateName,
    sender: sender,
    recipient: recipient,
    bookInfo: bookInfo,
    approvalInfo: approvalInfo,
  };

  try {
    const emailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/send-email`, reqBody);
  } catch (error) {
    console.error('이메일 전송에 실패하였습니다:', error);
    alert('이메일 전송에 실패하였습니다.');
  }
};

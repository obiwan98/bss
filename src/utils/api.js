import axios from 'axios';

/**
 * 역할 데이터를 가져오는 함수
 */
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles`);
    console.log('Roles fetched:', response.data);
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
    console.log('Groups fetched:', response.data);
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
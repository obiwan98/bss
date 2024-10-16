import { useEffect, useState } from 'react';
import { fetchTags } from '../utils/api';

const useFetchTags = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      try {
        setLoading(true);
        const tagsData = await fetchTags();
        setTags(tagsData.tags);
        if (tagsData.tags.length > 0) {
          setSelectedTag(tagsData.tags[0].Code); // 기본 선택 태그 설정
        }
      } catch (error) {
        setErrorMessage('Error fetching tags');
      } finally {
        setLoading(false);
      }
    };

    getTags();
  }, []);

  return { tags, selectedTag, setSelectedTag, loading, errorMessage };
};

export default useFetchTags;

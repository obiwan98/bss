import { useEffect, useState } from 'react';
import { fetchBooksByQuery } from '../utils/api';

const useFetchBooksByQuery = (query) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getBooks = async () => {
      if (query) {
        setLoading(true);
        try {
          const booksData = await fetchBooksByQuery(query);
          setBooks(booksData.books);
        } catch (error) {
          setErrorMessage('Error fetching books');
        } finally {
          setLoading(false);
        }
      }
    };

    getBooks();
  }, [query]);

  return { books, loading, errorMessage };
};

export default useFetchBooksByQuery;

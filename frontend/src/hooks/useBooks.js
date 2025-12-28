import { useState, useEffect, useCallback } from 'react';
import { bookAPI } from '../services/api';

export const useBooks = (initialParams = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookAPI.getAll({ ...initialParams, ...params });
      setBooks(response.data.books || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const addBook = async (bookData) => {
    try {
      setError(null);
      const response = await bookAPI.create(bookData);
      setBooks(prev => [...prev, response.data.book]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      setError(null);
      const response = await bookAPI.update(id, bookData);
      setBooks(prev => prev.map(book => 
        book._id === id ? response.data.book : book
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      setError(null);
      await bookAPI.delete(id);
      setBooks(prev => prev.filter(book => book._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    refetch: fetchBooks,
    addBook,
    updateBook,
    deleteBook,
  };
};
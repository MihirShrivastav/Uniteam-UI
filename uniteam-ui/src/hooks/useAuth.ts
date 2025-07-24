import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { mockLogin } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);

  // Auto-login with mock user for UI development
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(mockLogin());
    }
  }, [dispatch, isAuthenticated, loading]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
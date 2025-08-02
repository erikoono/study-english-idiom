import { useState, useCallback } from 'react';

interface UseErrorHandlerReturn {
  error: string | null;
  hasError: boolean;
  showError: (message: string, originalError?: Error) => void;
  clearError: () => void;
  handleApiError: (error: Error, userMessage?: string) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string, originalError?: Error) => {
    if (originalError) {
      console.error('Error occurred:', originalError);
    }
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((error: Error, userMessage?: string) => {
    const defaultMessage = 'エラーが発生しました。しばらくしてから再度お試しください。';
    const message = userMessage || defaultMessage;
    
    console.error('API Error:', error);
    setError(message);
  }, []);

  return {
    error,
    hasError: !!error,
    showError,
    clearError,
    handleApiError,
  };
};
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorContextProps {
  error: boolean;
  setError: (error: boolean) => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextProps => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

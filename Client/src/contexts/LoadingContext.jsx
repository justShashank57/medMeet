import React from 'react';

const LoadingContext = React.createContext();

export function LoadingProvider({ children }) {
  const [loadingStates, setLoadingStates] = React.useState({});

  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const isLoading = (key) => loadingStates[key] || false;

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

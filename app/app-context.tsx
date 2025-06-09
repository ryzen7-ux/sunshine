// context/AppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AppContextProps {
  success: boolean;
  handleSuccess: () => void;
  resetSuccess: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [success, setIsSuccess] = useState(false);

  const handleSuccess = useCallback(() => setIsSuccess((prev) => !prev), []);
  const resetSuccess = useCallback(() => setIsSuccess(false), []);

  const value: AppContextProps = {
    success,
    handleSuccess,
    resetSuccess,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

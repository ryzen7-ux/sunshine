"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the user data
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the context type, including the user and a state update function
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with a default null value
export const UserContext = createContext<UserContextType | null>(null);

// Create the provider component
export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

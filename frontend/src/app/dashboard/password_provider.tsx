"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Password {
  id: string;
  site_name: string;
  username: string;
  category: string;
  site_url: string;
  password: string;
  creation_date: string;
  modification_date: string;
  notes: string;
}

interface PasswordContextType {
  passwords: Password[];
  setPasswords: React.Dispatch<React.SetStateAction<Password[]>>;
  refreshPasswords: (email: string) => Promise<void>;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

interface PasswordProviderProps {
  children: ReactNode;
}

export const PasswordProvider: React.FC<PasswordProviderProps> = ({ children }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch passwords for the authenticated user
  const fetchPasswords = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/passwords?email=${email}`);
      const data = await response.json();
      setPasswords(data);
    } catch (err) {
      setError('Failed to fetch passwords');
    } finally {
      setLoading(false);
    }
  };

  // Refresh passwords by calling the fetch function
  const refreshPasswords = async (email: string) => {
    await fetchPasswords(email);
  };

  return (
    <PasswordContext.Provider value={{ passwords, setPasswords, refreshPasswords }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePasswords must be used within a PasswordProvider');
  }
  return context;
};

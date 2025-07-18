import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LogEntry } from '@/types/logging';

interface LoggingContextType {
  logs: LogEntry[];
  logAction: (action: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export const useLogging = () => {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return context;
};

interface LoggingProviderProps {
  children: ReactNode;
}

export const LoggingProvider = ({ children }: LoggingProviderProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logAction = (action: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...action
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs]);
    
    // Also log to console for debugging
    console.log('Action logged:', newLog);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LoggingContext.Provider value={{ logs, logAction, clearLogs }}>
      {children}
    </LoggingContext.Provider>
  );
};
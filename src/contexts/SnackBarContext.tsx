'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomSnackbar from '@/components/SnackBar/SnackBar';
import { useTranslation } from 'react-i18next';

type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextProps {
  showSnackbar: (message: string, severity?: SnackbarSeverity, icon?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = () => {
  const { t: translate } = useTranslation();
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(translate('SNACKBAR.ERROR'));
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<SnackbarSeverity>('info');
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const showSnackbar = (message: string, severity: SnackbarSeverity = 'info', icon?: string) => {
    setMessage(message);
    setSeverity(severity);
    setIcon(icon);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        icon={icon}
        onClose={() => setOpen(false)}
      />
    </SnackbarContext.Provider>
  );
};
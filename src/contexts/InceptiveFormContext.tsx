'use client';

import { createContext, useContext, useState } from 'react';
import { Question } from '@/data/preliminaryQuestions';

interface InceptiveFormContextType {
  formValue: any;
  setFormValue: (val: any) => void;
}

const InceptiveFormContext = createContext<InceptiveFormContextType | undefined>(undefined);

export const InceptiveFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formValue, setFormValue] = useState<Question[]>([]);

  return (
    <InceptiveFormContext.Provider value={{ formValue, setFormValue }}>
      {children}
    </InceptiveFormContext.Provider>
  );
};

export const useInceptiveForm = () => {
  const context = useContext(InceptiveFormContext);
  if (!context) throw new Error('useInceptiveForm must be used within InceptiveFormProvider');
  return context;
};

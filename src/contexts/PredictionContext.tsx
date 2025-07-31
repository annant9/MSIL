'use client';
import React, { createContext, useContext, useState } from 'react';

interface PredictionContextType {
  predictionData: any;
  setPredictionData: (data: any) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predictionData, setPredictionData] = useState<any>(null);

  return (
    <PredictionContext.Provider value={{ predictionData, setPredictionData }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

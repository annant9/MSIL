import { createContext, useContext, useState, ReactNode } from 'react';

type ExpandedPanels = { [key: string]: boolean };

const ExpandedPanelsContext = createContext<{
  expandedPanels: ExpandedPanels;
  setExpandedPanels: React.Dispatch<React.SetStateAction<ExpandedPanels>>;
  handlePanelSwitch: (from: string, to: string) => void;
  checkIfOnlyExpanded: (panel: string) => boolean;
} | null>(null);

export const ExpandedPanelsProvider = ({ children }: { children: ReactNode }) => {
  const [expandedPanels, setExpandedPanels] = useState<ExpandedPanels>({
    panel1: true,
    panel2: false,
  });

  const handlePanelSwitch = (from: string, to: string) => {
    setExpandedPanels((prev) => ({ ...prev, [from]: false, [to]: true }));
  };

  const checkIfOnlyExpanded = (panel: string) => {
    return (
      (panel === 'panel1' && expandedPanels.panel1 && !expandedPanels.panel2) ||
      (panel === 'panel2' && !expandedPanels.panel1 && expandedPanels.panel2)
    );
  };

  return (
    <ExpandedPanelsContext.Provider
      value={{ expandedPanels, setExpandedPanels, handlePanelSwitch, checkIfOnlyExpanded }}
    >
      {children}
    </ExpandedPanelsContext.Provider>
  );
};

export const useExpandedPanels = () => {
  const context = useContext(ExpandedPanelsContext);
  if (!context) throw new Error('useExpandedPanels must be used within ExpandedPanelsProvider');
  return context;
};

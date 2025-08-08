import { create } from 'zustand';

interface SummaryOutput {
  summary: string,
  similar_indices: string
}

interface SummaryOutputState {
  summaryOutput: SummaryOutput | null;
  setSummaryOutput: (data: SummaryOutput) => void;
}

export const useSummaryStore = create<SummaryOutputState>((set) => ({
  summaryOutput: null,
  setSummaryOutput: (data) => set({ summaryOutput: data }),
}));

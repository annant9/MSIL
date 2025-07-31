import { create } from 'zustand';

interface ModelOutput {
  prediction: string,
  message: string
}

interface ModelOutputState {
  modelOutput: ModelOutput | null;
  setModelOutput: (data: ModelOutput) => void;
}

export const usePredictionStore = create<ModelOutputState>((set) => ({
  modelOutput: null,
  setModelOutput: (data) => set({ modelOutput: data }),
}));

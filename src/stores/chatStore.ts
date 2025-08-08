// stores/chatStore.ts
import { create } from 'zustand';

interface ChatState {
  sessionId: string | null;
  messages: { sender: string; text: string }[];
  setSessionId: (id: string) => void;
  addMessage: (msg: { sender: string; text: string }) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  messages: [],
  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));

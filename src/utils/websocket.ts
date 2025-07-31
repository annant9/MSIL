import { clientEnv } from '@/config/client-env';

let socket: WebSocket | null = null;

const listeners: ((event: MessageEvent) => void)[] = [];

export const initWebSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      listeners.forEach((listener) => listener(event));
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  return socket;
};

export const getWebSocket = () => {
  return socket;
};

export const addWebSocketListener = (listener: (event: MessageEvent) => void) => {
  listeners.push(listener);
};

export const removeWebSocketListener = (listener: (event: MessageEvent) => void) => {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

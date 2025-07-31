'use client';

import React, { createContext, useContext, useRef, useState } from 'react';

interface WebSocketContextProps {
  sessionId: string | null;
  socket: WebSocket | null;
  connect: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  sessionId: null,
  socket: null,
  connect: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connect = () => {
    const id = crypto.randomUUID();
    const ws = new WebSocket('localurl');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'INIT_SESSION', sessionId: id }));
      setSessionId(id);
      setSocket(ws);
    };

    ws.onerror = console.error;
    ws.onclose = () => setSocket(null);

    setSocket(ws);
  };

  return (
    <WebSocketContext.Provider value={{ sessionId, socket, connect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

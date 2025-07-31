'use client';

import React, { useState, useRef } from 'react';

const WebSocketClient: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const handleConnect = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected.');
      return;
    }

    const socket = new WebSocket('localhosturl');

    socket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      socket.send(JSON.stringify({ type: 'INIT_SESSION', payload: {} }));
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    ws.current = socket;
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {connected ? 'Connected' : 'Initiate Session'}
      </button>
    </div>
  );
};

export default WebSocketClient;
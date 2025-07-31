// 'use client';

// import { useState, useRef, useEffect } from 'react';

// type Message = {
//   sender: 'user' | 'bot';
//   text: string;
// };

// export default function ChatSection() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: Message = { sender: 'user', text: input };
//     setMessages(prev => [...prev, userMessage]);

//     const botReply: Message = {
//       sender: 'bot',
//       text: `Echo: ${input}`,
//     };

//     setTimeout(() => {
//       setMessages(prev => [...prev, botReply]);
//     }, 5000);

//     setInput('');
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 p-4">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-3 rounded-xl max-w-xs ${
//               msg.sender === 'user' ? 'bg-blue-500 text-white custom-user-message' : 'bg-white text-black self-start'
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           className="flex-1 p-2 border rounded-md"
//           placeholder="Type your message..."
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null); // WebSocket reference

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // Initialize WebSocket
  useEffect(() => {
    const ws = new WebSocket('wss://aiccm-services-dev.boschindia-mobilitysolutions.com/ws/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data === 'string') {
          // If the server just sends plain text
          setMessages(prev => [...prev, { sender: 'bot', text: data }]);
        } else if (data.bot_message) {
          setMessages(prev => [...prev, { sender: 'bot', text: data.bot_message }]);
        } else {
          setMessages(prev => [...prev, { sender: 'bot', text: event.data }]);
        }
      } catch (err) {
        console.error('Invalid message format', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Send user message to WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ user_message: input }));
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}

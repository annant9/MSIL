'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import { Box, Container, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useInceptiveForm } from '@/contexts/InceptiveFormContext';
import Image from 'next/image';
import editForm from './../../assets/images/edit-form.svg';
import reset from './../../assets/images/reset.svg';
import { closeWebSocket, initWebSocket } from '@/utils/websocket';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/contexts/SnackBarContext';
import { usePredictionStore } from '@/stores/predictionStore';

type Conversation = {
  sender: string;
  content: string;
};

const DiagnosisBot: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { t: translate } = useTranslation();
  const [inputText, setInputText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const placeholderText = translate('CHAT.PLACEHOLDER');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { formSubmitted, setFormSubmitted, formChanged } = useInceptiveForm();
  const [loader, setLoader] = useState(false);
  const inputRef = useRef('');
  const [endWorkflow, setEndWorkflow] = useState(false);
  const messageHandledRef = useRef(false);
  const [socketReconnect, setSocketReconnect] = useState(false);
  const [restartConversation, setRestartConversation] = useState(false);
  const modelOutput = usePredictionStore((state) => state.modelOutput);

  useEffect(() => {
    if (formChanged) setConversations([]);
  }, [formChanged]);

  useEffect(() => {
    if (!formSubmitted) {
      if (ws.current) {
        closeWebSocket();
        ws.current = null;
      }
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    setEndWorkflow(false);
    setLoader(true);

    const newSocket = initWebSocket();
    ws.current = newSocket;

    newSocket.onopen = () => {
      setConversations([]);
    };

    newSocket.onmessage = (event) => {
      messageHandledRef.current = false;
      try {
        const data = JSON.parse(event.data);
        setLoader(false);
        const response = data.response || data;

        let botReply = response;

        response.end_workflow && setEndWorkflow(true);
        setConversations((prev) => [...prev, botReply]);
        setLoader(false);
        messageHandledRef.current = true;
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setLoader(false);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoader(false);
      showSnackbar(translate('CHAT.CONNECTING') + '!', 'info');
    };

    newSocket.onclose = () => {
      if (!conversations.length) setSocketReconnect(true);
    };

    return () => {
      if (ws.current) {
        if (ws.current) {
          if (newSocket.onmessage) {
            ws.current.removeEventListener('message', newSocket.onmessage);
          }
          if (newSocket.onerror) {
            ws.current.removeEventListener('error', newSocket.onerror);
          }
          if (newSocket.onopen) {
            ws.current.removeEventListener('open', newSocket.onopen);
          }
        };

        if (
          newSocket.readyState === WebSocket.OPEN ||
          newSocket.readyState === WebSocket.CONNECTING
        ) {
          newSocket.close();
        }
        ws.current = null;
      }
    };
  }, [formSubmitted, socketReconnect, restartConversation]);

  useEffect(() => {
    if (restartConversation) {
      setRestartConversation(false);
    }
  }, [restartConversation]);

  useEffect(() => {
    if (!endWorkflow) return;
    const socket = ws.current;
    if (!socket) return;
    socket.onclose = () => {
      console.log(translate('WEBSCOKET.CLOSE') + '.');
    };
    return () => {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [endWorkflow]);

  const changeInputText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = '2rem';
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight <= 80) {
      textarea.style.height = scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = '10rem !important';
      textarea.style.overflowY = 'auto';
    }
    setInputText(e.target.value);
  };

  const keyboardInput = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        event.preventDefault();
        setInputText((prevText) => prevText + '\n');
      } else {
        event.preventDefault();
        handleSubmit(event);
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations]);

  useEffect(() => {
  ws.current = new WebSocket('ws://localhost:8080');

  ws.current.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const botReply = data;
    setConversations((prev) => [...prev, botReply]);
        setLoader(false);
  };

  ws.current.onerror = (error) => {
    console.log('WebSocket error:', error);
  };

  ws.current.onclose = () => {
    console.log('WebSocket closed');
  };

  return () => {
    ws.current?.close();
  };
}, []);

useEffect(() => {
  if (!formChanged)
    return;
  ws.current = new WebSocket('ws://localhost:8080');
  setConversations([]);

  ws.current.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const botReply = data;
    setConversations((prev) => [...prev, botReply]);
        setLoader(false);
  };

  ws.current.onerror = (error) => {
    console.log('WebSocket error:', error);
  };

  ws.current.onclose = () => {
    console.log('WebSocket closed');
  };

  return () => {
    ws.current?.close();
  };
}, [formChanged]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !inputRef.current.trim()) return;
    setLoader(true);

    const messageToSend = inputText.length ? inputText : inputRef.current;
    const messagePayload = {
      content: messageToSend,
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messagePayload));
      messageHandledRef.current = false;
      setInputText('');
      inputRef.current = '';
    } else {
      console.warn('WebSocket not ready to send message.');
      setLoader(false);
      showSnackbar(translate('CHAT.CONNECTION_LOST'), 'warning');
      return;
    }

    const userMessage= {sender: 'user', content: messageToSend};
    setConversations((prev) => [...prev, userMessage]);
  };

  const resetConversation = () => {
    setConversations([]);
    setEndWorkflow(false);
    setLoader(false);
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setRestartConversation(true);
  };

  return (
    <>
      {modelOutput?.prediction === 'UNSURE' && <div>
        <Container>
          {(
            <>
              <Grid
                container
                spacing={0.5}
                className={`pb-2 px-2 ${styles.formContainer}`}
                direction="column"
              >
                <Grid size={{ xs: 12 }} className={styles.formContainer}>
                  <div
                    className={`flex flex-col flex-1 overflow-y-auto space-y-2 p-2 ${styles.containerStyle}`}
                  >
                    <div className={styles.messagesContainer}>
                      {conversations.map((msg, index) =>
                        msg.sender === 'user' ? (
                          <div className={styles.flexComponent} key={index}>
                            <div
                              className={`p-3 rounded-xl max-w-xs bg-gray-1000 text-red text-end ml-auto ${styles.responseContainer}`}
                            >
                              <div>{msg.content}</div>
                            </div>
                            <div className="flex gap-1 mt-1">
                              <i
                                className={`a-icon boschicon-bosch-ic-user ${styles.chatIcon}`}
                              ></i>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.flexComponent} key={index}>
                            <div className="flex gap-1 mt-1">
                              <i
                                className={`a-icon boschicon-bosch-ic-user-artificial-intelligence ${styles.chatIcon}`}
                              ></i>
                            </div>
                            <div
                              className={`pt-0 pr-3 pb-3 pl-3 rounded-xl max-w-xs bg-white text-black self-start ${styles.responseContainer}`}
                            >
                              <div>{msg.content}</div>
                            </div>
                          </div>
                        )
                      )}
                      <div ref={messagesEndRef} />
                      {loader && (
                        <div className={styles.flexComponent}>
                          <div className="flex gap-1 mt-1">
                            <i
                              className={`a-icon boschicon-bosch-ic-user-artificial-intelligence ${styles.chatIcon}`}
                            ></i>
                          </div>
                          <div
                            className={`pt-0 pr-3 pb-3 pl-3 rounded-xl max-w-xs bg-white text-black self-start ${styles.responseContainer}`}
                          >
                            <div
                              className="a-activity-indicator -small"
                              aria-live="off"
                            >
                              <div className="a-activity-indicator__top-box"></div>
                              <div className="a-activity-indicator__bottom-box"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
                <div className={`${styles.querySection} p-2 bg-[#f9f9f9]`}>
                  <div className="a-text-area input-text">
                    <textarea
                      id="1"
                      className="text-area-style"
                      name="inputText text"
                      placeholder={placeholderText}
                      value={inputText}
                      onChange={changeInputText}
                      onKeyDown={keyboardInput}
                      disabled={endWorkflow}
                    ></textarea>
                  </div>
                  <div className={styles.queryButton}>
                    <Box className={styles.flexComponent}>
                      <Tooltip title="Edit Form">
                        <Image
                          src={editForm}
                          alt="Edit Form"
                          className={`${styles.iconStyle} ${endWorkflow ? styles.disabledIcon : ''}`}
                          onClick={() => setFormSubmitted(false)}
                        />
                      </Tooltip>
                      <Tooltip title="Restart Conversation">
                        <Image
                          src={reset}
                          alt="newChat"
                          className={`${styles.iconStyle} ${endWorkflow ? styles.disabledIcon : ''}`}
                          onClick={() => {
                            setEndWorkflow(true);
                            resetConversation();
                          }}
                        />
                      </Tooltip>
                    </Box>

                    <Tooltip title="Send">
                      <i
                        className={`a-icon a-button__icon boschicon-bosch-ic-paperplane ${styles.iconStyle} ${endWorkflow ? styles.disabledIcon : ''}`}
                        onClick={endWorkflow ? undefined : handleSubmit}
                        aria-label="Restart Conversation"
                      />
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            </>
          )}
        </Container>
      </div>}
    </>
  );
};

export default DiagnosisBot;

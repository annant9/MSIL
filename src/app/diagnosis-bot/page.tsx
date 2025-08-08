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
import { createChatSession, sendChatMessage } from '@/services/chatModelService';
import { useSummaryStore } from '@/stores/summaryStore';
import { marked } from 'marked';

type Conversation = {
  sender: string;
  content: any;
};

const DiagnosisBot: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { t: translate } = useTranslation();
  const [inputText, setInputText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const placeholderText = translate('CHAT.PLACEHOLDER');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loader, setLoader] = useState(false);
  const inputRef = useRef('');
  const [endWorkflow, setEndWorkflow] = useState(false);
  const messageHandledRef = useRef(false);
  const [restartConversation, setRestartConversation] = useState(false);
  const modelOutput = usePredictionStore((state) => state.modelOutput);
  const { formValue } = useInceptiveForm();
  const summaryOutput = useSummaryStore((state) => state.summaryOutput);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (restartConversation) {
      setRestartConversation(false);
    }
  }, [restartConversation]);

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

  }, [summaryOutput])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !inputRef.current.trim()) return;

    setInputText('');
    const messageToSend = inputText.length ? inputText : inputRef.current;
    const messagePayload = {
      content: messageToSend,
    };

    if (!conversations.length) {
      const { paramData } = extractData();
      const response = await createChatSession(paramData, translate);
      const userMessage = { sender: 'user', content: messageToSend };
      setConversations((prev) => [...prev, userMessage]);
      setLoader(true);
      if (response?.session_id) {
        const chatResponse = await sendChatMessage({ 'session_id': response.session_id, 'user_input': messageToSend }, translate);
        const html = marked(chatResponse?.response);
        const botMessage = { sender: 'bot', content: html };
        setLoader(false);
        setConversations((prev) => [...prev, botMessage]);
        setSessionId(response?.session_id);
      }
    } else {
      const userMessage = { sender: 'user', content: messageToSend };
      setConversations((prev) => [...prev, userMessage]);
      setLoader(true);
      const chatResponse = await sendChatMessage({ 'session_id': sessionId, 'user_input': messageToSend }, translate);
      const html = marked(chatResponse?.response);
      const botMessage = { sender: 'bot', content: html };
      setLoader(false);
      setConversations((prev) => [...prev, botMessage]);
    }
  };

  const extractData = () => {
    const paramData: Record<string, any> = {};
    formValue.forEach((question: any) => {
      if (question.id && question.id === 'issue') {
        paramData['current_issue'] = question.value;
      }
    });
    paramData['classification_model_output'] = {
      'prediction': modelOutput?.prediction,
      'prediction_explanation': [
        {
          "feature": "string",
          "impact": 0
        }
      ],
      'input_features': {
        'additionalProp1': {}
      }
    };
    paramData['retrieved_documents_index'] = summaryOutput?.similar_indices;
    paramData['summary'] = summaryOutput?.summary
    return { paramData };
  };

  const resetConversation = () => {
    setConversations([]);
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
                              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
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
                      disabled={!summaryOutput}
                    ></textarea>
                  </div>
                  <div className={styles.queryButton}>
                    <Box className={styles.flexComponent}>
                      <Tooltip title="Restart Conversation">
                        <Image
                          src={reset}
                          alt="newChat"
                          className={`${styles.iconStyle} ${endWorkflow ? styles.disabledIcon : ''}`}
                          onClick={() => {
                            resetConversation();
                          }}
                        />
                      </Tooltip>
                    </Box>

                    <Tooltip title="Send">
                      <i
                        className={`a-icon a-button__icon boschicon-bosch-ic-paperplane ${styles.iconStyle} ${endWorkflow ? styles.disabledIcon : ''}`}
                        onClick={summaryOutput ? undefined : handleSubmit}
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

// lib/chatApi.ts
import { useChatStore } from "@/stores/chatStore";

export async function createChatSession(payload: any, showSnackbar: any): Promise<any> {
  try {
    console.log(payload);
    debugger
    const response = await fetch('https://kor2vm0015.apac.bosch.com:4438/api/v1/chat/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      showSnackbar('Failed to create chat session!', 'error', 'ui-ic-alert-error');
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    showSnackbar('Failed to create chat session!', 'error', 'ui-ic-alert-error');
    return;
  }
}

export async function sendChatMessage(
  payload: any,
  showSnackbar: any
): Promise<any> {
  try {
    const sessionId = payload.session_id;
    debugger;
    if (!sessionId) {
      showSnackbar('No active session!', 'error', 'ui-ic-alert-error');
      return;
    }

    const response = await fetch('https://kor2vm0015.apac.bosch.com:4438/api/v1/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      showSnackbar('Failed to send message!', 'error', 'ui-ic-alert-error');
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    showSnackbar('Failed to send message!', 'error', 'ui-ic-alert-error');
    return;
  }
}

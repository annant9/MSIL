import { usePredictionStore } from '@/stores/predictionStore';

export async function getPrediction(payload: any, showSnackbar: any, translate: any): Promise<any> {
  try {
    debugger;
    const response = await fetch(
      'https://mocki.io/v1/3cab6a57-0617-4547-b15b-21c732a7f526',
      {
        method: 'GET',
        // headers: {'accept': 'application/json', 'Content-Type': 'application/json'},
        // body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      showSnackbar('Failed to fetch prediction!', 'error', 'ui-ic-alert-error');
    }
    const data = await response.json();
    usePredictionStore.getState().setModelOutput(data);
    showSnackbar(
      'Prediction fetched successfully!',
      'success',
      'boschicon-bosch-ic-emoji-happy'
    );
    return (response);
  } catch (error) {
    showSnackbar('Failed to fetch prediction!', 'error', 'ui-ic-alert-error');
  }
}
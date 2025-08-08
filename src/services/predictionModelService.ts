import { usePredictionStore } from '@/stores/predictionStore';

export async function getPrediction(payload: any, showSnackbar: any, translate: any): Promise<any> {
  try {
    console.log(JSON.stringify(payload));
    debugger;
    const response = await fetch(
      'https://kor2vm0015.apac.bosch.com:4434/predict',
      {
        method: 'POST',
        headers: {'accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
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
import { useSummaryStore } from "@/stores/summaryStore";

export async function getAiSummary(
  payload: Record<string, string>,
  showSnackbar: any
): Promise<void> {
  try {
    const response = await fetch(
      'https://kor2vm0015.apac.bosch.com:4438/api/v1/summary',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      showSnackbar('Failed to fetch AI summary!', 'error', 'ui-ic-alert-error');
    }
    const data = await response.json();
    useSummaryStore.getState().setSummaryOutput(data);
  } catch (error) {
    console.error(error);
    showSnackbar('Failed to fetch AI summary!', 'error', 'ui-ic-alert-error');
  }
}

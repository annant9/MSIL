import { useSummaryStore } from "@/stores/summaryStore";

export async function getAiSummary(
  payload: Record<string, string>,
  showSnackbar: any
): Promise<void> {
  try {
    debugger;
    const response = await fetch(
      'https://mocki.io/v1/6d2b1c58-2850-4b15-9f59-f6b88ac4ecaa',
      {
        method: 'GET',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(payload)
      }
    );
    if (!response.ok) {
      showSnackbar('Failed to fetch AI summary!', 'error', 'ui-ic-alert-error');
    }
    const data = await response.json();
    useSummaryStore.getState().setSummaryOutput(data);

    console.log(data);
  } catch (error) {
    console.error(error);
    showSnackbar('Failed to fetch AI summary!', 'error', 'ui-ic-alert-error');
  }
}

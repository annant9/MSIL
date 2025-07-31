'use client';

import '@bosch/frontend.kit-npm/dist/frontend-kit.complete.css';
import './globals.css';
import { InceptiveFormProvider, useInceptiveForm } from '@/contexts/InceptiveFormContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import '@/i18n';
import { PredictionProvider } from '@/contexts/PredictionContext';
import { ExpandedPanelsProvider } from '@/contexts/ExpandedPanelsContext';
import { SnackbarProvider } from '@/contexts/SnackBarContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          <SnackbarProvider>
            <InceptiveFormProvider>
              <ExpandedPanelsProvider>
                <PredictionProvider>
                  {children}
                </PredictionProvider>
              </ExpandedPanelsProvider>
            </InceptiveFormProvider>
          </SnackbarProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}

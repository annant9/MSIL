'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import InceptiveForm from '@/components/InceptiveForm/InceptiveForm';
import { useInceptiveForm } from '@/contexts/InceptiveFormContext';
import { closeWebSocket, initWebSocket } from '@/utils/websocket';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/contexts/SnackBarContext';
import AiSummary from '../ai-summary/page';
import DiagnosisBot from '../diagnosis-bot/page';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useExpandedPanels } from '@/contexts/ExpandedPanelsContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

const Home: React.FC = () => {
  const { expandedPanels, setExpandedPanels, handlePanelSwitch, checkIfOnlyExpanded } = useExpandedPanels();

  return (
    <>
    <Header />
      <div>
        <Box className={styles.formContainer}>
          <Accordion
          expanded={expandedPanels.panel1}          
          onChange={() =>
            setExpandedPanels((prev) => { if (prev.panel1 && !prev.panel2) return prev; return {...prev, panel1: !prev.panel1} })
          }
          className={`${styles.accordion} ${checkIfOnlyExpanded('panel1') && styles.noPointerEvents}`}
          >
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-expanded={true}
            aria-controls='panel1-content'
            id='panel1-header'
            className={styles.accordionHeader}>
              <Typography>Enter Preliminary details</Typography>
            </AccordionSummary>
            <AccordionDetails className={styles.accordion}>
              <InceptiveForm onSubmitSuccess={() => handlePanelSwitch('panel1', 'panel2')} />
            </AccordionDetails>
          </Accordion>
          <Accordion
          expanded={expandedPanels.panel2}          
          onChange={() =>
            setExpandedPanels((prev) => { if (prev.panel1)
              return {panel1: prev.panel1, panel2: !prev.panel2}; 
              return {panel1: !prev.panel1, panel2: !prev.panel2} })
          }
          className={styles.accordion}
          >
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1-content'
            id='panel1-header'
            className={styles.accordionHeader}>
              <Typography>AI Summary and Chat conversation</Typography>
            </AccordionSummary>
            <AccordionDetails className={`${styles.accordion} ${styles.predictionChatContainer}`}>
              <Grid container>
                <Grid size={{ xs: 12, md: 12 }}>
                  <AiSummary />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default Home;
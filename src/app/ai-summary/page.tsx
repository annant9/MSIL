'use client';

import { useInceptiveForm } from "@/contexts/InceptiveFormContext";
import { getAiSummary } from "@/services/summaryModelService";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { useSummaryStore } from "@/stores/summaryStore";
import styles from './page.module.scss';

interface IPayload {
    model_output: {
        prediction: string,
        features: string,
        explanation: string
    },
    dealer_remarks: string,
};

const AiSummary: React.FC = () => {
    const modelOutput = usePredictionStore((state) => state.modelOutput);
    const [dealerRemarks, setDealerRemarks] = useState<string>('');
    const { showSnackbar } = useSnackbar();
    const summaryOutput = useSummaryStore((state) => state.summaryOutput);
    const { formValue } = useInceptiveForm();

    useEffect(() => {
        const { paramData } = extractData();
        if (modelOutput)
            getAiSummary(
                paramData,
                showSnackbar
            );

    }, []);

    useEffect(() => {
        if (!modelOutput)
            return;
        const { paramData } = extractData();
        getAiSummary(
            paramData,
            showSnackbar
        );
    }, [modelOutput])

    const extractData = useCallback(() => {
        const paramData: Record<string, string> = {};
        console.log(formValue)
        debugger;
        formValue.forEach((question: any) => {
            if (question.id && question.id !== 'issue') {
            paramData[question.id] = question.value;
            }
        });

        return { paramData };
        }, [formValue]);



    return (
        <>
            {modelOutput && <Container>
                <Box>
                    <Grid container flexGrow={'column'} className={`${styles.gridContainer} ${styles.predictionContainer}`}>
                        <Grid size={{ xs: 3 }}>
                            <Typography className={`${styles.textStyle} ${styles.boldText}`}>
                                Prediction :
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                            <Typography className={`${styles.textStyle} ${styles.highlightedText}`}>
                                {modelOutput?.prediction}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Grid container flexGrow={'column'} className={`${styles.gridContainer} ${styles.predictionContainer}`}>
                        <Grid size={{ xs: 3 }}>
                            <Typography className={`${styles.textStyle} ${styles.boldText}`}>
                                Remarks :
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                            <Typography className={styles.textStyle}>
                                {modelOutput?.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                {summaryOutput?.ai_summary && <Box>
                    <Grid container flexGrow={'column'} className={`${styles.gridContainer} ${styles.predictionContainer}`}>
                        <Grid size={{ xs: 3 }}>
                            <Typography className={`${styles.textStyle} ${styles.boldText}`}>
                                AI Generated Summary :
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                            <Typography className={styles.textStyle}>
                                {summaryOutput?.ai_summary}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>}
            </Container>}
        </>
    );
};

export default AiSummary; 
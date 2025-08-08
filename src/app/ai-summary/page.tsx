'use client';

import { useInceptiveForm } from "@/contexts/InceptiveFormContext";
import { getAiSummary } from "@/services/summaryModelService";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { usePredictionStore } from "@/stores/predictionStore";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { useSummaryStore } from "@/stores/summaryStore";
import styles from './page.module.scss';
import { marked } from 'marked';
import DiagnosisBot from "../diagnosis-bot/page";

const AiSummary: React.FC = () => {
    const modelOutput = usePredictionStore((state) => state.modelOutput);
    const [dealerRemarks, setDealerRemarks] = useState<string>('');
    const { showSnackbar } = useSnackbar();
    const summaryOutput = useSummaryStore((state) => state.summaryOutput);
    const { formValue } = useInceptiveForm();
    const [htmlContent, setHtmlContent] = useState<string | Promise<string>>('');
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % 5);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!modelOutput)
            return;
        const { paramData } = extractData();
        getAiSummary(
            paramData,
            showSnackbar
        );
    }, [modelOutput]);

    const extractData = () => {
        const paramData: Record<string, any> = {};
        console.log(formValue)
        debugger;
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
        }

        return { paramData };
    };

    useEffect(() => {
        if (!summaryOutput?.summary)
            return;
        const rawText = summaryOutput?.summary;
        const html = marked(rawText);
        setHtmlContent(html);
        console.log(htmlContent);

    }, [summaryOutput]);

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
                {modelOutput?.prediction === 'UNSURE' && <Box>
                    <Grid container flexGrow={'column'} className={`${styles.gridContainer} ${styles.predictionContainer}`}>
                        <Grid size={{ xs: 3 }}>
                            <Typography className={`${styles.textStyle} ${styles.boldText}`}>
                                AI Generated Summary :
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 9 }}>
                            {summaryOutput?.summary
                            ? <Typography component="div" className={styles.textStyle} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                            : <div className={styles.container}>
                                <div className={styles.dots}>
                                    {[1, 2, 3, 4, 5].map((num, index) => (
                                    <span
                                        key={num}
                                        className={`${styles.dot} ${styles[`color${num}`]} ${
                                        activeIndex === index ? styles.active : styles.dimmed
                                        }`}
                                    />
                                    ))}
                                </div>
                            </div>
                            }
                        </Grid>
                    </Grid>
                </Box>}
            </Container>}
            {modelOutput?.prediction === 'UNSURE' && summaryOutput?.summary &&
                <Grid size={{ xs: 12, md: 12 }}>
                    <hr className="a-divider" />
                    <DiagnosisBot />
                </Grid>}
        </>
    );
};

export default AiSummary; 
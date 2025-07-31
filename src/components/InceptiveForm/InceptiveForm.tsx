import { Box, Container, Grid, Tab, Tabs } from '@mui/material';
import {
  getPreliminaryQuestions,
  Question
} from '@/data/preliminaryQuestions';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useInceptiveForm } from '@/contexts/InceptiveFormContext';
import './InceptiveForm.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { getPrediction } from '@/services/predictionModelService';
import { useSnackbar } from '@/contexts/SnackBarContext';
import { usePrediction } from '@/contexts/PredictionContext';
import { useRouter } from 'next/navigation';

interface InceptiveFormProps {
  onSubmitSuccess: () => void;
}

const InceptiveForm: React.FC<InceptiveFormProps> = ({ onSubmitSuccess }) => {
  const { setFormValue } = useInceptiveForm();
  const [inceptiveForm, setInceptiveForm] = useState<Question[]>([]);
  const [formStepValidity, setFormStepValidity] = useState(false);
  const { t: translate } = useTranslation();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const storedForm = localStorage ? localStorage?.getItem('form') : null;
    if (storedForm) {
      // setInceptiveForm(JSON.parse(storedForm));
    } else {
      const fetchQuestions = async () => {
        const data = await getPreliminaryQuestions();
        setInceptiveForm(data);
        console.log(data);
      };
      fetchQuestions();
    }
  }, []);

  useEffect(() => {
    console.log(inceptiveForm);
    let stepValidity = true;
    inceptiveForm && inceptiveForm.map((question: any, index: number) => {
      stepValidity = stepValidity && question.valid && question.value.length > 0;
      console.log(stepValidity);
    });
    // localStorage.setItem('form', inceptiveForm)
    setFormValue(inceptiveForm);
    setFormStepValidity(stepValidity);
  }, [inceptiveForm]);

  const handleChange = (parentIndex: string, index: number, value: string) => {
    setInceptiveForm((prev: any[]) => {
      const updated = prev.map((question: any) => {
        console.log(question);
        // debugger;
        if (question.index === index) {
          // debugger;
          const pattern = question?.regex?.replace(/^\/|\/$/g, '');
          const regex = pattern ? new RegExp(pattern) : null;
          const isValid = regex ? regex.test(value) || value.length === 0 : true;
          return {
            ...question,
            value: value,
            valid: isValid
          }
        }
        return question;
      })
      return updated;
    });
  };

  const extractFormData = React.useCallback(() => {
    const paramData: Record<string, string> = {};
    const objectifiedForm = inceptiveForm;

    objectifiedForm &&
      objectifiedForm?.map((question: any, index: number) => {
        if (question.id === 'issue') { } else
          if (question.id) {
            paramData[question.id] = question.value;
          }
      });
    return { paramData };
  }, []);

  const handleSubmit = async () => {
    const { paramData } = extractFormData();
    console.log(paramData);
    const modelOutputs = await getPrediction(paramData, showSnackbar, translate);

    if (!modelOutputs) {
      showSnackbar('Error while fetching prediction!', 'error', '');
      return;
    }
    onSubmitSuccess();
  };


  return (
    <div className="form-container">
      <Grid container spacing={2}>
        {inceptiveForm.length > 0 &&
          inceptiveForm?.map((question: any, index: number) => (

            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <div className="flex flex-col" key={index}>
                <Box className="questionHeader">
                  <strong>{question?.question}</strong>{' '}
                  *
                </Box>
                {question?.type === 'text' && (
                  <>
                    <div className="a-text-field">
                      <input
                        type="text"
                        id={`text-input-${index}`}
                        name={`input-${index}`}
                        placeholder={question.placeholder}
                        value={question.value}
                        onChange={(e) => handleChange(
                          question.panel,
                          index,
                          e.target.value
                        )}
                        className={`custom-input ${!question.valid ? 'invalidInput' : ''}`} />
                    </div>
                  </>
                )}
                {question?.type === 'text-area' && (
                  <>
                    <div className={`a-text-area custom-height`}>
                      <textarea
                        id={`text-input-${index}`}
                        name={`input-${index}`}
                        placeholder={question.placeholder}
                        value={question.value}
                        onChange={(e) => handleChange(
                          question.panel,
                          index,
                          e.target.value
                        )}
                        className="custom-height"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          ))}

      </Grid>
      <div className="buttons-container">

        <div className="-size-sm">
          {translate('INCEPTIVE_FORM.MANDATORY_FIELDS')} *
        </div>
        <button
          type="button"
          className="a-button a-button--primary -without-icon button-style"
          onClick={handleSubmit}
          disabled={!formStepValidity}
        >
          <span className="a-button__label">Submit</span>
        </button>
      </div>
    </div>
  );
};

export default InceptiveForm;

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
  {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

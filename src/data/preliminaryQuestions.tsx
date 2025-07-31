export interface Question {
  index: number;
  question: string;
  options: string[];
  valid: boolean;
  value: string;
  type: string;
  placeholder: string;
  regex: string;
  id: string;
  metric?: string;
}

export interface QuestionGroup {
  group: string;
  panel: string;
  questions: Question[];
}

export async function getPreliminaryQuestions(): Promise<Question[]> {
  return [
    {
      index: 0,
      id: 'CompleteVIN',
      question: 'VIN No. / Eng. No.',
      regex: '/^[a-zA-Z0-9]*$/',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: 'Enter an alphanumeric value',
    },
    {
      index: 1,
      id: 'TMType',
      question: 'TMT type details',
      regex: '^.{0,100}$',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: '',
    },
    {
      index: 2,
      id: 'EngineType',
      question: 'Engine type details',
      regex: '^.{0,100}$',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: '',
    },
    {
      index: 3,
      id: 'KM',
      question: 'KMs',
      regex: '/^[0-9]*$/',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: '',
    },
    {
      index: 4,
      id: 'Cleaned_Final_DTCs',
      question: 'DTC details',
      regex: '^.{0,100}$',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: '',
    },
    {
      index: 5,
      id: 'Variant',
      question: 'Variant',
      regex: '^.{0,100}$',
      valid: true,
      value: '',
      type: 'text',
      options: [],
      placeholder: '',
    },
    {
      index: 6,
      id: 'issue',
      question: 'Enter Issue remarks',
      regex: '^.{0,5000}$',
      valid: true,
      value: '',
      type: 'text-area',
      options: [],
      placeholder: '',
      metric: '',
    }
  ];
}

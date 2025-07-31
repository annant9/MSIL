import fctLogo from './../assets/images/fct-logo.png';

export const tileDetails = [
    {
        header: 'Preliminary data',
        tooltip: 'Enter the device dteails and issue in here',
        path: '/home#preliminary',
        altText: 'Diagnosis image',
        disable: false,
        id: 1
    },
    {
        header: 'AI Summary',
        image: fctLogo,
        tooltip: 'Fetch the AI generated summary for the enetered data',
        path: '/home#ai-summary',
        altText: 'Diagnosis image',
        disable: false,
        id: 2
    },
    {
        header: 'Chat Conversation',
        image: fctLogo,
        tooltip: 'Know more about the AI generated summary',
        path: '/home#chat',
        altText: 'Diagnosis image',
        disable: false,
        id: 3
    }
]
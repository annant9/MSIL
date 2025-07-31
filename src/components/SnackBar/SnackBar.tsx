'use client';

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { Box, Typography } from '@mui/material';
import styles from './SnackBar.module.scss';

interface Props {
  open: boolean;
  message: string;
  icon?: string;
  severity?: AlertColor;
  onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar: React.FC<Props> = ({ open, message, icon, severity, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={50000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} icon={false}>
        <Box className={styles.snackBarContent}>
            {icon &&
            <i className={`a-icon ${icon}`}></i>}
            <Typography>
                {message}
            </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
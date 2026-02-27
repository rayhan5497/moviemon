// SnackbarProvider.js
import { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState({ open: false, message: '' });

  const showSnackbar = (message, style) => {
    setSnack({ open: true, message, style });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return; // ignore clickaway if you want
    setSnack({ ...snack, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        message={snack.message}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          content: {
            sx: {
              ...snack.style, // merge dynamic styles
            },
          },
        }}
      />
    </SnackbarContext.Provider>
  );
};

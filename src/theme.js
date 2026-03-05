import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#128654', // Verde principal
    },
    secondary: {
      main: '#FFFBE2', // Creme
    },
    background: {
      default: '#FFFFFF',
      paper: '#363F4D', // Neutral
    },
    text: {
      primary: '#15181E', // Neutral Variant
      secondary: '#363F4D',
    },
  },
});
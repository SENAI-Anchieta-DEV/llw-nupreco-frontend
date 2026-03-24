import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#128654', // Verde oficial NuPreço
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#363F4D', // Cinza escuro da marca
    },
    // Cores para os Feedbacks Visuais (LLW-140/142)
    error: {
      main: '#d32f2f', 
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#128654',
    },
    background: {
      default: '#F9F9F9',
    },
  },
  shape: {
    borderRadius: 15, // Arredondamento padrão do sistema
  },
  components: {
    // Padronização de Botões (LLW-139)
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none', // Remove o Caps Lock automático
          borderRadius: '12px',  // Botões levemente menos arredondados que os cards para estética
          padding: '10px 20px',
        },
      },
    },
    // Padronização de Inputs (LLW-141)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#128654', // Garante que o foco seja sempre o verde da marca
          },
        },
      },
    },
    // Padronização de Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '25px', // Mantém o padrão do seu protótipo
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
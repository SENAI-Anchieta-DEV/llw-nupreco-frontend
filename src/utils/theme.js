import React, { createContext, useContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';


export const obterTemaNupreco = (modo = 'light') =>
  createTheme({
    palette: {
      mode: modo,
      primary: {
        main: '#128654',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: modo === 'dark' ? '#D1D5DB' : '#363F4D',
      },
      error: {
        main: '#D32F2F',
      },
      warning: {
        main: '#ED6C02',
      },
      info: {
        main: '#0288D1',
      },
      success: {
        main: '#128654',
      },
      background: {
        default: modo === 'dark' ? '#0F1720' : '#F9F9F9',
        paper: modo === 'dark' ? '#16212B' : '#FFFFFF',
      },
      text: {
        primary: modo === 'dark' ? '#F7FAFC' : '#15181E',
        secondary: modo === 'dark' ? '#C7D0DA' : '#666666',
        disabled: modo === 'dark' ? '#8391A1' : '#9E9E9E',
      },
      divider: modo === 'dark' ? 'rgba(199,208,218,0.16)' : '#E0E0E0',
    },


    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      button: {
        fontWeight: 700,
        textTransform: 'none',
      },
    },


    shape: {
      borderRadius: 15,
    },


    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
            backgroundColor: modo === 'dark' ? '#0F1720' : '#F9F9F9',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
          '#root': {
            minHeight: '100vh',
            backgroundColor: modo === 'dark' ? '#0F1720' : '#F9F9F9',
          },
        },
      },


      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: modo === 'dark' ? '#16212B' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },


      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: modo === 'dark' ? '#16212B' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            border: `1px solid ${modo === 'dark' ? '#2C2C2C' : '#F0F0F0'}`,
            boxShadow:
              modo === 'dark'
                ? '0px 4px 20px rgba(0,0,0,0.32)'
                : '0px 4px 20px rgba(0,0,0,0.05)',
          },
        },
      },


      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: 'none',
          },
        },
      },


      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: modo === 'dark' ? 'transparent' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            '&:hover': {
              backgroundColor: modo === 'dark' ? 'transparent' : '#FFFFFF',
            },
            '&.Mui-focused': {
              backgroundColor: modo === 'dark' ? 'transparent' : '#FFFFFF',
            },
            '& fieldset': {
              borderColor: modo === 'dark' ? 'rgba(199,208,218,0.34)' : '#DDDDDD',
            },
            '&:hover fieldset': {
              borderColor: '#128654',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#128654',
            },
          },
          input: {
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
            backgroundColor: 'transparent',
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${modo === 'dark' ? '#16212B' : '#FFFFFF'} inset`,
              WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              caretColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              borderRadius: 12,
            },
          },
        },
      },


      MuiFilledInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: modo === 'dark' ? 'transparent' : '#F5F5F5',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            '&:hover': {
              backgroundColor: modo === 'dark' ? 'transparent' : '#F5F5F5',
            },
            '&.Mui-focused': {
              backgroundColor: modo === 'dark' ? 'transparent' : '#F5F5F5',
            },
            '&:before': {
              borderBottom: `1px solid ${modo === 'dark' ? 'rgba(199,208,218,0.28)' : '#CCCCCC'}`,
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '1px solid #128654',
            },
            '&:after': {
              borderBottom: '2px solid #128654',
            },
          },
          input: {
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
            backgroundColor: 'transparent',
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${modo === 'dark' ? '#16212B' : '#F5F5F5'} inset`,
              WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              caretColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              borderRadius: 12,
            },
          },
        },
      },


      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            '&.Mui-focused': {
              backgroundColor: 'transparent',
            },
          },
          input: {
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
            caretColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
            backgroundColor: 'transparent',
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${modo === 'dark' ? '#16212B' : '#FFFFFF'} inset`,
              WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              caretColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
              transition: 'background-color 9999s ease-out 0s',
            },
          },
        },
      },


      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: modo === 'dark' ? '#C7D0DA' : '#666666',
            '&.Mui-focused': {
              color: '#128654',
            },
            '&.Mui-error': {
              color: '#D32F2F',
            },
          },
        },
      },


      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: modo === 'dark' ? '#C7D0DA' : '#666666',
            '&.Mui-error': {
              color: '#FF8A80',
            },
          },
        },
      },


      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${modo === 'dark' ? 'rgba(199,208,218,0.14)' : '#F0F0F0'}`,
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },


      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: modo === 'dark' ? '#16212B' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },


      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },






      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: modo === 'dark' ? '#16212B' : '#FFFFFF',
            color: modo === 'dark' ? '#F7FAFC' : '#15181E',
          },
        },
      },


      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: modo === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8',
          },
        },
      },


      MuiSelect: {
        styleOverrides: {
          icon: {
            color: modo === 'dark' ? '#C7D0DA' : '#666666',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
    },
  });




const ThemeModeContext = createContext(null);


export function ThemeModeProvider({ children }) {
  const [modo, setModo] = useState(() => localStorage.getItem('nupreco-theme-mode') || 'dark');


  const tema = useMemo(() => obterTemaNupreco(modo), [modo]);


  const alternarTema = () => {
    setModo((modoAtual) => {
      const novoModo = modoAtual === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nupreco-theme-mode', novoModo);
      return novoModo;
    });
  };


  const value = useMemo(
    () => ({
      modo,
      isDarkMode: modo === 'dark',
      alternarTema,
      alternarModo: alternarTema,
    }),
    [modo]
  );


  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}


export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode deve ser usado dentro de ThemeModeProvider');
  }
  return context;
}




export default obterTemaNupreco('light');


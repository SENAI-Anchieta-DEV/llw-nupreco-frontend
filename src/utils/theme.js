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
        default: modo === 'dark' ? '#121212' : '#F9F9F9',
        paper: modo === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: modo === 'dark' ? '#FFFFFF' : '#15181E',
        secondary: modo === 'dark' ? '#D1D5DB' : '#666666',
      },
      divider: modo === 'dark' ? '#3A3A3A' : '#E0E0E0',
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
            backgroundColor: modo === 'dark' ? '#121212' : '#F9F9F9',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
          '#root': {
            minHeight: '100vh',
            backgroundColor: modo === 'dark' ? '#121212' : '#F9F9F9',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: modo === 'dark' ? '#1E1E1E' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: modo === 'dark' ? '#1E1E1E' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            border: `1px solid ${modo === 'dark' ? '#2C2C2C' : '#F0F0F0'}`,
            boxShadow:
              modo === 'dark'
                ? '0px 4px 20px rgba(0,0,0,0.40)'
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
            backgroundColor: modo === 'dark' ? '#252525' : '#FFFFFF',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            '& fieldset': {
              borderColor: modo === 'dark' ? '#555555' : '#DDDDDD',
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
          },
        },
      },

      MuiFilledInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: modo === 'dark' ? '#252525' : '#F5F5F5',
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            '&:before': {
              borderBottom: `1px solid ${modo === 'dark' ? '#555555' : '#CCCCCC'}`,
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
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          input: {
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
            WebkitTextFillColor: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: modo === 'dark' ? '#D1D5DB' : '#666666',
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
            color: modo === 'dark' ? '#D1D5DB' : '#666666',
            '&.Mui-error': {
              color: '#FF8A80',
            },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${modo === 'dark' ? '#2C2C2C' : '#F0F0F0'}`,
            color: modo === 'dark' ? '#FFFFFF' : '#15181E',
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: modo === 'dark' ? '#1E1E1E' : '#FFFFFF',
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

      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
    },
  });

export default obterTemaNupreco('light');
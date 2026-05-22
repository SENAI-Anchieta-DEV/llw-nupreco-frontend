import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useThemeMode } from '../utils/theme';


const ThemeToggleButton = ({ variant = 'public' }) => {
  const { modo, alternarModo } = useThemeMode();


  const titulo = modo === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro';
  const isSidebar = variant === 'sidebar';


  return (
    <Tooltip title={titulo} placement={isSidebar ? 'right' : 'bottom'}>
      <IconButton
        onClick={alternarModo}
        aria-label={titulo}
        sx={
          isSidebar
            ? {
                width: 44,
                height: 44,
                mb: 4,
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.55)',
                bgcolor: 'rgba(255,255,255,0.10)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.20)',
                },
              }
            : {
                position: 'fixed',
                top: { xs: 8, sm: 12 },
                right: { xs: 14, sm: 24 },
                zIndex: 3000,
                width: 44,
                height: 44,
                color: '#128654',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 22px rgba(0,0,0,0.38)'
                    : '0 8px 22px rgba(0,0,0,0.10)',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(18,134,84,0.16)'
                      : 'rgba(18,134,84,0.08)',
                },
              }
        }
      >
        {modo === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};


export default ThemeToggleButton;




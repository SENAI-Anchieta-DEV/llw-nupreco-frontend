import React from 'react';
import { Box, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const Inicio = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', fontWeight: 'bold' }}
      >
        PAINEL / INÍCIO
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: '#128654',
          fontWeight: 'bold'
        }}
      >
        Bem-vinda ao NuPreço
      </Typography>

      <Typography variant="body1">
        Olá, <strong>{user?.nome || 'Usuária'}</strong> 👋
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Aqui você pode gerenciar seu estoque, vendas, contas e produtos de forma rápida e eficiente.
      </Typography>
    </Box>
  );
};

export default Inicio;
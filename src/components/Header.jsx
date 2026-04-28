import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#128654', fontWeight: 'bold' }}>
            NuPreço
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sistema de gestão
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user?.nome || 'Usuário'}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ textTransform: 'none', borderColor: '#128654', color: '#128654' }}
          >
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

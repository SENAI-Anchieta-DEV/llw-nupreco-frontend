import React from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarMenu from '../../components/SidebarMenu';

const PrivateLayout = () => {
  const location = useLocation();
  const isInicio = location.pathname === '/inicio';

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {!isInicio && <SidebarMenu />}

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PrivateLayout;

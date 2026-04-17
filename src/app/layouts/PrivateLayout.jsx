import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../../components/SidebarMenu';
import Header from '../../components/Header';

const PrivateLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <SidebarMenu />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PrivateLayout;
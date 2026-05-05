import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';

import SidebarMenu from '../../components/SidebarMenu';

const PrivateLayout = () => {

  return (
<Box

      sx={{

        display: 'flex',

        minHeight: '100vh',

        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <SidebarMenu />

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

import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
 
const PrivateLayout = () => {

  return (
<Box

      sx={{

        display: 'flex',

        minHeight: '100vh',

        bgcolor: 'background.default',

      }}
>
<Box

        sx={{

          flex: 1,

          display: 'flex',

          flexDirection: 'column',

          minWidth: 0,

        }}
>
<Box

          component="main"

          sx={{

            flex: 1,

            overflow: 'hidden',

          }}
>
<Outlet />
</Box>
</Box>
</Box>

  );

};
 
export default PrivateLayout;
 
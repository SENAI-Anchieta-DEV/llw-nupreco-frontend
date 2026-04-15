import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const SidebarMenu = ({ modulos = [] }) => {
  const [aberto, setAberto] = useState(false);

  const toggleMenu = () => {
    setAberto((prev) => !prev);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={aberto}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: '#128654',
            color: 'white',
            pt: 2
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{ p: 3, fontWeight: 'bold', textAlign: 'center' }}
        >
          NuPreço
        </Typography>

        <List>
          {modulos.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => {
                item.action?.();
                toggleMenu();
              }}
              sx={{ py: 2 }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 50 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          width: { xs: 70, lg: 85 },
          bgcolor: '#128654',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          height: '100vh',
          zIndex: 1200,
          borderTopRightRadius: '15px',
          borderBottomRightRadius: '15px'
        }}
      >
        <IconButton onClick={toggleMenu} sx={{ color: 'white' }}>
          <MenuIcon sx={{ fontSize: { xs: '2.5rem', lg: '2.8rem' } }} />
        </IconButton>
      </Box>
    </>
  );
};

export default SidebarMenu;
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';

import useAuth from '../hooks/useAuth';

const SidebarMenu = ({ modulos }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [aberto, setAberto] = useState(false);

  const toggleMenu = () => {
    setAberto((prev) => !prev);
  };

  const navegar = (rota) => {
    if (rota) {
      navigate(rota);
    }
    setAberto(false);
  };

  const sair = () => {
    logout();
    setAberto(false);
    navigate('/entrar');
  };

  const modulosPadrao = [
    { text: 'Início', icon: <HomeIcon />, rota: '/inicio' },
    { text: 'Usuário', icon: <PersonIcon />, rota: '/usuarios' },
    { text: 'Vendas', icon: <AssessmentIcon />, rota: '/vendas' },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, rota: '/pdv' },
    { text: 'Contas', icon: <ReportProblemIcon />, rota: '/contas' },
    { text: 'Estoque', icon: <InventoryIcon />, rota: '/estoque' },
    { text: 'Produtos', icon: <CategoryIcon />, rota: '/produtos' },
    { text: 'Sair', icon: <LogoutIcon />, action: sair },
  ];

  const itensMenu = Array.isArray(modulos) && modulos.length > 0 ? modulos : modulosPadrao;

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
            pt: 2,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ p: 3, fontWeight: 'bold', textAlign: 'center' }}
        >
          NuPreço
        </Typography>

        <List>
          {itensMenu.map((item) => {
            const ativo = item.rota && location.pathname === item.rota;

            return (
              <ListItemButton
                key={item.text}
                onClick={() => {
                  if (item.action) {
                    item.action();
                    setAberto(false);
                    return;
                  }

                  navegar(item.rota);
                }}
                sx={{
                  py: 2,
                  bgcolor: ativo ? 'rgba(255,255,255,0.16)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 50 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItemButton>
            );
          })}
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
          minHeight: '100vh',
          height: '100vh',
          zIndex: 1200,
          borderTopRightRadius: '15px',
          borderBottomRightRadius: '15px',
          flexShrink: 0,
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

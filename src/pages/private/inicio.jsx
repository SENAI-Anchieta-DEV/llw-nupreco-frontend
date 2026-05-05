import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Stack,
  Badge,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import contaService from '../../services/contaService';

const Inicio = ({ perfilUsuario }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [listaContasDoDia, setListaContasDoDia] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarContasDoDia = async () => {
      try {
        const contas = await contaService.listar();
        const hoje = new Date().toISOString().slice(0, 10);
        const contasHoje = contas.filter(
          (conta) => conta.dataVencimento === hoje && conta.status !== 'PAGA'
        );
        setListaContasDoDia(contasHoje);
      } catch (error) {
        setErro('Não foi possível carregar as notificações de contas.');
      }
    };

    carregarContasDoDia();
  }, []);

  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const sair = () => {
    logout();
    navigate('/entrar');
  };

  const modulos = [
    { text: 'Usuário', icon: <PersonIcon />, action: () => navigate('/usuarios') },
    { text: 'Vendas', icon: <AssessmentIcon />, action: () => navigate('/vendas') },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: () => navigate('/pdv') },
    { text: 'Contas', icon: <ReportProblemIcon />, action: () => navigate('/contas') },
    { text: 'Estoque', icon: <InventoryIcon />, action: () => navigate('/estoque') },
    { text: 'Produtos', icon: <CategoryIcon />, action: () => navigate('/produtos') },
    { text: 'Sair', icon: <LogoutIcon />, action: sair },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#F9F9F9',
        minHeight: '100%',
        width: '100%',
        px: { xs: 3, lg: 8 },
        py: { xs: 2, lg: 4 },
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
        <Box sx={{ width: 48, display: { xs: 'none', lg: 'block' } }} />

        <Box
          sx={{
            px: { xs: 5, lg: 12 },
            py: 2,
            borderRadius: '25px',
            bgcolor: 'white',
            boxShadow: '0px 4px 15px rgba(0,0,0,0.05)',
            border: '1px solid #EEE',
          }}
        >
          <Typography sx={{ color: '#128654', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' }}>
            {user?.role || perfilUsuario || 'USUÁRIO'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} alignItems="center">
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>
            NuPreço
          </Typography>

          <IconButton onClick={handleOpenNotif} sx={{ color: listaContasDoDia.length > 0 ? '#d32f2f' : '#128654' }}>
            <Badge badgeContent={listaContasDoDia.length} color="error">
              <NotificationsNoneIcon sx={{ fontSize: '2.5rem' }} />
            </Badge>
          </IconButton>
        </Stack>

        <Menu
          anchorEl={anchorElNotif}
          open={Boolean(anchorElNotif)}
          onClose={handleCloseNotif}
          PaperProps={{ sx: { width: 320, borderRadius: '15px', mt: 1.5 } }}
        >
          <Typography sx={{ p: 2, fontWeight: 'bold', color: '#d32f2f', borderBottom: '1px solid #F0F0F0' }}>
            Atenção: Contas Do Dia
          </Typography>

          {listaContasDoDia.length > 0 ? (
            listaContasDoDia.map((conta) => (
              <MenuItem key={conta.id} onClick={handleCloseNotif} sx={{ py: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {conta.nome}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#d32f2f' }}>
                    R$ {Number(conta.valor).toFixed(2)} • Vence Hoje
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleCloseNotif}>Nenhuma pendência hoje</MenuItem>
          )}
        </Menu>
      </Box>

      {erro && <Alert severity="warning" sx={{ mb: 3 }}>{erro}</Alert>}

      <Box
        sx={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 6,
        }}
      >
        {modulos.map((item, index) => (
          <Card
            key={index}
            onClick={item.action}
            sx={{
              aspectRatio: '1.2 / 1',
              borderRadius: '25px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: 'white',
              border: '1px solid #F0F0F0',
              transition: '0.2s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 15px 40px rgba(0,0,0,0.06)',
                bgcolor: item.text === 'Sair' ? '#fff5f5' : 'white',
              },
            }}
          >
            <Typography sx={{ color: item.text === 'Sair' ? '#d32f2f' : '#128654', fontWeight: 'bold', mb: 1 }}>
              {item.text.toUpperCase()}
            </Typography>

            <Box sx={{ color: item.text === 'Sair' ? '#d32f2f' : '#128654', '& svg': { fontSize: '85px' } }}>
              {item.icon}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Inicio;

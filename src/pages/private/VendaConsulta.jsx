import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Stack,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindowsOutlined';

import SidebarMenu from '../../components/SidebarMenu';

const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const VendaConsulta = ({ onBack, onLogout, historicoVendas = [], aoIrUsuarios, aoIrProdutos, aoIrPdv, aoIrContas, aoIrEstoque }) => {
  const theme = useTheme();

  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: onBack },
    { text: 'Usuário', icon: <PersonIcon />, action: aoIrUsuarios },
    { text: 'Vendas', icon: <AssessmentIcon /> },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: aoIrPdv },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoIrContas },
    { text: 'Estoque', icon: <InventoryIcon />, action: aoIrEstoque },
    { text: 'Produtos', icon: <CategoryIcon />, action: aoIrProdutos },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout }
  ];

  const vendas = useMemo(() => {
    return historicoVendas.map((venda, index) => ({
      id: venda.id || `VENDA-${index + 1}`,
      data: venda.data || '-',
      vendedor: venda.vendedor || 'SISTEMA',
      qtd: Array.isArray(venda.itens) ? venda.itens.reduce((acc, item) => acc + Number(item.qtd || 0), 0) : Number(venda.qtd || 0),
      total: Number(venda.total || 0),
      status: venda.status || 'CONCLUIDA'
    }));
  }, [historicoVendas]);

  const totalVendido = vendas.filter((v) => v.status === 'CONCLUIDA').reduce((acc, v) => acc + Number(v.total || 0), 0);
  const vendasConcluidas = vendas.filter((v) => v.status === 'CONCLUIDA').length;
  const taxaConclusao = vendas.length > 0 ? Math.round((vendasConcluidas / vendas.length) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, px: { xs: 3, lg: 6 }, py: { xs: 2, lg: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              HISTÓRICO / VENDAS
            </Typography>
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>
              VENDAS
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#E8F5E9', color: '#128654', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">VALOR TOTAL VENDIDO</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#128654' }}>
                {formatarMoeda(totalVendido)}
              </Typography>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#F1F8F5', color: '#128654', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AssessmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">TAXA DE CONCLUSÃO</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {taxaConclusao}%
              </Typography>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F5F5F5', color: 'text.secondary', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DesktopWindowsIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">REGISTROS EM TELA</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {vendas.length}
              </Typography>
            </Box>
          </Card>
        </Box>

        <Card sx={{ flexGrow: 1, borderRadius: '25px', p: 2, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ maxHeight: '52vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['ID', 'DATA', 'VENDEDOR', 'QUANTIDADE', 'VALOR TOTAL', 'STATUS'].map((head) => (
                    <TableCell key={head} sx={{ color: 'text.secondary', fontWeight: 'bold', bgcolor: 'background.paper' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {vendas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                      Nenhuma venda registrada até o momento.
                    </TableCell>
                  </TableRow>
                ) : (
                  vendas.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>{row.id}</TableCell>
                      <TableCell>{row.data}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{row.vendedor}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row.qtd}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{formatarMoeda(row.total)}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          sx={{
                            bgcolor: row.status === 'CONCLUIDA' ? '#C8E6C9' : '#FFCDD2',
                            color: row.status === 'CONCLUIDA' ? '#2E7D32' : '#C62828',
                            fontWeight: 'bold',
                            borderRadius: '8px'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Pagination count={1} shape="rounded" color="primary" size="small" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default VendaConsulta;
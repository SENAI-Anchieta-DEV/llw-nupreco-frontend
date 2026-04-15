import React from 'react';
import {
  Box,
  Typography,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
  Button,
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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import SidebarMenu from './components/SidebarMenu';

const Estoque = ({
  produtos = [],
  onBack,
  onLogout,
  aoAtualizarQtd,
  aoNotificar,
  aoIrVendas,
  aoIrUsuarios,
  aoIrProdutos,
  aoIrPdv,
  aoIrContas
}) => {
  const theme = useTheme();

  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: onBack },
    { text: 'Usuário', icon: <PersonIcon />, action: aoIrUsuarios },
    { text: 'Vendas', icon: <AssessmentIcon />, action: aoIrVendas },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: aoIrPdv },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoIrContas },
    { text: 'Estoque', icon: <InventoryIcon /> },
    { text: 'Produtos', icon: <CategoryIcon />, action: aoIrProdutos },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout }
  ];

  const ajustarEstoque = (codigo, novaQtd) => {
    if (novaQtd < 0) {
      aoNotificar?.('A quantidade não pode ser menor que zero!', 'warning');
      return;
    }
    aoAtualizarQtd?.(codigo, novaQtd);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <InventoryIcon sx={{ color: '#128654', fontSize: '2.8rem' }} />
          <Box>
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold', lineHeight: 1 }}>
              ESTOQUE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              GERENCIAMENTO DE INVENTÁRIO NUPREÇO
            </Typography>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '25px',
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 10px 40px rgba(0,0,0,0.35)'
              : '0px 10px 40px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            maxHeight: '72vh'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['CÓDIGO', 'DESCRIÇÃO DO PRODUTO', 'CATEGORIA', 'QUANTIDADE', 'PREÇO VENDA', 'STATUS'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      bgcolor: 'background.paper',
                      color: head === 'PREÇO VENDA' ? '#128654' : 'text.primary',
                      fontWeight: 'bold'
                    }}
                    align={head === 'QUANTIDADE' || head === 'STATUS' ? 'center' : head === 'PREÇO VENDA' ? 'right' : 'left'}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10, color: 'text.secondary', fontStyle: 'italic' }}>
                    Nenhum produto cadastrado no estoque.
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((prod, index) => {
                  const estoqueBaixo = Number(prod.qtd) <= 5;

                  return (
                    <TableRow key={index} hover sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#232323' : '#F1F8F5' } }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#128654' }}>
                        {prod.cod}
                      </TableCell>

                      <TableCell sx={{ color: 'text.primary', textTransform: 'uppercase', fontWeight: 500 }}>
                        {prod.desc}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={prod.categoria || 'GERAL'}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            bgcolor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#EEE',
                            color: 'text.primary'
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                          <Button
                            size="small"
                            onClick={() => ajustarEstoque(prod.cod, Number(prod.qtd) - 1)}
                            sx={{ minWidth: 'auto', color: '#D32F2F' }}
                          >
                            <RemoveCircleOutlineIcon />
                          </Button>

                          <Box
                            sx={{
                              minWidth: '40px',
                              py: 0.5,
                              borderRadius: '10px',
                              bgcolor: estoqueBaixo
                                ? (theme.palette.mode === 'dark' ? '#3A1F1F' : '#FFEBEE')
                                : (theme.palette.mode === 'dark' ? '#1B2A22' : '#F0F7F4'),
                              border: `1px solid ${estoqueBaixo ? '#D32F2F' : '#128654'}`
                            }}
                          >
                            <Typography sx={{ color: estoqueBaixo ? '#FF8A80' : '#128654', fontWeight: 'bold', textAlign: 'center' }}>
                              {prod.qtd}
                            </Typography>
                          </Box>

                          <Button
                            size="small"
                            onClick={() => ajustarEstoque(prod.cod, Number(prod.qtd) + 1)}
                            sx={{ minWidth: 'auto', color: '#128654' }}
                          >
                            <AddCircleOutlineIcon />
                          </Button>
                        </Stack>
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        R$ {Number(prod.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>

                      <TableCell align="center">
                        {estoqueBaixo ? (
                          <Chip
                            icon={<WarningAmberIcon style={{ color: '#D32F2F', fontSize: '1rem' }} />}
                            label="REPOR"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? '#3A1F1F' : '#FFEBEE',
                              color: '#D32F2F',
                              fontWeight: 'bold',
                              border: '1px solid #D32F2F'
                            }}
                          />
                        ) : (
                          <Chip
                            label="OK"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? '#1B2A22' : '#E8F5E9',
                              color: '#128654',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, px: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            NUPREÇO SISTEMAS v1.0
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            TOTAL DE PRODUTOS: {produtos.length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Estoque;
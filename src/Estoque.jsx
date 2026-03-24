import React from 'react';
import { 
  Box, Typography, IconButton, CssBaseline, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Chip 
} from '@mui/material';

// Ícones
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import InventoryIcon from '@mui/icons-material/AllInbox';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Estoque = ({ produtos, onBack, onLogout, aoAtualizarQtd, aoNotificar }) => {
  const sidebarIconStyle = { color: 'white', fontSize: '2.2rem' };

  // Função para lidar com o ajuste de estoque com feedback
  const ajustarEstoque = (codigo, novaQtd, nome) => {
    if (novaQtd < 0) {
      aoNotificar("A quantidade não pode ser menor que zero!", "warning");
      return;
    }
    aoAtualizarQtd(codigo, novaQtd);
    // Opcional: Notificação silenciosa ou apenas atualização visual
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* SIDEBAR PADRONIZADA */}
      <Box sx={{ 
        width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', py: 3, height: '100vh', zIndex: 1200,
        borderTopRightRadius: '15px', borderBottomRightRadius: '15px'
      }}>
        <IconButton onClick={onBack} sx={{ mb: 4 }}>
          <HomeIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ mb: 2 }}>
          <LogoutIcon sx={sidebarIconStyle} />
        </IconButton>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box sx={{ flexGrow: 1, ml: '10px', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <InventoryIcon sx={{ color: '#128654', fontSize: '2.8rem' }} />
            <Box>
                <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold', lineHeight: 1 }}>
                  ESTOQUE
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontWeight: 'bold' }}>
                    GERENCIAMENTO DE INVENTÁRIO NUPREÇO
                </Typography>
            </Box>
        </Box>

        <TableContainer component={Paper} sx={{ 
          borderRadius: '25px', 
          boxShadow: '0px 10px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          border: '1px solid #F0F0F0',
          maxHeight: '72vh'
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>CÓDIGO</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>DESCRIÇÃO DO PRODUTO</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>CATEGORIA</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="center">QUANTIDADE</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="right">PREÇO VENDA</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="center">STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10, color: '#AAA', fontStyle: 'italic' }}>
                    Nenhum produto cadastrado no estoque.
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((prod, index) => {
                  const estoqueBaixo = prod.qtd <= 5;
                  return (
                    <TableRow key={index} hover sx={{ '&:hover': { bgcolor: '#F1F8F5' } }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#128654' }}>{prod.cod}</TableCell>
                      <TableCell sx={{ color: '#333', textTransform: 'uppercase', fontWeight: 500 }}>{prod.desc}</TableCell>
                      <TableCell>
                        <Chip label={prod.categoria || "GERAL"} size="small" sx={{ fontSize: '0.7rem', fontWeight: 'bold', bgcolor: '#EEE' }} />
                      </TableCell>
                      
                      {/* AJUSTE DE QUANTIDADE */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                          <IconButton 
                            size="small" 
                            onClick={() => ajustarEstoque(prod.cod, Number(prod.qtd) - 1, prod.desc)}
                            sx={{ color: '#D32F2F' }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                          
                          <Box sx={{ 
                            minWidth: '40px', 
                            py: 0.5, 
                            borderRadius: '10px', 
                            bgcolor: estoqueBaixo ? '#FFEBEE' : '#F0F7F4',
                            border: `1px solid ${estoqueBaixo ? '#FFCDD2' : '#C8E6C9'}`
                          }}>
                            <Typography sx={{ color: estoqueBaixo ? '#D32F2F' : '#128654', fontWeight: 'bold', textAlign: 'center' }}>
                              {prod.qtd}
                            </Typography>
                          </Box>

                          <IconButton 
                            size="small" 
                            onClick={() => ajustarEstoque(prod.cod, Number(prod.qtd) + 1, prod.desc)}
                            sx={{ color: '#128654' }}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#333' }}>
                        R$ {Number(prod.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>

                      <TableCell align="center">
                        {estoqueBaixo ? (
                          <Chip 
                            icon={<WarningAmberIcon style={{ color: '#D32F2F', fontSize: '1rem' }} />}
                            label="REPOR" 
                            size="small" 
                            sx={{ bgcolor: '#FFEBEE', color: '#D32F2F', fontWeight: 'bold', border: '1px solid #D32F2F' }} 
                          />
                        ) : (
                          <Chip 
                            label="OK" 
                            size="small" 
                            sx={{ bgcolor: '#E8F5E9', color: '#128654', fontWeight: 'bold' }} 
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
            <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 'bold' }}>
              NUPREÇO SISTEMAS v1.0
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold' }}>
              TOTAL DE PRODUTOS: {produtos.length}
            </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Estoque;
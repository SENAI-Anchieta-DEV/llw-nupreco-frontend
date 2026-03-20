import React from 'react';
import { 
  Box, Typography, IconButton, CssBaseline, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Stack 
} from '@mui/material';

// Ícones
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import InventoryIcon from '@mui/icons-material/AllInbox';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleOutline';

const Estoque = ({ produtos, onBack, onLogout, aoAtualizarQtd }) => {
  const sidebarIconStyle = { color: 'white', fontSize: '2.2rem' };

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
      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <InventoryIcon sx={{ color: '#128654', fontSize: '2.8rem' }} />
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold', letterSpacing: 1 }}>
              ESTOQUE
            </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ 
          borderRadius: '25px', 
          boxShadow: '0px 10px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          border: '1px solid #F0F0F0',
          maxHeight: '75vh'
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>CÓDIGO</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>DESCRIÇÃO DO PRODUTO</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }}>CATEGORIA</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="center">AJUSTAR ESTOQUE</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="right">PREÇO VENDA</TableCell>
                <TableCell sx={{ bgcolor: '#128654', color: 'white', fontWeight: 'bold' }} align="right">MARGEM</TableCell>
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
                produtos.map((prod, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 'bold', color: '#128654' }}>{prod.cod}</TableCell>
                    <TableCell sx={{ color: '#555', textTransform: 'uppercase' }}>{prod.desc}</TableCell>
                    <TableCell sx={{ color: '#888' }}>{prod.categoria || "OUTROS"}</TableCell>
                    
                    {/* CÉLULA DE QUANTIDADE COM BOTÕES DE ALTERAÇÃO */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        <IconButton 
                          size="small" 
                          onClick={() => aoAtualizarQtd(prod.cod, Number(prod.qtd) - 1)}
                          sx={{ color: '#D32F2F' }}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                        
                        <Typography sx={{ color: '#128654', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                          {prod.qtd}
                        </Typography>

                        <IconButton 
                          size="small" 
                          onClick={() => aoAtualizarQtd(prod.cod, Number(prod.qtd) + 1)}
                          sx={{ color: '#128654' }}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>

                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      R$ {prod.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#128654', fontWeight: 'bold' }}>
                      {prod.margem}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ color: '#BBB', textAlign: 'right', pr: 2 }}>
          Total de itens cadastrados: {produtos.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default Estoque;
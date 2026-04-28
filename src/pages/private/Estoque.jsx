import React from 'react';
import {
  Box,
  Typography,
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

import InventoryIcon from '@mui/icons-material/AllInbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const Estoque = ({
  produtos = [],
  aoAtualizarQtd,
  aoNotificar
}) => {
  const theme = useTheme();

  const ajustarEstoque = (codigo, novaQtd) => {
    if (novaQtd < 0) {
      aoNotificar?.('A quantidade não pode ser menor que zero!', 'warning');
      return;
    }
    aoAtualizarQtd?.(codigo, novaQtd);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InventoryIcon sx={{ color: '#128654', fontSize: '2.8rem' }} />

        <Box>
          <Typography
            variant="h4"
            sx={{ color: '#128654', fontWeight: 'bold' }}
          >
            ESTOQUE
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold' }}
          >
            GERENCIAMENTO DE INVENTÁRIO NUPREÇO
          </Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '25px',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 10px 40px rgba(0,0,0,0.35)'
              : '0px 10px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          maxHeight: '70vh'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['CÓDIGO', 'PRODUTO', 'CATEGORIA', 'QTD', 'PREÇO', 'STATUS'].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    bgcolor: 'background.paper',
                    fontWeight: 'bold'
                  }}
                  align={head === 'QTD' || head === 'STATUS' ? 'center' : 'left'}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum produto no estoque.
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((prod, index) => {
                const estoqueBaixo = Number(prod.qtd) <= 5;

                return (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#128654' }}>
                      {prod.cod}
                    </TableCell>

                    <TableCell>{prod.desc}</TableCell>

                    <TableCell>
                      <Chip label={prod.categoria || 'GERAL'} size="small" />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          onClick={() => ajustarEstoque(prod.cod, prod.qtd - 1)}
                        >
                          <RemoveCircleOutlineIcon />
                        </Button>

                        <Typography sx={{ fontWeight: 'bold' }}>
                          {prod.qtd}
                        </Typography>

                        <Button
                          size="small"
                          onClick={() => ajustarEstoque(prod.cod, prod.qtd + 1)}
                        >
                          <AddCircleOutlineIcon />
                        </Button>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      R$ {Number(prod.preco).toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      {estoqueBaixo ? (
                        <Chip
                          icon={<WarningAmberIcon />}
                          label="REPOR"
                          color="error"
                        />
                      ) : (
                        <Chip label="OK" color="success" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        TOTAL DE PRODUTOS: {produtos.length}
      </Typography>
    </Box>
  );
};

export default Estoque;
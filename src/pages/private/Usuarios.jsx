import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

import usuarioService from '../../services/usuarioService';
import { getApiErrorMessage } from '../../services/apiResponse';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });

  const carregarUsuarios = async () => {
    setCarregando(true);
    setErro('');

    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar os usuários.'));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const alterarCampo = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cadastrarFuncionario = async () => {
    setErro('');
    setSucesso('');

    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }

    setSalvando(true);

    try {
      await usuarioService.cadastrarFuncionario(form);
      setForm({ nome: '', email: '', senha: '' });
      setSucesso('Funcionário cadastrado com sucesso.');
      await carregarUsuarios();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível cadastrar o funcionário.'));
    } finally {
      setSalvando(false);
    }
  };

  const excluirUsuario = async (usuario) => {
    setErro('');
    setSucesso('');

    if (usuario.role === 'GESTOR') {
      setErro('O Gestor não pode ser excluído pelo sistema.');
      return;
    }

    try {
      await usuarioService.excluir(usuario.id);
      setSucesso('Usuário excluído com sucesso.');
      await carregarUsuarios();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir o usuário.'));
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            CADASTRO / USUÁRIOS
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Usuários
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarUsuarios}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar
        </Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PersonAddAltIcon sx={{ color: '#128654' }} />
              <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                Cadastrar Funcionário
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={alterarCampo} fullWidth />
              <TextField label="E-mail" name="email" value={form.email} onChange={alterarCampo} fullWidth />
              <TextField label="Senha" name="senha" type="password" value={form.senha} onChange={alterarCampo} fullWidth />

              <Button
                variant="contained"
                disabled={salvando}
                onClick={cadastrarFuncionario}
                sx={{ bgcolor: '#128654', py: 1.4, fontWeight: 700, textTransform: 'none', borderRadius: '10px' }}
              >
                {salvando ? 'Salvando...' : 'Cadastrar Funcionário'}
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Usuários Cadastrados
            </Typography>

            {carregando ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#128654' }} />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: '1px solid #EEE' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F6FBF8' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>E-mail</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Perfil</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Nenhum usuário encontrado.</TableCell>
                      </TableRow>
                    ) : (
                      usuarios.map((usuario) => (
                        <TableRow key={usuario.id} hover>
                          <TableCell>{usuario.nome}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={usuario.role}
                              size="small"
                              sx={{ bgcolor: usuario.role === 'GESTOR' ? '#E8F5E9' : '#E3F2FD', fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell>{usuario.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              disabled={usuario.role === 'GESTOR'}
                              onClick={() => excluirUsuario(usuario)}
                              sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                              Excluir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Usuarios;

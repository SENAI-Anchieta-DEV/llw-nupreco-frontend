import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  useTheme,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/SaveOutlined';


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
import usuarioService from '../../services/usuarioService';
import { getApiErrorMessage } from '../../services/apiResponse';


<<<<<<< HEAD


const initialForm = { nome: '', email: '', senha: '' };
const SENHA_MINIMA_MENSAGEM = 'A senha deve conter no mínimo 6 caracteres.';


=======
const initialForm = { nome: '', email: '', senha: '' };
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65


const formatarPerfil = (role) => {
  if (role === 'GESTOR') return 'Administrador';
  if (role === 'FUNCIONARIO') return 'Funcionário';
  return role || 'Usuário';
};


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
const Usuarios = () => {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [form, setForm] = useState(initialForm);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState(initialForm);


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const carregarUsuarios = async () => {
    setCarregando(true);
    setErro('');


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar os usuários.'));
    } finally {
      setCarregando(false);
    }
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  useEffect(() => {
    carregarUsuarios();
  }, []);


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const alterarCampo = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const alterarCampoEdicao = (event) => {
    const { name, value } = event.target;
    setFormEdicao((prev) => ({ ...prev, [name]: value }));
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const cadastrarFuncionario = async () => {
    setErro('');
    setSucesso('');


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    if (!form.nome || !form.email || !form.senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }


<<<<<<< HEAD
    if (form.senha.length < 6) {
      setErro(SENHA_MINIMA_MENSAGEM);
      return;
    }




    setSalvando(true);




=======
    setSalvando(true);


>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    try {
      await usuarioService.cadastrarFuncionario(form);
      setForm(initialForm);
      setSucesso('Funcionário cadastrado com sucesso.');
      await carregarUsuarios();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível cadastrar o funcionário.'));
    } finally {
      setSalvando(false);
    }
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const abrirEdicao = (usuario) => {
    setUsuarioEditando(usuario);
    setFormEdicao({
      nome: usuario.nome || '',
      email: usuario.email || '',
      senha: '',
    });
    setModalEdicaoAberto(true);
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const fecharEdicao = () => {
    setModalEdicaoAberto(false);
    setUsuarioEditando(null);
    setFormEdicao(initialForm);
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const salvarEdicao = async () => {
    setErro('');
    setSucesso('');


<<<<<<< HEAD


    if (!usuarioEditando?.id) return;




=======
    if (!usuarioEditando?.id) return;


>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    if (!formEdicao.nome || !formEdicao.email || !formEdicao.senha) {
      setErro('Para atualizar o usuário, preencha nome, e-mail e senha.');
      return;
    }


<<<<<<< HEAD
    if (formEdicao.senha.length < 6) {
      setErro(SENHA_MINIMA_MENSAGEM);
      return;
    }




    setSalvando(true);




=======
    setSalvando(true);


>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    try {
      await usuarioService.atualizar(usuarioEditando.id, formEdicao);
      fecharEdicao();
      setSucesso('Usuário atualizado com sucesso.');
      await carregarUsuarios();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível atualizar o usuário.'));
    } finally {
      setSalvando(false);
    }
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const excluirUsuario = async (usuario) => {
    setErro('');
    setSucesso('');


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    if (usuario.role === 'GESTOR') {
      setErro('O Gestor não pode ser excluído pelo sistema.');
      return;
    }


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    try {
      await usuarioService.excluir(usuario.id);
      setSucesso('Usuário excluído com sucesso.');
      await carregarUsuarios();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir o usuário.'));
    }
  };


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', p: { xs: 2, sm: 3, lg: 4 }, overflowX: 'hidden' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            CADASTRO / USUÁRIOS
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Usuários
          </Typography>
        </Box>


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarUsuarios}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700, alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Atualizar
        </Button>
      </Stack>


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: '25px', border: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PersonAddAltIcon sx={{ color: '#128654' }} />
              <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                Cadastrar Funcionário
              </Typography>
            </Stack>


<<<<<<< HEAD


            <Stack spacing={2}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={alterarCampo} fullWidth />
              <TextField label="E-mail" name="email" value={form.email} onChange={alterarCampo} fullWidth />
              <TextField
                label="Senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={alterarCampo}
                fullWidth
                error={Boolean(form.senha) && form.senha.length < 6}
                helperText={SENHA_MINIMA_MENSAGEM}
                FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600, mt: 0.75 } }}
              />


=======
            <Stack spacing={2}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={alterarCampo} fullWidth />
              <TextField label="E-mail" name="email" value={form.email} onChange={alterarCampo} fullWidth />
              <TextField label="Senha" name="senha" type="password" value={form.senha} onChange={alterarCampo} fullWidth />
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65


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


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: '25px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Usuários Cadastrados
            </Typography>


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
            {carregando ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#128654' }} />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: (theme) => `1px solid ${theme.palette.divider}`, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>
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
                          <TableCell sx={{ fontWeight: 700 }}>{usuario.nome}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={formatarPerfil(usuario.role)}
                              size="small"
                              sx={{ bgcolor: usuario.role === 'GESTOR' ? '#E8F5E9' : '#F6FBF8', color: '#128654', fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={usuario.ativo ? 'Ativo' : 'Inativo'}
                              size="small"
                              sx={{ bgcolor: usuario.ativo ? '#E8F5E9' : '#FFEBEE', color: usuario.ativo ? '#2E7D32' : '#C62828', fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => abrirEdicao(usuario)}
                              sx={{ color: '#128654', textTransform: 'none', fontWeight: 700 }}
                            >
                              Editar
                            </Button>
                            {usuario.role !== 'GESTOR' && (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => excluirUsuario(usuario)}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                              >
                                Excluir
                              </Button>
                            )}
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


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      <Dialog open={modalEdicaoAberto} onClose={fecharEdicao} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: '#128654', fontWeight: 800 }}>
          Editar Usuário
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" name="nome" value={formEdicao.nome} onChange={alterarCampoEdicao} fullWidth />
            <TextField label="E-mail" name="email" value={formEdicao.email} onChange={alterarCampoEdicao} fullWidth />
<<<<<<< HEAD
            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={formEdicao.senha}
              onChange={alterarCampoEdicao}
              fullWidth
              error={Boolean(formEdicao.senha) && formEdicao.senha.length < 6}
              helperText={SENHA_MINIMA_MENSAGEM}
              FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 600, mt: 0.75 } }}
            />
=======
            <TextField label="Senha" name="senha" type="password" value={formEdicao.senha} onChange={alterarCampoEdicao} fullWidth helperText="O backend exige senha no DTO de atualização." />
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={fecharEdicao} sx={{ color: '#128654', textTransform: 'none', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={salvando}
            onClick={salvarEdicao}
            sx={{ bgcolor: '#128654', textTransform: 'none', fontWeight: 700 }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


<<<<<<< HEAD


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
export default Usuarios;



<<<<<<< HEAD






=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SidebarMenu from './components/SidebarMenu';

const Usuarios = ({
  onBack,
  usuariosCadastrados = [],
  aoSalvarUsuario,
  aoExcluirUsuario,
  usuarioLogado,
  aoNotificar,
  onLogout,
  aoIrVendas,
  aoIrProdutos,
  aoIrPdv,
  aoIrContas,
  aoIrEstoque
}) => {
  const theme = useTheme();
  const [modo, setModo] = useState('LISTA');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [form, setForm] = useState({ id: '', nome: '', email: '', senha: '' });

  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: onBack },
    { text: 'Usuário', icon: <PersonIcon /> },
    { text: 'Vendas', icon: <AssessmentIcon />, action: aoIrVendas },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: aoIrPdv },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoIrContas },
    { text: 'Estoque', icon: <InventoryIcon />, action: aoIrEstoque },
    { text: 'Produtos', icon: <CategoryIcon />, action: aoIrProdutos },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout }
  ];

  const ehAdminPrincipal = (id) => id === "ADMIN_ROOT" || id === usuariosCadastrados[0]?.id;

  const abrirCadastro = (user = null) => {
    if (user) {
      setForm({ ...user, senha: '' });
      setModo('FORMULARIO');
    } else {
      setForm({
        id: `FUNC-${Math.floor(Date.now() / 1000)}`,
        nome: '',
        email: '',
        senha: ''
      });
      setModo('FORMULARIO');
    }
  };

  const salvar = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      aoNotificar("Nome e E-mail são obrigatórios!", "warning");
      return;
    }

    const ehNovo = !usuariosCadastrados.find((u) => u.id === form.id);
    if (ehNovo && (!form.senha || form.senha.length < 6)) {
      aoNotificar("Defina uma senha de no mínimo 6 caracteres para o novo funcionário!", "warning");
      return;
    }

    aoSalvarUsuario(form);
    setModo('LISTA');
  };

  const tentarExcluir = (u) => {
    if (ehAdminPrincipal(u.id)) {
      aoNotificar("O perfil de Gestor (ADMIN) é vitalício e não pode ser removido.", "error");
      return;
    }
    aoExcluirUsuario(u.id);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={modo === 'LISTA' ? onBack : () => setModo('LISTA')} sx={{ color: '#128654' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ color: '#128654', fontWeight: 'bold' }}>
            {modo === 'CONSULTA' ? `RESUMO: ${usuarioSelecionado?.nome}` : 'GERENCIAR EQUIPE'}
          </Typography>
        </Stack>

        {modo === 'LISTA' && (
          <>
            <Card
              onClick={() => abrirCadastro()}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px dashed #128654',
                bgcolor: theme.palette.mode === 'dark' ? '#163528' : '#F0F7F4'
              }}
            >
              <AddIcon sx={{ color: '#128654', fontSize: '2rem' }} />
              <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>
                CADASTRAR NOVO FUNCIONÁRIO
              </Typography>
            </Card>

            <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#128654' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome / Cargo</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail de Acesso</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuariosCadastrados.map((u) => {
                    const gestor = ehAdminPrincipal(u.id);
                    return (
                      <TableRow key={u.id} sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#F5F5F5' } }}>
                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{u.id}</TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ fontWeight: gestor ? 'bold' : 'normal', color: 'text.primary' }}>
                              {u.nome}
                            </Typography>
                            {gestor && (
                              <Chip
                                icon={<ShieldIcon style={{ color: '#128654', fontSize: '1rem' }} />}
                                label="GESTOR"
                                size="small"
                                sx={{ bgcolor: '#E8F5E9', color: '#128654', fontWeight: 'bold', fontSize: '0.7rem' }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{u.email}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              size="small"
                              startIcon={<SearchIcon />}
                              onClick={() => {
                                setUsuarioSelecionado(u);
                                setModo('CONSULTA');
                              }}
                              sx={{ color: '#128654', fontWeight: 'bold' }}
                            >
                              Relatório
                            </Button>
                            <IconButton onClick={() => abrirCadastro(u)} sx={{ color: '#128654' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => tentarExcluir(u)} sx={{ color: gestor ? '#777' : '#C62828' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {modo === 'FORMULARIO' && (
          <Card sx={{ p: 4, borderRadius: '25px', maxWidth: 500, mx: 'auto', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#128654', fontWeight: 'bold' }}>
              {usuariosCadastrados.find((u) => u.id === form.id) ? "Editar Perfil" : "Novo Integrante"}
            </Typography>

            <Stack spacing={3}>
              <TextField label="ID DO SISTEMA" value={form.id} disabled fullWidth variant="filled" />
              <TextField label="Nome Completo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} fullWidth />
              <TextField label="E-mail de Acesso" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth disabled={ehAdminPrincipal(form.id)} />
              <TextField label="Senha de Acesso" type="password" value={form.senha} placeholder={usuariosCadastrados.find((u) => u.id === form.id) ? "Deixe vazio para não alterar" : "Mínimo 6 caracteres"} onChange={(e) => setForm({ ...form, senha: e.target.value })} fullWidth />

              <Button variant="contained" onClick={salvar} startIcon={<SaveIcon />} sx={{ bgcolor: '#128654', borderRadius: '15px', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#0e6b43' } }}>
                SALVAR ALTERAÇÕES
              </Button>

              <Button onClick={() => setModo('LISTA')} sx={{ color: 'text.secondary' }}>
                Cancelar e Voltar
              </Button>
            </Stack>
          </Card>
        )}

        {modo === 'CONSULTA' && (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="overline" color="text.secondary">TOTAL DE VENDAS (MÊS)</Typography>
                <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>R$ 0,00</Typography>
              </Card>

              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="overline" color="text.secondary">STATUS DE ACESSO</Typography>
                <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>
                  {usuarioSelecionado?.nome === usuarioLogado ? 'EM USO' : 'ATIVO'}
                </Typography>
              </Card>

              <Card sx={{ p: 3, borderRadius: '20px', border: `1px solid ${theme.palette.divider}`, gridColumn: { md: 'span 2' }, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
                  REGISTRO DE ATIVIDADE
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O usuário <strong>{usuarioSelecionado?.nome}</strong> está habilitado para operar o PDV.
                  Nenhuma venda registrada até o momento.
                </Typography>
              </Card>
            </Box>

            <Button variant="outlined" onClick={() => setModo('LISTA')} sx={{ mt: 4, color: '#128654', borderColor: '#128654', borderRadius: '12px', px: 4 }}>
              VOLTAR PARA LISTA
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Usuarios;
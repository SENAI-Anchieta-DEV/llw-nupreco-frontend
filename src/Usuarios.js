import React, { useState } from 'react';
import { 
  Box, Typography, Card, TextField, Button, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Chip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import SearchIcon from '@mui/icons-material/Search';

const Usuarios = ({ onBack, usuariosCadastrados, aoSalvarUsuario, aoExcluirUsuario, usuarioLogado, aoNotificar }) => {
  const [modo, setModo] = useState('LISTA'); // LISTA, FORMULARIO, CONSULTA
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [form, setForm] = useState({ id: '', nome: '', email: '', senha: '' });

  // Trava de segurança: Identifica se o usuário em questão é o ADMIN logado
  const ehAdminDefinitivo = (userEmail) => {
    // Busca o primeiro usuário da lista (que é o criador da conta) ou compara com o logado
    return userEmail === usuariosCadastrados[0]?.email;
  };

  const abrirCadastro = (user = null) => {
    if (user) {
      setForm({ ...user, senha: '' }); // Não trazemos a senha por segurança
      setModo('FORMULARIO');
    } else {
      setForm({ id: `ID-${Math.floor(Date.now() / 1000)}`, nome: '', email: '', senha: '' });
      setModo('FORMULARIO');
    }
  };

  const abrirConsulta = (user) => {
    setUsuarioSelecionado(user);
    setModo('CONSULTA');
  };

  const salvar = () => {
    // Validação Profissional (LLW-141)
    if (!form.nome || !form.email) {
      aoNotificar("O nome e e-mail são obrigatórios!", "warning");
      return;
    }

    // Se for novo usuário, a senha é obrigatória
    const ehNovo = !usuariosCadastrados.find(u => u.id === form.id);
    if (ehNovo && !form.senha) {
      aoNotificar("Defina uma senha para o novo funcionário!", "warning");
      return;
    }

    aoSalvarUsuario(form);
    // O feedback de sucesso já vem do App.js através do aoSalvarUsuario
    setModo('LISTA');
  };

  const tentarExcluir = (u) => {
    if (ehAdminDefinitivo(u.email)) {
      aoNotificar("Atenção: O perfil de Gestor (ADMIN) é definitivo e não pode ser removido.", "error");
      return;
    }
    
    // Se não for admin, procede com a exclusão
    aoExcluirUsuario(u.id);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}>
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
          <Card onClick={() => abrirCadastro()} sx={{ p: 3, mb: 4, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: '1px dashed #128654', bgcolor: '#F0F7F4', transition: '0.3s', '&:hover': { bgcolor: '#E8F5E9' } }}>
            <AddIcon sx={{ color: '#128654', fontSize: '2rem' }} />
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>CADASTRAR NOVO FUNCIONÁRIO</Typography>
          </Card>

          <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: 'none', border: '1px solid #EEE', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#128654' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome / Cargo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosCadastrados.map((u) => {
                  const gestor = ehAdminDefinitivo(u.email);
                  return (
                    <TableRow key={u.id} sx={{ '&:hover': { bgcolor: '#F5F5F5' } }}>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#999' }}>{u.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontWeight: gestor ? 'bold' : 'normal' }}>{u.nome}</Typography>
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
                      <TableCell>{u.email}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button 
                            size="small" 
                            startIcon={<SearchIcon />} 
                            onClick={() => abrirConsulta(u)}
                            sx={{ color: '#128654', fontWeight: 'bold', textTransform: 'none' }}
                          >
                            Relatório
                          </Button>

                          <IconButton onClick={() => abrirCadastro(u)} sx={{ color: '#128654' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton 
                            onClick={() => tentarExcluir(u)} 
                            sx={{ color: gestor ? '#DDD' : '#C62828' }}
                          >
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
        <Card sx={{ p: 4, borderRadius: '25px', maxWidth: 500, mx: 'auto', border: '1px solid #EEE', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#128654', fontWeight: 'bold' }}>
            {usuariosCadastrados.find(u => u.id === form.id) ? "Editar Integrante" : "Novo Integrante"}
          </Typography>
          <Stack spacing={3}>
            <TextField label="ID DO SISTEMA" value={form.id} disabled fullWidth variant="filled" />
            <TextField label="Nome Completo" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} fullWidth />
            <TextField 
              label="E-mail de Acesso" 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              fullWidth 
              disabled={ehAdminDefinitivo(form.email)} // Bloqueia troca de e-mail do ADMIN
            />
            <TextField 
              label="Nova Senha" 
              type="password" 
              value={form.senha} 
              placeholder="Deixe em branco para manter a atual"
              onChange={(e) => setForm({...form, senha: e.target.value})} 
              fullWidth 
            />
            <Button 
              variant="contained" 
              onClick={salvar} 
              startIcon={<SaveIcon />} 
              sx={{ bgcolor: '#128654', borderRadius: '15px', py: 1.5, fontWeight: 'bold', mt: 2 }}
            >
              SALVAR ALTERAÇÕES
            </Button>
            <Button onClick={() => setModo('LISTA')} sx={{ color: '#999', textTransform: 'none' }}>Cancelar e Voltar</Button>
          </Stack>
        </Card>
      )}

      {modo === 'CONSULTA' && (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <GridResumo u={usuarioSelecionado} />
          <Button 
            variant="outlined" 
            onClick={() => setModo('LISTA')} 
            sx={{ mt: 4, color: '#128654', borderColor: '#128654', borderRadius: '12px', px: 4 }}
          >
            VOLTAR PARA LISTA
          </Button>
        </Box>
      )}
    </Box>
  );
};

const GridResumo = ({ u }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', textAlign: 'center' }}>
      <Typography variant="overline" color="textSecondary">TOTAL DE VENDAS (MÊS)</Typography>
      <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>R$ 0,00</Typography>
    </Card>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', textAlign: 'center' }}>
      <Typography variant="overline" color="textSecondary">STATUS DE ACESSO</Typography>
      <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>ATIVO</Typography>
    </Card>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', gridColumn: { md: 'span 2' } }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>REGISTRO DE ATIVIDADE</Typography>
      <Typography variant="body2" color="textSecondary">
        O usuário <strong>{u?.nome}</strong> está habilitado para operar o PDV e gerenciar estoque. 
        Nenhuma venda registrada no período selecionado.
      </Typography>
    </Card>
  </Box>
);

export default Usuarios;
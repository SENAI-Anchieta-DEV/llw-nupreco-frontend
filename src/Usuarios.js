import React, { useState } from 'react';
import { 
  Box, Typography, Card, TextField, Button, IconButton, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Chip, Tooltip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import SearchIcon from '@mui/icons-material/Search'; // Ícone para Consultar

const Usuarios = ({ onBack, usuariosCadastrados, aoSalvarUsuario, aoExcluirUsuario, usuarioLogado }) => {
  const [modo, setModo] = useState('LISTA'); // LISTA, FORMULARIO, CONSULTA
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [form, setForm] = useState({ id: '', nome: '', email: '', senha: '' });

  const abrirCadastro = (user = null) => {
    if (user) {
      setForm({ ...user, senha: '' });
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
    if (!form.nome || !form.email || (modo === 'FORMULARIO' && !usuarioSelecionado && !form.senha)) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    aoSalvarUsuario(form);
    setModo('LISTA');
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
          <Card onClick={() => abrirCadastro()} sx={{ p: 3, mb: 4, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: '1px dashed #128654', bgcolor: '#F0F7F4' }}>
            <AddIcon sx={{ color: '#128654', fontSize: '2rem' }} />
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>CADASTRAR NOVO FUNCIONÁRIO</Typography>
          </Card>

          <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: 'none', border: '1px solid #EEE' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#128654' }}>
                  <TableCell sx={{ color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Nome / Cargo</TableCell>
                  <TableCell sx={{ color: 'white' }}>E-mail</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Ações / Relatório</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosCadastrados.map((u) => {
                  const ehGestor = u.nome === usuarioLogado;
                  return (
                    <TableRow key={u.id}>
                      <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>{u.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontWeight: ehGestor ? 'bold' : 'normal' }}>{u.nome}</Typography>
                          {ehGestor && <Chip icon={<ShieldIcon style={{ color: '#128654', fontSize: '1rem' }} />} label="GESTOR" size="small" sx={{ bgcolor: '#E8F5E9', color: '#128654', fontWeight: 'bold' }} />}
                        </Stack>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {/* BOTÃO CONSULTAR */}
                          <Button 
                            size="small" 
                            startIcon={<SearchIcon />} 
                            onClick={() => abrirConsulta(u)}
                            sx={{ color: '#128654', fontWeight: 'bold', textTransform: 'none' }}
                          >
                            Consultar
                          </Button>

                          <IconButton onClick={() => abrirCadastro(u)} sx={{ color: '#128654' }}><EditIcon /></IconButton>
                          {!ehGestor && (
                            <IconButton onClick={() => aoExcluirUsuario(u.id)} sx={{ color: '#C62828' }}><DeleteIcon /></IconButton>
                          )}
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
        <Card sx={{ p: 4, borderRadius: '25px', maxWidth: 500, mx: 'auto', border: '1px solid #EEE' }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#128654', fontWeight: 'bold' }}>Dados do Usuário</Typography>
          <Stack spacing={3}>
            <TextField label="ID" value={form.id} disabled fullWidth />
            <TextField label="Nome Completo" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} fullWidth />
            <TextField label="E-mail" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} fullWidth />
            <TextField label="Senha" type="password" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})} fullWidth />
            <Button variant="contained" onClick={salvar} startIcon={<SaveIcon />} sx={{ bgcolor: '#128654', borderRadius: '15px', py: 1.5, fontWeight: 'bold' }}>SALVAR</Button>
            <Button onClick={() => setModo('LISTA')} sx={{ color: '#666' }}>VOLTAR</Button>
          </Stack>
        </Card>
      )}

      {modo === 'CONSULTA' && (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <GridResumo u={usuarioSelecionado} />
          <Button variant="outlined" onClick={() => setModo('LISTA')} sx={{ mt: 3, color: '#128654', borderColor: '#128654' }}>FECHAR CONSULTA</Button>
        </Box>
      )}
    </Box>
  );
};

// Subcomponente para organizar os dados da consulta
const GridResumo = ({ u }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', textAlign: 'center' }}>
      <Typography variant="overline" color="textSecondary">TOTAL DE VENDAS</Typography>
      <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>R$ 0,00</Typography>
    </Card>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', textAlign: 'center' }}>
      <Typography variant="overline" color="textSecondary">DIAS TRABALHADOS</Typography>
      <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>0</Typography>
    </Card>
    <Card sx={{ p: 3, borderRadius: '20px', border: '1px solid #EEE', gridColumn: 'span 2' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>ÚLTIMAS MODIFICAÇÕES NO SISTEMA</Typography>
      <Typography variant="body2" color="textSecondary">Nenhuma atividade registrada hoje.</Typography>
    </Card>
  </Box>
);

export default Usuarios;
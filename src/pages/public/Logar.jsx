import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Logar() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    senha: '',
  });

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(form.nome, form.senha);
      navigate('/inicio');
    } catch (error) {
      setErro('Nome ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Nome"
        name="nome"
        type="text"
        value={form.nome}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Senha"
        name="senha"
        type="password"
        value={form.senha}
        onChange={handleChange}
        margin="normal"
        required
      />

      {erro && (
        <Typography sx={{ color: 'error.main', mt: 1 }}>
          {erro}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 2, mb: 2, bgcolor: '#128654' }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
      </Typography>
    </Box>
  );
}

export default Logar;
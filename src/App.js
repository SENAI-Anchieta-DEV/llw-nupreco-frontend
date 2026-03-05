import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme'; // Importa o arquivo de cores que criamos
import BemVindo from './BemVindo';
import Cadastro from './Cadastro';

function App() {
  // Estado para controlar qual tela mostrar
  const [telaAtual, setTelaAtual] = useState('bem-vindo');
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(true);

  useEffect(() => {
    // Verifica se já existe um gestor cadastrado no sistema
    const gestorConfigurado = localStorage.getItem('gestor_configurado');
    if (gestorConfigurado === 'true') {
      setIsPrimeiroAcesso(false);
    }
  }, []);

  // Função chamada pelo botão "Criar nova conta" na tela de Bem-Vindo
  const gerenciarFluxo = () => {
    if (isPrimeiroAcesso) {
      // Se for a primeira vez, vai para o cadastro do gestor
      setTelaAtual('cadastro');
    } else {
      // Se já houver gestor, o sistema deve seguir para o Login
      setTelaAtual('login');
    }
  };

  // Função chamada após concluir o cadastro do Gestor
  const concluirCadastroGestor = () => {
    localStorage.setItem('gestor_configurado', 'true');
    setIsPrimeiroAcesso(false);
    setTelaAtual('home'); // Redireciona para a Home do Gestor
  };

  return (
    <ThemeProvider theme={theme}>
      {/* O CssBaseline reseta o CSS para o padrão do Material UI */}
      <CssBaseline />
      
      {telaAtual === 'bem-vindo' && (
        <BemVindo aoClicarCriar={gerenciarFluxo} />
      )}

      {telaAtual === 'cadastro' && (
        <Cadastro aoFinalizar={concluirCadastroGestor} />
      )}

      {telaAtual === 'login' && (
        <div style={{ padding: '20px' }}>
          <h2>Tela de Login (Próximo passo)</h2>
        </div>
      )}

      {telaAtual === 'home' && (
        <div style={{ padding: '20px' }}>
          <h2>Bem-vindo, Gestor! (Área Logada)</h2>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
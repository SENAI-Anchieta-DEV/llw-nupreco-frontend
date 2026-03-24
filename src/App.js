import { useState, useEffect } from "react"; 
import { Snackbar, Alert } from '@mui/material'; 
import Inicio from "./inicio";
import VendaConsulta from "./VendaConsulta";
import PdvRapido from "./PdvRapido";
import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./entrar";
import Produto from "./Produto";
import Estoque from "./Estoque";
import Contas from "./Contas"; 
import Usuarios from "./Usuarios";

function App() {
  const carregar = (chave, valorPadrao) => {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : valorPadrao;
  };

  const [telaAtiva, setTelaAtiva] = useState("bemvindo");
  const [logado, setLogado] = useState(false);
  const [subTela, setSubTela] = useState("menu"); 
  const [usuarioLogado, setUsuarioLogado] = useState("");

  const [produtosCadastrados, setProdutosCadastrados] = useState(() => carregar("nupreco_produtos", []));
  const [historicoVendas, setHistoricoVendas] = useState(() => carregar("nupreco_vendas", []));
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(() => carregar("nupreco_usuario", null));
  const [contasCadastradas, setContasCadastradas] = useState(() => carregar("nupreco_contas", []));
  const [usuariosLista, setUsuariosLista] = useState(() => carregar("nupreco_usuarios_lista", []));

  const [estaCarregando, setEstaCarregando] = useState(false);

  // --- ESTADO PARA NOTIFICAÇÕES (LLW-140) ---
  const [notificacao, setNotificacao] = useState({ 
    aberto: false, 
    mensagem: '', 
    tipo: 'success' 
  });

  const mostrarMensagem = (msg, tipo = 'success') => {
    setNotificacao({ aberto: true, mensagem: msg, tipo });
  };

  const fecharNotificacao = () => {
    setNotificacao({ ...notificacao, aberto: false });
  };

  useEffect(() => { localStorage.setItem("nupreco_produtos", JSON.stringify(produtosCadastrados)); }, [produtosCadastrados]);
  useEffect(() => { localStorage.setItem("nupreco_vendas", JSON.stringify(historicoVendas)); }, [historicoVendas]);
  useEffect(() => { localStorage.setItem("nupreco_contas", JSON.stringify(contasCadastradas)); }, [contasCadastradas]);
  useEffect(() => { localStorage.setItem("nupreco_usuario", JSON.stringify(usuarioCadastrado)); }, [usuarioCadastrado]);
  useEffect(() => { localStorage.setItem("nupreco_usuarios_lista", JSON.stringify(usuariosLista)); }, [usuariosLista]);

  const handleLogout = () => {
    setLogado(false);
    setTelaAtiva("login");
    setSubTela("menu"); 
    mostrarMensagem("Sessão encerrada.", "info");
  };

  const handleSalvarUsuario = (usuario) => {
    setUsuariosLista((prev) => {
      const existe = prev.find(u => u.id === usuario.id);
      if (existe) return prev.map(u => u.id === usuario.id ? usuario : u);
      return [...prev, usuario];
    });
    mostrarMensagem("Usuário salvo com sucesso!");
  };

  const handleExcluirUsuario = (id) => {
    const usuarioParaExcluir = usuariosLista.find(u => u.id === id);
    // Proteção do ADMIN (LLW-143)
    if (usuarioParaExcluir && usuarioParaExcluir.email === usuarioCadastrado?.email) {
      mostrarMensagem("Operação negada: O Gestor principal não pode ser excluído.", "error");
      return;
    }
    setUsuariosLista((prev) => prev.filter(u => u.id !== id));
    mostrarMensagem("Usuário removido.", "info");
  };

  const handleSalvarConta = (c) => {
    setContasCadastradas(prev => [...prev.filter(x => x.id !== c.id), c].sort((a,b) => new Date(a.dataVencimento) - new Date(b.dataVencimento)));
    mostrarMensagem("Conta atualizada com sucesso!");
  };

  const handleExcluirConta = (id) => {
    setContasCadastradas(prev => prev.filter(c => c.id !== id));
    mostrarMensagem("Conta excluída.", "info");
  };

  const handleSalvarProduto = (p) => {
    setProdutosCadastrados(prev => [...prev.filter(x => x.id !== p.id), p]);
    mostrarMensagem("Produto salvo no sistema!");
  };

  const handleExcluirProduto = (id) => {
    setProdutosCadastrados(prev => prev.filter(p => p.id !== id));
    mostrarMensagem("Produto removido do estoque.", "info");
  };

  const hoje = new Date().toISOString().split('T')[0];
  const contasDoDia = contasCadastradas.filter(c => c.dataVencimento === hoje && !c.paga);

  const handleRegistrarVenda = async (dadosVenda) => {
    setEstaCarregando(true);
    await new Promise(r => setTimeout(r, 1500));
    setHistoricoVendas(prev => [{ ...dadosVenda, id: (historicoVendas.length + 1).toString().padStart(6, '0') }, ...prev]);
    setEstaCarregando(false);
    mostrarMensagem("Venda realizada com sucesso!", "success");
  };

  // Renderização para usuários não logados
  if (!logado) {
    return (
      <>
        {telaAtiva === "bemvindo" && (
          <BemVindo aoClicarCriar={() => setTelaAtiva("cadastro")} aoClicarEntrar={() => setTelaAtiva("login")} />
        )}
        {telaAtiva === "cadastro" && (
          <Cadastro 
            aoVoltar={() => setTelaAtiva("bemvindo")} 
            aoSalvarCadastro={(d) => { 
              setUsuarioCadastrado(d); 
              setUsuariosLista([{id: "ADMIN_ROOT", nome: d.nome, email: d.email, senha: d.senha}]);
              setUsuarioLogado(d.nome); 
              setLogado(true); 
              setSubTela("menu"); 
              mostrarMensagem("Conta criada com sucesso! Bem-vindo.");
            }} 
            aoNotificar={mostrarMensagem}
          />
        )}
        {telaAtiva === "login" && (
          <Login 
            aoVoltar={() => setTelaAtiva("bemvindo")} 
            listaUsuarios={usuariosLista}
            onLogin={(nome) => { 
              setUsuarioLogado(nome); setLogado(true); setSubTela("menu"); 
            }}
            aoNotificar={mostrarMensagem}
          />
        )}

        <Snackbar open={notificacao.aberto} autoHideDuration={4000} onClose={fecharNotificacao} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={fecharNotificacao} severity={notificacao.tipo} variant="filled" sx={{ width: '100%' }}>
            {notificacao.mensagem}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // Renderização para usuários logados
  return (
    <>
      {subTela === "menu" && (
        <Inicio 
          onLogout={handleLogout} 
          perfilUsuario={usuarioLogado === usuarioCadastrado?.nome ? "ADMINISTRADOR" : "FUNCIONÁRIO"}
          aoClicarVendas={() => setSubTela("vendas")} 
          aoClicarPdv={() => setSubTela("pdv")} 
          aoClicarProdutos={() => setSubTela("produto")}
          aoClicarEstoque={() => setSubTela("estoque")}
          aoClicarContas={() => setSubTela("contas")} 
          aoClicarUsuarios={() => setSubTela("usuarios")}
          listaContasDoDia={contasDoDia} 
        />
      )}

      {subTela === "usuarios" && (
        <Usuarios 
          onBack={() => setSubTela("menu")}
          usuariosCadastrados={usuariosLista}
          aoSalvarUsuario={handleSalvarUsuario}
          aoExcluirUsuario={handleExcluirUsuario}
          usuarioLogado={usuarioLogado}
          aoNotificar={mostrarMensagem} // Passando feedback
        />
      )}
      
      {subTela === "contas" && (
        <Contas 
          onBack={() => setSubTela("menu")} 
          onLogout={handleLogout} 
          aoSalvarConta={handleSalvarConta} 
          aoExcluirConta={handleExcluirConta} 
          contasCadastradas={contasCadastradas}
          aoNotificar={mostrarMensagem} 
        />
      )}

      {subTela === "vendas" && (
        <VendaConsulta 
          vendas={historicoVendas} 
          onBack={() => setSubTela("menu")} 
          onLogout={handleLogout} 
          aoNotificar={mostrarMensagem}
        />
      )}

      {subTela === "estoque" && (
        <Estoque 
          produtos={produtosCadastrados} 
          onBack={() => setSubTela("menu")} 
          onLogout={handleLogout} 
          aoAtualizarQtd={(c,q) => {
            setProdutosCadastrados(prev => prev.map(p => p.cod === c ? {...p, qtd: Math.max(0,q)} : p));
            mostrarMensagem("Estoque atualizado!");
          }} 
        />
      )}

      {subTela === "pdv" && (
        <PdvRapido 
          onBack={() => setSubTela("menu")} 
          onLogout={handleLogout} 
          onRegistrarVenda={handleRegistrarVenda} 
          nomeVendedor={usuarioLogado} 
          estoque={produtosCadastrados} 
          carregando={estaCarregando} 
          aoNotificar={mostrarMensagem}
        />
      )}

      {subTela === "produto" && (
        <Produto 
          onBack={() => setSubTela("menu")} 
          onLogout={handleLogout} 
          onSalvarProduto={handleSalvarProduto} 
          onExcluirProduto={handleExcluirProduto} 
          produtosCadastrados={produtosCadastrados} 
          aoClicarEstoque={() => setSubTela("estoque")}
          aoNotificar={mostrarMensagem}
        />
      )}

      <Snackbar open={notificacao.aberto} autoHideDuration={4000} onClose={fecharNotificacao} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={fecharNotificacao} severity={notificacao.tipo} variant="filled" sx={{ width: '100%' }}>
          {notificacao.mensagem}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
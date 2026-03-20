import { useState, useEffect } from "react"; 
import Inicio from "./inicio";
import VendaConsulta from "./VendaConsulta";
import PdvRapido from "./PdvRapido";
import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./entrar";
import Produto from "./Produto";
import Estoque from "./Estoque";
import Contas from "./Contas"; 
import Usuarios from "./Usuarios"; // NOVO COMPONENTE

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
  
  // NOVA LISTA DE USUÁRIOS (FUNCIONÁRIOS)
  const [usuariosLista, setUsuariosLista] = useState(() => carregar("nupreco_usuarios_lista", []));

  const [estaCarregando, setEstaCarregando] = useState(false);

  useEffect(() => { localStorage.setItem("nupreco_produtos", JSON.stringify(produtosCadastrados)); }, [produtosCadastrados]);
  useEffect(() => { localStorage.setItem("nupreco_vendas", JSON.stringify(historicoVendas)); }, [historicoVendas]);
  useEffect(() => { localStorage.setItem("nupreco_contas", JSON.stringify(contasCadastradas)); }, [contasCadastradas]);
  useEffect(() => { localStorage.setItem("nupreco_usuario", JSON.stringify(usuarioCadastrado)); }, [usuarioCadastrado]);
  useEffect(() => { localStorage.setItem("nupreco_usuarios_lista", JSON.stringify(usuariosLista)); }, [usuariosLista]);

  // --- LOGICA DE USUÁRIOS (FUNCIONÁRIOS) ---
  const handleSalvarUsuario = (usuario) => {
    setUsuariosLista((prev) => {
      const existe = prev.find(u => u.id === usuario.id);
      if (existe) {
        return prev.map(u => u.id === usuario.id ? usuario : u);
      }
      return [...prev, usuario];
    });
  };

  const handleExcluirUsuario = (id) => {
    setUsuariosLista((prev) => prev.filter(u => u.id !== id));
  };

  // --- LOGICA DE CONTAS ---
  const handleSalvarConta = (contaEditada) => {
    setContasCadastradas((prev) => {
      let novaLista;
      const existe = prev.find(c => c.id === contaEditada.id);
      if (existe) {
        novaLista = prev.map(c => c.id === contaEditada.id ? contaEditada : c);
      } else {
        novaLista = [...prev, contaEditada];
      }
      return novaLista.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    });
  };

  const handleExcluirConta = (id) => {
    setContasCadastradas((prev) => prev.filter(c => c.id !== id));
  };

  // --- LOGICA DE PRODUTOS ---
  const handleSalvarProduto = (produtoEditado) => {
    setProdutosCadastrados((prev) => {
      const existe = prev.find(p => p.id === produtoEditado.id);
      if (existe) {
        return prev.map(p => p.id === produtoEditado.id ? produtoEditado : p);
      } else {
        return [...prev, produtoEditado];
      }
    });
  };

  const handleExcluirProduto = (id) => {
    setProdutosCadastrados((prev) => prev.filter(p => p.id !== id));
  };

  // --- LÓGICA DA NOTIFICAÇÃO ---
  const hoje = new Date().toISOString().split('T')[0];
  const contaNotificacao = contasCadastradas.find(c => c.dataVencimento === hoje && !c.paga) 
                           || contasCadastradas.find(c => !c.paga);

  // --- LÓGICA DE VENDA COM LOADING ---
  const handleRegistrarVenda = async (dadosVenda) => {
    setEstaCarregando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const proximoId = (historicoVendas.length + 1).toString().padStart(6, '0');
    const novaVendaComId = { ...dadosVenda, id: proximoId };
    setHistoricoVendas((prev) => [novaVendaComId, ...prev]);
    setEstaCarregando(false);
  };

  // --- ATUALIZAÇÃO DE ESTOQUE ---
  const handleAtualizarQuantidade = (cod, novaQtd) => {
    setProdutosCadastrados((prev) => 
      prev.map(p => p.cod === cod ? { ...p, qtd: Math.max(0, novaQtd) } : p)
    );
  };

  if (!logado) {
    return (
      <>
        {telaAtiva === "bemvindo" && (
          <BemVindo aoClicarCriar={() => setTelaAtiva("cadastro")} aoClicarEntrar={() => setTelaAtiva("login")} />
        )}
        {telaAtiva === "cadastro" && (
          <Cadastro aoVoltar={() => setTelaAtiva("bemvindo")} aoSalvarCadastro={(d) => { 
            setUsuarioCadastrado(d); 
            // Adiciona o primeiro usuário (Gestor) na lista geral também
            setUsuariosLista([{id: Date.now().toString(), nome: d.nome, email: d.email, senha: d.senha}]);
            setUsuarioLogado(d.nome); 
            setLogado(true); 
            setSubTela("menu"); 
          }} />
        )}
        {telaAtiva === "login" && (
          <Login aoVoltar={() => setTelaAtiva("bemvindo")} dadosParaConferir={usuarioCadastrado} onLogin={(nome) => { 
            setUsuarioLogado(nome); setLogado(true); setSubTela("menu"); 
          }} />
        )}
      </>
    );
  }

  return (
    <>
      {subTela === "menu" && (
        <Inicio 
          onLogout={() => setLogado(false)} 
          aoClicarVendas={() => setSubTela("vendas")} 
          aoClicarPdv={() => setSubTela("pdv")} 
          aoClicarProdutos={() => setSubTela("produto")}
          aoClicarEstoque={() => setSubTela("estoque")}
          aoClicarContas={() => setSubTela("contas")} 
          aoClicarUsuarios={() => setSubTela("usuarios")} // NOVA PROP
          notificacaoConta={contaNotificacao} 
        />
      )}

      {subTela === "usuarios" && (
        <Usuarios 
          onBack={() => setSubTela("menu")}
          usuariosCadastrados={usuariosLista}
          aoSalvarUsuario={handleSalvarUsuario}
          aoExcluirUsuario={handleExcluirUsuario}
          usuarioLogado={usuarioLogado}
        />
      )}

      {subTela === "contas" && (
        <Contas 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)}
          aoSalvarConta={handleSalvarConta}
          aoExcluirConta={handleExcluirConta}
          contasCadastradas={contasCadastradas}
        />
      )}

      {subTela === "vendas" && (
        <VendaConsulta vendas={historicoVendas} onBack={() => setSubTela("menu")} onLogout={() => setLogado(false)} />
      )}

      {subTela === "estoque" && (
        <Estoque 
          produtos={produtosCadastrados} 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)} 
          aoAtualizarQtd={handleAtualizarQuantidade} 
        />
      )}

      {subTela === "pdv" && (
        <PdvRapido 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)} 
          onRegistrarVenda={handleRegistrarVenda} 
          nomeVendedor={usuarioLogado} 
          estoque={produtosCadastrados}
          carregando={estaCarregando}
        />
      )}

      {subTela === "produto" && (
        <Produto 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)} 
          onSalvarProduto={handleSalvarProduto}
          onExcluirProduto={handleExcluirProduto}
          produtosCadastrados={produtosCadastrados}
          aoClicarEstoque={() => setSubTela("estoque")}
        />
      )}
    </>
  );
}

export default App;
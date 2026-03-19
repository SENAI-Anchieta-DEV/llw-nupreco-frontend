import { useState } from "react";
import Inicio from "./inicio";
import VendaConsulta from "./VendaConsulta";
import PdvRapido from "./PdvRapido";
import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./entrar";
import Produto from "./Produto";
import Estoque from "./Estoque"; // 1. IMPORTAÇÃO MANTIDA

function App() {
  const [telaAtiva, setTelaAtiva] = useState("bemvindo");
  const [logado, setLogado] = useState(false);
  const [subTela, setSubTela] = useState("menu"); 
  const [usuarioLogado, setUsuarioLogado] = useState("");

  // ESTADO GLOBAL DE PRODUTOS INICIANDO VAZIO PARA APARECER SÓ O QUE VOCÊ CADASTRAR
  const [produtosCadastrados, setProdutosCadastrados] = useState([]);

  const [historicoVendas, setHistoricoVendas] = useState([]);
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(null);

  // 2. FUNÇÃO QUE SALVA NO ESTOQUE E MUDA A TELA
  const handleSalvarProduto = (novo) => {
    setProdutosCadastrados((prev) => [...prev, novo]);
    setSubTela("estoque"); // Vai direto para o estoque ver o item salvo
  };

  const handleRegistrarVenda = (dadosVenda) => {
    const proximoId = (historicoVendas.length + 1).toString().padStart(6, '0');
    const novaVendaComId = { ...dadosVenda, id: proximoId };
    setHistoricoVendas((prev) => [novaVendaComId, ...prev]);
  };

  if (!logado) {
    return (
      <>
        {telaAtiva === "bemvindo" && (
          <BemVindo aoClicarCriar={() => setTelaAtiva("cadastro")} aoClicarEntrar={() => setTelaAtiva("login")} />
        )}
        {telaAtiva === "cadastro" && (
          <Cadastro aoVoltar={() => setTelaAtiva("bemvindo")} aoSalvarCadastro={(d) => { 
            setUsuarioCadastrado(d); setUsuarioLogado(d.nome); setLogado(true); setSubTela("menu"); 
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
          aoClicarEstoque={() => setSubTela("estoque")} // 3. PROP PARA O MENU
        />
      )}

      {subTela === "vendas" && (
        <VendaConsulta 
          vendas={historicoVendas}
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)}
        />
      )}

      {/* 4. EXIBIÇÃO DO ESTOQUE */}
      {subTela === "estoque" && (
        <Estoque 
          produtos={produtosCadastrados}
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)}
        />
      )}

      {subTela === "pdv" && (
        <PdvRapido 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)}
          onRegistrarVenda={handleRegistrarVenda} 
          nomeVendedor={usuarioLogado} 
          estoque={produtosCadastrados}
        />
      )}

      {subTela === "produto" && (
        <Produto 
          onBack={() => setSubTela("menu")} 
          onLogout={() => setLogado(false)}
          onSalvarProduto={handleSalvarProduto} 
        />
      )}
    </>
  );
}

export default App;
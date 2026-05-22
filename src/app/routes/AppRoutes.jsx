import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import useAuth from '../../hooks/useAuth';
import { canAccessRoute } from '../../utils/permissions';
import { verificarGestorCadastrado } from '../../utils/firstAccess';
import BemVindo from '../../pages/public/BemVindo';
import CadastroPage from '../../pages/public/Cadastro';
import EntrarPage from '../../pages/public/Logar';
import Inicio from '../../pages/private/inicio';
import PdvRapido from '../../pages/private/PdvRapido';
import Estoque from '../../pages/private/Estoque';
import Produto from '../../pages/private/Produto';
import Contas from '../../pages/private/Contas';
import Usuarios from '../../pages/private/Usuarios';
import VendaConsulta from '../../pages/private/VendaConsulta';
import EtiquetaDigital from '../../pages/private/EtiquetaDigital';


const FirstGestorRoute = ({ children }) => {
  const [verificandoGestor, setVerificandoGestor] = useState(true);
  const [gestorCadastrado, setGestorCadastrado] = useState(false);


  useEffect(() => {
    let componenteMontado = true;


    const verificarPrimeiroAcesso = async () => {
      const existeGestor = await verificarGestorCadastrado();


      if (componenteMontado) {
        setGestorCadastrado(existeGestor);
        setVerificandoGestor(false);
      }
    };


    verificarPrimeiroAcesso();


    return () => {
      componenteMontado = false;
    };
  }, []);


  if (verificandoGestor) {
    return null;
  }


  if (gestorCadastrado) {
    return <Navigate to="/" replace />;
  }


  return children;
};


const RoleProtectedRoute = ({ route, children }) => {
  const { user } = useAuth();


  if (!canAccessRoute(user?.role, route)) {
    return <Navigate to="/inicio" replace />;
  }


  return children;
};


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>








        {/* ✅ BEM-VINDO (SEM LAYOUT — CORREÇÃO PRINCIPAL) */}
        <Route
          path="/"
          element={<BemVindo />}
        />








        {/* 🔐 ROTAS PÚBLICAS (com layout normal) */}
        <Route
          path="/entrar"
          element={
            <PublicRoute>
              <PublicLayout
                title="Entrar"
                subtitle="Acesse sua conta para gerenciar seu negócio com eficiência."
              >
                <EntrarPage />
              </PublicLayout>
            </PublicRoute>
          }
        />








        <Route
          path="/cadastro"
          element={
             <PublicRoute>
              <FirstGestorRoute>
                <PublicLayout
                  title="Criar Conta"
                  subtitle="Cadastre-se para começar a usar o NuPreço."
                >
                  <CadastroPage />
                </PublicLayout>
              </FirstGestorRoute>
            </PublicRoute>
          }
        />








        {/* 🔒 ROTAS PRIVADAS */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/pdv" element={<PdvRapido />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/produtos" element={<Produto />} />
          <Route
            path="/contas"
            element={
              <RoleProtectedRoute route="/contas">
                <Contas />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <RoleProtectedRoute route="/usuarios">
                <Usuarios />
              </RoleProtectedRoute>
            }
          />
          <Route path="/vendas" element={<VendaConsulta />} />
          <Route path="/etiqueta-digital" element={<EtiquetaDigital />} />
        </Route>








        {/* 🔁 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />








      </Routes>
    </BrowserRouter>
  );
};








export default AppRoutes;












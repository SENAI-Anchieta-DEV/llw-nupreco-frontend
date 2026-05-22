<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React from 'react';
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
<<<<<<< HEAD
import useAuth from '../../hooks/useAuth';
import { canAccessRoute } from '../../utils/permissions';
import { verificarGestorCadastrado } from '../../utils/firstAccess';




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65




import BemVindo from '../../pages/public/BemVindo';
import CadastroPage from '../../pages/public/Cadastro';
import EntrarPage from '../../pages/public/Logar';




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
import Inicio from '../../pages/private/inicio';
import PdvRapido from '../../pages/private/PdvRapido';
import Estoque from '../../pages/private/Estoque';
import Produto from '../../pages/private/Produto';
import Contas from '../../pages/private/Contas';
import Usuarios from '../../pages/private/Usuarios';
import VendaConsulta from '../../pages/private/VendaConsulta';
import EtiquetaDigital from '../../pages/private/EtiquetaDigital';




<<<<<<< HEAD






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


=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        {/* ✅ BEM-VINDO (SEM LAYOUT — CORREÇÃO PRINCIPAL) */}
        <Route
          path="/"
          element={<BemVindo />}
        />




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <Route
          path="/cadastro"
          element={
             <PublicRoute>
<<<<<<< HEAD
              <FirstGestorRoute>
                <PublicLayout
                  title="Criar Conta"
                  subtitle="Cadastre-se para começar a usar o NuPreço."
                >
                  <CadastroPage />
                </PublicLayout>
              </FirstGestorRoute>
=======
              <PublicLayout
                title="Criar Conta"
                subtitle="Cadastre-se para começar a usar o NuPreço."
              >
                <CadastroPage />
              </PublicLayout>
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
            </PublicRoute>
          }
        />




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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
<<<<<<< HEAD
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
=======
          <Route path="/contas" element={<Contas />} />
          <Route path="/usuarios" element={<Usuarios />} />
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
          <Route path="/vendas" element={<VendaConsulta />} />
          <Route path="/etiqueta-digital" element={<EtiquetaDigital />} />
        </Route>




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        {/* 🔁 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      </Routes>
    </BrowserRouter>
  );
};




<<<<<<< HEAD




=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
export default AppRoutes;




<<<<<<< HEAD







=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65

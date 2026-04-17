import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import BemVindo from '../../pages/public/BemVindo';
import Cadastro from '../../pages/public/Cadastro';
import Entrar from '../../pages/public/Logar';

import Inicio from '../../pages/private/inicio';
import PdvRapido from '../../pages/private/PdvRapido';
import Estoque from '../../pages/private/Estoque';
import Produto from '../../pages/private/Produto';
import Contas from '../../pages/private/Contas';
import Usuarios from '../../pages/private/Usuarios';
import VendaConsulta from '../../pages/private/VendaConsulta';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout
              title="Bem-vindo ao NuPreço"
              subtitle="Controle, organização e praticidade para o seu negócio."
            >
              <BemVindo />
            </PublicLayout>
          }
        />

        <Route
          path="/entrar"
          element={
            <PublicRoute>
              <PublicLayout
                title="Entrar"
                subtitle="Acesse sua conta para gerenciar seu negócio com eficiência."
              >
                <Entrar />
              </PublicLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <PublicLayout
                title="Criar Conta"
                subtitle="Cadastre-se para começar a usar o NuPreço."
              >
                <Cadastro />
              </PublicLayout>
            </PublicRoute>
          }
        />

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
          <Route path="/contas" element={<Contas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/vendas" element={<VendaConsulta />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
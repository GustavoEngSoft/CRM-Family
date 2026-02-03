import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './componentes/Login/login';
import Dashboard from './componentes/Dashboard/dashboard';
import Pessoas from './componentes/Pessoas/pessoas';
import PessoasPorTag from './componentes/PessoasPorTag/pessoasPorTag';
import Acompanhamento from './componentes/Acompanhamento/acompanhamento';
import Comunicacao from './componentes/Comunicacao/comunicacao';
import Relatorios from './componentes/Relatorios/relatorios';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/categorias-tags" element={<PrivateRoute><Pessoas /></PrivateRoute>} />
            <Route path="/tag/:tagName" element={<PrivateRoute><PessoasPorTag /></PrivateRoute>} />
            <Route path="/acompanhamento" element={<PrivateRoute><Acompanhamento /></PrivateRoute>} />
            <Route path="/comunicacao" element={<PrivateRoute><Comunicacao /></PrivateRoute>} />
            <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;

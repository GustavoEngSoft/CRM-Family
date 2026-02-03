import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categorias-tags" element={<Pessoas />} />
          <Route path="/tag/:tagName" element={<PessoasPorTag />} />
          <Route path="/acompanhamento" element={<Acompanhamento />} />
          <Route path="/comunicacao" element={<Comunicacao />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

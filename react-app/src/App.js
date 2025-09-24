import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MateriaListagem from "./pages/materiaListagem";
import MateriaDetails from "./pages/materiaDetails";
import AlunoListagem from "./pages/alunoListagem";
import AlunoDetails from "./pages/alunoDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MateriaListagem />} />
          <Route path="/materia/:materia" element={<MateriaDetails />} />
          <Route path="/alunos" element={<AlunoListagem />} />
          <Route path="/aluno/:aluno" element={<AlunoDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import MateriaListagem from "./pages/materiaListagem";
import MateriaDetails from "./pages/materiaDetails";
import AlunoListagem from "./pages/alunoListagem";
import AlunoDetails from "./pages/alunoDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/materias"
              element={
                <ProtectedRoute>
                  <MateriaListagem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materia/:materia"
              element={
                <ProtectedRoute>
                  <MateriaDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alunos"
              element={
                <ProtectedRoute>
                  <AlunoListagem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aluno/:aluno"
              element={
                <ProtectedRoute>
                  <AlunoDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

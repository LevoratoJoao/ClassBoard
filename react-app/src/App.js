import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DownloadProvider } from "./context/DownloadContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalDownloadPopup from "./components/GlobalDownloadPopup";

import LandingPage from "./pages/landingPage";
import Login from "./pages/login";

import MateriaListagem from "./pages/materiaListagem";
import MateriaDetails from "./pages/materiaDetails";
import AlunoListagem from "./pages/alunoListagem";
import AlunoDetails from "./pages/alunoDetails";
import Inicial from "./pages/inicial";
import TurmaDetails from "./pages/turmaDetails";
import Register from "./pages/register";

function App() {
  return (
    <AuthProvider>
      <DownloadProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/inicial"
                element={
                  <ProtectedRoute>
                    <Inicial />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/turma"
                element={
                  <ProtectedRoute>
                    <TurmaDetails />
                  </ProtectedRoute>
                }
              />

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

              <Route path="/turma" element={<Navigate to="/turma" replace />} />
              <Route path="*" element={<Navigate to="/inicial" replace />} />
            </Routes>

            {/* Pop-up global de download que persiste entre páginas */}
            <GlobalDownloadPopup />
          </div>
        </Router>
      </DownloadProvider>
    </AuthProvider>
  );
}

export default App;

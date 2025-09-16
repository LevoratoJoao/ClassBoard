import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MateriaListagem from './pages/materiaListagem';
import MateriaDetails from './pages/materiaDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MateriaListagem />} />
          <Route path="/materia/:materia" element={<MateriaDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
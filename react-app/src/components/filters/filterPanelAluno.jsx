import { useState, useEffect } from "react";
import { avaliacoesAPI } from "../../services/apiService";

const FilterPanelAluno = ({ onFiltersChange }) => {
  const [materia, setMateria] = useState("All");
  const [bimestre, setBimestre] = useState("All");
  const [tipo, setTipo] = useState("All");
  const [materias, setMaterias] = useState([]);

  // Buscar matérias disponíveis da API
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        // Buscar todas as avaliações para obter todas as matérias disponíveis
        const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();
        const materiasUnicas = [
          ...new Set(todasAvaliacoes.map((avaliacao) => avaliacao.materia)),
        ];
        setMaterias(materiasUnicas.sort());
      } catch (error) {
        console.error("Erro ao buscar matérias:", error);
        // Fallback para matérias padrão
        setMaterias([
          "Artes",
          "Ciencias",
          "Geografia",
          "Historia",
          "Matematica",
          "Portugues",
        ]);
      }
    };

    fetchMaterias();
  }, []);

  const handleApplyFilters = () => {
    onFiltersChange({ materia, bimestre, tipo });
  };

  const handleClearFilters = () => {
    setMateria("All");
    setBimestre("All");
    setTipo("All");
    onFiltersChange({ materia: "All", bimestre: "All", tipo: "All" });
  };

  return (
    <div className="card h-80">
      <div className="card-body">
        <h5 className="card-title text-center">Filtros</h5>
        <hr />
        <div className="d-flex flex-column align-items-start">
          <div className="mb-3 w-100">
            <label className="form-label mb-2">Matéria</label>
            <select
              className="form-select"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            >
              <option value="All">Todas</option>
              {materias.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 w-100">
            <label className="form-label mb-2">Bimestre</label>
            <select
              className="form-select"
              value={bimestre}
              onChange={(e) => setBimestre(e.target.value)}
            >
              <option value="All">Todos</option>
              <option value="1">1º Bimestre</option>
              <option value="2">2º Bimestre</option>
              <option value="3">3º Bimestre</option>
              <option value="4">4º Bimestre</option>
            </select>
          </div>
          <div className="mb-3 w-100">
            <label className="form-label mb-2">Tipo de Avaliação</label>
            <select
              className="form-select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="All">Todos</option>
              <option value="Prova">Prova</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Recuperação">Recuperação</option>
            </select>
          </div>
          <button
            className="btn w-100 mt-2 applyFilters"
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </button>
          <button
            className="btn w-100 mt-2 clearFilters"
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelAluno;

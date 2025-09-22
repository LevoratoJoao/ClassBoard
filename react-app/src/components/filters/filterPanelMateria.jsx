import { useState } from "react";

const FilterPanelMateria = ({ onFiltersChange }) => {
  const [bimestre, setBimestre] = useState("All");
  const [tipo, setTipo] = useState("All");

  const handleApplyFilters = () => {
    onFiltersChange({ bimestre, tipo });
  };

  const handleClearFilters = () => {
    setBimestre("All");
    setTipo("All");
    onFiltersChange({ bimestre: "All", tipo: "All" });
  };

  return (
    <div className="card h-80">
      <div className="card-body">
        <h5 className="card-title text-center">Filtros</h5>
        <hr />
        <div className="d-flex flex-column align-items-start">
          <div className="mb-3 w-100">
            <label className="form-label mb-2">Bimestre</label>
            <div id="bimestreFilter" className="d-flex flex-column">
              {["All", "1", "2", "3", "4"].map((value) => (
                <div key={value} className="form-check">
                  <input
                    id={`bimestre${value}`}
                    className="form-check-input"
                    type="radio"
                    name="bimestre"
                    value={value}
                    checked={bimestre === value}
                    onChange={(e) => setBimestre(e.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`bimestre${value}`}
                  >
                    {value === "All" ? "Todos" : `${value}º Bimestre`}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label mb-2">Tipo de Avaliação</label>
          <div id="tipoFilter" className="d-flex flex-column">
            {[
              { value: "All", label: "Todos" },
              { value: "Prova", label: "Prova" },
              { value: "Trabalho", label: "Trabalho" },
              { value: "Recuperação", label: "Recuperação" },
            ].map(({ value, label }) => (
              <div key={value} className="form-check">
                <input
                  id={`tipo${value}`}
                  className="form-check-input"
                  type="radio"
                  name="tipo"
                  value={value}
                  checked={tipo === value}
                  onChange={(e) => setTipo(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`tipo${value}`}>
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          id="applyFilters"
          className="btn w-100 mt-2 applyFilters"
          onClick={handleApplyFilters}
        >
          Aplicar Filtros
        </button>
        <button
          id="clearFilters"
          className="btn w-100 mt-2 clearFilters"
          onClick={handleClearFilters}
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterPanelMateria;

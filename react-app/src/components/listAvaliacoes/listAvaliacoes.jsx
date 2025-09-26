import { useState, useEffect } from "react";
import { getAvaliacoesByMateria } from "../../services/avaliacoesService";

const ListAvaliacoes = ({ materia, filters }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    let avaliacoesMateria = getAvaliacoesByMateria(materia);

    if (filters.bimestre && filters.bimestre !== "All") {
      avaliacoesMateria = avaliacoesMateria.filter(
        (a) => String(a.bimestre) === String(filters.bimestre)
      );
    }
    if (filters.tipo && filters.tipo !== "All") {
      avaliacoesMateria = avaliacoesMateria.filter(
        (a) => a.tipo === filters.tipo
      );
    }

    setAvaliacoes(avaliacoesMateria);
  }, [materia, filters]);

  return (
    <div className="col">
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title text-center">Avaliações passadas</h5>
          <ul class="list-group">
            {avaliacoes.map((avaliacao) => (
              <li className="list-group-item" key={avaliacao.id}>
                <strong>{avaliacao.tipo}</strong> - {avaliacao.bimestre}º
                Bimestre
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListAvaliacoes;

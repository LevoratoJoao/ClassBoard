import { useState, useEffect } from "react";
import { getAvaliacoesByMateria } from "../../services/avaliacoesService";

const ListAvaliacoes = ({ materia }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const avaliacoesMateria = getAvaliacoesByMateria(materia);
    setAvaliacoes(avaliacoesMateria);
  }, [materia]);

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

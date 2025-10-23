import { useState, useEffect } from "react";
import { avaliacoesAPI } from "../../services/apiService";

const ListAvaliacoes = ({ materia, filters }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      const avaliacoesMateria = await avaliacoesAPI.filterAvaliacoes(
        materia,
        filters.tipo,
        filters.bimestre
      );
      setAvaliacoes(avaliacoesMateria);
    };

    fetchAvaliacoes();
  }, [materia, filters]);

  return (
    <div className="col">
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title text-center">Avaliações passadas</h5>
          <ul className="list-group">
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

import React, { useState, useEffect } from "react";

const BulkUploadNotaModal = ({ show, onClose, onSubmit, defaultMateria }) => {
  const [selectedAvaliacao, setSelectedAvaliacao] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [notas, setNotas] = useState({});
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "https://classboard-back-aa9y.onrender.com";

  // Carrega dados quando modal é aberto
  useEffect(() => {
    if (show) {
      fetchAvaliacoes();
      fetchAlunos();
    }
  }, [show]);

  // Busca avaliações disponíveis, filtrando por matéria se especificada
  const fetchAvaliacoes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Filtra por matéria padrão se fornecida
        const filtered = defaultMateria
          ? data.filter((av) => av.materia === defaultMateria)
          : data;
        setAvaliacoes(filtered);
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  // Busca lista de alunos
  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/alunos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
        setNotas({}); // Limpa notas ao carregar novos alunos
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Limpa notas quando avaliação é alterada
  const handleAvaliacaoChange = (e) => {
    setSelectedAvaliacao(e.target.value);
    setNotas({});
  };

  // Atualiza nota de um aluno específico
  const handleNotaChange = (alunoNome, nota) => {
    setNotas((prev) => ({ ...prev, [alunoNome]: nota }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Encontra objeto da avaliação selecionada
    const avaliacao = avaliacoes.find(
      (av) => av.id === parseInt(selectedAvaliacao)
    );
    if (!avaliacao) return;

    // Filtra apenas notas preenchidas e formata dados
    const notasData = Object.entries(notas)
      .filter(([_, nota]) => nota !== "" && nota !== undefined)
      .map(([alunoNome, nota]) => ({
        aluno_nome: alunoNome,
        avaliacao_id: avaliacao.id,
        nota: parseFloat(nota),
      }));

    onSubmit(notasData);
    // Limpa formulário após envio
    setSelectedAvaliacao("");
    setNotas({});
  };

  // Objeto da avaliação selecionada para exibição
  const selectedAvaliacaoObj = avaliacoes.find(
    (av) => av.id === parseInt(selectedAvaliacao)
  );

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Notas em Lote</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Seletor de avaliação */}
              <div className="mb-3">
                <label className="form-label">Selecione a Avaliação</label>
                <select
                  className="form-select"
                  value={selectedAvaliacao}
                  onChange={handleAvaliacaoChange}
                  required
                >
                  <option value="">Escolha uma avaliação</option>
                  {avaliacoes.map((avaliacao) => (
                    <option key={avaliacao.id} value={avaliacao.id}>
                      {avaliacao.materia} - {avaliacao.tipo} -{" "}
                      {avaliacao.bimestre}º Bimestre
                    </option>
                  ))}
                </select>
              </div>

              {/* Exibe detalhes da avaliação selecionada */}
              {selectedAvaliacaoObj && (
                <div className="alert alert-info">
                  <strong>Avaliação selecionada:</strong>{" "}
                  {selectedAvaliacaoObj.materia} - {selectedAvaliacaoObj.tipo} -{" "}
                  {selectedAvaliacaoObj.bimestre}º Bimestre
                </div>
              )}

              {/* Tabela de notas por aluno */}
              {selectedAvaliacao && (
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px" }}
                >
                  <table className="table table-striped">
                    <thead className="table-dark sticky-top">
                      <tr>
                        <th>Aluno</th>
                        <th>Nota (0-10)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="2" className="text-center">
                            Carregando alunos...
                          </td>
                        </tr>
                      ) : (
                        alunos.map((aluno) => (
                          <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>
                              {/* Input para nota individual */}
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                max="10"
                                step="0.1"
                                value={notas[aluno.nome] || ""}
                                onChange={(e) =>
                                  handleNotaChange(aluno.nome, e.target.value)
                                }
                                placeholder="Nota"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedAvaliacao}
              >
                Salvar Notas
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadNotaModal;

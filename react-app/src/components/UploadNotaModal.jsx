import React, { useState, useEffect } from "react";

const UploadNotaModal = ({ show, onClose, onSubmit, defaultMateria }) => {
  const [formData, setFormData] = useState({
    aluno_nome: "",
    materia: defaultMateria || "Portugues",
    tipo: "",
    bimestre: 1,
    nota: "",
  });
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultMateria) {
      setFormData((prev) => ({ ...prev, materia: defaultMateria }));
    }
  }, [defaultMateria]);

  useEffect(() => {
    if (show) {
      fetchAlunos();
    }
  }, [show]);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/alunos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      aluno_nome: "",
      materia: defaultMateria || "Portugues",
      tipo: "",
      bimestre: 1,
      nota: "",
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Nova Nota</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Aluno</label>
                <select
                  className="form-select"
                  name="aluno_nome"
                  value={formData.aluno_nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((aluno, index) => (
                    <option key={index} value={aluno.nome}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
                {loading && (
                  <small className="text-muted">Carregando alunos...</small>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Matéria</label>
                <select
                  className="form-select"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                  required
                  disabled={!!defaultMateria}
                >
                  <option value="Portugues">Português</option>
                  <option value="Matematica">Matemática</option>
                  <option value="Ciencias">Ciências</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Historia">História</option>
                  <option value="Artes">Artes</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Avaliação</label>
                <input
                  type="text"
                  className="form-control"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  placeholder="Ex: Prova, Trabalho, Exercício"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bimestre</label>
                <select
                  className="form-select"
                  name="bimestre"
                  value={formData.bimestre}
                  onChange={handleChange}
                  required
                >
                  <option value={1}>1º Bimestre</option>
                  <option value={2}>2º Bimestre</option>
                  <option value={3}>3º Bimestre</option>
                  <option value={4}>4º Bimestre</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nota</label>
                <input
                  type="number"
                  className="form-control"
                  name="nota"
                  value={formData.nota}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Nota
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNotaModal;

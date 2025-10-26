// src/components/UploadAlunoModal.jsx
import React, { useState } from "react";

const UploadAlunoModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: "",
    sexo: "masculino",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nome: "",
      sexo: "masculino",
    });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adicionar Novo Aluno</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome do aluno"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Sexo</label>
                <select
                  className="form-select"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
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
                Salvar Aluno
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAlunoModal;

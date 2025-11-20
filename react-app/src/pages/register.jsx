import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import fundoLogin from "../assets/images/fundoLogin.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza dados do formulário e limpa erros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setErrors({ general: "Todos os campos são obrigatórios" });
      return;
    }

    // Verifica se senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setErrors({ general: "Senhas não coincidem" });
      return;
    }

    setIsLoading(true);

    try {
      // Envia dados para API de registro
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Redireciona para login após sucesso
        navigate("/login");
      } else {
        const error = await response.json();
        setErrors({ general: error.detail || "Erro ao registrar usuário" });
      }
    } catch (error) {
      setErrors({ general: "Erro de conexão. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${fundoLogin})` }}
    >
      <div className="login-container">
        <div className="login-header">
          {/* Botão de voltar para login */}
          <button className="back-button" onClick={() => navigate("/login")}>
            ←
          </button>
          <div className="login-logo">
            <img src={logo} alt="ClassBoard Logo" />
          </div>
        </div>

        <div className="login-form-container">
          <h2>Criar Conta</h2>

          {/* Exibe erros gerais */}
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu username"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                disabled={isLoading}
              />
            </div>

            {/* Botão com estado de loading */}
            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </button>
          </form>

          <div className="login-demo">
            <p>
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import fundoLogin from "../assets/images/fundoLogin.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza dados do formulário e limpa erros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!formData.username || !formData.password) {
      setErrors({ general: "Username e senha são obrigatórios" });
      return;
    }

    setIsLoading(true);

    try {
      // Tenta fazer login usando contexto de autenticação
      await login(formData.username, formData.password);
      navigate("/inicial"); // Redireciona para página inicial
    } catch (error) {
      setErrors({
        general: "Credenciais inválidas. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${fundoLogin})` }}
    >
      <div className="login-container">
        <div className="login-header">
          {/* Botão de voltar para página inicial */}
          <button className="back-button" onClick={handleBackToLanding}>
            ←
          </button>
          <div className="login-logo">
            <img src={logo} alt="ClassBoard Logo" />
          </div>
        </div>

        <div className="login-form-container">
          <h2>Faça o Login</h2>

          {/* Exibe mensagens de erro */}
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

            {/* Botão com estado de loading */}
            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Seção de demonstração com credenciais */}
          <div className="login-demo">
            <h4>Use as Credenciais de Demonstração:</h4>
            <p>
              <strong>Username:</strong> admin
              <br />
              <strong>Senha:</strong> admin123
            </p>
            <p>
              Não tem uma conta? <Link to="/register">Criar conta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

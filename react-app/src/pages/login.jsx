import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import fundoLogin from "../assets/images/fundoLogin.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simular autenticação (você pode substituir por uma API real)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Credenciais de demo
      if (
        formData.email === "admin@classboard.com" &&
        formData.password === "admin123"
      ) {
        login({
          id: 1,
          name: "Administrador",
          email: formData.email,
          role: "admin",
        });
        navigate("/inicial");
      } else {
        setErrors({
          general:
            "Credenciais inválidas. Use: admin@classboard.com / admin123",
        });
      }
    } catch (error) {
      setErrors({
        general: "Erro ao fazer login. Tente novamente.",
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
          <button className="back-button" onClick={handleBackToLanding}>
            ←
          </button>
          <div className="login-logo">
            <img src={logo} alt="ClassBoard Logo" />
          </div>
        </div>

        <div className="login-form-container">
          <h2>Faça o Login</h2>

          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Digite seu email"
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Digite sua senha"
                disabled={isLoading}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="login-demo">
            <h4>Use as Credenciais de Demonstração:</h4>
            <p>
              <strong>Email:</strong> admin@classboard.com
              <br />
              <strong>Senha:</strong> admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

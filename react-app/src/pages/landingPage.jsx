import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import cerebro from "../assets/images/cerebro.webp";
import ia from "../assets/images/ia.webp";
import grafico from "../assets/images/grafico.webp";
import deatlhes from "../assets/images/detalhes.webp";
import { useCountUpOnVisible } from "../hooks/useCountUpOnVisible";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  // No need to pass a ref as argument!
  const [alunosRef, alunos] = useCountUpOnVisible(100);
  const [escolasRef, escolas] = useCountUpOnVisible(12);
  const [avaliacoesRef, avaliacoes] = useCountUpOnVisible(500);
  const [satisfacaoRef, satisfacao] = useCountUpOnVisible(98);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src={logo} alt="ClassBoard Logo" className="nav-logo" />
        </div>
        <button
          className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
          onClick={handleLoginClick}
        >
          Entrar
        </button>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              O controle de <span className="highlight">sala de aula</span> que
              você sempre quis
            </h1>
            <p className="hero-description">
              O ClassBoard é a plataforma completa para gestão educacional.
              Acompanhe o desempenho dos alunos, analise notas, visualize
              relatórios detalhados e tome decisões baseadas em dados.
            </p>
            <button
              className="btn btn-navbar montserrat-bold fs-4 px-4 py-2 me-2 startNow"
              onClick={handleLoginClick}
            >
              Começar Agora
            </button>
          </div>
          <div className="hero-image">
            <img src={ia} alt="Educação Inteligente" />
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Recursos Principais</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src={grafico} alt="Relatórios" />
              </div>
              <h3>Relatórios Detalhados</h3>
              <p>
                Visualize o desempenho dos alunos através de gráficos
                interativos e relatórios personalizados.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <img
                  src={deatlhes}
                  alt="Rankings"
                  style={{ width: "120px", objectFit: "contain" }}
                />
              </div>
              <h3>Visão completa</h3>
              <p>
                Acompanhe todas as notas, faltas e evolução dos alunos em um só
                lugar de forma simples e intuitiva.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <img src={cerebro} alt="IA" />
              </div>
              <h3>Análises com IA</h3>
              <p>
                Receba insights inteligentes sobre padrões de aprendizado e
                sugestões de melhorias.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Dados que Importam</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" ref={alunosRef}>
                {alunos}+
              </div>
              <div className="stat-label">Alunos Cadastrados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" ref={escolasRef}>
                {escolas}+
              </div>
              <div className="stat-label">Escolas Atendidas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" ref={avaliacoesRef}>
                {avaliacoes}+
              </div>
              <div className="stat-label">Avaliações Registradas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" ref={satisfacaoRef}>
                {satisfacao}%
              </div>
              <div className="stat-label">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para revolucionar sua gestão educacional?</h2>
            <p>
              Junte-se a centenas de educadores que já transformaram sua forma
              de ensinar com o ClassBoard.
            </p>
            <button
              className="btn btn-navbar montserrat-bold fs-4 px-4 py-2 me-2"
              onClick={handleLoginClick}
            >
              Acessar Plataforma
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={logo} alt="ClassBoard Logo" />
              <span>ClassBoard</span>
            </div>
            <p className="footer-text">
              © 2024 ClassBoard. Transformando a educação através da tecnologia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

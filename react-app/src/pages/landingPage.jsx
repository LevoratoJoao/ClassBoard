import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import cerebro from "../assets/images/cerebro.webp";
import trofeu from "../assets/images/trofeu.webp";
import grafico from "../assets/images/grafico.webp";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <nav className="landing-nav">
          <div className="nav-brand">
            <img src={logo} alt="ClassBoard Logo" className="nav-logo" />
          </div>
          <button className="btn-login" onClick={handleLoginClick}>
            Entrar
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Gerencie sua <span className="highlight">sala de aula</span> de
              forma inteligente
            </h1>
            <p className="hero-description">
              O ClassBoard é a plataforma completa para gestão educacional.
              Acompanhe o desempenho dos alunos, analise notas, visualize
              relatórios detalhados e tome decisões baseadas em dados.
            </p>
            <button className="btn-primary-large" onClick={handleLoginClick}>
              Começar Agora
            </button>
          </div>
          <div className="hero-image">
            <img src={cerebro} alt="Educação Inteligente" />
          </div>
        </div>
      </header>

      {/* Features Section */}
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
                <img src={trofeu} alt="Rankings" />
              </div>
              <h3>Rankings Inteligentes</h3>
              <p>
                Acompanhe o progresso e identifique os melhores desempenhos em
                cada disciplina.
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

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Dados que Importam</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Alunos Cadastrados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Disciplinas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Avaliações Registradas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para revolucionar sua gestão educacional?</h2>
            <p>
              Junte-se a centenas de educadores que já transformaram sua forma
              de ensinar com o ClassBoard.
            </p>
            <button className="btn-primary-large" onClick={handleLoginClick}>
              Acessar Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
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

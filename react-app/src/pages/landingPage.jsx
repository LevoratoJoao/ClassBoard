import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import cerebro from "../assets/images/cerebro.webp";
import exemplo from "../assets/images/exemplo.webp";
import grafico from "../assets/images/grafico.webp";
import deatlhes from "../assets/images/detalhes.webp";
import levorato from "../assets/images/levorato.jpg";
import sefora from "../assets/images/sefora.jpeg";
import thiago from "../assets/images/thiago.png";
import ia from "../assets/images/ia.webp";
import { useCountUpOnVisible } from "../hooks/useCountUpOnVisible";
import { carouselCards } from "../data/carouselData";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const [alunosRef, alunos] = useCountUpOnVisible(100);
  const [escolasRef, escolas] = useCountUpOnVisible(12);
  const [avaliacoesRef, avaliacoes] = useCountUpOnVisible(500);
  const [satisfacaoRef, satisfacao] = useCountUpOnVisible(98);

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(carouselCards.length / 3)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselCards.length]);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src={logo} alt="ClassBoard Logo" className="nav-logo" />
        </div>
        <div className="nav-links">
          <a href="#recursos" className="nav-link">
            Recursos
          </a>
          <a href="#detalhes" className="nav-link">
            Detalhes
          </a>
          <a href="#sobre" className="nav-link">
            Sobre
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
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
              className="btn btn-navbar montserrat-bold fs-4 px-4 py-2 me-2"
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

      <section id="recursos" className="features-section">
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

      <section id="detalhes" className="details-section">
        <div className="container">
          <h2 className="section-title">Detalhes Extras</h2>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({
                  length: Math.ceil(carouselCards.length / 3),
                }).map((_, slideIndex) => (
                  <div key={slideIndex} className="carousel-slide">
                    <div className="features-grid">
                      {carouselCards
                        .slice(slideIndex * 3, (slideIndex + 1) * 3)
                        .map((card) => (
                          <div key={card.id} className="feature-card">
                            <div className="feature-icon">
                              <img
                                src={card.image}
                                alt={card.title}
                                style={card.style || {}}
                              />
                            </div>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="carousel-dots">
            {Array.from({ length: Math.ceil(carouselCards.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${
                    currentSlide === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section className="system-preview-section">
        <div className="system-preview-content">
          <div className="system-preview-image">
            <img src={exemplo} alt="ClassBoard Sistema" />
          </div>
          <div className="system-preview-text">
            <h2 className="system-preview-title">
              Veja o <span className="highlight">ClassBoard</span> em Ação
            </h2>
            <p className="system-preview-description">
              Navegue facilmente pelo sistema com uma interface limpa e
              organizada, desenvolvida pensando na experiência do usuário
            </p>
          </div>
        </div>
      </section>

      <section id="sobre" className="about-section">
        <div className="container">
          <h2 className="section-title">Sobre Nós</h2>
          <p className="about-subtitle">
            Somos desenvolvedores empenhados em facilitar a gestão educacional,
            unindo tecnologia inovadora e paixão pela educação para transformar
            a experiência de professores e alunos, criando soluções intuitivas
            que tornam o ensino mais eficiente e impactante.
          </p>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-photo">
                <img src={levorato} alt="João" />
              </div>
              <h4>João Vitor</h4>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img src={sefora} alt="Séfora" />
              </div>
              <h4>Séfora Davanso</h4>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <img src={thiago} alt="Thiago" />
              </div>
              <h4>Thiago Cristovão</h4>
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

      <section id="faq" className="faq-section">
        <div className="container">
          <h2 className="section-title">Perguntas Frequentes</h2>
          <div className="faq-list">
            <div className={`faq-item ${activeFAQ === 0 ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(0)}>
                <h4>Preciso instalar algo?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Não! O ClassBoard é 100% online. Acesse diretamente pelo seu
                  navegador sem precisar instalar nenhum programa ou aplicativo.
                </p>
              </div>
            </div>

            <div className={`faq-item ${activeFAQ === 1 ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(1)}>
                <h4>Ele é 100% gratuito?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Sim! O ClassBoard é completamente gratuito para professores.
                  Nossa missão é democratizar o acesso a ferramentas de gestão
                  educacional de qualidade, sem custos ou mensalidades.
                </p>
              </div>
            </div>

            <div className={`faq-item ${activeFAQ === 2 ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(2)}>
                <h4>Funciona no celular?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Sim! Nossa plataforma é totalmente responsiva e funciona
                  perfeitamente em smartphones, tablets e computadores.
                </p>
              </div>
            </div>

            <div className={`faq-item ${activeFAQ === 3 ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(3)}>
                <h4>Posso usar em mais de uma turma?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  O ClassBoard é focado para professores de ensino infantil e
                  fundamental que trabalham com uma turma específica,
                  ministrando várias matérias. O sistema não suporta múltiplas
                  turmas, concentrando-se em oferecer uma gestão completa e
                  eficiente para sua turma atual.
                </p>
              </div>
            </div>

            <div className={`faq-item ${activeFAQ === 4 ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(4)}>
                <h4>Como funciona a importação de notas?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>
                  Você pode importar notas através do upload dinâmico. Nossa
                  interface intuitiva torna o processo rápido e simples.
                </p>
              </div>
            </div>
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

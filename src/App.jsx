import React, { useState, useEffect } from 'react';
import './app.css';
import meImage from "/me.jpg"

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch repositórios do GitHub
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/JULIANEJIRARDI/repos?sort=updated&per_page=6');
        const repos = await response.json();
        
        // Formatar os dados dos repositórios
        const formattedProjects = repos
          .filter(repo => !repo.fork) // Filtrar apenas repositórios próprios
          .map((repo) => ({
            id: repo.id,
            title: repo.name.charAt(0).toUpperCase() + repo.name.slice(1).replace(/-/g, ' '),
            description: repo.description || 'Sem descrição disponível',
            image: `https://raw.githubusercontent.com/JULIANEJIRARDI/${repo.name}/main/screenshot.png` || 'https://via.placeholder.com/300x200?text=' + repo.name,
            tags: repo.topics && repo.topics.length > 0 ? repo.topics : ['GitHub', 'Projeto'],
            link: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language || 'JavaScript'
          }));
        
        setProjects(formattedProjects);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const skills = [
    { category: 'Frontend', items: ['React', 'JavaScript', 'HTML5', 'CSS3'] },
    { category: 'Design', items: ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping'] },
    { category: 'Tools', items: ['Vite', 'Git', 'VS Code', 'npm'] },
    { category: 'Soft Skills', items: ['Criatividade', 'Comunicação', 'Colaboração', 'Resolução de Problemas'] }
  ];

  const handleScrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">JM</div>
          <ul className="nav-menu">
            <li><a href="#home" onClick={() => handleScrollToSection('home')} className={activeSection === 'home' ? 'active' : ''}>Home</a></li>
            <li><a href="#about" onClick={() => handleScrollToSection('about')} className={activeSection === 'about' ? 'active' : ''}>Sobre</a></li>
            <li><a href="#projects" onClick={() => handleScrollToSection('projects')} className={activeSection === 'projects' ? 'active' : ''}>Projetos</a></li>
            <li><a href="#skills" onClick={() => handleScrollToSection('skills')} className={activeSection === 'skills' ? 'active' : ''}>Habilidades</a></li>
            <li><a href="#contact" onClick={() => handleScrollToSection('contact')} className={activeSection === 'contact' ? 'active' : ''}>Contato</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="hero-avatar">
            <img src={meImage} alt="Juliane Martins" />
          </div>
          <h1 className="hero-title">Juliane Martins</h1>
          <p className="hero-subtitle">Designer & Frontend Developer</p>
          <p className="hero-description">
            Criando experiências digitais incríveis com React, JavaScript e Design criativo.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => handleScrollToSection('projects')}>Ver Meus Projetos</button>
            <button className="btn btn-secondary" onClick={() => handleScrollToSection('contact')}>Entrar em Contato</button>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">Sobre Mim</h2>
          <div className="about-content">
            <div className="about-image">
              <img src={meImage} alt="Juliane" />
            </div>
            <div className="about-text">
              <p>
                Olá! Sou Juliane Martins, uma Designer e Desenvolvedora Frontend apaixonada por criar interfaces 
                bonitas e funcionais. Com experiência em React e JavaScript, construo aplicações web modernas e responsivas.
              </p>
              <p>
                Minha jornada começou com Design, e descobri a paixão por programação ao perceber que 
                design e código andam juntos para criar experiências extraordinárias.
              </p>
              <p>
                Quando não estou codificando, adoro explorar novas tendências de design, contribuir em projetos 
                open-source e aprender novas tecnologias.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">{projects.length}+</span>
                  <span className="stat-label">Projetos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Dedicação</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Anos Exp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">Meus Projetos</h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Carregando projetos...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(project.title)}`;
                      }}
                    />
                    <div className="project-overlay">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        Ver no GitHub →
                      </a>
                    </div>
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span className="project-language">💻 {project.language}</span>
                      <span className="project-stars">⭐ {project.stars}</span>
                    </div>
                    <div className="project-tags">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-projects">Nenhum projeto encontrado. Visite meu GitHub para mais informações.</p>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">Habilidades</h2>
          <div className="skills-grid">
            {skills.map((skillGroup, index) => (
              <div key={index} className="skill-category">
                <h3>{skillGroup.category}</h3>
                <div className="skill-items">
                  {skillGroup.items.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <span className="skill-dot"></span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Vamos Conversar?</h2>
          <p className="contact-subtitle">
            Estou aberto a novas oportunidades e projetos interessantes.
          </p>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:seu.email@gmail.com">seu.email@gmail.com</a></p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h4>Telefone</h4>
                  <p><a href="tel:+5511999999999">+55 (11) 99999-9999</a></p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Localização</h4>
                  <p>São Paulo, Brasil</p>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Função de envio não implementada'); }}>
              <input type="text" placeholder="Seu Nome" required />
              <input type="email" placeholder="Seu Email" required />
              <textarea placeholder="Sua Mensagem" rows="6" required></textarea>
              <button type="submit" className="btn btn-primary">Enviar Mensagem</button>
            </form>
          </div>
        </div>
        <div className="social-links">
          <a href="https://github.com/JULIANEJIRARDI" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
          <a href="#" className="social-link">LinkedIn</a>
          <a href="#" className="social-link">Instagram</a>
          <a href="#" className="social-link">Twitter</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Juliane Martins. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
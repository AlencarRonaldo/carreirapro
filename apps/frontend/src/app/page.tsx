"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAuthStatus } from "@/lib/auth-utils"
import "./futuristic.css"

export default function Home() {
  const [authed, setAuthed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try { 
      setAuthed(getAuthStatus() === 'authenticated')
    } catch { 
      setAuthed(false) 
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Custom Cursor
    const cursor = document.querySelector('.cursor') as HTMLElement;
    const follower = document.querySelector('.cursor-follower') as HTMLElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
      
      if (follower) {
        setTimeout(() => {
          follower.style.left = e.clientX - 10 + 'px';
          follower.style.top = e.clientY - 10 + 'px';
        }, 100);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Matrix Rain Effect - Implementação melhorada
    const matrixBg = document.getElementById('matrix-bg');
    
    if (matrixBg) {
      // Limpar conteúdo anterior
      matrixBg.innerHTML = '';
      
      // Calcular número de colunas baseado na largura da tela
      const screenWidth = window.innerWidth;
      const columnWidth = 20; // Pixels por coluna aproximadamente
      const numberOfColumns = Math.floor(screenWidth / columnWidth);
      
      // Criar colunas de chuva Matrix
      for (let i = 0; i < numberOfColumns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        
        // Distribuição mais uniforme das colunas
        column.style.left = (i * (100 / numberOfColumns)) + '%';
        column.style.animationDelay = Math.random() * 5 + 's';
        column.style.animationDuration = (4 + Math.random() * 6) + 's';
        column.style.fontSize = (12 + Math.random() * 8) + 'px';
        
        // Criar string de caracteres binários mais longa
        let binaryText = '';
        const textLength = 60 + Math.floor(Math.random() * 40); // 60-100 caracteres
        for (let j = 0; j < textLength; j++) {
          binaryText += Math.random() < 0.5 ? '0' : '1';
          // Quebra de linha ocasional para criar efeito mais interessante
          if (j > 0 && j % (3 + Math.floor(Math.random() * 3)) === 0) {
            binaryText += '\n';
          }
        }
        
        column.textContent = binaryText;
        matrixBg.appendChild(column);
      }
      
      // Recriar o efeito periodicamente para manter dinâmico
      const recreateMatrix = () => {
        if (matrixBg && matrixBg.children.length > 0) {
          // Remover algumas colunas aleatoriamente e criar novas
          const columnsToUpdate = Math.floor(numberOfColumns * 0.3); // 30% das colunas
          for (let k = 0; k < columnsToUpdate; k++) {
            const randomIndex = Math.floor(Math.random() * matrixBg.children.length);
            const randomColumn = matrixBg.children[randomIndex] as HTMLElement;
            if (randomColumn) {
              // Atualizar o texto
              let newBinaryText = '';
              const newTextLength = 60 + Math.floor(Math.random() * 40);
              for (let j = 0; j < newTextLength; j++) {
                newBinaryText += Math.random() < 0.5 ? '0' : '1';
                if (j > 0 && j % (3 + Math.floor(Math.random() * 3)) === 0) {
                  newBinaryText += '\n';
                }
              }
              randomColumn.textContent = newBinaryText;
            }
          }
        }
      };
      
      // Atualizar matriz a cada 8 segundos
      setInterval(recreateMatrix, 8000);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Parallax Effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.grid-bg') as HTMLElement;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
        }
      });
    }, observerOptions);

    // Animate elements on scroll
    document.querySelectorAll('.feature-card, .stat-card, .timeline-item, .pricing-card').forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(50px) scale(0.9)';
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(element);
    });

    // Button hover effect
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('mouseenter', function() {
        if (cursor) {
          cursor.style.transform = 'scale(2)';
          cursor.style.borderColor = 'var(--neon-secondary)';
        }
      });
      
      button.addEventListener('mouseleave', function() {
        if (cursor) {
          cursor.style.transform = 'scale(1)';
          cursor.style.borderColor = 'var(--neon-primary)';
        }
      });
    });

    // Number Counter Animation
    const animateNumbers = () => {
      document.querySelectorAll('.stat-number').forEach(num => {
        const target = (num as HTMLElement).innerText;
        const isPercentage = target.includes('%');
        const isDuration = target.includes('s');
        const isTime = target.includes('/');
        const hasPlus = target.includes('+');
        
        if (!isTime) {
          let finalValue = parseFloat(target.replace(/[^0-9.]/g, ''));
          let current = 0;
          const increment = finalValue / 50;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
              current = finalValue;
              clearInterval(timer);
            }
            
            let display = current.toFixed(isDuration ? 1 : 0);
            if (isPercentage) display += '%';
            if (isDuration) display += 's';
            if (hasPlus && current === finalValue) display += 'K+';
            
            (num as HTMLElement).innerText = display;
          }, 30);
        }
      });
    };

    // Trigger number animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    // Glitch effect on hover for logo
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('mouseenter', () => {
        (logo as HTMLElement).style.animation = 'glitch 0.5s infinite';
      });
      logo.addEventListener('mouseleave', () => {
        (logo as HTMLElement).style.animation = 'glitch 2s infinite';
      });
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="loader">
        <div className="loader-text" data-text="CARREIRA PRO">CARREIRA PRO</div>
      </div>
    );
  }

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      {/* Matrix Background */}
      <div className="matrix-bg" id="matrix-bg"></div>
      
      {/* Grid Background */}
      <div className="grid-bg"></div>

      {/* Navigation */}
      <nav className="futuristic-nav">
        <div className="nav-container">
          <Link href="/" className="logo">CARREIRA.PRO</Link>
          <ul className="nav-menu">
            <li><a href="#features" className="nav-link">Recursos</a></li>
            <li><a href="#process" className="nav-link">Processo</a></li>
            <li><a href="#pricing" className="nav-link">Planos</a></li>
            {authed ? (
              <li><Link href="/profile" className="nav-link">Dashboard</Link></li>
            ) : (
              <li><Link href="/login" className="nav-link">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 IA DE ÚLTIMA GERAÇÃO</div>
          <h1 className="hero-title">
            <span className="hero-title-line" data-text="DOMINE O">DOMINE O</span>
            <span className="hero-title-line" data-text="FUTURO DA SUA">FUTURO DA SUA</span>
            <span className="hero-title-line" data-text="CARREIRA">CARREIRA</span>
          </h1>
          <p className="hero-description">
            Algoritmos avançados de IA analisam vagas, otimizam currículos para ATS e garantem matches perfeitos. O futuro do recrutamento está aqui.
          </p>
          <div>
            {authed ? (
              <Link href="/profile">
                <button className="btn-3d">ACESSAR DASHBOARD</button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="btn-3d">INICIAR JORNADA</button>
              </Link>
            )}
            <Link href="/demo">
              <button className="btn-outline">VER DEMO</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Taxa de Aprovação ATS</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Profissionais Ativos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0.3s</div>
            <div className="stat-label">Análise por IA</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Suporte Inteligente</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <div className="section-badge">⚡ RECURSOS</div>
          <h2 className="section-title">Tecnologia Revolucionária</h2>
          <p className="section-subtitle">Ferramentas poderosas impulsionadas por inteligência artificial</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">Neural ATS Engine</h3>
            <p className="feature-description">
              Engine neural que processa e otimiza seu currículo em tempo real para máxima compatibilidade com sistemas ATS.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">Deep Learning Analysis</h3>
            <p className="feature-description">
              Análise profunda de vagas usando NLP avançado para identificar requisitos ocultos e palavras-chave cruciais.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Quantum Matching</h3>
            <p className="feature-description">
              Algoritmo quântico que calcula probabilidades de match em microsegundos com precisão superior a 95%.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Smart Targeting</h3>
            <p className="feature-description">
              Sistema inteligente que adapta seu perfil para cada vaga específica maximizando chances de sucesso.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Analytics Dashboard</h3>
            <p className="feature-description">
              Painel analítico com métricas em tempo real, insights preditivos e recomendações personalizadas.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3 className="feature-title">API Integration</h3>
            <p className="feature-description">
              Integração seamless com LinkedIn, Indeed e principais plataformas de recrutamento via API REST.
            </p>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="process-section" id="process">
        <div className="section-header">
          <div className="section-badge">⚙️ PROCESSO</div>
          <h2 className="section-title">Pipeline Automatizado</h2>
          <p className="section-subtitle">Do upload ao sucesso em 5 etapas revolucionárias</p>
        </div>
        
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>Onboarding Instantâneo</h3>
              <p>Crie sua conta em segundos. Autenticação biométrica e criptografia de ponta.</p>
            </div>
            <div className="timeline-number">01</div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>Data Mining</h3>
              <p>Importação automática via LinkedIn API ou upload direto. Parser inteligente extrai todos os dados.</p>
            </div>
            <div className="timeline-number">02</div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>Template Selection</h3>
              <p>IA sugere templates otimizados baseados no seu perfil e indústria alvo.</p>
            </div>
            <div className="timeline-number">03</div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>Deep Analysis</h3>
              <p>Neural network analisa vaga e otimiza currículo em tempo real com score preditivo.</p>
            </div>
            <div className="timeline-number">04</div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>Deploy & Track</h3>
              <p>Envio automatizado e tracking em tempo real com notificações push.</p>
            </div>
            <div className="timeline-number">05</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <div className="section-badge">💎 PLANOS</div>
          <h2 className="section-title">Escolha seu Arsenal</h2>
          <p className="section-subtitle">Planos desenvolvidos para cada fase da sua jornada</p>
        </div>
        
        <div className="pricing-container">
          <div className="pricing-card">
            <div className="plan-name">Starter</div>
            <div className="plan-price">R$0</div>
            <div className="plan-period">Forever Free</div>
            <ul className="plan-features">
              <li>2 currículos completos</li>
              <li>5 templates básicos</li>
              <li>3 análises mensais</li>
              <li>Export PDF (marca d&apos;água)</li>
              <li>Suporte via email</li>
            </ul>
            <Link href="/login">
              <button className="btn-outline" style={{width: '100%'}}>COMEÇAR AGORA</button>
            </Link>
          </div>
          
          <div className="pricing-card featured">
            <div className="plan-name">Professional</div>
            <div className="plan-price">R$29</div>
            <div className="plan-period">por mês</div>
            <ul className="plan-features">
              <li>Currículos ilimitados</li>
              <li>50+ templates premium</li>
              <li>Análises ilimitadas com IA</li>
              <li>Export sem marca d&apos;água</li>
              <li>Cover Letter Generator</li>
              <li>LinkedIn Optimizer</li>
              <li>Priority Support 24/7</li>
            </ul>
            <Link href={authed ? "/subscription" : "/login"}>
              <button className="btn-3d" style={{width: '100%'}}>UPGRADE PRO</button>
            </Link>
          </div>
          
          <div className="pricing-card">
            <div className="plan-name">Enterprise</div>
            <div className="plan-price">R$99</div>
            <div className="plan-period">por mês</div>
            <ul className="plan-features">
              <li>Tudo do Professional</li>
              <li>10 usuários inclusos</li>
              <li>API REST completa</li>
              <li>White label option</li>
              <li>Custom integrations</li>
              <li>Dedicated account manager</li>
              <li>SLA garantido 99.9%</li>
            </ul>
            <button className="btn-outline" style={{width: '100%'}}>FALAR COM VENDAS</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-header">
          <h2 className="cta-title">
            PRONTO PARA O FUTURO?
          </h2>
          <p className="section-subtitle">
            Junte-se a milhares de profissionais que já dominam o mercado com IA
          </p>
          <div style={{marginTop: '3rem'}}>
            <Link href={authed ? "/profile" : "/login"}>
              <button className="btn-3d">COMEÇAR GRATUITAMENTE</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="futuristic-footer">
        <div className="footer-content">
          <div className="logo">CARREIRA.PRO</div>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Termos</a></li>
            <li><a href="#" className="footer-link">Privacidade</a></li>
            <li><a href="#" className="footer-link">API</a></li>
            <li><a href="#" className="footer-link">Blog</a></li>
          </ul>
          <div className="social-links">
            <a href="#" className="social-link">f</a>
            <a href="#" className="social-link">t</a>
            <a href="#" className="social-link">in</a>
            <a href="#" className="social-link">@</a>
          </div>
        </div>
      </footer>
    </>
  )
}
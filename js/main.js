/**
 * DIANA ELENA DRAGUNA — PORTFOLIO PROFESIONAL INTERACTIVO
 * Motor JS: Lightbox de Fotos Ampliables, Chatbot Inteligente Diferenciado, Carruseles y TFG
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initImageZoomLightbox();
  initKedgeCarousel();
  initImmersionCarousel();
  initVideoPlayer();
  initChatbot();
  initClipboardButtons();
  initModalSystem();
});

/* ==========================================================================
   1. GESTIÓN DE TEMA (CLARO / OSCURO)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
      showToast(isDark ? '🌙 Modo Oscuro activado' : '☀️ Modo Claro activado');
    });
  }

  function updateThemeIcons(isDark) {
    if (themeIconSun && themeIconMoon) {
      if (isDark) {
        themeIconSun.classList.remove('hidden');
        themeIconMoon.classList.add('hidden');
      } else {
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
      }
    }
  }
}

/* ==========================================================================
   2. NAVEGACIÓN Y ACTIVE SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-amber-700', 'dark:text-amber-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-amber-700', 'dark:text-amber-400', 'font-semibold');
      }
    });
  });
}

/* ==========================================================================
   3. FOTOS AMPLIABLES (LIGHTBOX MODAL PARA TODAS LAS IMÁGENES)
   ========================================================================== */
function initImageZoomLightbox() {
  const modal = document.getElementById('image-zoom-modal');
  const zoomedImg = document.getElementById('zoomed-image');
  const captionEl = document.getElementById('zoomed-image-caption');
  const closeBtn = document.getElementById('image-zoom-close-btn');

  if (!modal || !zoomedImg) return;

  // Registrar clic en todas las fotos con clase zoomable-photo
  document.querySelectorAll('.zoomable-photo').forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || 'Fotografía de Diana Elena Draguna';
      const customCaption = img.getAttribute('data-caption') || alt;

      zoomedImg.src = src;
      zoomedImg.alt = alt;
      if (captionEl) captionEl.textContent = customCaption;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeZoomModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeZoomModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-backdrop-target')) {
      closeZoomModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeZoomModal();
    }
  });
}

/* ==========================================================================
   4. CARRUSEL KEDGE BUSINESS SCHOOL (3 FOTOS) CON FLECHAS FUNCIONALES
   ========================================================================== */
function initKedgeCarousel() {
  const slides = document.querySelectorAll('.kedge-slide');
  const prevBtn = document.getElementById('kedge-prev-btn');
  const nextBtn = document.getElementById('kedge-next-btn');
  const counter = document.getElementById('kedge-counter');
  const caption = document.getElementById('kedge-caption');
  const dotsContainer = document.getElementById('kedge-dots');

  if (!slides.length) return;

  let currentIndex = 0;
  const captions = [
    { title: 'Campus KEDGE Bordeaux', desc: 'Intercambio Erasmus en Management · Acreditación Triple Corona (EQUIS, AMBA, AACSB)' },
    { title: 'Gestión y Trabajo en Equipo', desc: 'Presentaciones ejecutivas y resolución de casos en grupos multiculturales' },
    { title: 'Inmersión Académica Internacional', desc: 'Excelencia en dirección responsable y marketing · Nota media: 8,63 / 10' }
  ];

  function renderSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    if (counter) {
      counter.textContent = `${index + 1} / ${slides.length}`;
    }

    if (caption && captions[index]) {
      caption.innerHTML = `<span class="font-bold text-amber-700 dark:text-amber-400 mr-2">${captions[index].title}</span><span class="text-stone-500 dark:text-stone-400">${captions[index].desc}</span>`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.kedge-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-amber-600', i === index);
        dot.classList.toggle('bg-stone-300', i !== index);
        dot.classList.toggle('dark:bg-stone-600', i !== index);
      });
    }
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `kedge-dot w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`;
      dot.setAttribute('aria-label', `Ver foto ${i + 1} de Kedge`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = i;
        renderSlide(currentIndex);
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex);
    });
  }

  renderSlide(0);
}

/* ==========================================================================
   5. CARRUSEL INMERSIÓN EN IRLANDA (4 FOTOS) CON FLECHAS FUNCIONALES
   ========================================================================== */
function initImmersionCarousel() {
  const slides = document.querySelectorAll('.immersion-slide');
  const prevBtn = document.getElementById('immersion-prev-btn');
  const nextBtn = document.getElementById('immersion-next-btn');
  const counter = document.getElementById('immersion-counter');
  const caption = document.getElementById('immersion-caption');
  const dotsContainer = document.getElementById('immersion-dots');

  if (!slides.length) return;

  let currentIndex = 0;
  const captions = [
    { title: 'Bray & Dublín (Irlanda)', desc: 'Programa intensivo de inmersión lingüística completa con Interway' },
    { title: 'Adaptación Sociocultural', desc: 'Desarrollo de independencia personal y desenvoltura en entorno internacional' },
    { title: 'Fluidez y Comunicación Real', desc: 'Uso diario y espontáneo del idioma inglés en situaciones cotidianas y académicas' },
    { title: 'Experiencia y Visión Global', desc: 'Ampliación de horizontes culturales y competencias de relación intercultural' }
  ];

  function renderSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    if (counter) {
      counter.textContent = `${index + 1} / ${slides.length}`;
    }

    if (caption && captions[index]) {
      caption.innerHTML = `<span class="font-bold text-teal-700 dark:text-teal-400 mr-2">${captions[index].title}</span><span class="text-stone-500 dark:text-stone-400">${captions[index].desc}</span>`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.immersion-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-teal-600', i === index);
        dot.classList.toggle('bg-stone-300', i !== index);
        dot.classList.toggle('dark:bg-stone-600', i !== index);
      });
    }
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `immersion-dot w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-teal-600' : 'bg-stone-300 dark:bg-stone-600'}`;
      dot.setAttribute('aria-label', `Ver foto ${i + 1} de Inmersión`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = i;
        renderSlide(currentIndex);
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex);
    });
  }

  renderSlide(0);
}

/* ==========================================================================
   6. REPRODUCTORES DE VÍDEO (ELEVATOR PITCH, PROYECTO & HABILIDADES)
   ========================================================================== */
function initVideoPlayer() {
  const containers = document.querySelectorAll('.video-container-custom');
  if (!containers.length) return;

  const allVideos = document.querySelectorAll('.video-container-custom video');

  containers.forEach(container => {
    const videoElem = container.querySelector('video');
    const overlayBtn = container.querySelector('.video-play-overlay-btn');

    if (!videoElem) return;

    if (overlayBtn) {
      overlayBtn.addEventListener('click', () => {
        if (videoElem.paused) {
          // Pausar cualquier otro vídeo activo para evitar reproducciones simultáneas
          allVideos.forEach(v => {
            if (v !== videoElem && !v.paused) v.pause();
          });
          videoElem.play();
          overlayBtn.classList.add('opacity-0', 'pointer-events-none');
        } else {
          videoElem.pause();
          overlayBtn.classList.remove('opacity-0', 'pointer-events-none');
        }
      });
    }

    videoElem.addEventListener('play', () => {
      // Sincronizar pausa de otros reproductores si se activa desde controles nativos
      allVideos.forEach(v => {
        if (v !== videoElem && !v.paused) v.pause();
      });
      if (overlayBtn) overlayBtn.classList.add('opacity-0', 'pointer-events-none');
    });

    videoElem.addEventListener('pause', () => {
      if (overlayBtn) overlayBtn.classList.remove('opacity-0', 'pointer-events-none');
    });

    videoElem.addEventListener('ended', () => {
      if (overlayBtn) overlayBtn.classList.remove('opacity-0', 'pointer-events-none');
    });
  });
}


/* ==========================================================================
   7. CHATBOT INTELIGENTE ORIENTADO A SOLUCIONES Y EVIDENCIAS REALES
   (Motor NLP de Puntuación Semántica: Responde siempre con soluciones basadas en el CV,
   detalla los mayores retos reales y nunca desvía de forma perezosa a WhatsApp)
   ========================================================================== */
function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const messagesContainer = document.getElementById('chat-messages');
  const inputForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  if (!toggleBtn || !chatWindow) return;

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  // Delegación de eventos para chips superiores
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query') || chip.textContent.trim();
      handleUserMessage(query);
    });
  });

  // Delegación para chips interactivos dentro de las respuestas
  if (messagesContainer) {
    messagesContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip-inline');
      if (chip) {
        const query = chip.getAttribute('data-query') || chip.textContent.trim();
        handleUserMessage(query);
      }
    });
  }

  if (inputForm) {
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      handleUserMessage(text);
    });
  }

  function handleUserMessage(query) {
    appendMessage(query, 'user');
    const typingId = appendTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator(typingId);
      const answer = generateSolutionResponse(query);
      appendMessage(answer, 'bot');
    }, 400);
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} animate-fadeIn`;
    bubble.innerHTML = text;
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'chat-bubble chat-bubble-bot flex items-center gap-1.5 py-2.5';
    indicator.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.4s]"></span>
    `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Base de Conocimiento y Diccionario Semántico Ponderado
  const intentKnowledge = {
    retos_dificil: {
      phrases: [
        'mas dificil', 'mayor reto', 'mayores retos', 'mayor desafio', 'mayores desafios',
        'situacion compleja', 'situaciones complejas', 'obstaculo', 'obstaculos', 'problema complejo',
        'problemas complejos', 'como resuelves', 'resolucion de problemas', 'bajo presion',
        'situacion dificil', 'lo mas complicado', 'que fue lo mas dificil', 'peor momento',
        'que ha sido lo mas dificil', 'que es lo mas dificil que has hecho'
      ],
      tokens: [
        'reto', 'retos', 'desafio', 'desafios', 'fracaso', 'fracasos', 'error', 'errores',
        'dificultad', 'dificultades', 'dificil', 'dificiles', 'complicado', 'debilidad', 'debilidades'
      ],
      response: `<strong>Soluciones ante los Mayores Desafíos Profesionales de Diana:</strong><br><br>
      Diana aborda cualquier reto complejo con una metodología ordenada y analítica: <strong>diagnóstico de la ineficiencia, modelado cuantitativo y ejecución rápida de soluciones</strong>:<br><br>
      1. <strong>Automatización en Carrefour (Reto Técnico & de Eficiencia):</strong><br>
      • <em>El Desafío:</em> El equipo perdía horas diarias volcando datos manualmente de Carrefour PASS en hojas de cálculo dispersas, con elevado riesgo de error humano y sin ningún pipeline previo desarrollado.<br>
      • <em>La Solución de Diana:</em> Asumió por iniciativa propia la programación en <strong>Python (Spyder con Pandas)</strong> de 6 procesos de reporting automatizado. Redujo el tiempo manual en un <strong>85%</strong> y aseguró la total fiabilidad del dato.<br><br>
      2. <strong>Cierres Contables y Auditoría de Rappels en Campofrío (Reto Financiero & Rigor):</strong><br>
      • <em>El Desafío:</em> Conciliar grandes volúmenes de facturación y calcular liquidaciones de rappels por volumen de grandes cuentas bajo la estricta presión de plazos de cierre mensual.<br>
      • <em>La Solución de Diana:</em> Construcción y explotación de dashboards comerciales integrando <strong>SAP ERP, IBIS y Excel avanzado</strong>, logrando cierres rigurosos sin desvíos contables.<br><br>
      3. <strong>Alineamiento Negocio - TI en El Corte Inglés (Reto de Coordinación):</strong><br>
      • <em>El Desafío:</em> Brecha de prioridades entre las metas comerciales y los desarrollos técnicos de los programadores.<br>
      • <em>La Solución de Diana:</em> Documentación funcional estructurada, mapeo de flujos <strong>As-Is / To-Be</strong> y diseño de planes de prueba <strong>UAT</strong>, validando que el software cumpliese con la operativa real.<br><br>
      4. <strong>Compromiso y Resiliencia Multidisciplinar:</strong><br>
      • <em>El Desafío:</em> Compatibilizar un riguroso Doble Grado en ADE + Data Science con un intercambio Erasmus superado con <strong>8,63 / 10</strong> y la capitanía deportiva en baloncesto.<br>
      • <em>La Solución de Diana:</em> Disciplina horaria, tolerancia a la presión y liderazgo basado en la confianza de equipo.`
    },

    experiencia_general: {
      phrases: [
        'donde has trabajado', 'donde ha trabajado', 'donde trabajo', 'donde trabajaste',
        'donde trabajas', 'carrera profesional', 'experiencia laboral', 'historial laboral',
        'resumen experiencia', 'que has hecho', 'que ha hecho', 'proyectos laborales',
        'empresas donde ha trabajado', 'en que ha trabajado', 'vida laboral'
      ],
      tokens: [
        'experiencia', 'experiencias', 'trayectoria', 'empresas', 'practicas', 'empleo',
        'empleos', 'trabajos', 'trabajo', 'curriculum', 'cv'
      ],
      response: `<strong>Trayectoria Laboral y Experiencia Profesional de Diana Elena Draguna:</strong><br><br>
      Diana ha aportado valor en tres corporaciones de primer nivel, resolviendo retos en datos, control de gestión y procesos:<br><br>
      1. <strong>Centros Comerciales Carrefour | Beca Captación FF&SS (2026):</strong><br>
      • Automatización proactiva de <strong>6 procesos de reporting comercial</strong> mediante <strong>Python (Pandas, Spyder)</strong>, logrando un <strong>85% de ahorro de tiempo manual</strong>.<br>
      • Seguimiento comercial de la tarjeta <strong>Carrefour PASS</strong>, análisis de consumo y materiales formativos para hipermercados.<br><br>
      2. <strong>Campofrío Food Group | Beca Controlling Área Comercial (2025 - 2026):</strong><br>
      • Controlling de rentabilidad, márgenes brutos/netos y descuentos por cliente y canal (Retail, Foodservice y Exportación).<br>
      • Dashboards en <strong>SAP, IBIS y Excel</strong>; auditoría de contratos y liquidación de rappels; y soporte activo en cierres contables mensuales.<br><br>
      3. <strong>Centros El Corte Inglés | Beca Analista de Negocios:</strong><br>
      • Enlace funcional entre Negocio y TI, levantamiento de especificaciones técnicas y mapeo de flujos <strong>As-Is / To-Be</strong>.<br>
      • Pruebas de aceptación de usuario (<strong>UAT</strong>), modelos predictivos de demanda (forecasting) y evaluación de campañas.<br><br>
      <div class="flex flex-wrap gap-1.5 pt-1">
        <button class="chat-chip-inline px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-medium hover:bg-amber-600 hover:text-white transition-colors" data-query="que hizo en carrefour">Ver Carrefour</button>
        <button class="chat-chip-inline px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-medium hover:bg-amber-600 hover:text-white transition-colors" data-query="rol en campofrio">Ver Campofrío</button>
        <button class="chat-chip-inline px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-medium hover:bg-amber-600 hover:text-white transition-colors" data-query="que hizo en el corte ingles">Ver El Corte Inglés</button>
      </div>`
    },

    carrefour: {
      phrases: [
        'carrefour pass', 'servicios financieros', '6 procesos', 'seis procesos', '85 por ciento',
        'captacion ffss', 'captacion ff ss', 'reporting carrefour'
      ],
      tokens: [
        'carrefour', 'python', 'spyder', 'pass', 'ffss', 'captacion',
        'automatiz', 'automatizacion', 'automatizo', 'automatizar', 'volcado', 'pandas'
      ],
      response: `<strong>Experiencia en Centros Comerciales Carrefour (Beca Captación FF&SS):</strong><br><br>
      • <strong>Iniciativa Propia en Automatización con Python:</strong> Asumió de forma proactiva la automatización de <strong>6 procesos críticos de reporting comercial</strong> que anteriormente se realizaban de forma manual en hojas de cálculo dispersas. Desarrolló scripts en <strong>Python (Spyder con Pandas)</strong>, reduciendo en un <strong>85% el tiempo de procesamiento manual</strong> del equipo y eliminando el riesgo de errores en el volcado de datos.<br>
      • <strong>Reporting Carrefour PASS:</strong> Consolidación periódica y seguimiento de altas de clientes, campañas comerciales y volumen financiado a través de la tarjeta Carrefour PASS.<br>
      • <strong>Análisis de Comportamiento:</strong> Evaluación cuantitativa de patrones de compra y desempeño de campañas para fundamentar decisiones comerciales.<br>
      • <strong>Materiales para Tiendas:</strong> Elaboración de guías y presentaciones formativas ejecutivas para los gestores en hipermercados.`
    },

    campofrio: {
      phrases: [
        'cierre contable', 'cierres contables', 'auditoria comercial', 'cuadre contable',
        'controlling campofrio', 'campofrio food group'
      ],
      tokens: [
        'campofrio', 'controlling', 'sap', 'ibis', 'rappel', 'rappels', 'margen', 'margenes',
        'descuento', 'descuentos', 'rentabilidad', 'foodservice', 'horeca'
      ],
      response: `<strong>Experiencia en Campofrío Food Group (Beca Controlling Comercial):</strong><br><br>
      • <strong>Controlling de Rentabilidad & KPIs:</strong> Seguimiento diario de indicadores comerciales, márgenes brutos y netos, y políticas de precios y descuentos por cliente y canal (Retail, Foodservice y Exportación).<br>
      • <strong>Cuadros de Mando en SAP, IBIS y Excel:</strong> Creación y actualización de dashboards de ventas integrando datos del ERP <strong>SAP</strong> con el software <strong>IBIS</strong> y modelos financieros en Excel.<br>
      • <strong>Auditoría de Acuerdos y Rappels:</strong> Revisión exhaustiva de la facturación de grandes clientes para verificar la correcta aplicación de promociones y el cálculo exacto de <strong>rappels por volumen</strong> contractual.<br>
      • <strong>Cierres Contables Mensuales:</strong> Verificación de pedidos pendientes, facturas emitidas y periodificaciones de ingresos y gastos, garantizando el cuadre exacto de las cuentas.`
    },

    corte_ingles: {
      phrases: [
        'corte ingles', 'el corte ingles', 'analista de negocios', 'analista funcional',
        'as is', 'to be', 'pruebas uat', 'pronostico demanda', 'flujos de trabajo', 'analisis funcional'
      ],
      tokens: [
        'uat', 'forecasting', 'demanda'
      ],
      response: `<strong>Experiencia en Centros El Corte Inglés (Beca Analista de Negocios):</strong><br><br>
      • <strong>Enlace Negocio - TI:</strong> Traducción de objetivos comerciales en requerimientos funcionales y técnicos para el equipo de desarrollo de software informático.<br>
      • <strong>Mapeo de Procesos As-Is / To-Be:</strong> Diagnóstico de flujos de trabajo existentes, detección de cuellos de botella y diseño de procedimientos optimizados.<br>
      • <strong>Pruebas de Aceptación (UAT):</strong> Definición, ejecución y validación de casos de prueba con usuarios clave para verificar que los nuevos módulos informáticos cumpliesen con la operativa del negocio.<br>
      • <strong>Forecasting de Ventas:</strong> Construcción de modelos predictivos de demanda para estimar volumen de venta y evaluar el retorno económico de promociones.`
    },

    estudios: {
      phrases: [
        'doble grado', 'nota media', 'ciencia de datos', 'ciencias de datos', 'administracion y direccion',
        'titulo superior', 'estudios universitarios', 'que ha estudiado', 'donde estudio', 'donde ha estudiado'
      ],
      tokens: [
        'estudio', 'estudios', 'estudiado', 'estudiando', 'estudias', 'estudiaste',
        'universidad', 'carrera', 'grado', 'esic', 'titulacion', 'formacion',
        'educacion', 'ade', 'asignaturas', 'materias', 'expediente', 'facultad'
      ],
      response: `<strong>Formación Universitaria Oficial de Diana Elena Draguna:</strong><br><br>
      1. <strong>ESIC University (Madrid, 2022 - Actualidad):</strong><br>
      • <strong>Doble Grado en Administración y Dirección de Empresas (ADE) y Título Superior en Data Science</strong> (Nota media: 7,1 / 10).<br>
      • <em>Asignaturas clave:</em> Sistemas de Información de Gestión, Modelación Estadística con R, Visualización de Datos, Patrones de Consumo, Métodos de Decisión Empresarial y Minería de Datos.<br><br>
      2. <strong>KEDGE Business School (Bordeaux, Francia, Feb - May 2025):</strong><br>
      • <strong>Intercambio Erasmus en Management</strong> superado con <strong>nota media de 8,63 / 10</strong>.<br>
      • Cursos en inglés: <em>Responsible Management & CSR, Luxury Marketing, Cross-Cultural Management, CSR & International Development</em>.<br><br>
      3. <strong>Trabajo de Fin de Grado (TFG):</strong><br>
      • <em>"Impacto del Liderazgo en Amazon"</em> analizando 170 encuestas sobre cultura corporativa, innovación y bienestar laboral.`
    },

    tfg: {
      phrases: [
        'trabajo de fin de grado', 'trabajo fin de grado', 'fin de grado',
        'liderazgo en amazon', '170 encuestas', 'maria jose', 'luciano lopez', 'day 1',
        'tfg amazon', 'sobre amazon', 'memoria del tfg'
      ],
      tokens: [
        'tfg', 'amazon', 'tesis', 'encuesta', 'encuestas'
      ],
      response: `<strong>Trabajo de Fin de Grado (TFG): "Impacto del Liderazgo en Amazon"</strong><br><br>
      • <strong>Titulación:</strong> Grado en ADE · ESIC University (Curso Académico 2025/2026).<br>
      • <strong>Autoras:</strong> Diana Elena Draguna y María José Gutiérrez | <strong>Tutor:</strong> Luciano López Gómez.<br>
      • <strong>Metodología Mixta:</strong> Combinación de una <strong>encuesta cuantitativa a 170 participantes</strong> (escala Likert de 5 puntos) con entrevistas cualitativas a empleados de Amazon.<br>
      • <strong>Hallazgos Clave:</strong> Examina cómo la filosofía Day 1 y la obsesión por el cliente de Jeff Bezos sostienen el liderazgo mundial de Amazon, evaluando además su impacto en el bienestar y retención del talento humano.<br><br>
      <a href="tfg%20DEFINNITIVO%20.pdf" download="TFG_Diana_Elena_Draguna_Liderazgo_Amazon.pdf" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs">
        <span>⬇️ Descargar Memoria Completa del TFG (PDF · 1.0 MB)</span>
      </a>`
    },

    kedge: {
      phrases: [
        'triple corona', 'responsible management', 'luxury marketing', 'cross cultural',
        'nota kedge', 'kedge bordeaux', 'erasmus kedge', 'francia kedge', 'burdeos kedge'
      ],
      tokens: [
        'kedge', 'bordeaux', 'burdeos', 'francia', 'erasmus', 'intercambio', 'csr'
      ],
      response: `<strong>Intercambio Erasmus en KEDGE Business School (Bordeaux, Francia):</strong><br><br>
      • <strong>Periodo y Calificación:</strong> Febrero a Mayo de 2025, completado con una sobresaliente <strong>nota media de 8,63 / 10</strong>.<br>
      • <strong>Institución:</strong> Escuela acreditada con la prestigiosa <strong>Triple Corona internacional (EQUIS, AMBA, AACSB)</strong>.<br>
      • <strong>Asignaturas cursadas íntegramente en inglés:</strong><br>
        - <em>Responsible Management & CSR:</em> Modelos de negocio sostenibles y métricas ESG.<br>
        - <em>Luxury Marketing:</em> Estrategia de valor, branding y posicionamiento de marcas globales.<br>
        - <em>Cross-Cultural Management:</em> Negociación y liderazgo de equipos multiculturales.<br>
        - <em>CSR & International Development:</em> Cadenas de valor éticas y desarrollo internacional.`
    },

    inmersion_irlanda: {
      phrases: [
        'estancia irlanda', 'viaje irlanda', 'bray dublin', 'estancia en irlanda', 'inmersion en irlanda'
      ],
      tokens: [
        'irlanda', 'bray', 'dublin', 'inmersion', 'interway'
      ],
      response: `<strong>Inmersión Lingüística en Bray & Dublín (Irlanda):</strong><br><br>
      • <strong>Programa:</strong> Estancia intensiva de un mes organizada con la institución especializada Interway.<br>
      • <strong>Competencias Desarrolladas:</strong> Convivencia total en entorno nativo anglófono, fortaleciendo la autonomía personal, la resolución espontánea de situaciones cotidianas y la soltura comunicativa en inglés profesional.`
    },

    idiomas: {
      phrases: [
        'hablas ingles', 'habla ingles', 'nivel de ingles', 'que idiomas', 'cuantos idiomas',
        'perfil trilingue', 'idiomas que habla'
      ],
      tokens: [
        'idioma', 'idiomas', 'lengua', 'lenguas', 'ingles', 'rumano', 'castellano',
        'espanol', 'trilingue', 'bilingue'
      ],
      response: `<strong>Perfil Lingüístico Trilingüe de Diana Elena Draguna:</strong><br><br>
      • <strong>Castellano:</strong> Lengua materna (nativo). Fluidez ejecutiva y presentaciones comerciales de alto impacto.<br>
      • <strong>Rumano:</strong> Lengua materna (nativo). Bilingüismo natural y flexibilidad mental intercultural.<br>
      • <strong>Inglés:</strong> Nivel intermedio/avanzado funcional (C1 de trabajo). Utilizado en asignaturas en Francia, inmersión en Irlanda, lectura de documentación técnica y programación.`
    },

    habilidades_tecnicas: {
      phrases: [
        'hard skills', 'excel avanzado', 'power query', 'sabe programar', 'que sabes hacer',
        'habilidades tecnicas', 'herramientas que domina', 'que programas maneja', 'competencias analiticas'
      ],
      tokens: [
        'habilidades', 'habilidad', 'competencias', 'competencia', 'skills',
        'herramientas', 'herramienta', 'programas', 'software', 'tecnologias',
        'tecnologia', 'lenguajes', 'programar', 'programacion', 'tableau', 'r',
        'sql', 'power bi', 'excel', 'dax', 'ga4'
      ],
      response: `<strong>Competencias Analíticas, Herramientas y Metodologías:</strong><br><br>
      Diana une la solvencia cuantitativa de Data Science con la visión aplicada de ADE:<br><br>
      • <strong>Programación & Datos:</strong> Python (Pandas, NumPy, scripts ETL en Spyder), R (modelación econométrica y estadística multivariante).<br>
      • <strong>Sistemas de Gestión ERP:</strong> SAP ERP (módulos comercial y de facturación), IBIS Sales Intelligence.<br>
      • <strong>Business Intelligence & Reporting:</strong> Microsoft Power BI (modelado relacional en DAX y Power Query), Google Analytics 4 (GA4, eventos y conversión).<br>
      • <strong>Modelado Financiero:</strong> Microsoft Excel Avanzado (tablas dinámicas complejas, modelos de márgenes y fórmulas analíticas).<br>
      • <strong>Cloud & IA:</strong> Microsoft Azure Fundamentals (AZ-900) y Azure AI Fundamentals (AI-900).<br>
      • <strong>Metodología de Procesos:</strong> Diagramación As-Is / To-Be, especificaciones funcionales y planes de prueba UAT.`
    },

    certificaciones: {
      phrases: [
        'titulos oficiales', 'google analytics', 'excel associate', 'microsoft certified',
        'certificaciones tecnicas', 'certificados oficiales', 'cuales son sus certificaciones'
      ],
      tokens: [
        'certificacion', 'certificaciones', 'certificados', 'certificado', 'credenciales',
        'azure', 'az900', 'ai900'
      ],
      response: `<strong>5 Certificaciones Técnicas Oficiales de Diana:</strong><br><br>
      1. <strong>Microsoft Azure Fundamentals (AZ-900, 2026):</strong> Conceptos de nube, arquitectura, infraestructura y gobierno del dato.<br>
      2. <strong>Microsoft Azure AI Fundamentals (AI-900, 2026):</strong> Machine Learning, Computer Vision y principios éticos de IA responsable.<br>
      3. <strong>Google Analytics Certificate (GA4, 2025):</strong> Medición de eventos web, embudos de conversión y audiencias.<br>
      4. <strong>Power BI Dashboard Creation (ESIC, 2024):</strong> Extracción Power Query, modelado DAX y cuadros de mando interactivos.<br>
      5. <strong>Microsoft Excel Associate (2023):</strong> Fórmulas avanzadas, modelado financiero y análisis dinámico de datos.`
    },

    deportes_liderazgo: {
      phrases: [
        'ciudad de la raqueta', 'sagrado corazon', 'la salle', 'liderazgo deportivo', 'disciplina deportiva',
        'experiencia en deportes', 'capitana baloncesto'
      ],
      tokens: [
        'deporte', 'deportes', 'baloncesto', 'basket', 'capitana', 'capitan',
        'natacion', 'nadar', 'tenis', 'competitivo', 'competicion'
      ],
      response: `<strong>Liderazgo y Disciplina Deportiva:</strong><br><br>
      • <strong>Baloncesto (Capitana del Equipo Escolar):</strong> En La Salle Sagrado Corazón. Desarrolló capitanía, liderazgo motivacional, toma de decisiones rápidas bajo presión de marcador y fomento de la cohesión grupal.<br>
      • <strong>Natación y Tenis de Competición:</strong> En Ciudad de la Raqueta y torneos escolares. Disciplina de entrenamiento estricta, alta tolerancia a la frustración y hábito de superación constante.`
    },

    voluntariado: {
      phrases: [
        'compromiso social', 'sant egidio', 'personas mayores', 'sin hogar', 'comedor social',
        'ha hecho voluntariado', 'accion social'
      ],
      tokens: [
        'voluntariado', 'voluntaria', 'egidio', 'amavir', 'masesic', 'solidario', 'solidaridad'
      ],
      response: `<strong>Compromiso Social y Voluntariado:</strong><br><br>
      • <strong>Comunidad de Sant'Egidio:</strong> Preparación y reparto directo de alimentos para personas en situación de calle y apoyo organizativo en comedores navideños en Madrid.<br>
      • <strong>Residencia Amavir Pozuelo (MásESIC):</strong> Acompañamiento afectivo y dinamización de talleres para personas mayores, fortaleciendo la empatía y la escucha activa intergeneracional.`
    },

    por_que_contratar: {
      phrases: [
        'por que contratar', 'por que deberiamos contratar', 'por que elegir',
        'valor diferencial', 'que aporta', 'por que tu', 'por que diana', 'resumen ejecutivo',
        'quien es diana', 'hablame de diana', 'sobre diana', 'por que ella', 'que soluciones das',
        'que soluciones da', 'que solucion das', 'soluciones que aporta', 'cualidades de diana'
      ],
      tokens: [
        'contratar', 'contratacion', 'fortalezas', 'cualidades', 'ventaja', 'ventajas',
        'solucion', 'soluciones', 'perfil'
      ],
      response: `<strong>Valor Diferencial de Diana Elena Draguna (¿Por qué incorporarla?):</strong><br><br>
      1. <strong>Iniciativa y Autonomía Demostrada:</strong> En Carrefour identificó tareas manuales ineficientes y programó 6 procesos en Python ahorrando un 85% de tiempo manual sin requerir supervisión técnica previa.<br>
      2. <strong>Perfil Híbrido Negocio + Data Science:</strong> Entiende los estados financieros y la estrategia comercial, y sabe traducirlos en código, dashboards y modelos predictivos.<br>
      3. <strong>Rigor Financiero en Controlling:</strong> Experiencia práctica en auditoría de márgenes comerciales, liquidación de rappels y cierres mensuales en Campofrío.<br>
      4. <strong>Perfil Internacional y Trilingüe:</strong> Nota sobresaliente de 8,63/10 en KEDGE Business School (Francia), estancia en Irlanda y dominio fluido de Castellano, Rumano e Inglés.<br>
      5. <strong>Liderazgo y Disciplina:</strong> Capitana de equipo deportivo, alta tolerancia a la presión y mentalidad orientada a la superación.`
    },

    contacto: {
      phrases: [
        'donde vive', 'hablar con ella', 'como contactar', 'datos de contacto', 'telefono de diana'
      ],
      tokens: [
        'contacto', 'contactar', 'telefono', 'movil', 'celular', 'whatsapp', 'whas',
        'email', 'correo', 'ciudad', 'madrid', 'linkedin', 'redes', 'llamar'
      ],
      response: `<strong>Canales de Contacto Directo con Diana Elena Draguna:</strong><br><br>
      • <strong>WhatsApp / Teléfono:</strong> <a href="https://wa.me/34680198467" target="_blank" class="text-amber-700 underline font-semibold">+34 680 19 84 67</a><br>
      • <strong>Email Directo:</strong> <a href="mailto:dragunadianaelena@gmail.com" class="text-amber-700 underline font-semibold">dragunadianaelena@gmail.com</a><br>
      • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/dianaelenadraguna" target="_blank" class="text-amber-700 underline font-semibold">linkedin.com/in/dianaelenadraguna</a><br>
      • <strong>Ubicación:</strong> Madrid, España.<br><br>
      <a href="https://wa.me/34680198467" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
        <span>💬 Abrir Chat de WhatsApp Directo</span>
      </a>`
    },

    videos_presentacion: {
      phrases: [
        'elevator pitch', 'ver video', 'videos de diana', 'tienes videos', 'video de presentacion',
        'video habilidades', 'video proyecto', 'reproducir video', 'video carrefour', 'donde estan los videos',
        'cuales son los videos', 'que videos hay'
      ],
      tokens: [
        'video', 'videos', 'pitch', 'grabacion', 'grabaciones', 'audiovisual', 'reproductor', 'reproducir'
      ],
      response: `<strong>Vídeos Oficiales de Diana Elena Draguna en el Portfolio:</strong><br><br>
      Puedes visualizar <strong>3 vídeos integrados en alta definición</strong> a lo largo de la web:<br><br>
      1. 🎬 <strong>Elevator Pitch (Introducción):</strong> En la cabecera principal. Diana expone su perfil directivo, visión de negocio y competencias cuantitativas.<br>
      2. 📊 <strong>Proyecto Destacado (Carrefour PASS):</strong> En la sección de Proyectos. Demostración en sala directiva del cuadro de mando interactivo y automatización Python (-85% tiempo).<br>
      3. 💻 <strong>Habilidades Técnicas & Data Science:</strong> En la sección de Habilidades. Interacción con dashboards avanzados, arquitecturas neuronales y entornos Cloud/IA.<br><br>
      <span class="text-xs text-stone-500">Accede directamente a cada sección para reproducirlos:</span><br>
      <div class="flex flex-wrap gap-1.5 pt-2">
        <a href="#hero" class="px-2.5 py-1 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-600 transition-colors">▶ Ver Elevator Pitch</a>
        <a href="#proyectos" class="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors">▶ Ver Vídeo Proyecto</a>
        <a href="#habilidades" class="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors">▶ Ver Vídeo Habilidades</a>
      </div>`
    },

    saludo: {
      phrases: [
        'buenos dias', 'buenas tardes', 'buenas noches', 'como estas', 'quien eres'
      ],
      tokens: [
        'hola', 'que tal', 'ayuda', 'saludos', 'hey'
      ],
      response: `¡Hola! 👋 Soy el asistente virtual de Diana Elena Draguna.<br><br>
      Puedo darte <strong>soluciones y respuestas inmediatas</strong> sobre su trayectoria:<br>
      • Su experiencia en <strong>Carrefour</strong> (automatización Python), <strong>Campofrío</strong> (controlling SAP) y <strong>El Corte Inglés</strong> (procesos y UAT).<br>
      • Su <strong>Doble Grado en ADE & Data Science</strong> en ESIC y su nota de <strong>8,63 en KEDGE Bordeaux</strong>.<br>
      • Su <strong>TFG sobre Amazon</strong> o cómo afronta <strong>los retos más difíciles</strong>.<br>
      • Sus <strong>vídeos demostrativos</strong> (Elevator Pitch, Proyecto Carrefour y Habilidades).<br><br>
      ¿Qué aspecto te gustaría consultar?`
    }
  };

  // Motor de Inferencia y Puntuación
  function generateSolutionResponse(rawInput) {
    const q = normalizeText(rawInput);
    if (!q) return intentKnowledge.saludo.response;

    const scores = {};
    for (const [intentKey, conf] of Object.entries(intentKnowledge)) {
      scores[intentKey] = 0;

      // Evaluar frases completas (+15 puntos)
      for (const phrase of conf.phrases) {
        const normPhrase = normalizeText(phrase);
        if (q.includes(normPhrase)) {
          scores[intentKey] += 15;
        }
      }

      // Evaluar tokens individuales (+6 puntos coincidencia exacta de palabra, +3 parcial)
      for (const token of conf.tokens) {
        const normToken = normalizeText(token);
        
        // Evitar que 'ingles' compute para idiomas si se refiere a 'corte ingles'
        if (normToken === 'ingles' && q.includes('corte ingles')) {
          continue;
        }

        const wordRegex = new RegExp('\\b' + normToken + '\\b');
        if (wordRegex.test(q)) {
          scores[intentKey] += 6;
        } else if (normToken.length > 4 && q.includes(normToken)) {
          scores[intentKey] += 3;
        }
      }
    }

    // Ordenar intenciones por puntuación
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [bestIntent, bestScore] = sorted[0];

    // Si hay una intención con coincidencia suficiente, responder con su solución
    if (bestScore >= 4) {
      return intentKnowledge[bestIntent].response;
    }

    // Respuesta estratégica por defecto (nunca desvía perezosamente a WhatsApp)
    return `<strong>Soluciones y Áreas de Especialización de Diana Elena Draguna:</strong><br><br>
    Diana resuelve problemas empresariales conectando la dirección de empresas (ADE) con la analítica de datos (Data Science):<br><br>
    • <strong>Automatización de Procesos:</strong> Creación de pipelines en Python (Pandas/Spyder) para suprimir tareas repetitivas (ej: -85% de tiempo manual en Carrefour).<br>
    • <strong>Controlling y Rentabilidad:</strong> Monitorización de márgenes comerciales, auditoría de rappels y soporte a cierres contables en SAP y Excel (Campofrío).<br>
    • <strong>Análisis Funcional TI:</strong> Mapeo As-Is/To-Be y validación mediante pruebas UAT (El Corte Inglés).<br>
    • <strong>Excelencia y Mentalidad Global:</strong> Nota de 8,63 en KEDGE Bordeaux, bilingüe nativa (Castellano/Rumano) con inglés C1 y liderazgo deportivo.<br><br>
    <span class="text-xs text-stone-500">Haz clic en cualquiera de las siguientes opciones para ver el detalle:</span><br>
    <div class="flex flex-wrap gap-1.5 pt-2">
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="experiencia laboral">Ver Experiencia</button>
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="que es lo mas dificil que has hecho">Mayores Retos</button>
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="videos de diana">Ver Vídeos</button>
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="estudios">Estudios ESIC</button>
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="habilidades tecnicas">Herramientas & Datos</button>
      <button class="chat-chip-inline px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-600 transition-colors" data-query="por que contratar">Por qué contratar</button>
    </div>`;
  }
}

/* ==========================================================================
   8. SISTEMA DE MODALES LIGHTBOX PARA TFG, VÍDEO Y CERTIFICACIONES
   ========================================================================== */
const modalDatabase = {
  tfg: {
    tag: 'TRABAJO DE FIN DE GRADO (TFG)',
    title: 'Impacto del Liderazgo en Amazon',
    subtitle: 'Grado en Administración y Dirección de Empresas · ESIC University (2025/2026)',
    badge: 'Investigación Empírica · 170 Encuestas · 37 Páginas',
    content: `
      <div class="space-y-5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div class="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
          <div class="flex flex-wrap items-center justify-between text-xs gap-2">
            <span class="font-bold text-amber-800 dark:text-amber-300">Autores: Diana Elena Draguna & María José Gutiérrez</span>
            <span class="text-stone-500 font-mono">Tutor: Luciano López Gómez</span>
          </div>
          <h4 class="text-base font-bold text-stone-900 dark:text-white">“Impacto del Liderazgo en Amazon: Cultura, Innovación y Gestión del Talento”</h4>
          <p class="text-xs text-stone-600 dark:text-stone-400">ESIC University · Curso Académico 2025/2026 · Autorizada publicación en Biblioteca ESIC</p>
        </div>

        <div class="space-y-2">
          <h5 class="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-xs">Resumen Ejecutivo del Proyecto:</h5>
          <p class="leading-relaxed text-xs">
            Este estudio analiza cómo el estilo de liderazgo de Amazon, con especial foco en la filosofía transformacional de Jeff Bezos, ha permitido la evolución desde una tienda digital de libros hasta un líder tecnológico global de la economía digital.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <strong class="text-stone-900 dark:text-white block mb-1">Muestra Estadística</strong>
            <span class="text-amber-700 dark:text-amber-400 font-bold text-base block">170 Participantes</span>
            <span class="text-[11px] text-stone-500">Cuestionario cuantitativo con escala Likert de 5 puntos.</span>
          </div>
          <div class="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <strong class="text-stone-900 dark:text-white block mb-1">Metodología Mixta</strong>
            <span class="text-teal-700 dark:text-teal-400 font-bold text-base block">Datos + Cualitativo</span>
            <span class="text-[11px] text-stone-500">Combinación de estadística y entrevistas internas a empleados.</span>
          </div>
          <div class="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <strong class="text-stone-900 dark:text-white block mb-1">Pilares Clave</strong>
            <span class="text-stone-900 dark:text-white font-bold text-base block">Obsesión Cliente</span>
            <span class="text-[11px] text-stone-500">Cultura "Day 1", innovación constante y escalabilidad.</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
          <h5 class="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider">Conclusiones Clave del Estudio:</h5>
          <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Los hallazgos confirman que la cultura de planificación a largo plazo y la capacidad de adaptación al entorno son determinantes para sostener ventajas competitivas sostenibles. Se examinan además las implicaciones directas en el bienestar laboral y las políticas de retención del talento humano en entornos de alta exigencia.
          </p>
        </div>

        <!-- Botón de Descarga Directa del PDF Oficial -->
        <div class="pt-2 text-center">
          <a href="tfg%20DEFINNITIVO%20.pdf" download="TFG_Diana_Elena_Draguna_Liderazgo_Amazon.pdf" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Descargar Memoria Completa del TFG (PDF · 1.0 MB)</span>
          </a>
        </div>
      </div>
    `
  },

  pitch: {
    tag: 'VÍDEO DE INTRODUCCIÓN · ELEVATOR PITCH',
    title: 'Presentación Ejecutiva · Diana Elena Draguna',
    subtitle: 'Resolución de problemas mediante Data Science, Automatización y Rigor de Negocio',
    badge: 'Vídeo Oficial · 16:9',
    content: `
      <div class="space-y-4">
        <div class="relative bg-stone-900 rounded-xl overflow-hidden aspect-video border border-stone-700 shadow-xl">
          <video controls autoplay class="w-full h-full object-cover" poster="images/poster_elevator_pitch.jpg">
            <source src="video/elevator_pitch.mp4" type="video/mp4">
            Tu navegador no soporta reproducción de vídeo.
          </video>
        </div>
        <p class="text-xs text-stone-600 dark:text-stone-300">"Mi meta profesional es conectar el rigor de los datos con el impacto directo en la toma de decisiones empresariales y la optimización de procesos."</p>
      </div>
    `
  },

  video_proyecto: {
    tag: 'PROYECTO DESTACADO · VÍDEO DEMO',
    title: 'Automatización & Reporting Comercial Carrefour PASS',
    subtitle: 'Presentación de Resultados y Toma de Decisiones en Entorno Directivo',
    badge: 'Vídeo Oficial · 16:9',
    content: `
      <div class="space-y-4">
        <div class="relative bg-stone-900 rounded-xl overflow-hidden aspect-video border border-stone-700 shadow-xl">
          <video controls autoplay class="w-full h-full object-cover" poster="images/poster_proyecto.jpg">
            <source src="video/proyecto_destacado.mp4" type="video/mp4">
            Tu navegador no soporta reproducción de vídeo.
          </video>
        </div>
        <p class="text-xs text-stone-600 dark:text-stone-300">Demostración ejecutiva del cuadro de mando interactivo y reducción del 85% en tiempo de reportería para Carrefour PASS.</p>
      </div>
    `
  },

  video_habilidades: {
    tag: 'HABILIDADES TÉCNICAS · VÍDEO DEMO',
    title: 'Entorno Analítico, Redes Neuronales & Modelado de Datos',
    subtitle: 'Interacción con Dashboards Avanzados, Inteligencia Artificial y Cloud',
    badge: 'Vídeo Oficial · 16:9',
    content: `
      <div class="space-y-4">
        <div class="relative bg-stone-900 rounded-xl overflow-hidden aspect-video border border-stone-700 shadow-xl">
          <video controls autoplay class="w-full h-full object-cover" poster="images/poster_habilidades.jpg">
            <source src="video/habilidades.mp4" type="video/mp4">
            Tu navegador no soporta reproducción de vídeo.
          </video>
        </div>
        <p class="text-xs text-stone-600 dark:text-stone-300">Demostración práctica de arquitecturas neuronales, modelado estadístico en Python y visualización analítica de datos.</p>
      </div>
    `
  },

  certifications: {
    tag: 'CREDENCIALES OFICIALES',
    title: 'Certificaciones Tecnológicas y Profesionales',
    subtitle: 'Microsoft, Google y ESIC University',
    badge: 'Cloud · Inteligencia Artificial · Analítica Web · BI',
    content: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
          <span class="text-amber-700 dark:text-amber-400 font-bold block mb-1">Microsoft Azure Fundamentals (AZ-900, 2026)</span>
          <p class="text-stone-600 dark:text-stone-400">Arquitectura cloud, gobernanza del dato, servicios de red y modelos de coste en la nube.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
          <span class="text-amber-700 dark:text-amber-400 font-bold block mb-1">Microsoft Azure AI Fundamentals (AI-900, 2026)</span>
          <p class="text-stone-600 dark:text-stone-400">Cargas de trabajo de Machine Learning, Computer Vision y principios de IA responsable.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
          <span class="text-teal-700 dark:text-teal-400 font-bold block mb-1">Google Analytics Certificate (GA4, 2025)</span>
          <p class="text-stone-600 dark:text-stone-400">Medición de eventos web, embudos de conversión, audiencias y atribución de campañas.</p>
        </div>
        <div class="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
          <span class="text-teal-700 dark:text-teal-400 font-bold block mb-1">Power BI Dashboard Creation (ESIC, 2024)</span>
          <p class="text-stone-600 dark:text-stone-400">Modelado de datos en DAX, Power Query y diseño de cuadros de mando ejecutivos.</p>
        </div>
      </div>
    `
  }
};

function initModalSystem() {
  const modalBackdrop = document.getElementById('evidence-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBadge = document.getElementById('modal-badge');
  const modalBody = document.getElementById('modal-body');

  if (!modalBackdrop) return;

  document.querySelectorAll('[data-evidence]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const evidenceKey = trigger.getAttribute('data-evidence');
      const data = modalDatabase[evidenceKey];

      if (data) {
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalBadge.textContent = data.badge;
        modalBody.innerHTML = data.content;

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    const modalVideo = modalBackdrop.querySelector('video');
    if (modalVideo) modalVideo.pause();
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. PORTAPAPELES Y TOAST NOTIFICATIONS
   ========================================================================== */
function initClipboardButtons() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'dragunadianaelena@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copiado: dragunadianaelena@gmail.com');
      }).catch(() => {
        prompt('Copia el email:', email);
      });
    });
  });

  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '+34680198467';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('✓ Teléfono copiado: +34 680 19 84 67');
      }).catch(() => {
        prompt('Copia el teléfono:', phone);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xl font-medium text-xs flex items-center gap-2 border border-stone-700 dark:border-stone-300 transition-all duration-300';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

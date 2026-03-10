/* ========================================
   AI R&D Portfolio - main.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initTypingEffect();
  initPipeline();
  initProjectThumbnails();
  initLightbox();
  initProjectFilter();
  initProjectModal();
  initI18n();
  initWFMCanvas();
});

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavigation() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollPos = window.scrollY + 100;
  let currentSection = '';
  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) currentSection = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('nav__link--active');
    if (link.getAttribute('href') === '#' + currentSection) link.classList.add('nav__link--active');
  });
}

/* ----------------------------------------
   Scroll Animations
   ---------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
        let delay = 0;
        siblings.forEach((sibling, i) => { if (sibling === entry.target) delay = i * 100; });
        setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 300));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   Typing Effect
   ---------------------------------------- */
function initTypingEffect() {
  restartTypingEffect(currentLang);
}

/* ----------------------------------------
   Pipeline (About Section)
   ---------------------------------------- */
const PIPELINE_STAGES = [
  {
    title: { ko: '소재 (Material)', en: 'Material' },
    label: { ko: '소재', en: 'Material' },
    desc: {
      ko: [
        '실험 데이터로 Material-scale Electrochemical Neural Operator를 학습',
        '전기화학 반응·전달·안전 거동을 물리 제약하에 동시에 추정',
        '예측 불확실도를 계산해 설계-운용 단계에 피드백'
      ],
      en: [
        'Train scale-aware Electrochemical Neural Operators from active-material, electrolyte, and electrode data',
        'Estimate reaction, transport, and safety dynamics under physical constraints',
        'Output uncertainty-aware features for downstream design and operation'
      ]
    },
    tags: ['Electrochemical Neural Operator', 'Domain-Specific Neural Operator', 'Scale-aware Physics']
  },
  {
    title: { ko: '설계 (Design)', en: 'Design' },
    label: { ko: '설계', en: 'Design' },
    desc: {
      ko: [
        '공정 조건을 잠재 코드로 임베딩',
        '조건부 Diffusion으로 전극·소재 후보 생성',
        'Surrogate + 물리 제약 스코어러로 후보를 자동 스크리닝'
      ],
      en: [
        'Embed material and process conditions as conditional codes',
        'Generate material/electrode candidates by conditional diffusion',
        'Filter candidates with surrogate scoring + physics constraints'
      ]
    },
    tags: ['Conditional Diffusion', 'Generative Design', 'Constraint Screening']
  },
  {
    title: { ko: '운용 (Operation)', en: 'Operation' },
    label: { ko: '운용', en: 'Operation' },
    desc: {
      ko: [
        '충방전·온도·부하 프로토콜을 Neural Operator surrogate로 동적 시뮬레이션',
        'SOC, SOH, RUL 및 열폭주 위험을 멀티태스크 디코더로 추정',
        'Failure-sensitivity 맵을 설계·소재 단계에 역전파 형태로 피드백'
      ],
      en: [
        'Simulate dynamic charge/discharge, temperature, and load profiles with operator surrogates',
        'Estimate SOC, SOH, RUL, and thermal-runaway risk with a multi-task head',
        'Back-propagate failure-sensitivity maps to design and materials stages'
      ]
    },
    tags: ['Battery Foundation Model', 'SOC, SOH, RUL', 'Safety AI']
  },
  {
    title: { ko: '수명 (Lifetime)', en: 'Lifetime' },
    label: { ko: '수명', en: 'Lifetime' },
    desc: {
      ko: [
        '열화 신호 시계열로 열화 경로를 예측',
        '생성형 후보·운영 정책을 AI 최적화기로 평가',
        '신뢰성 제약을 만족하도록 설계·소재·운용 조건을 폐루프 최적화'
      ],
      en: [
        'Forecast aging trajectories from degradation signals',
        'Evaluate design candidates and operating policies with AI optimizers',
        'Closed-loop optimize design, materials, and operation under safety-reliability constraints'
      ]
    },
    tags: ['Aging-aware Optimization', 'Closed-Loop Optimization', 'Materials-Design Co-Optimization']
  }
];

function initPipeline() {
  const nodes = document.querySelectorAll('.pipeline__node');
  const detailInner = document.querySelector('.pipeline__detail-inner');
  if (!nodes.length || !detailInner) return;

  let activeIndex = 0;
  let autoTimer = null;
  let userPaused = false;

  function setActive(index) {
    activeIndex = index;
    nodes.forEach((n, i) => n.classList.toggle('pipeline__node--active', i === index));
    updateDetail(index);
  }

  function updateDetail(index) {
    const stage = PIPELINE_STAGES[index];
    const lang = currentLang || 'ko';

    detailInner.classList.add('fade-out');
    setTimeout(() => {
      const titleEl = detailInner.querySelector('.pipeline__detail-title');
      const descEl = detailInner.querySelector('.pipeline__detail-desc');
      const tagsEl = detailInner.querySelector('.pipeline__detail-tags');

      titleEl.textContent = stage.title[lang];
      const descValue = stage.desc[lang] || stage.desc.ko;
      if (Array.isArray(descValue)) {
        descEl.innerHTML = descValue.map(item => `<p>${item}</p>`).join('');
      } else {
        descEl.textContent = String(descValue || '');
      }
      tagsEl.innerHTML = stage.tags.map(t => `<span class="tag tag--accent">${t}</span>`).join('');

      detailInner.classList.remove('fade-out');
    }, 200);
  }

  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      userPaused = true;
      clearInterval(autoTimer);
      setActive(i);
      // Resume after 8s of no interaction
      clearTimeout(window._pipelineResumeTimer);
      window._pipelineResumeTimer = setTimeout(() => {
        userPaused = false;
        startAutoRotation();
      }, 8000);
    });
    node.addEventListener('mouseenter', () => {
      if (!userPaused) {
        clearInterval(autoTimer);
      }
      setActive(i);
    });
    node.addEventListener('mouseleave', () => {
      if (!userPaused) {
        startAutoRotation();
      }
    });
  });

  function startAutoRotation() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % PIPELINE_STAGES.length;
      setActive(activeIndex);
    }, 3000);
  }

  // Expose for i18n re-render
  window._pipelineSetActive = setActive;
  window._pipelineActiveIndex = () => activeIndex;

  startAutoRotation();
}

/* ----------------------------------------
   Project Thumbnails (Graphical Abstract)
   ---------------------------------------- */
function initProjectThumbnails() {
  const cards = document.querySelectorAll('.proj[data-project]');
  cards.forEach(card => {
    const idx = card.dataset.project;
    const imgPath = `assets/img/projects/proj-${idx}.png`;

    // Create thumbnail element
    const thumb = document.createElement('div');
    thumb.className = 'proj__thumb';

    // Placeholder (shown if no image)
    const placeholder = document.createElement('div');
    placeholder.className = 'proj__thumb-placeholder';
    placeholder.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
      <span>Graphical Abstract</span>
    `;
    thumb.appendChild(placeholder);

    // Try to load actual image
    const img = new Image();
    img.alt = 'Graphical Abstract';
    img.onload = () => {
      thumb.classList.add('proj__thumb--has-img');
      thumb.prepend(img);
    };
    img.src = imgPath;
    // Handle already-cached images
    if (img.complete) {
      thumb.classList.add('proj__thumb--has-img');
      thumb.prepend(img);
    }

    // Wrap existing content
    const main = document.createElement('div');
    main.className = 'proj__main';
    while (card.firstChild) {
      main.appendChild(card.firstChild);
    }

    card.appendChild(thumb);
    card.appendChild(main);
  });
}

/* ----------------------------------------
   Image Lightbox
   ---------------------------------------- */
function initLightbox() {
  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img src="" alt="Enlarged view">';
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');

  // Close on click
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });

  // Delegate click on thumbnail images (and modal GA images)
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.proj__thumb--has-img img, .modal__ga img, .modal__outcome-cert, .award-gallery__img');
    if (img) {
      e.stopPropagation();
      lbImg.src = img.src;
      lightbox.classList.add('open');
    }
  });
}

/* ----------------------------------------
   Project Filter
   ---------------------------------------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter__btn');
  const cards = document.querySelectorAll('.proj');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ----------------------------------------
   Project Modal with Rich Detail Data
   ---------------------------------------- */
const PROJECT_DETAILS = [
  // 0
  {
    role: 'Proposal Author & Lead Researcher',
    isLead: true,
    period: 'Mar. 2026 – Dec. 2026',
    title: 'Universal Foundation Model for Battery Diagnostics',
    org: 'Advanced GPU Computing Support Program · National IT Industry Promotion Agency (NIPA) · Ministry of Science and ICT',
    diagram: {
      flow: ['Entity (LLM Data Standardization)', 'Scenario (Diffusion Synthesis)', 'EngineX (PM/ROM/DM/OM)', 'Agentic Scientific AI'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>배터리의 소재 탐색부터 수명 예측까지, 전주기를 하나의 AI로 통합 진단하는 10B+ 규모 범용 파운데이션 모델 개발</li><li>NIPA 국가 GPU 지원 사업 선정 — NVIDIA B200 24GPU · 160TB 데이터 · 12개월</li><li>자율적으로 진단·예측·최적화를 수행하는 Agentic Scientific AI 구현</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>소재→설계→운용→수명 각 단계가 분절되어 전주기 통합 의사결정이 불가능</li><li>물리 모델은 실시간 불가, 데이터 모델은 물리 법칙을 위배(환각)하여 신뢰성 한계</li><li>실험 중심 고비용·장기간 R&D를 AI로 전환할 원천 기술 부재</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>3단 프레임워크로 분절 문제 해결: 데이터 표준화(Entity) → 극한 시나리오 합성(Scenario) → 물리+AI 엔진 결합(EngineX)</li><li>Physics-Informed Loss와 물리 기반 RLHF로 AI 환각 제거 → 물리 일관성 보장</li><li>자체 개발 물리 엔진(PE-FNO, JEPA, P2D)과 LLM을 결합한 하이브리드 아키텍처</li></ul>'
      },
      {
        icon: 'target',
        title: 'Deliverables',
        content: '<ul><li>10B+ 파라미터 범용 배터리 파운데이션 모델 및 EngineX 프레임워크 완성</li><li>추론 200배 가속(→1.5ms), 예측 오차 &lt;2%, 학습 80배 단축(→9h/Epoch)</li><li>160TB 표준 데이터셋 구축 (실데이터 50TB + 합성 110TB)</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>과제 기획서 작성 및 실무책임자로 단독 수행</li><li>Entity-Scenario-EngineX 3단 프레임워크 설계</li><li>물리-AI 하이브리드 모델 구현 및 학습 파이프라인 구축</li><li>GPU 클러스터 대규모 실험 및 다운스트림 Fine-tuning 수행</li></ul>'
      }
    ],
    tags: ['Battery Foundation Model', 'Large-Scale Pretraining', 'NVIDIA B200 Cluster', 'PyTorch', 'Agentic Scientific AI'],
    outcomes: [
      'NIPA 첨단 GPU 활용 지원사업 과제 선정 (2026)',
      '배터리 Agentic Scientific AI 아키텍처 (Entity-Scenario-EngineX) 특허'
    ]
  },
  // 1
  {
    role: 'Proposal Author & Lead Researcher',
    isLead: true,
    period: 'Jan. 2026 – Dec. 2026',
    title: 'Physics Foundation Model for Battery Full-Lifecycle Prediction and Diagnostics',
    org: 'Institute for AI Innovation',
    diagram: {
      flow: ['Multi-modal Battery Data', 'Physics-Based Modelling', 'Battery Foundation Model (B-FM)', 'Multi-Industries Applications'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>전기화학·열역학 법칙을 AI에 내재화하여 배터리의 물리적 거동을 시뮬레이션하는 월드 모델 개발</li><li>물리-데이터 융합으로 제조→운용→폐기 전주기 진단·수명 예측을 하나의 엔진으로 통합</li><li>배터리 디지털 트윈의 핵심 기반 기술 확보 — AI 혁신연구원 과제 선정</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>기존 AI는 데이터 패턴만 학습하여 물리적으로 불가능한 예측을 생성</li><li>제조·운용·폐기 단계마다 데이터 형태가 달라 단일 모델 적용이 곤란</li><li>물리 시뮬레이션은 정확하지만 실시간 활용이 불가능한 속도 한계</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>Neural Operator에 물리 지배방정식을 통합하여 물리적으로 불가능한 예측 차단 (→환각 해결)</li><li>단계별 특화 모듈 + 공유 표현 학습으로 데이터 형태 차이 극복 (→이질성 해결)</li><li>월드 모델로 배터리 거동을 암묵적 내재화하여 실시간 추론 가능 (→속도 해결)</li></ul>'
      },
      {
        icon: 'target',
        title: 'Deliverables',
        content: '<ul><li>물리 기반 전주기 예측 모델 개발 진행 중</li><li>제조-운용-폐기 통합 프레임워크 설계 완료</li><li>50TB 규모 멀티모달·멀티스케일 표준 데이터셋 구축</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>과제 기획서 작성 및 실무책임자로 단독 수행</li><li>Neural Operator 기반 물리-AI 하이브리드 아키텍처 설계·구현</li><li>월드 모델 학습 및 물리 일관성 검증 실험</li><li>데이터 인프라 및 전처리 파이프라인 개발</li></ul>'
      }
    ],
    tags: ['Neural Operator', 'Physics-Informed Learning', 'Battery World Model', 'Digital Twin', 'Multi-modal Battery Data'],
    outcomes: [
      'AI혁신연구원 연구지원사업 과제 선정 (2026)',
      '"A Battery World Foundation Model for Diagnosis and Prognosis" — eTransportation, In Preparation'
    ]
  },
  // 2
  {
    role: 'Proposal Author & Lead Researcher',
    isLead: true,
    period: 'Sep. 2025 – Feb. 2026',
    title: 'Development of a Foundation Model for Predicting Battery Safety and Lifetime',
    org: 'High-Performance Computing Support Program · National IT Industry Promotion Agency (NIPA) · Ministry of Science and ICT',
    diagram: {
      flow: ['Raw Battery Data', 'Standardizer → Battery Record', 'Pretext Trainer (E→z→D)', 'Downstream (SOC, SOH, RUL)'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>HPC 환경에서 대규모 사전학습을 통해 배터리 종류·환경의 차이를 극복하는 범용 진단 AI 개발</li><li>안전성·SOC·SOH·RUL을 하나의 Backbone으로 동시 처리하는 멀티태스크 구조 설계</li><li>NIPA 국가 GPU 지원 사업 선정 — 30B 파라미터 규모 모델 학습</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>열폭주 등 이상 데이터가 극히 희소하여 지도학습만으로는 안전 예측 한계</li><li>배터리 종류·환경별 데이터 분포 차이로 단일 모델의 일반화 실패</li><li>안전성·SOC·SOH·RUL을 동시에 다루는 멀티태스크 학습의 기술적 난이도</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>Diffusion 기반 Pretext 학습으로 희소한 이상 데이터를 합성하여 데이터 부족 해결</li><li>Contrastive 학습으로 배터리 종류·환경 간 공통 표현을 추출하여 일반화 확보</li><li>멀티태스크 Transformer 헤드로 SOC·SOH·RUL 동시 추정 구조 설계</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>SOH 예측 MAE 1.5% → 0.8% 이하로 개선</li><li>Diffusion 합성으로 희소 이상 데이터 문제 완화</li><li>Cross-dataset 환경에서 SOTA 대비 향상된 일반화 성능</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>과제 기획서 작성 및 실무책임자로 단독 수행</li><li>Diffusion Pretext + Contrastive 사전학습 전략 설계</li><li>HPC GPU 학습 파이프라인 구축·최적화</li><li>멀티태스크 헤드 설계 및 Cross-dataset 검증 수행</li></ul>'
      }
    ],
    tags: ['Battery Foundation Model', 'Diffusion Pretraining', 'Contrastive Learning', 'Multi-task Transformer', 'SOC, SOH, RUL', 'HPC'],
    outcomes: [
      'NIPA 고성능 컴퓨팅 지원사업 과제 선정 (2025)',
      '"UniBatt: Universal Foundation Framework for Battery State Estimation" — KECS 2025, Oral Presentation'
    ]
  },
  // 3
  {
    role: 'Researcher',
    isLead: false,
    period: 'Jul. 2025 – Oct. 2027',
    title: 'Development of Software Technology for Predicting and Early Diagnosing for EV Battery Thermal Runaway',
    org: 'Ministry of Trade, Industry and Energy (MOTIE)',
    diagram: {
      flow: ['Irregular Domain Data', 'Nested JEPA Pre-training', 'Dual Hierarchical Encoder', 'SOC / SOH / RUL / Thermal Runaway'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>라벨 없는 대량의 필드 데이터로 사전학습하고, 소량 라벨만으로 진단하는 배터리 Foundation Model 개발</li><li>전기차 배터리 열폭주 사전 예측·조기 진단을 위한 산업통상자원부 국책과제</li><li>SOC·SOH·RUL을 동시 추정하는 통합 진단 Backbone 구현</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>필드 데이터는 대량이지만 라벨이 거의 없어 지도학습 적용 불가</li><li>배터리 화학계마다 충방전 특성이 달라 모델 재학습이 필요</li><li>단기 충방전 동역학과 장기 열화 패턴을 동시에 포착하기 어려움</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>Nested JEPA 자기지도학습으로 라벨 없이 배터리 표현을 사전학습 (→라벨 부족 해결)</li><li>Dual Hierarchical Encoder로 단기(Intra-cycle)·장기(Inter-cycle) 패턴을 분리 학습 (→동시 포착 해결)</li><li>Domain-Conditioned Modulation으로 화학계별 분포에 자동 적응 (→재학습 해결)</li><li>Few-shot Fine-tuning으로 소량 라벨만으로 SOC·SOH·RUL 멀티태스크 진단</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>SOH RMSE 1.8% → 0.95% (10% 라벨 Few-shot 조건)</li><li>새 화학계 적응 시 Full-supervised 대비 93% 성능 유지</li><li>Unlabeled 데이터 활용으로 라벨 효율성 5배 향상</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>Nested JEPA 기반 사전학습 프레임워크 설계·구현</li><li>Dual Hierarchical Encoder 아키텍처 설계</li><li>Cross-dataset 검증 및 진단 성능 평가 수행</li><li>배터리 데이터 전처리·분석 파이프라인 구축</li></ul>'
      }
    ],
    tags: ['Nested JEPA', 'Dual Hierarchical Encoder', 'Domain-Conditioned Modulation', 'Few-shot Fine-tuning', 'SOC, SOH, RUL', 'Thermal Runaway'],
    outcomes: [
      '산업통상자원부(MOTIE) 국책과제 참여 (2025–2027)'
    ]
  },
  // 4
  {
    role: 'Researcher',
    isLead: false,
    period: 'Jul. 2024 – Oct. 2024',
    title: 'Copyright Protection of AI Model & Digital Content from Generative AI',
    org: 'Computer Vision Lab (Prof. Sangpil Kim) · Korea University · Collaboration with Google DeepMind',
    diagram: {
      flow: ['Original Video + Message', 'Latent Encoder + Mapping Network', 'Distortion Layer (H.264, Crop...)', '3D Wavelet Decoder → Verification'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>생성형 비디오 모델의 출력물에 보이지 않는 워터마크를 삽입하여 저작권을 보호하는 기술 개발</li><li>Google DeepMind와의 공동 연구 — 모델 수준 워터마킹으로 탈취·왜곡 공격에 대응</li><li>대규모 생성형 AI 시대의 Responsible AI 기반 기술 구현</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>기존 워터마킹은 이미지 단위로 동작하여 비디오의 시간적 일관성을 보장하지 못함</li><li>후처리 방식은 모델 탈취 시 워터마크가 함께 우회됨</li><li>H.264 압축, 프레임 드롭, 크롭 등 실제 공격에 취약</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>3D Wavelet + RGB 결합으로 비디오 시간축까지 고려한 Decoder 설계 (→시간 일관성 해결)</li><li>모델 가중치에 직접 삽입하는 Weight Modulation으로 탈취 시에도 워터마크 유지 (→우회 해결)</li><li>Distortion Layer로 압축·크롭 등 실공격을 시뮬레이션하며 내성 학습 (→강건성 해결)</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>512-bit 워터마크 삽입 후 99% 이상 비트 정확도 달성</li><li>H.264 압축·복합 공격 환경에서도 높은 복원 정확도</li><li>SOTA 대비 향상된 FVD 및 temporal consistency</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>Latent Decoder Weight Modulation 전략 구현·실험</li><li>이미지·비디오·모델공격 Robustness 실험 및 분석</li><li>Google DeepMind 연구팀과 공동 실험·논의</li><li>관련 문헌 조사 및 기법 벤치마킹</li></ul>'
      }
    ],
    tags: ['Model Watermarking', '3D Wavelet Decoder', 'Weight Modulation', 'Distortion-Robust Training', 'Generative Video', 'Responsible AI'],
    outcomes: [
      'Google DeepMind 공동 연구 프로젝트 참여 (2024)'
    ]
  },
  // 5
  {
    role: 'Researcher',
    isLead: false,
    period: 'Mar. 2024 – Jun. 2024',
    title: 'Management for Police Field Customized Research and Development',
    org: 'Ministry of Science and Technology & Korean National Police Agency',
    diagram: {
      flow: ['시나리오 설정 → 시뮬레이션', '데이터 합성 및 라벨링', '도메인 적응 (DANN)', 'ST-GCN 모델 학습'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>구치소 등 치안현장에서 자해·폭행 등 이상행동을 AI로 감지하는 기술 고도화</li><li>현실에서 수집이 어려운 위험 상황 데이터를 게임 엔진으로 대규모 합성</li><li>합성→실제 환경 전이가 가능한 Robust Vision AI 구현</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>이상 행동(자해, 폭행 등) 데이터는 현실에서 수집이 극히 어려움</li><li>행동 인식에는 시간축 정보가 필수이나 단일 프레임 모델로는 한계</li><li>합성 데이터로 학습한 모델은 실환경에서 도메인 갭으로 성능 하락</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>Unreal Engine으로 다양한 CCTV 환경·이상행동 시나리오 합성 데이터 생성 (→데이터 부족 해결)</li><li>Skeleton 기반 ST-GCN으로 시간축 포함 행동 인식 수행 (→단일 프레임 한계 해결)</li><li>DANN 도메인 적응으로 합성-실제 간 분포 차이 완화 (→도메인 갭 해결)</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>다양한 환경·시나리오 합성 데이터 10TB 확보</li><li>ST-GCN + DANN 모델 정확도 84.49%, F1-Score 0.73 달성</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>Unreal Engine 기반 합성 데이터 생성 파이프라인 구축</li><li>DANN 도메인 적응 프레임워크 설계·구현</li><li>ST-GCN 이상행동 감지 모델 구축 및 성능 평가</li></ul>'
      }
    ],
    tags: ['Unreal Engine', 'ST-GCN', 'DANN', 'Synthetic CCTV Data', 'Domain Adaptation', 'Abnormal Behavior Detection'],
    outcomes: [
      '"A Research on Synthetic Data for Improving Performance of Skeleton-Based Fall Down Detection Models" — KIIS 2024, Oral Presentation',
      '"An Analysis on Synthetic Data for Improving Performance of Skeleton-Based Fall Down Detection Models" — IBDAP 2024, Oral Presentation'
    ]
  },
  // 6
  {
    role: 'Researcher',
    isLead: false,
    period: 'Mar. 2023 – Dec. 2023',
    title: 'Development of SMART Community Policing System',
    org: 'Ministry of Science and Technology & National Research Foundation of Korea (NRF)',
    diagram: {
      flow: ['Drone Aerial View', 'Synthetic Data Generation', 'ReID Model + Attribute Filtering', 'Person Re-identification'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>드론 공중 시점에서 촬영된 인물을 재식별(Re-ID)하는 Vision AI 개발</li><li>현실 수집이 어려운 공중 시점 데이터를 게임 엔진으로 합성하여 학습 데이터 확보</li><li>치안·국방·재난 대응으로 확장 가능한 공중 영상 인식 기술</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>드론 공중 시점 인물 데이터는 수집 비용이 높고 개인정보 이슈 존재</li><li>지상 CCTV 학습 모델은 공중 시점에서 시점·해상도 변화로 성능 급락</li><li>고도·각도·조명 변화로 동일 인물의 외관이 크게 달라져 매칭 난이도 증가</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>게임 엔진으로 다양한 고도·각도·배경의 공중 인물 합성 데이터 생성 (→데이터 부족 해결)</li><li>Attribute-based Filtering으로 후보군 사전 필터링 후 ReID 수행 (→매칭 효율 향상)</li><li>합성-실제 혼합 학습으로 도메인 갭 완화 (→시점 변화 해결)</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>mAP 78.3%, Rank-1 Accuracy 84.7% 달성</li><li>합성 혼합 학습으로 실데이터 단독 대비 mAP 12.5%p 향상</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>합성 데이터 생성 파이프라인 설계·구축</li><li>Attribute Filtering + ReID 모델 구현·실험</li><li>혼합 학습 전략 설계 및 도메인 갭 분석</li></ul>'
      }
    ],
    tags: ['Person Re-ID', 'Drone Vision', 'Attribute Filtering', 'Synthetic Aerial Data', 'Mixed Real-Synthetic Training', 'Game Engine'],
    outcomes: [
      '"Improving Top-Down Pose Estimation-Based Fall Detection Using Segmentation" — KASP 2024'
    ]
  },
  // 7
  {
    role: 'Team Leader',
    isLead: true,
    period: 'Sep. 2023 – Jun. 2024',
    title: 'AI-Driven Autonomous Patrol Robot Framework for Real-Time Smoking Behavior Detection',
    org: 'ICIP & Capstone Design · Software Education Institute · Dongguk University',
    diagram: {
      flow: ['Thermal + RGB Camera', 'a) Smoking Detection  b) Deblur', 'c) Adverse Weather  d) SLAM+ROS2', 'Integrated Patrol System'],
    },
    sections: [
      {
        icon: 'target',
        title: 'Overview',
        content: '<ul><li>야간·역광·연기 등 극한 환경에서 흡연 행위를 감지하는 자율 순찰 로봇 프레임워크 개발</li><li>흡연 감지, 모션 디블러, 악천후 대응, 자율주행 4개 모듈을 하나의 시스템으로 통합</li><li>엣지 디바이스 실시간 추론이 가능한 경량화 파이프라인 구현</li></ul>'
      },
      {
        icon: 'problem',
        title: 'Problem',
        content: '<ul><li>야간·역광 환경에서 RGB 기반 행동 인식 정확도 급락 + 개인정보 침해 우려</li><li>이동 로봇 센서 영상에서 모션 블러 발생으로 인식 품질 저하</li><li>악천후(비·안개) 데이터 부족으로 자율주행 객체 인식 일반화 한계</li></ul>'
      },
      {
        icon: 'approach',
        title: 'Approach',
        content: '<ul><li>Thermal + Pose Estimation으로 신원 노출 없이 야간에도 행동 감지 (→프라이버시+야간 해결)</li><li>경량화 모션 디블러 모델로 실시간 블러 복원 (→영상 품질 해결)</li><li>CycleGAN 합성으로 악천후 학습 데이터 확보 (→일반화 해결)</li><li>SLAM + ROS2 기반 자율주행 및 통합 순찰 시스템 구현</li></ul>'
      },
      {
        icon: 'target',
        title: 'Result',
        content: '<ul><li>흡연 감지: Accuracy 94.2%, F1 0.85 (기존 대비 1.3배 개선)</li><li>모션 디블러: PSNR 30.02 (기존 대비 2.5배 개선)</li><li>악천후 합성 데이터 활용 시 객체 탐지 정확도 2배 개선</li></ul>'
      },
      {
        icon: 'role',
        title: 'My Role',
        content: '<ul><li>4인 팀 리더 — 기획, 역할 분배, 일정 관리</li><li>Thermal Threshold 기반 Pose Estimation 알고리즘 제안·구현</li><li>모션 디블러 모델 경량화·최적화</li><li>시스템 통합 및 실환경 테스트</li></ul>'
      }
    ],
    tags: ['Thermal + Pose', 'Motion Deblurring', 'CycleGAN', 'ROS2', 'SLAM', 'Edge Inference'],
    outcomes: [
      'The Grand Prize (President\'s Award) — ICIP Capstone Design 2024',
      '"Thermal Threshold-Based Pose Estimation for Smoking Behavior Detection" — KCC 2024',
      '"Accelerating Motion Deblurring of Color Images with Grayscale Conversion and Approximate Color Restoration" — KMMS 2024',
      '"CycleGAN-Based Image Synthesis for Improving Traffic Light Recognition in Rainy Conditions" — KMMS 2024'
    ]
  }
];

/* Award certificate images mapped to project outcomes */
const AWARD_IMAGES = {
  5: {
    0: ['우수논문상_Award2_ParkJimin.png'],
    1: ['IBDAP2024Certificate_ParkJimin.png']
  },
  6: {
    0: ['우수논문상_Award3_ParkJimin.png', '우수발표상_Award4_ParkJimin.png']
  },
  7: {
    0: ['캡스톤_Award5_ParkJimin.png'],
    1: ['정보과학회_Award1_ParkJimin.png']
  }
};

const OUTCOME_GROUPS = {
  0: {
    projects: [
      'NIPA 첨단 GPU 활용 지원사업 과제 선정 (2026)'
    ],
    ip: [
      '배터리 Agentic Scientific AI 아키텍처 (Entity-Scenario-EngineX) 특허'
    ]
  },
  1: {
    projects: [
      'AI혁신연구원 연구지원사업 과제 선정 (2026)'
    ],
    publications: [
      '"A Battery World Foundation Model for Diagnosis and Prognosis" — eTransportation, In Preparation'
    ]
  },
  2: {
    projects: [
      'NIPA 고성능 컴퓨팅 지원사업 과제 선정 (2025)'
    ],
  },
  3: {
    projects: [
      '산업통상자원부(MOTIE) 국책과제 참여 (2025–2027)'
    ],
    publications: [
      '"UniBatt: Universal Foundation Framework for Battery State Estimation" — KECS 2025, Oral Presentation'
    ]
  },
  4: {
    projects: [
      'Google DeepMind 공동 연구 프로젝트 참여 (2024)'
    ]
  },
  5: {
    publications: [
      '"A Research on Synthetic Data for Improving Performance of Skeleton-Based Fall Down Detection Models" — KIIS 2024, Oral Presentation',
      '"An Analysis on Synthetic Data for Improving Performance of Skeleton-Based Fall Down Detection Models" — IBDAP 2024, Oral Presentation'
    ],
    awards: [
      'Best Paper Award (KIIS 2024)'
    ]
  },
  6: {
    publications: [
      '"Improving Top-Down Pose Estimation-Based Fall Detection Using Segmentation" — KASP 2024'
    ],
    awards: [
      'Best Paper Award (KASP 2024)',
      'Best Presentation Award (KASP 2024)'
    ]
  },
  7: {
    publications: [
      '"Thermal Threshold-Based Pose Estimation for Smoking Behavior Detection" — KCC 2024',
      '"Accelerating Motion Deblurring of Color Images with Grayscale Conversion and Approximate Color Restoration" — KMMS 2024',
      '"CycleGAN-Based Image Synthesis for Improving Traffic Light Recognition in Rainy Conditions" — KMMS 2024'
    ],
    awards: [
      'The Grand Prize (President\'s Award) — ICIP Capstone Design 2024',
      '3rd Place Award (KCC 2024)'
    ]
  }
};

const AWARD_IMAGES_BY_TEXT = {
  5: {
    'Best Paper Award (KIIS 2024)': ['우수논문상_Award2_ParkJimin.png'],
    '"An Analysis on Synthetic Data for Improving Performance of Skeleton-Based Fall Down Detection Models" — IBDAP 2024, Oral Presentation': ['IBDAP2024Certificate_ParkJimin.png']
  },
  6: {
    'Best Paper Award (KASP 2024)': ['우수논문상_Award3_ParkJimin.png'],
    'Best Presentation Award (KASP 2024)': ['우수발표상_Award4_ParkJimin.png']
  },
  7: {
    'The Grand Prize (President\'s Award) — ICIP Capstone Design 2024': ['캡스톤_Award5_ParkJimin.png'],
    '3rd Place Award (KCC 2024)': ['정보과학회_Award1_ParkJimin.png']
  }
};

function getModalOutcomeGroups(data, idx) {
  if (idx !== undefined && OUTCOME_GROUPS[idx]) {
    return OUTCOME_GROUPS[idx];
  }
  if (!data.outcomes || !data.outcomes.length) return null;
  return { outcomes: data.outcomes };
}

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const content = document.getElementById('modalContent');
  const cards = document.querySelectorAll('.proj--clickable');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.project);
      const data = PROJECT_DETAILS[idx];
      if (!data) return;
      content.innerHTML = renderProjectDetail(data, idx);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function renderProjectDetail(data, idx) {
  const iconMap = {
    target: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    problem: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M5.07 19H18.93a2 2 0 001.72-2.98L13.72 4.02a2 2 0 00-3.44 0L3.34 16.02A2 2 0 005.07 19z"/></svg>',
    approach: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    role: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>'
  };

  const roleClass = data.isLead ? 'modal__role--lead' : 'modal__role--default';

  const t = TRANSLATIONS[currentLang];
  const modalRole = (idx !== undefined && t[`proj.${idx}.role`]) || data.role;
  const modalTitle = (idx !== undefined && t[`proj.${idx}.title`]) || data.title;
  const modalOrg = (idx !== undefined && t[`proj.${idx}.org`]) || data.org;

  let html = `
    <span class="modal__role ${roleClass}">${modalRole}</span>
    <p class="modal__period">${data.period}</p>
    <h2 class="modal__title">${modalTitle}</h2>
    <p class="modal__org">${modalOrg}</p>
  `;

  // Graphical Abstract (auto-detect proj-X-N.png extra images)
  if (idx !== undefined) {
    const baseName = `proj-${idx}`;
    const images = [`${baseName}.png`];
    // Probe for extra images: proj-X-1.png, proj-X-2.png, ...
    const MAX_EXTRA = 10;
    for (let n = 1; n <= MAX_EXTRA; n++) {
      images.push(`${baseName}-${n}.png`);
    }
    const placeholderHTML = `<div class='modal__ga--placeholder'><svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M21 15l-5-5L5 21'/></svg><span>Graphical Abstract</span></div>`;

    html += `<div class="modal__ga modal__ga--grid" id="modalGA">`;
    images.forEach(file => {
      html += `<img src="assets/img/projects/${file}" alt="Graphical Abstract" onerror="this.remove()">`;
    });
    html += `</div>`;
  }

  // Diagram
  if (data.diagram && data.diagram.flow) {
    html += `<div class="modal__diagram"><div class="modal__diagram-content"><div class="modal__diagram-flow">`;
    data.diagram.flow.forEach((step, i) => {
      if (i > 0) html += `<span class="modal__diagram-arrow">→</span>`;
      html += `<span class="modal__diagram-box">${step}</span>`;
    });
    html += `</div></div></div>`;
  }

  // Sections
  data.sections.forEach(sec => {
    html += `
      <div class="modal__section">
        <h3 class="modal__section-title">${iconMap[sec.icon] || ''} ${sec.title}</h3>
        <div class="modal__text">${sec.content}</div>
      </div>
    `;
  });

  // Tech Stack
  html += `<div class="modal__section"><h3 class="modal__section-title">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
    Tech Stack</h3><div class="modal__tags">`;
  data.tags.forEach(tag => {
    html += `<span class="tag tag--accent">${tag}</span>`;
  });
  html += `</div></div>`;

  // Outcomes
  const outcomeGroups = getModalOutcomeGroups(data, idx);
  if (outcomeGroups) {
    const groupMeta = {
      projects: {
        itemIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      },
      ip: {
        itemIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
      },
      publications: {
        itemIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
      },
      awards: {
        itemIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
      },
      outcomes: {
        itemIcon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      }
    };
    const groupOrder = ['projects', 'ip', 'publications', 'awards', 'outcomes'];
    let fallbackOutcomeIdx = 0;
    html += `<div class="modal__section"><h3 class="modal__section-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
      Outcomes</h3><div class="modal__outcome-box">`;

    groupOrder.forEach(key => {
      const items = outcomeGroups[key];
      if (!items || !items.length) return;
      const meta = groupMeta[key];
      const useLegacyFallback = key === 'outcomes';
      html += `<div class="modal__outcome-group">`;
      items.forEach(itemText => {
        const certByText = (idx !== undefined && AWARD_IMAGES_BY_TEXT[idx] && AWARD_IMAGES_BY_TEXT[idx][itemText]) || [];
        const certByLegacyIndex = useLegacyFallback
          ? ((idx !== undefined && AWARD_IMAGES[idx] && AWARD_IMAGES[idx][fallbackOutcomeIdx]) || [])
          : [];
        const certs = certByText.length ? certByText : certByLegacyIndex;
        if (useLegacyFallback) fallbackOutcomeIdx += 1;
        html += `<div class="modal__outcome-item">
          ${meta.itemIcon}
          <div class="modal__outcome-content">
            <span>${itemText}</span>
            ${certs.length ? `<div class="modal__outcome-certs">${certs.map(c =>
              `<img class="modal__outcome-cert" src="assets/img/awards/${c}" alt="Certificate" loading="lazy">`
            ).join('')}</div>` : ''}
          </div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `</div></div>`;
  }

  return html;
}

/* Fade-in keyframe for filter */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);

/* ----------------------------------------
   i18n (Internationalization)
   ---------------------------------------- */
const TRANSLATIONS = {
  ko: {
    'hero.greeting': '안녕하세요,',
    'hero.name': '<span class="accent">박지민</span>입니다.',
    'hero.desc': '연세대학교 이차전지융합공학협동과정 석사과정<br>Multi-Physics Modeling & Computation Lab (Prof. Jung-Il Choi)',
    'nav.about': 'Research Focus',
    'about.title': 'Research Focus',
    'about.subtitle': '이차전지 전주기 통합 AI 파운데이션 모델',
    'pipeline.legend': '이차전지 전주기 통합 AI 파운데이션 모델',
    'pipeline.0.label': '소재',
    'pipeline.1.label': '설계',
    'pipeline.2.label': '운용',
    'pipeline.3.label': '수명',
    'pipeline.0.title': '소재 (Material)',
    'pipeline.0.desc': '실험 데이터로 Material-scale Electrochemical Neural Operator를 학습하고, 전기화학 반응·전달·안전 거동을 물리 제약 하에 추정해 설계·운용 단계로 불확실도 신호를 전달합니다.',
    'pipeline.1.title': '설계 (Design)',
    'pipeline.1.desc': '공정 조건을 잠재 조건으로 인코딩해 조건부 Diffusion으로 전극·소재 후보를 생성하고, Surrogate + 물리 제약 스코어러로 후보를 스크리닝합니다.',
    'pipeline.2.title': '운용 (Operation)',
    'pipeline.2.desc': '동적 충방전·온도·부하 프로토콜을 Neural Operator로 빠르게 시뮬레이션해 SOC, SOH, RUL 및 열폭주 위험을 멀티태스크로 추정하고, 실패 민감도 맵을 설계·소재 단계로 역전파 방식으로 전달합니다.',
    'pipeline.3.title': '수명 (Lifetime)',
    'pipeline.3.desc': '열화 시계열을 활용해 수명 경로를 예측하고, AI 최적화기로 설계·소재·운용 조합을 평가해 신뢰성 제약 하에서 목표 수명을 폐루프 확보합니다.',
    'pipeline.feedback': '최적화 폐루프',
    'projects.subtitle': '연구 프로젝트 & 활동',
    'proj.0.desc': '물리+AI 융합 \'Entity-Scenario-EngineX\' 3단 프레임워크 기반 10B+ 파라미터 범용 배터리 파운데이션 모델 개발 국책과제. NVIDIA B200 24GPU / 160TB 데이터 규모로, EV·UAM·ESS 배터리 전주기 진단·예측·설계 최적화 Agentic Scientific AI를 구현.',
    'proj.1.desc': '물리(전기화학, 열역학) 기반 Physics-Integrated Battery Foundation Model 개발. 물리-데이터 융합 기반 전주기 진단·수명 예측 통합 엔진을 구축하며, 차세대 Agentic Scientific AI로 확장 가능한 배터리 디지털 트윈 기반 확보.',
    'proj.2.desc': 'NIPA 국가 GPU 지원 사업 기반 EV·ESS 전주기 안전·수명 통합 예측 파운데이션 모델 개발. Diffusion Pretext + Contrastive 학습으로 30B 파라미터 모델을 사전학습하여 SOH 예측 MAE 0.8% 이하 달성.',
    'proj.3.desc': '산업통상자원부 국책과제로 전기차 배터리 열폭주 사전 대응용 차세대 상태진단 AI 엔진 개발. Nested JEPA + Dual Hierarchical Encoder 기반 Battery Foundation Model을 설계하여 SOC, SOH, RUL 동시 추정 통합 진단 Backbone 구축.',
    'proj.4.desc': 'Google DeepMind 협업 하에 차세대 생성형 비디오 모델 저작권 보호 기술 개발. 3D Wavelet + Importance-based Weight Modulation 기반 Video Watermark Decoder를 설계하여 512-bit 고용량 워터마크 99% 비트 정확도 달성.',
    'proj.5.desc': '치안현장 맞춤형 R&D 과제(폴리스랩 2.0)로, 게임 엔진 기반 합성 이상행동 데이터 10TB 생성 및 DANN 도메인 적응을 통한 ST-GCN 이상행동 감지 모델 고도화. 테스트 환경 정확도 84.49%, F1-Score 0.73 달성.',
    'proj.6.desc': '국책과제로 드론 감시 환경에서의 장거리 인물 추적을 위한 Vision AI 고도화 연구. 게임 엔진 기반 공중 시점 합성 데이터를 활용하여 Person Re-Identification 모델을 개발하고, IEEE 국제학회에서 발표.',
    'proj.7.desc': '극한 환경에서의 AI 기반 자율 순찰 로봇 프레임워크 개발. Thermal + Vision AI 융합 흡연 감지(Accuracy 94.2%, F1 0.85), 모션 디블러(PSNR 30.02), 악천후 대응, SLAM+ROS2 자율주행 4개 모듈 통합. 캡스톤 디자인 총장상(대상) 수상.',
    'proj.8.desc': 'Unreal Engine을 활용하여 딥러닝 학습에 필요한 고품질 합성 데이터를 자동 생성하는 파이프라인을 구축. 다양한 카메라 앵글, 조명, 포즈 변화를 시뮬레이션하여 데이터 다양성을 확보하고, 실제 데이터 대비 모델 성능 향상 효과를 검증.',
    'proj.9.desc': '대학교 공지사항을 자동 크롤링하고, NLP 기법을 적용하여 사용자 맞춤형 키워드 알림을 제공하는 시스템을 개발. 웹 스크래핑, 텍스트 분류, 알림 서비스를 포함한 End-to-End 시스템을 구현.',
    'proj.10.desc': '실내외 공기질 데이터를 센서로 수집하고, AI 기반 예측 모델을 통해 자동으로 환기 시점을 결정하는 스마트 창문형 공기청정기를 설계 및 프로토타입 제작. 교육부/NRF 지원 산학협력 프로젝트로 팀을 이끌어 학장상(대상) 수상.',
    'publications.subtitle': '학술 논문 및 발표',
    'resume.title': 'Resume',
    'resume.edu.title': 'Education',
    'resume.edu.ms': 'M.S. Battery Conflation Engineering',
    'resume.edu.ms.org': 'Yonsei University · Multi-Physics Modeling & Computation Lab (Prof. Jung-Il Choi)',
    'resume.edu.bs': 'B.S. Mathematics & B.S. Computer Science and Engineering',
    'resume.edu.bs.org': 'Dongguk University · Double Major',
    'resume.edu.intl': 'International Secondary Education',
    'resume.research.title': 'Research Experience',
    'resume.exp.yonsei.ms': 'M.S. Student · Yonsei University',
    'resume.exp.yonsei.ms.dept': 'Multi-Physics Modeling & Computation Lab<br>&emsp;Battery Conflation Engineering',
    'resume.exp.yonsei.intern': 'Research Intern · Yonsei University',
    'resume.exp.yonsei.intern.dept': 'Multi-Physics Modeling & Computation Lab<br>&emsp;School of Mathematics & Computing (CSE)',
    'resume.exp.korea': 'Research Intern · Korea University',
    'resume.exp.korea.dept': 'Computer Vision Lab (Prof. Sangpil Kim)<br>&emsp;Dept. of Artificial Intelligence',
    'resume.exp.dongguk': 'Research Intern · Dongguk University',
    'resume.exp.dongguk.dept': 'CS & Distributed Computing Lab (Prof. Junho Jeong)<br>&emsp;Dept. of Computer Science and Engineering',
    'resume.honors.title': 'Honors & Awards',
    'resume.skills.title': 'Skills',
    'resume.skills.research': 'Research Interests',
    'resume.skills.programming': 'Programming & Frameworks',
    'resume.skills.tools': 'Tools',
    'resume.skills.languages': 'Languages',
    'resume.skills.lang.en': 'English (Fluent)',
    'resume.skills.lang.ja': 'Japanese (Intermediate)',
    'resume.skills.lang.zh': 'Chinese (Intermediate)',
    'resume.skills.lang.ko': 'Korean (Native)',
    'resume.activities.title': 'Activities',
    'resume.cv.download': 'Download CV (PDF)',
    'proj.0.title': '배터리 진단을 위한 범용 파운데이션 모델 개발',
    'proj.0.role': '과제 기획 및 실무 책임',
    'proj.0.org': '첨단 GPU 활용 지원사업, 정보통신산업진흥원(NIPA), 과학기술정보통신부',
    'proj.1.title': '배터리 전주기 예측·진단을 위한 물리 기반 파운데이션 모델',
    'proj.1.role': '과제 기획 및 실무 책임',
    'proj.1.org': 'AI혁신연구원 연구지원사업, AI혁신연구원',
    'proj.2.title': '배터리 안전성 및 수명 예측 파운데이션 모델 개발',
    'proj.2.role': '과제 기획 및 실무 책임',
    'proj.2.org': '고성능 컴퓨팅 지원사업, 정보통신산업진흥원(NIPA), 과학기술정보통신부',
    'proj.3.title': '배터리 열폭주 예측 및 조기진단을 위한 소프트웨어 기술개발',
    'proj.3.role': '연구원',
    'proj.3.org': '자동차산업기술개발사업(그린카), 산업통상자원부(MOTIE)',
    'proj.4.title': '생성형 AI로부터의 AI 모델 & 디지털 콘텐츠 저작권 보호',
    'proj.4.role': '연구원',
    'proj.4.org': 'Google DeepMind Collaboration',
    'proj.5.title': '이상 행동 감지 모델 성능 개선을 위한 합성 데이터 생성 연구',
    'proj.5.role': '연구원',
    'proj.5.org': '치안현장 맞춤형 연구개발사업 (폴리스랩 2.0), 과학기술정보통신부 & 경찰청',
    'proj.6.title': '게임엔진을 활용한 드론 인물 재식별 모델 개발',
    'proj.6.role': '연구원',
    'proj.6.org': '스마트 커뮤니티 폴리싱 시스템(Googi) 개발, 과학기술정보통신부 & 한국연구재단(NRF)',
    'proj.7.title': '극한 환경에서의 AI 기반 자율 순찰 로봇 프레임워크 개발',
    'proj.7.role': '팀 리더',
    'proj.7.org': 'ICIP & 캡스톤 디자인, 소프트웨어교육원, 동국대학교',
    'proj.8.title': '게임 엔진을 활용한 딥러닝 분석용 데이터 생성 고도화 연구',
    'proj.8.role': '연구원',
    'proj.8.org': '자율 캡스톤 디자인, 동국대학교',
    'proj.9.title': '크롤링 및 NLP 기반 동국대학교 공지사항 알림 시스템',
    'proj.9.role': '개발자',
    'proj.9.org': '오픈소스 프로젝트, 소프트웨어교육원, 동국대학교',
    'proj.10.title': '인공지능 창문형 공기청정기',
    'proj.10.role': '팀 리더',
    'proj.10.org': 'LINC 3.0 어드벤처 디자인, 교육부 & 한국연구재단',
    'footer.text': 'AI Researcher · 연세대학교',
    'proj.clickable': '클릭하여 상세보기 →',
    'wfm.model': '배터리 월드 모델',
    'wfm.sim.title': '멀티스케일 디지털 트윈 시뮬레이션',
    'wfm.sim.no1': '뉴럴 오퍼레이터',
    'wfm.sim.no2': '가속 시뮬레이션',
    'wfm.sim.material': '소재',
    'wfm.sim.electrode': '전극',
    'wfm.sim.cell': '셀',
    'wfm.sim.system': '시스템',
    'wfm.data': '시뮬레이션 데이터',
    'wfm.out.perf': '성능 · 수명 예측',
    'wfm.out.state': 'SOC · SOH · RUL',
    'wfm.out.safety': '안전 · 이상탐지',
    'wfm.inverse': '역설계 최적화',
    'wfm.out.title': '다운스트림 태스크',
    'wfm.phase.forward': 'Forward →',
    'wfm.phase.backward': '← Inverse',
  },
  en: {
    'hero.greeting': 'Hello,',
    'hero.name': 'I\'m <span class="accent">Jimin Park</span>.',
    'hero.desc': 'M.S. Student, Battery Conflation Engineering, Yonsei University<br>Multi-Physics Modeling & Computation Lab (Prof. Jung-Il Choi)',
    'nav.about': 'Research Focus',
    'about.title': 'Research Focus',
    'about.subtitle': 'Integrated Full-Cycle Battery AI Foundation Model',
    'pipeline.legend': 'Integrated Full-Cycle Battery AI Foundation Model',
    'pipeline.0.label': 'Material',
    'pipeline.1.label': 'Design',
    'pipeline.2.label': 'Operation',
    'pipeline.3.label': 'Lifetime',
    'pipeline.0.title': 'Material',
    'pipeline.0.desc': 'Train material-scale electrochemical Neural Operator surrogates from experiments to predict reaction, transport, and safety metrics',
    'pipeline.1.title': 'Design',
    'pipeline.1.desc': 'Encode material and process conditions as conditional codes, generate electrode candidates by conditional diffusion, and pre-screen with surrogate scoring and physics constraints.',
    'pipeline.2.title': 'Operation',
    'pipeline.2.desc': 'Simulate dynamic charge/discharge, temperature, and load trajectories with Neural Operator surrogates to estimate SOC, SOH, RUL, and thermal-runaway risk, then back-propagate failure-sensitivity maps to design and materials.',
    'pipeline.3.title': 'Lifetime',
    'pipeline.3.desc': 'Predict aging trajectories from degradation signals and use AI optimization to close the loop across design, materials, and operation while satisfying safety-reliability constraints.',
    'pipeline.feedback': 'Optimization Closed Loop',
    'projects.subtitle': 'Research Projects & Activities',
    'proj.0.title': 'Universal Foundation Model for Battery Diagnostics',
    'proj.0.role': 'Proposal Author & Lead Researcher',
    'proj.0.org': 'Advanced GPU Computing Support Program, National IT Industry Promotion Agency (NIPA), Ministry of Science and ICT',
    'proj.0.desc': 'Developing a 10B+ parameter universal battery foundation model based on the physics+AI \'Entity-Scenario-EngineX\' 3-stage framework. Utilizing NVIDIA B200 24GPUs / 160TB data for EV/UAM/ESS full-lifecycle diagnostics, prediction, and design optimization as Agentic Scientific AI.',
    'proj.1.title': 'Physics Foundation Model for Battery Full-Lifecycle Prediction and Diagnostics',
    'proj.1.role': 'Proposal Author & Lead Researcher',
    'proj.1.org': 'Institute for AI Innovation',
    'proj.1.desc': 'Developing a Physics-Integrated Battery Foundation Model grounded in electrochemistry and thermodynamics. Building a physics-data fusion engine for full-lifecycle diagnostics and lifetime prediction, establishing a battery digital twin foundation for Agentic Scientific AI.',
    'proj.2.title': 'Development of a Foundation Model for Predicting Battery Safety and Lifetime',
    'proj.2.role': 'Proposal Author & Lead Researcher',
    'proj.2.org': 'High-Performance Computing Support Program, National IT Industry Promotion Agency (NIPA), Ministry of Science and ICT',
    'proj.2.desc': 'Developing an EV/ESS full-lifecycle safety and lifetime prediction foundation model on the NIPA national GPU program. Pre-trained a 30B parameter model with Diffusion Pretext + Contrastive learning, achieving SOH prediction MAE below 0.8%.',
    'proj.3.title': 'Development of Software Technology for Predicting and Early Diagnosing for EV Battery Thermal Runaway',
    'proj.3.role': 'Researcher',
    'proj.3.org': 'Ministry of Trade, Industry and Energy (MOTIE)',
    'proj.3.desc': 'Developing next-generation state diagnostics AI engine for EV battery thermal runaway prevention under a MOTIE national project. Designed a Battery Foundation Model based on Nested JEPA + Dual Hierarchical Encoder for unified SOC, SOH, RUL estimation.',
    'proj.4.title': 'Copyright Protection of AI Model & Digital Content from Generative AI',
    'proj.4.role': 'Researcher',
    'proj.4.org': 'Google DeepMind Collaboration',
    'proj.4.desc': 'Developing next-generation video copyright protection in collaboration with Google DeepMind. Designed a Video Watermark Decoder based on 3D Wavelet + Importance-based Weight Modulation, achieving 512-bit watermark embedding with 99% bit accuracy.',
    'proj.5.title': 'Management for Police Field Customized Research and Development',
    'proj.5.role': 'Researcher',
    'proj.5.org': 'Ministry of Science and Technology & Korean National Police Agency',
    'proj.5.desc': 'Police field-customized R&D (PoliceLab 2.0) generating 10TB synthetic abnormal behavior data via game engine and enhancing ST-GCN anomaly detection with DANN domain adaptation. Achieved 84.49% accuracy and F1-Score 0.73.',
    'proj.6.title': 'Development of SMART Community Policing System',
    'proj.6.role': 'Researcher',
    'proj.6.org': 'Ministry of Science and Technology & National Research Foundation of Korea (NRF)',
    'proj.6.desc': 'Developed Vision AI for long-range person tracking in drone surveillance as a national research project. Built a Person Re-Identification model using game engine-based aerial synthetic data and presented at an IEEE international conference.',
    'proj.7.title': 'AI-Driven Autonomous Patrol Robot Framework for Real-Time Smoking Behavior Detection',
    'proj.7.role': 'Team Leader',
    'proj.7.org': 'ICIP & Capstone Design, Software Education Institute, Dongguk University',
    'proj.7.desc': 'Developed an AI-driven autonomous patrol robot framework for extreme environments. Integrated 4 modules: Thermal+Vision smoking detection (Accuracy 94.2%, F1 0.85), motion deblur (PSNR 30.02), adverse weather, and SLAM+ROS2. Won the President\'s Grand Prize.',
    'proj.8.title': 'An Advanced Study on Data Generation for Deep Learning Analysis Using the Game Engine',
    'proj.8.role': 'Researcher',
    'proj.8.org': 'Independent Capstone Design, Dongguk University',
    'proj.8.desc': 'Built a pipeline for automatically generating high-quality synthetic data for deep learning using Unreal Engine. Simulated diverse camera angles, lighting, and pose variations to ensure data diversity, and verified model performance improvement compared to real data.',
    'proj.9.title': 'Crawling and NLP-Powered Dongguk University Notification Alert System',
    'proj.9.role': 'Developer',
    'proj.9.org': 'Open Software Project, Software Education Institute, Dongguk University',
    'proj.9.desc': 'Developed a system that automatically crawls university announcements and applies NLP techniques to provide user-customized keyword alerts. Implemented an End-to-End system including web scraping, text classification, and notification services.',
    'proj.10.title': 'Artificial Intelligence Window Air Purifier',
    'proj.10.role': 'Team Leader',
    'proj.10.org': 'LINC 3.0 Adventure Design, Ministry of Education & National Research Foundation of Korea',
    'proj.10.desc': 'Designed and prototyped a smart window air purifier that collects indoor/outdoor air quality data via sensors and uses AI prediction models to automatically determine optimal ventilation timing. Led the team to win the Dean\'s Grand Prize.',
    'publications.subtitle': 'Academic Papers & Presentations',
    'resume.title': 'Resume',
    'resume.edu.title': 'Education',
    'resume.edu.ms': 'M.S. Battery Conflation Engineering',
    'resume.edu.ms.org': 'Yonsei University · Multi-Physics Modeling & Computation Lab (Prof. Jung-Il Choi)',
    'resume.edu.bs': 'B.S. Mathematics & B.S. Computer Science and Engineering',
    'resume.edu.bs.org': 'Dongguk University · Double Major',
    'resume.edu.intl': 'International Secondary Education',
    'resume.research.title': 'Research Experience',
    'resume.exp.yonsei.ms': 'M.S. Student · Yonsei University',
    'resume.exp.yonsei.ms.dept': 'Multi-Physics Modeling & Computation Lab<br>&emsp;Battery Conflation Engineering',
    'resume.exp.yonsei.intern': 'Research Intern · Yonsei University',
    'resume.exp.yonsei.intern.dept': 'Multi-Physics Modeling & Computation Lab<br>&emsp;School of Mathematics & Computing (CSE)',
    'resume.exp.korea': 'Research Intern · Korea University',
    'resume.exp.korea.dept': 'Computer Vision Lab (Prof. Sangpil Kim)<br>&emsp;Dept. of Artificial Intelligence',
    'resume.exp.dongguk': 'Research Intern · Dongguk University',
    'resume.exp.dongguk.dept': 'CS & Distributed Computing Lab (Prof. Junho Jeong)<br>&emsp;Dept. of Computer Science and Engineering',
    'resume.honors.title': 'Honors & Awards',
    'resume.skills.title': 'Skills',
    'resume.skills.research': 'Research Interests',
    'resume.skills.programming': 'Programming & Frameworks',
    'resume.skills.tools': 'Tools',
    'resume.skills.languages': 'Languages',
    'resume.skills.lang.en': 'English (Fluent)',
    'resume.skills.lang.ja': 'Japanese (Intermediate)',
    'resume.skills.lang.zh': 'Chinese (Intermediate)',
    'resume.skills.lang.ko': 'Korean (Native)',
    'resume.activities.title': 'Activities',
    'resume.cv.download': 'Download CV (PDF)',
    'footer.text': 'AI Researcher · Yonsei University',
    'proj.clickable': 'Click to view details →',
    'wfm.model': 'Battery World Model',
    'wfm.sim.title': 'Multi-Scale Digital Twin Simulation',
    'wfm.sim.no1': 'Neural Operator',
    'wfm.sim.no2': 'Accelerated Simulation',
    'wfm.sim.material': 'Material',
    'wfm.sim.electrode': 'Electrode',
    'wfm.sim.cell': 'Cell',
    'wfm.sim.system': 'System',
    'wfm.data': 'Simulation Data',
    'wfm.out.perf': 'Performance · Lifetime',
    'wfm.out.state': 'SOC · SOH · RUL',
    'wfm.out.safety': 'Safety · Anomaly',
    'wfm.inverse': 'Inverse Design',
    'wfm.out.title': 'Downstream Task',
    'wfm.phase.forward': 'Forward →',
    'wfm.phase.backward': '← Inverse',
  }
};

const TYPING_PHRASES = {
  ko: [
    'World Models & Foundation Models',
    'Battery AI Researcher',
    'Neural Operators & Physics-Informed ML',
    'Multimodal AI & Agentic AI',
    '연세대학교 석사과정'
  ],
  en: [
    'World Models & Foundation Models',
    'Battery AI Researcher',
    'Neural Operators & Physics-Informed ML',
    'Multimodal AI & Agentic AI',
    'Yonsei University M.S. Student'
  ]
};

let currentLang = 'ko';

function initI18n() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  const savedLang = localStorage.getItem('portfolio-lang');
  if (savedLang && (savedLang === 'en' || savedLang === 'ko')) {
    currentLang = savedLang;
  }

  // Always apply language on init to ensure all elements (including
  // those reparented by initProjectThumbnails) are properly translated
  applyLanguage(currentLang);

  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    localStorage.setItem('portfolio-lang', currentLang);
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  // Update toggle UI
  document.querySelectorAll('.lang-toggle__option').forEach(opt => {
    opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang);
  });

  // Update all data-i18n elements
  const t = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update clickable hint via CSS custom property
  document.documentElement.style.setProperty('--clickable-hint', `"${t['proj.clickable']}"`);

  // Refresh pipeline detail panel
  if (window._pipelineSetActive && window._pipelineActiveIndex) {
    window._pipelineSetActive(window._pipelineActiveIndex());
  }

  // Restart typing effect with correct language
  restartTypingEffect(lang);
}

function restartTypingEffect(lang) {
  const element = document.getElementById('typingText');
  if (!element) return;
  element.textContent = '';

  if (window._typingTimeout) clearTimeout(window._typingTimeout);

  const phrases = TYPING_PHRASES[lang];
  let phraseIndex = 0, charIndex = 0, isDeleting = false, isPausing = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isPausing) return;

    if (!isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isPausing = true;
        window._typingTimeout = setTimeout(() => { isPausing = false; isDeleting = true; type(); }, 2000);
        return;
      }
      window._typingTimeout = setTimeout(type, 80 + Math.random() * 40);
    } else {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window._typingTimeout = setTimeout(type, 400);
        return;
      }
      window._typingTimeout = setTimeout(type, 40);
    }
  }
  window._typingTimeout = setTimeout(type, 400);
}

/* ----------------------------------------
   World Foundation Model Canvas Animation
   ---------------------------------------- */
function initWFMCanvas() {
  const canvas = document.getElementById('wfmCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = false;
  let time = 0;

  const BLUE = '#2563eb';
  const BLUE_MID = '#3b82f6';
  const RED = '#ef4444';
  const RED_MID = '#f87171';
  const TEXT_DARK = '#1a1a2e';
  const TEXT_LIGHT = '#6b7280';
  const BORDER = '#e5e7eb';
  const CARD_BG = '#ffffff';

  // Phase system: forward (blue, left→right) ↔ backward (red, right→left)
  const PHASE_DURATION = 4.0; // seconds per phase
  const TRANSITION = 0.5;     // blend transition seconds
  let phase = 'forward';      // 'forward' | 'backward'
  let phaseTime = 0;          // time within current phase
  let blend = 0;              // 0 = fully forward (blue), 1 = fully backward (red)

  function getPhaseColor() {
    // Returns interpolated accent color
    if (blend <= 0) return BLUE;
    if (blend >= 1) return RED;
    // Lerp between blue and red
    var r = Math.round(37 + (239 - 37) * blend);
    var g = Math.round(99 + (68 - 99) * blend);
    var b = Math.round(235 + (68 - 235) * blend);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function getPhaseColorRgba(a) {
    if (blend <= 0) return 'rgba(37,99,235,' + a + ')';
    if (blend >= 1) return 'rgba(239,68,68,' + a + ')';
    var r = Math.round(37 + (239 - 37) * blend);
    var g = Math.round(99 + (68 - 99) * blend);
    var b = Math.round(235 + (68 - 235) * blend);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  const particles = [];  // unified particle pool

  function getParams() {
    if (W <= 480) return { ringNodes: [5, 8], pCount: 8 };
    if (W <= 768) return { ringNodes: [6, 10, 10], pCount: 12 };
    return { ringNodes: [6, 10, 14], pCount: 16 };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- Layout ---
  // Left:   sim chain vertical (소재 → 전극 → 셀 → 시스템)
  // Center: Battery WFM brain (input from left)
  // Right:  3 outputs fan-out
  // Bottom: inverse design feedback loop
  function getLayout() {
    var mobile = W <= 480;
    var tablet = W > 480 && W <= 768;

    var nodeW, nodeH, simX, simYs, pad, fmCx, fmCy, fmR, fmPadX, fmPadY, outX, outYs;

    if (mobile) {
      nodeW = Math.min(W * 0.18, 65);
      nodeH = H * 0.13;
      simX = W * 0.12;
      simYs = [H * 0.22, H * 0.41, H * 0.60, H * 0.79];
      pad = 6;
      fmCx = W * 0.46;
      fmCy = H * 0.50;
      fmR = Math.min(W * 0.10, H * 0.14);
      fmPadX = 20; fmPadY = 16;
      outX = W * 0.76;
      outYs = [H * 0.30, H * 0.50, H * 0.70];
    } else if (tablet) {
      nodeW = Math.min(W * 0.20, 100);
      nodeH = H * 0.14;
      simX = W * 0.13;
      simYs = [H * 0.20, H * 0.40, H * 0.60, H * 0.80];
      pad = 10;
      fmCx = W * 0.47;
      fmCy = H * 0.50;
      fmR = Math.min(W * 0.11, H * 0.16);
      fmPadX = 35; fmPadY = 22;
      outX = W * 0.78;
      outYs = [H * 0.30, H * 0.50, H * 0.70];
    } else {
      nodeW = Math.min(W * 0.22, 135);
      nodeH = H * 0.15;
      simX = W * 0.14;
      simYs = [H * 0.20, H * 0.40, H * 0.60, H * 0.80];
      pad = 14;
      fmCx = W * 0.48;
      fmCy = H * 0.50;
      fmR = Math.min(W * 0.11, H * 0.17);
      fmPadX = 55; fmPadY = 28;
      outX = W * 0.80;
      outYs = [H * 0.30, H * 0.50, H * 0.70];
    }

    var simNodeW = nodeW * 0.8, simNodeH = nodeH * 0.8;
    return {
      simX, simYs, nodeW, nodeH, simNodeW, simNodeH,
      simBoxX0: simX - nodeW / 2 - pad,
      simBoxX1: simX + nodeW / 2 + pad,
      simBoxY0: simYs[0] - nodeH / 2 - (mobile ? 8 : 14),
      simBoxY1: simYs[3] + nodeH / 2 + (mobile ? 8 : 14),
      fmCx, fmCy, fmR,
      fmBoxX0: fmCx - fmR - fmPadX,
      fmBoxX1: fmCx + fmR + fmPadX,
      fmBoxY0: fmCy - fmR - fmPadY,
      fmBoxY1: fmCy + fmR + fmPadY,
      outX,
      outYs,
      mobile, tablet,
    };
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawLabel(text, x, y, color, size, align, alpha, maxW) {
    ctx.save();
    ctx.globalAlpha = alpha || 0.7;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    // Auto-shrink font to fit maxW if provided
    var finalSize = size;
    if (maxW) {
      ctx.font = `600 ${finalSize}px "Noto Sans KR", sans-serif`;
      while (ctx.measureText(text).width > maxW && finalSize > 7) {
        finalSize -= 0.5;
        ctx.font = `600 ${finalSize}px "Noto Sans KR", sans-serif`;
      }
    } else {
      ctx.font = `600 ${finalSize}px "Noto Sans KR", sans-serif`;
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // --- Sim chain (left, vertical) ---
  function drawSimChain(L, t) {
    var acCol = getPhaseColor();
    var sW = L.simNodeW, sH = L.simNodeH;
    // Nodes: pill-shaped cards with soft shadow (slightly smaller)
    L.simYs.forEach(function(cy, i) {
      var nx = L.simX - sW / 2, ny = cy - sH / 2;
      var r = sH / 2; // full pill radius
      var pulse = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.2);
      ctx.save();
      // Soft shadow
      ctx.globalAlpha = 0.08 + pulse * 0.04;
      ctx.fillStyle = '#000';
      roundRect(nx + 1, ny + 2, sW, sH, r); ctx.fill();
      // White pill background
      ctx.globalAlpha = 1; ctx.fillStyle = CARD_BG;
      roundRect(nx, ny, sW, sH, r); ctx.fill();
      // Border
      ctx.globalAlpha = 0.5 + pulse * 0.3; ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
      roundRect(nx, ny, sW, sH, r); ctx.stroke();
      // Subtle accent border glow on hover pulse
      ctx.globalAlpha = pulse * 0.15; ctx.strokeStyle = acCol; ctx.lineWidth = 2;
      roundRect(nx, ny, sW, sH, r); ctx.stroke();
      ctx.restore();
    });
    // Connecting lines between nodes — flowing dashed + particles
    var col = getPhaseColor();
    var isForward = phase === 'forward';
    var dashDir = isForward ? -1 : 1;
    for (var i = 0; i < 3; i++) {
      var y0 = L.simYs[i] + sH / 2 + 2;
      var y1 = L.simYs[i + 1] - sH / 2 - 2;
      var midY = (y0 + y1) / 2;
      ctx.save();
      // Animated dashed line
      ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
      ctx.setLineDash([4, 4]); ctx.lineDashOffset = dashDir * t * 14;
      ctx.beginPath(); ctx.moveTo(L.simX, y0); ctx.lineTo(L.simX, y1); ctx.stroke();
      ctx.setLineDash([]);
      // Small chevron arrow
      ctx.globalAlpha = 0.5; ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      if (isForward) {
        ctx.beginPath();
        ctx.moveTo(L.simX - 3, midY - 3); ctx.lineTo(L.simX, midY); ctx.lineTo(L.simX + 3, midY - 3);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(L.simX - 3, midY + 3); ctx.lineTo(L.simX, midY); ctx.lineTo(L.simX + 3, midY + 3);
        ctx.stroke();
      }
      // Flowing dot particles (2 per segment, staggered)
      ctx.fillStyle = col;
      for (var dp = 0; dp < 2; dp++) {
        var speed = 0.4 + dp * 0.15;
        var raw = (t * speed + dp * 0.5 + i * 0.3) % 1;
        var prog = isForward ? raw : (1 - raw);
        var py = y0 + (y1 - y0) * prog;
        var fade = prog < 0.1 ? prog / 0.1 : prog > 0.9 ? (1 - prog) / 0.1 : 1;
        ctx.globalAlpha = fade * 0.6;
        ctx.beginPath(); ctx.arc(L.simX, py, L.mobile ? 1.2 : 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }

  // --- Flow lines: sim ↔ FM (direction based on phase) ---
  function drawFlowLines(L, t) {
    var targetX = L.fmBoxX0 - 4;
    var col = getPhaseColor();
    var dashDir = phase === 'forward' ? -1 : 1;
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
    ctx.setLineDash([4, 4]); ctx.lineDashOffset = dashDir * t * 12;
    L.simYs.forEach(function(sy) {
      var x0 = L.simX + L.simNodeW / 2 + 2;
      ctx.beginPath(); ctx.moveTo(x0, sy); ctx.lineTo(targetX, L.fmCy); ctx.stroke();
    });
    ctx.setLineDash([]);
    // Arrowhead: forward → points right (at FM), backward → points left (at sim)
    ctx.globalAlpha = 0.55; ctx.strokeStyle = col;
    if (phase === 'forward') {
      ctx.beginPath();
      ctx.moveTo(targetX - 5, L.fmCy - 3); ctx.lineTo(targetX, L.fmCy); ctx.lineTo(targetX - 5, L.fmCy + 3);
      ctx.stroke();
    } else {
      L.simYs.forEach(function(sy) {
        var x0 = L.simX + L.simNodeW / 2 + 2;
        ctx.beginPath();
        ctx.moveTo(x0 + 5, sy - 3); ctx.lineTo(x0, sy); ctx.lineTo(x0 + 5, sy + 3);
        ctx.stroke();
      });
    }
    ctx.restore();
  }

  // --- FM network (transformer-style) ---
  function drawFMNetwork(L, t) {
    var x0 = L.fmBoxX0, y0 = L.fmBoxY0;
    var w = L.fmBoxX1 - L.fmBoxX0, h = L.fmBoxY1 - L.fmBoxY0;

    // Autoencoder: encoder (large) → bottleneck → decoder (small)
    var nodeCounts, bottleneckIdx;
    if (W <= 480) {
      nodeCounts = [4, 2, 3];
      bottleneckIdx = 1;
    } else if (W <= 768) {
      nodeCounts = [5, 4, 2, 3, 4];
      bottleneckIdx = 2;
    } else {
      nodeCounts = [6, 5, 3, 2, 3, 4];
      bottleneckIdx = 3;
    }

    var nLayers = nodeCounts.length;
    var nodeR = Math.max(2.5, W * 0.004);
    var padX = w * 0.08, padY = h * 0.12;
    var innerW = w - 2 * padX;

    // Encoder gets more horizontal space (asymmetric)
    var encWidth = innerW * 0.55;
    var decWidth = innerW * 0.45;

    // Build layer node positions
    var layers = [];
    for (var li = 0; li < nLayers; li++) {
      var lx;
      if (li <= bottleneckIdx) {
        lx = x0 + padX + (bottleneckIdx > 0 ? encWidth * li / bottleneckIdx : 0);
      } else {
        var decIdx = li - bottleneckIdx;
        var decTotal = nLayers - 1 - bottleneckIdx;
        lx = x0 + padX + encWidth + (decTotal > 0 ? decWidth * decIdx / decTotal : 0);
      }
      var nNodes = nodeCounts[li];
      var col = [];
      var maxNodes = nodeCounts[0]; // first encoder layer has the most
      var spread = nNodes / maxNodes; // 0..1 ratio — fewer nodes = tighter vertical spread
      var layerH = (h - 2 * padY) * spread;
      var layerTop = L.fmCy - layerH / 2;
      for (var ni = 0; ni < nNodes; ni++) {
        var ny = nNodes === 1 ? L.fmCy : layerTop + layerH * ni / (nNodes - 1);
        col.push({ x: lx, y: ny });
      }
      layers.push(col);
    }

    // Background glow
    ctx.save();
    var grad = ctx.createRadialGradient(L.fmCx, L.fmCy, 0, L.fmCx, L.fmCy, w * 0.45);
    grad.addColorStop(0, getPhaseColorRgba(0.05));
    grad.addColorStop(1, getPhaseColorRgba(0));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(L.fmCx, L.fmCy, w * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // --- 3D Latent Space: rotating point cloud manifold ---
    var bnX = layers[bottleneckIdx][0].x;
    var bnNodes = layers[bottleneckIdx];
    var bnTopY = bnNodes[0].y;
    var bnBotY = bnNodes[bnNodes.length - 1].y;
    var lsCx = bnX, lsCy = L.fmCy;
    var lsR = Math.min((bnBotY - bnTopY) / 2 + nodeR * 4, h * 0.38);
    var nPts = L.mobile ? 14 : (L.tablet ? 20 : 28);
    var acCol = getPhaseColor();

    // 3D rotation matrices
    var rotYa = t * 0.25;
    var rotXa = 0.35 + Math.sin(t * 0.12) * 0.15;
    var cosRY = Math.cos(rotYa), sinRY = Math.sin(rotYa);
    var cosRX = Math.cos(rotXa), sinRX = Math.sin(rotXa);

    // Golden spiral sphere points with dynamic oscillation
    var pts3d = [];
    for (var pi = 0; pi < nPts; pi++) {
      var phi = Math.acos(1 - 2 * (pi + 0.5) / nPts);
      var theta = Math.PI * (1 + Math.sqrt(5)) * pi;
      var dynR = 1 + 0.08 * Math.sin(t * 1.2 + pi * 2.1) + 0.05 * Math.sin(t * 0.7 + pi * 3.3);
      var sx = dynR * Math.sin(phi) * Math.cos(theta);
      var sy = dynR * Math.sin(phi) * Math.sin(theta);
      var sz = dynR * Math.cos(phi);
      var rx = sx * cosRY - sz * sinRY;
      var rz = sx * sinRY + sz * cosRY;
      var ry = sy * cosRX - rz * sinRX;
      var fz = sy * sinRX + rz * cosRX;
      pts3d.push({ x: rx, y: ry, z: fz });
    }
    pts3d.sort(function(a, b) { return a.z - b.z; });

    ctx.save();
    // Soft outer glow
    var lsGrad = ctx.createRadialGradient(lsCx, lsCy, 0, lsCx, lsCy, lsR * 1.1);
    lsGrad.addColorStop(0, getPhaseColorRgba(0.06));
    lsGrad.addColorStop(0.7, getPhaseColorRgba(0.03));
    lsGrad.addColorStop(1, getPhaseColorRgba(0));
    ctx.fillStyle = lsGrad;
    ctx.beginPath(); ctx.arc(lsCx, lsCy, lsR * 1.1, 0, Math.PI * 2); ctx.fill();

    // Orbit rings (tilted great circles)
    var nRings = L.mobile ? 2 : 3;
    for (var ri = 0; ri < nRings; ri++) {
      var ringTilt = ri * Math.PI / nRings;
      var cosRT = Math.cos(ringTilt), sinRT = Math.sin(ringTilt);
      ctx.beginPath();
      ctx.globalAlpha = 0.08 + 0.04 * Math.sin(t * 0.4 + ri);
      ctx.strokeStyle = acCol; ctx.lineWidth = 0.6;
      for (var ai = 0; ai <= 64; ai++) {
        var a = ai / 64 * Math.PI * 2;
        var ox = Math.cos(a), oy = Math.sin(a) * cosRT, oz = Math.sin(a) * sinRT;
        var orx = ox * cosRY - oz * sinRY;
        var orz2 = ox * sinRY + oz * cosRY;
        var ory = oy * cosRX - orz2 * sinRX;
        var ppx = lsCx + orx * lsR * 0.82;
        var ppy = lsCy + ory * lsR * 0.82;
        if (ai === 0) ctx.moveTo(ppx, ppy); else ctx.lineTo(ppx, ppy);
      }
      ctx.stroke();
    }

    // Manifold connections between nearby points
    ctx.strokeStyle = acCol; ctx.lineWidth = 0.5;
    for (var ci = 0; ci < pts3d.length; ci++) {
      for (var cj = ci + 1; cj < pts3d.length; cj++) {
        var dx3 = pts3d[ci].x - pts3d[cj].x;
        var dy3 = pts3d[ci].y - pts3d[cj].y;
        var dz3 = pts3d[ci].z - pts3d[cj].z;
        if (dx3 * dx3 + dy3 * dy3 + dz3 * dz3 < 0.65) {
          var avgZ = (pts3d[ci].z + pts3d[cj].z) / 2;
          ctx.globalAlpha = 0.04 + (avgZ + 1) * 0.08;
          ctx.beginPath();
          ctx.moveTo(lsCx + pts3d[ci].x * lsR * 0.8, lsCy + pts3d[ci].y * lsR * 0.8);
          ctx.lineTo(lsCx + pts3d[cj].x * lsR * 0.8, lsCy + pts3d[cj].y * lsR * 0.8);
          ctx.stroke();
        }
      }
    }

    // 3D points with depth-based size and opacity
    for (var di = 0; di < pts3d.length; di++) {
      var pt = pts3d[di];
      var depth01 = (pt.z + 1.2) / 2.4;
      var pSize = (L.mobile ? 1.0 : 1.5) + depth01 * (L.mobile ? 1.5 : 2.5);
      var pAlpha = 0.15 + depth01 * 0.55;
      var px2 = lsCx + pt.x * lsR * 0.8;
      var py2 = lsCy + pt.y * lsR * 0.8;
      // Colored glow halo
      ctx.globalAlpha = pAlpha * 0.3; ctx.fillStyle = acCol;
      ctx.beginPath(); ctx.arc(px2, py2, pSize * 2, 0, Math.PI * 2); ctx.fill();
      // White core dot
      ctx.globalAlpha = pAlpha; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(px2, py2, pSize, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Feedforward connections with propagation wave
    ctx.save();
    for (var li2 = 0; li2 < nLayers - 1; li2++) {
      var src = layers[li2], dst = layers[li2 + 1];
      for (var a = 0; a < src.length; a++) {
        for (var b = 0; b < dst.length; b++) {
          var waveDir = phase === 'forward' ? -1 : 1;
          var wave = Math.sin(t * 0.8 + waveDir * li2 * 0.7 + a * 0.3 + b * 0.2);
          var alpha = 0.06 + Math.max(0, wave) * 0.22;
          ctx.strokeStyle = getPhaseColor();
          ctx.lineWidth = 0.4 + Math.max(0, wave) * 0.6;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(src[a].x, src[a].y);
          ctx.lineTo(dst[b].x, dst[b].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Self-attention arcs (encoder side only)
    ctx.save();
    ctx.strokeStyle = getPhaseColor();
    for (var li3 = 0; li3 <= bottleneckIdx; li3++) {
      var col2 = layers[li3];
      for (var a2 = 0; a2 < col2.length; a2++) {
        for (var b2 = a2 + 2; b2 < col2.length; b2++) {
          var attn = 0.5 + 0.5 * Math.sin(t * 1.2 + li3 * 1.5 + a2 * 0.7 + b2 * 0.5);
          ctx.globalAlpha = attn * 0.15;
          ctx.lineWidth = 0.3 + attn * 0.4;
          var curveOff = -8 - (b2 - a2) * 3;
          var midX = col2[a2].x + curveOff;
          var midY = (col2[a2].y + col2[b2].y) / 2;
          ctx.beginPath();
          ctx.moveTo(col2[a2].x, col2[a2].y);
          ctx.quadraticCurveTo(midX, midY, col2[b2].x, col2[b2].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Activation sweep glow (linear traversal)
    ctx.save();
    var progress = Math.min(phaseTime / PHASE_DURATION, 1);
    var sweepT = phase === 'forward' ? progress : (1 - progress);
    var sweepX = x0 + padX + innerW * sweepT;
    var sweepGrad = ctx.createRadialGradient(sweepX, L.fmCy, 0, sweepX, L.fmCy, w * 0.18);
    sweepGrad.addColorStop(0, getPhaseColorRgba(0.10));
    sweepGrad.addColorStop(1, getPhaseColorRgba(0));
    ctx.fillStyle = sweepGrad;
    ctx.beginPath(); ctx.arc(sweepX, L.fmCy, w * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Draw encoder/decoder nodes (skip bottleneck — replaced by 3D latent space)
    var nodeCol = getPhaseColor();
    for (var li4 = 0; li4 < nLayers; li4++) {
      if (li4 === bottleneckIdx) continue;
      layers[li4].forEach(function(nd, ni) {
        var gl = 0.5 + 0.5 * Math.sin(t * 1.4 + li4 * 1.5 + ni * 0.9);
        ctx.save();
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nodeR + gl * 2, 0, Math.PI * 2);
        ctx.fillStyle = nodeCol; ctx.globalAlpha = 0.10 + gl * 0.12; ctx.fill();
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = nodeCol; ctx.globalAlpha = 0.5 + gl * 0.4; ctx.fill();
        ctx.restore();
      });
    }

  }

  // --- Output arrows (FM ↔ outputs, direction based on phase) ---
  function drawOutputArrows(L, t) {
    var x0 = L.fmBoxX1 + 4;
    var stemEnd = x0 + (L.outX - x0) * 0.12;
    var col = getPhaseColor();
    var dashDir = phase === 'forward' ? -1 : 1;
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
    ctx.setLineDash([4, 4]); ctx.lineDashOffset = dashDir * t * 12;
    ctx.beginPath(); ctx.moveTo(x0, L.fmCy); ctx.lineTo(stemEnd, L.fmCy); ctx.stroke();
    L.outYs.forEach(function(oy) {
      ctx.beginPath(); ctx.moveTo(stemEnd, L.fmCy); ctx.lineTo(L.outX - 2, oy); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.5; ctx.strokeStyle = col;
    if (phase === 'forward') {
      // Arrowheads at output end (→)
      L.outYs.forEach(function(oy) {
        var dx = L.outX - 2 - stemEnd, dy = oy - L.fmCy;
        var len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var ax = L.outX - 2, ay = oy;
        ctx.beginPath();
        ctx.moveTo(ax - ux * 5 - uy * 3, ay - uy * 5 + ux * 3);
        ctx.lineTo(ax, ay);
        ctx.lineTo(ax - ux * 5 + uy * 3, ay - uy * 5 - ux * 3);
        ctx.stroke();
      });
    } else {
      // Arrowhead at FM end (←)
      ctx.beginPath();
      ctx.moveTo(x0 + 5, L.fmCy - 3); ctx.lineTo(x0, L.fmCy); ctx.lineTo(x0 + 5, L.fmCy + 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Output cards (pill-shaped, matching sim chain style) ---
  function drawOutputCards(L, t) {
    var acCol = getPhaseColor();
    var cardW = L.mobile ? W - L.outX - 4 : Math.min(W - L.outX - 8, 140);
    var cardH = L.mobile ? L.nodeH * 0.85 : L.nodeH * 0.75;
    var r = cardH / 2;

    L.outYs.forEach(function(oy, i) {
      var cx = L.outX, cy = oy - cardH / 2;
      var pulse = 0.5 + 0.5 * Math.sin(t * 0.6 + i * 1.5);
      ctx.save();
      // Soft shadow
      ctx.globalAlpha = 0.06 + pulse * 0.03;
      ctx.fillStyle = '#000';
      roundRect(cx + 1, cy + 2, cardW, cardH, r); ctx.fill();
      // White pill background
      ctx.globalAlpha = 1; ctx.fillStyle = CARD_BG;
      roundRect(cx, cy, cardW, cardH, r); ctx.fill();
      // Border
      ctx.globalAlpha = 0.5 + pulse * 0.3; ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
      roundRect(cx, cy, cardW, cardH, r); ctx.stroke();
      // Subtle accent border glow on hover pulse
      ctx.globalAlpha = pulse * 0.15; ctx.strokeStyle = acCol; ctx.lineWidth = 2;
      roundRect(cx, cy, cardW, cardH, r); ctx.stroke();
      // Animated progress bar at bottom inside card
      if (!L.mobile) {
        var progW = cardW - 16;
        var progH = 2;
        var progX = cx + 8, progY = oy + cardH / 2 - 6;
        var val = 0.3 + 0.3 * Math.sin(t * 0.5 + i * 1.8);
        ctx.globalAlpha = 0.12; ctx.fillStyle = acCol;
        roundRect(progX, progY, progW, progH, 1); ctx.fill();
        ctx.globalAlpha = 0.45 + pulse * 0.2;
        roundRect(progX, progY, progW * val, progH, 1); ctx.fill();
      }
      ctx.restore();
    });
  }


  // --- Unified particles: flow along both paths, direction follows phase ---
  function updateParticles(L) {
    var P = getParams();
    var col = getPhaseColor();
    var isForward = phase === 'forward';

    // Spawn new particles
    if (particles.length < P.pCount && Math.random() < 0.08) {
      // type 'flow' = sim↔FM path, type 'out' = FM↔output path
      var type = Math.random() < 0.5 ? 'flow' : 'out';
      particles.push({
        progress: 0,
        speed: 0.0015 + Math.random() * 0.001,
        type: type,
        src: Math.floor(Math.random() * 4),
        target: Math.floor(Math.random() * 3)
      });
    }

    ctx.save(); ctx.fillStyle = col;
    var fmX0 = L.fmBoxX0 - 4;
    var fmX1 = L.fmBoxX1 + 4;
    var stemEnd = fmX1 + (L.outX - fmX1) * 0.12;
    var pR = L.mobile ? 1.0 : 1.5;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.progress += p.speed;
      if (p.progress >= 1) { particles.splice(i, 1); continue; }

      var t2 = isForward ? p.progress : (1 - p.progress);
      var px, py;

      if (p.type === 'flow') {
        var srcY = L.simYs[p.src];
        var sx = L.simX + L.simNodeW / 2 + 2;
        px = sx + (fmX0 - sx) * t2;
        py = srcY + (L.fmCy - srcY) * t2;
      } else {
        if (t2 < 0.15) {
          var u = t2 / 0.15;
          px = fmX1 + (stemEnd - fmX1) * u; py = L.fmCy;
        } else {
          var u2 = (t2 - 0.15) / 0.85;
          px = stemEnd + (L.outX - 2 - stemEnd) * u2;
          py = L.fmCy + (L.outYs[p.target] - L.fmCy) * u2;
        }
      }

      var fade = p.progress < 0.1 ? p.progress / 0.1 : p.progress > 0.9 ? (1 - p.progress) / 0.1 : 1;
      ctx.globalAlpha = fade * 0.7;
      ctx.beginPath(); ctx.arc(px, py, pR, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function tr(key) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'ko';
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var L = getLayout();
    var dt = 0.016;
    time += dt;

    // Update phase
    phaseTime += dt;
    if (phaseTime >= PHASE_DURATION) {
      phaseTime = 0;
      phase = phase === 'forward' ? 'backward' : 'forward';
      particles.length = 0; // clear particles on phase switch
    }
    // Compute blend: 0→1 during first TRANSITION seconds, hold, 1→0 during last TRANSITION
    if (phase === 'forward') {
      var fadeOut = phaseTime < TRANSITION ? phaseTime / TRANSITION : 1;
      blend = 1 - fadeOut; // 1→0 (red→blue)
      if (phaseTime > PHASE_DURATION - TRANSITION) {
        blend = 0; // stay blue
      }
    } else {
      var fadeIn = phaseTime < TRANSITION ? phaseTime / TRANSITION : 1;
      blend = fadeIn; // 0→1 (blue→red)
      if (phaseTime > PHASE_DURATION - TRANSITION) {
        blend = 1; // stay red
      }
    }

    var fs, fsSm, fsTiny;
    if (L.mobile) {
      fs = Math.max(9, Math.min(11, W * 0.025));
      fsSm = Math.max(8, Math.min(10, W * 0.022));
      fsTiny = Math.max(7, Math.min(9, W * 0.018));
    } else if (L.tablet) {
      fs = Math.max(10, Math.min(14, W * 0.019));
      fsSm = Math.max(9, Math.min(12, W * 0.016));
      fsTiny = Math.max(8, Math.min(11, W * 0.014));
    } else {
      fs = Math.max(11, Math.min(16, W * 0.02));
      fsSm = Math.max(10, Math.min(14, W * 0.0175));
      fsTiny = Math.max(9, Math.min(12, W * 0.015));
    }
    var accentCol = getPhaseColor();

    // Max widths for auto-shrink
    var simW = L.simBoxX1 - L.simBoxX0 + 10;      // sim title area
    var fmW = L.fmBoxX1 - L.fmBoxX0;              // FM title area
    var outW = W - L.outX - 4;                     // output area (right edge)
    var nodeMaxW = L.simNodeW - 4;                  // inside sim node
    var titleGap1 = L.mobile ? 16 : 24;            // no1 title offset from box
    var titleGap2 = L.mobile ? 4 : 8;              // no2 title offset from box

    // 1. Sim chain (left vertical)
    drawSimChain(L, time);
    var simKeys = ['material', 'electrode', 'cell', 'system'];
    L.simYs.forEach(function(sy, i) {
      // Center label inside pill
      drawLabel(tr('wfm.sim.' + simKeys[i]), L.simX, sy, TEXT_DARK, fsSm, 'center', 1, nodeMaxW - 8);
    });
    // Titles above sim chain — consistent spacing
    var noTitleY = L.simBoxY0 - (L.mobile ? 14 : 22);
    var noSubY = L.simBoxY0 - (L.mobile ? 3 : 6);
    drawLabel(tr('wfm.sim.no1'), L.simX, noTitleY, accentCol, fs, 'center', 1, simW);
    drawLabel(tr('wfm.sim.no2'), L.simX, noSubY, TEXT_LIGHT, fsTiny, 'center', 0.85, simW);

    // 2. Flow lines
    drawFlowLines(L, time);

    // 3. FM network (transformer-style)
    drawFMNetwork(L, time);
    // FM title — same gap as sim title from its box
    var fmTitleY = L.fmBoxY0 - (L.mobile ? 3 : 6);
    drawLabel(tr('wfm.model'), L.fmCx, fmTitleY, accentCol, fs, 'center', 1, fmW);

    // 4. Output arrows + cards + labels
    drawOutputArrows(L, time);
    drawOutputCards(L, time);
    // Output card dimensions (must match drawOutputCards)
    var outCardH = L.mobile ? L.nodeH * 0.85 : L.nodeH * 0.75;
    var outCardW = L.mobile ? W - L.outX - 4 : Math.min(W - L.outX - 8, 140);
    // Title above first card
    var outTitleY = L.outYs[0] - outCardH / 2 - (L.mobile ? 8 : 14);
    drawLabel(tr('wfm.out.title'), L.outX + outCardW / 2, outTitleY, accentCol, fs, 'center', 1, outCardW);
    // Labels centered inside each card
    var outKeys = ['wfm.out.perf', 'wfm.out.state', 'wfm.out.safety'];
    L.outYs.forEach(function(oy, i) {
      var labelY = L.mobile ? oy : oy - 2;
      drawLabel(tr(outKeys[i]), L.outX + outCardW / 2, labelY, TEXT_DARK, fsSm, 'center', 1, outCardW - 16);
    });

    // 5. Phase label — below FM box
    var phaseGap = L.mobile ? 8 : 14;
    var phaseLabel = phase === 'forward' ? tr('wfm.phase.forward') : tr('wfm.phase.backward');
    drawLabel(phaseLabel, L.fmCx, L.fmBoxY1 + phaseGap, accentCol, fsTiny, 'center', 0.7, fmW);

    // 6. Particles
    updateParticles(L);

    if (isVisible) { animId = requestAnimationFrame(draw); }
  }

  function start() {
    if (animId) return;
    isVisible = true; resize(); draw();
  }

  function stop() {
    isVisible = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) start(); else stop();
    });
  }, { threshold: 0.1 });
  observer.observe(canvas);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (isVisible) resize(); }, 150);
  });
}

import './style.css';
import { products } from './products.js';

// Application State
const state = {
  currentCategory: 'all', // 'all', 'dog', 'cat', 'no-sub'
  searchQuery: '',
  priceRange: 150,
  selectedProducts: [], // For comparison (max 3)
  activeTab: 'catalog', // 'catalog', 'guide', 'faq'
  filterSubscription: 'all', // 'all', 'yes', 'no'
  sortBy: 'popular', // 'popular', 'price-asc', 'price-desc', 'score'
  activeProductDetail: null, // Product object for modal detail view
};

// SVG Icons helper so we don't depend on external CDNs loading late
const icons = {
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  filter: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="12" x2="12" y1="18" y2="22"/></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-emerald-600"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-rose-500 fill-rose-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  tag: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.41z"/><path d="M6 6h.01"/></svg>',
  wifi: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M12 20h.01"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 13a10 10 0 0 1 14 0"/><path d="M1.5 9.5a15 15 0 0 1 21 0"/></svg>',
  battery: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-charging"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="M19 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/><line x1="11" x2="11" y1="7" y2="17"/><line x1="7" x2="15" y1="12" y2="12"/></svg>',
  map: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><path d="M14.1 6a2 2 0 0 0-1.38-.56L8 5.86 3.65 4.15A1 1 0 0 0 2 5v14a1 1 0 0 0 1.15.98L8 18.25l4.72 1.9a2 2 0 0 0 1.38.56l4.75-.43a1 1 0 0 0 .8-.98V6a1 1 0 0 0-.8-.98Z"/><path d="M8 5.75v12.5"/><path d="M14 5.75v14.5"/></svg>',
};

// FAQ Data
const faqs = [
  {
    question: "¿Cómo funciona un collar GPS para mascotas?",
    answer: "La mayoría de los collares GPS para mascotas combinan un chip GPS (que recibe las coordenadas de localización directamente de los satélites) con una tarjeta SIM integrada (como la de un móvil). Esta tarjeta SIM envía las coordenadas a una aplicación en tu teléfono a través de redes celulares. Esto te permite ver la ubicación exacta de tu perro o gato en tiempo real en un mapa, sin importar la distancia."
  },
  {
    question: "¿Es obligatorio pagar una suscripción mensual?",
    answer: "Depende del modelo. Los localizadores más populares (como Tractive o Kippy) requieren una suscripción mensual (normalmente entre 4€ y 9€ al mes) porque incluyen una tarjeta SIM integrada que se conecta a las redes de telefonía de múltiples operadores para darte cobertura ilimitada y rastreo en tiempo real a cualquier distancia. Sin embargo, existen alternativas sin suscripción (como Weenect sin abono o los localizadores Bluetooth como Apple AirTag) que tienen limitaciones de alcance o de funciones pero no conllevan gastos recurrentes."
  },
  {
    question: "¿Sirven los collares GPS para gatos?",
    answer: "Sí, pero debes elegir un modelo diseñado específicamente para ellos. Los gatos requieren localizadores extremadamente ligeros (menos de 30 gramos) y con una forma ergonómica que se adapte a su cuello sin molestarles al saltar o limpiarse. Además, es de vital importancia que el collar cuente con un sistema de liberación rápida o cierre de seguridad anti-estrangulamiento para que se suelte automáticamente si el gato se engancha con una rama."
  },
  {
    question: "¿Cuál es la diferencia entre un localizador GPS y un Apple AirTag?",
    answer: "Un localizador GPS real utiliza satélites para saber dónde está y datos móviles para enviarte esa posición al instante, por lo que funciona de forma independiente y en cualquier lugar con cobertura móvil. El Apple AirTag (u otros rastreadores Bluetooth similares) no tiene GPS ni datos móviles; se comunica por Bluetooth con cualquier iPhone de terceros que pase cerca para reportar su posición de forma pasiva. El AirTag es excelente en ciudades o zonas muy pobladas, pero resulta prácticamente inútil en el campo, bosques o zonas rurales donde no hay gente paseando con teléfonos Apple."
  },
  {
    question: "¿Qué autonomía de batería suelen tener estos dispositivos?",
    answer: "La duración de la batería varía significativamente según el uso del rastreo activo en tiempo real. En modo de espera o con zonas de ahorro de energía wifi (disponibles en Tractive y Kippy), la batería puede durar de 7 a 20 días. Sin embargo, si mantienes activado el rastreo en vivo ('Live Tracking') constantemente, la batería puede agotarse en 24-48 horas. La mayoría de los usuarios cargan el dispositivo una vez a la semana en un uso mixto normal."
  }
];

// Helper to get matching category icon
function getCategoryBadge(category) {
  if (category === 'dog') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>Perros
            </span>`;
  } else if (category === 'cat') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>Gatos
            </span>`;
  } else {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>Universal
            </span>`;
  }
}

// Render the entire app shell
function initApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    <!-- Header/Navigation -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center cursor-pointer" id="nav-logo">
            <div class="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl text-white mr-3 shadow-md shadow-indigo-100 flex items-center justify-center">
              <i class="class-icon lucide-map-pin text-xl"></i>
            </div>
            <div>
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">RastreaCan</span>
              <p class="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Rastreadores de Mascotas</p>
            </div>
          </div>
          
          <nav class="hidden md:flex space-x-1">
            <button id="tab-catalog" class="px-4 py-2 text-sm font-medium rounded-lg transition-all-300">
              Comparador GPS
            </button>
            <button id="tab-guide" class="px-4 py-2 text-sm font-medium rounded-lg transition-all-300">
              Guía de Compra
            </button>
            <button id="tab-faq" class="px-4 py-2 text-sm font-medium rounded-lg transition-all-300">
              Preguntas Frecuentes (FAQ)
            </button>
          </nav>

          <div class="flex items-center space-x-2">
            <a href="#comparador" id="header-compare-btn" class="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all-300 shadow-sm">
              <span>Comparar</span>
              <span id="compare-badge-count" class="ml-1.5 bg-indigo-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">0</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Subheader Navigation (Visible on small screens) -->
    <div class="md:hidden bg-white border-b border-slate-100 sticky top-16 z-30 flex justify-around p-2">
      <button id="mob-tab-catalog" class="flex-1 py-2 text-xs font-bold text-center rounded-lg mx-1 transition-all-300">
        Localizadores
      </button>
      <button id="mob-tab-guide" class="flex-1 py-2 text-xs font-bold text-center rounded-lg mx-1 transition-all-300">
        Guía de Compra
      </button>
      <button id="mob-tab-faq" class="flex-1 py-2 text-xs font-bold text-center rounded-lg mx-1 transition-all-300">
        FAQs
      </button>
    </div>

    <!-- Main Content Stage -->
    <main class="flex-grow">
      <div id="content-area"></div>
    </main>

    <!-- Compare Sticky Footer Drawer (Only shown when there are items to compare) -->
    <div id="compare-drawer" class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl transform translate-y-full transition-transform duration-300 ease-in-out z-50">
    </div>

    <!-- Modal for Detailed Product Review -->
    <div id="product-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    </div>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center mb-4">
              <div class="bg-indigo-600 p-1.5 rounded-lg mr-2">
                <i class="lucide-map-pin text-sm"></i>
              </div>
              <span class="text-lg font-bold">RastreaCan</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Comparamos y analizamos los mejores localizadores y collares GPS para perros y gatos del mercado para ayudarte a mantener a tus amigos de cuatro patas siempre a salvo.
            </p>
            <p class="text-xs text-slate-500 mt-4 leading-relaxed">
              <em>Aviso de afiliación:</em> Algunos de los enlaces que se incluyen son enlaces de afiliados de Amazon y otros portales asociados. Esto significa que si decides comprar a través de ellos, recibimos una pequeña comisión sin ningún coste adicional para ti.
            </p>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Secciones</h3>
            <ul class="space-y-2 text-xs text-slate-400">
              <li><span class="hover:text-white cursor-pointer tab-trigger" data-tab="catalog">Comparador GPS</span></li>
              <li><span class="hover:text-white cursor-pointer tab-trigger" data-tab="guide">Guía de Elección</span></li>
              <li><span class="hover:text-white cursor-pointer tab-trigger" data-tab="faq">Dudas Frecuentes</span></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Consejo Rápido</h3>
            <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p class="text-xs text-slate-400 leading-relaxed italic">
                "Si buscas un GPS para un gato de menos de 4 kg, prioriza el peso total y asegúrate de que el collar cuente con un cierre de seguridad anti-estrangulamiento."
              </p>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; 2026 RastreaCan. Todos los derechos reservados.</p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <span class="hover:text-slate-500 cursor-pointer">Aviso Legal</span>
            <span class="hover:text-slate-500 cursor-pointer">Política de Privacidad</span>
            <span class="hover:text-slate-500 cursor-pointer">Contacto</span>
          </div>
        </div>
      </div>
    </footer>
  `;

  // Establish active tab styling update helper
  updateActiveTabUI();
  renderCurrentTab();
  setupEventListeners();
  updateCompareDrawer();
}

function updateActiveTabUI() {
  const tabs = ['catalog', 'guide', 'faq'];
  tabs.forEach(tab => {
    // Desktop tabs
    const el = document.getElementById(`tab-${tab}`);
    if (el) {
      if (state.activeTab === tab) {
        el.className = 'px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-900';
      } else {
        el.className = 'px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50';
      }
    }

    // Mobile tabs
    const mobEl = document.getElementById(`mob-tab-${tab}`);
    if (mobEl) {
      if (state.activeTab === tab) {
        mobEl.className = 'flex-1 py-2 text-xs font-bold text-center rounded-lg mx-1 bg-indigo-50 text-indigo-600 border border-indigo-100';
      } else {
        mobEl.className = 'flex-1 py-2 text-xs font-semibold text-center rounded-lg mx-1 text-slate-600 hover:bg-slate-50';
      }
    }
  });
}

function renderCurrentTab() {
  const container = document.getElementById('content-area');
  if (!container) return;

  if (state.activeTab === 'catalog') {
    renderCatalog(container);
  } else if (state.activeTab === 'guide') {
    renderGuide(container);
  } else if (state.activeTab === 'faq') {
    renderFAQ(container);
  }
  
  // Re-bind content events
  setupContentEventListeners();
  // Ensure we are scrolled back to the top when navigating
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupEventListeners() {
  // Navigation Tabs Action
  ['catalog', 'guide', 'faq'].forEach(tab => {
    const btn = document.getElementById(`tab-${tab}`);
    if (btn) {
      btn.addEventListener('click', () => {
        state.activeTab = tab;
        updateActiveTabUI();
        renderCurrentTab();
      });
    }

    const mobBtn = document.getElementById(`mob-tab-${tab}`);
    if (mobBtn) {
      mobBtn.addEventListener('click', () => {
        state.activeTab = tab;
        updateActiveTabUI();
        renderCurrentTab();
      });
    }
  });

  // Footer tab triggers
  document.querySelectorAll('.tab-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab) {
        state.activeTab = tab;
        updateActiveTabUI();
        renderCurrentTab();
      }
    });
  });

  // Logo navigation to catalog
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.addEventListener('click', () => {
      state.activeTab = 'catalog';
      updateActiveTabUI();
      renderCurrentTab();
    });
  }

  // Header comparison badge button
  const headerComp = document.getElementById('header-compare-btn');
  if (headerComp) {
    headerComp.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.selectedProducts.length > 0) {
        // Toggle the compare drawer view manually
        const drawer = document.getElementById('compare-drawer');
        if (drawer) {
          drawer.classList.remove('translate-y-full');
        }
      } else {
        // Direct the user to the comparison section or notify them
        alert("Selecciona al menos 1 collar GPS usando el botón de 'Comparar' en las tarjetas de los productos.");
      }
    });
  }
}

// Render Catalog View
function renderCatalog(container) {
  // Filter products
  const filtered = products.filter(prod => {
    // Category match
    if (state.currentCategory !== 'all') {
      if (state.currentCategory === 'no-sub' && prod.requiresSubscription) {
        return false;
      }
      if (state.currentCategory === 'dog' && !prod.suitableFor.includes('dog')) {
        return false;
      }
      if (state.currentCategory === 'cat' && !prod.suitableFor.includes('cat')) {
        return false;
      }
    }

    // Subscription Filter
    if (state.filterSubscription === 'yes' && !prod.requiresSubscription) return false;
    if (state.filterSubscription === 'no' && prod.requiresSubscription) return false;

    // Price range match (matches initialPrice)
    if (prod.initialPrice > state.priceRange) return false;

    // Search query match
    if (state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(query);
      const matchBrand = prod.brand.toLowerCase().includes(query);
      const matchDesc = prod.description.toLowerCase().includes(query);
      const matchFeatures = prod.pros.some(pro => pro.toLowerCase().includes(query));
      if (!matchName && !matchBrand && !matchDesc && !matchFeatures) return false;
    }

    return true;
  });

  // Sort products
  if (state.sortBy === 'popular') {
    // Sort by rating desc
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.initialPrice - b.initialPrice);
  } else if (state.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.initialPrice - a.initialPrice);
  } else if (state.sortBy === 'score') {
    filtered.sort((a, b) => b.score - a.score);
  }

  container.innerHTML = `
    <!-- Hero Banner / Title section -->
    <section class="bg-gradient-to-b from-slate-900 to-indigo-950 text-white py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4 animate-pulse">
          <i class="lucide-sparkles text-xs mr-1.5"></i> Actualizado para 2026
        </span>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight mb-4">¿Cuál es el mejor Localizador GPS para tu mascota?</h1>
        <p class="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Evita pérdidas y disgustos. Comparamos y analizamos de forma independiente los mejores collares GPS y rastreadores para perros y gatos. Sin falsas opiniones.
        </p>

        <!-- Quick Info Pills -->
        <div class="flex flex-wrap justify-center gap-4 mt-8 text-xs text-slate-300">
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span class="text-emerald-400 font-bold mr-1.5">✔</span> Análisis sin Sesgo
          </div>
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span class="text-emerald-400 font-bold mr-1.5">✔</span> Comparativa de Suscripciones
          </div>
          <div class="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span class="text-emerald-400 font-bold mr-1.5">✔</span> Enlaces directos de compra
          </div>
        </div>
      </div>
    </section>

    <!-- App State Selector & Quick Filter Tabs -->
    <section class="border-b border-slate-200 bg-white sticky top-[112px] md:top-16 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          <!-- Category Quick Buttons -->
          <div class="flex overflow-x-auto pb-1 md:pb-0 gap-1.5 scrollbar-thin">
            <button class="cat-btn flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all-300 ${state.currentCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="all">
              Todos
            </button>
            <button class="cat-btn flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all-300 flex items-center ${state.currentCategory === 'dog' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="dog">
              🐕 Para Perros
            </button>
            <button class="cat-btn flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all-300 flex items-center ${state.currentCategory === 'cat' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="cat">
              🐈 Para Gatos
            </button>
            <button class="cat-btn flex-shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all-300 flex items-center ${state.currentCategory === 'no-sub' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-cat="no-sub">
              ⭐ Sin Suscripción Mensual
            </button>
          </div>

          <!-- Sort Select drop down -->
          <div class="flex items-center gap-2 self-end md:self-auto">
            <span class="text-xs text-slate-500 font-medium">Ordenar por:</span>
            <select id="sort-select" class="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Más valorados ⭐</option>
              <option value="score" ${state.sortBy === 'score' ? 'selected' : ''}>Nota de análisis 📈</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Precio: de menor a mayor</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Precio: de mayor a menor</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filters panel -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Filters -->
        <div class="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div class="flex justify-between items-center pb-4 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <span class="mr-2">${icons.filter}</span>Filtros Avanzados
            </h2>
            <button id="reset-filters" class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-all-300">Limpiar</button>
          </div>

          <!-- Search Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Buscar</label>
            <div class="relative">
              <input type="text" id="search-input" value="${state.searchQuery}" placeholder="Ej. Tractive, Kippy, sin suscripción..." class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all-300">
              <span class="absolute left-3 top-2.5 text-slate-400">${icons.search}</span>
            </div>
          </div>

          <!-- Subscription requirement filter -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Cuota de Suscripción</label>
            <div class="space-y-2">
              <label class="flex items-center text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                <input type="radio" name="sub-filter" value="all" class="sub-radio-btn mr-2 accent-indigo-600" ${state.filterSubscription === 'all' ? 'checked' : ''}>
                Todos los modelos
              </label>
              <label class="flex items-center text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                <input type="radio" name="sub-filter" value="yes" class="sub-radio-btn mr-2 accent-indigo-600" ${state.filterSubscription === 'yes' ? 'checked' : ''}>
                Requiere suscripción mensual
              </label>
              <label class="flex items-center text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                <input type="radio" name="sub-filter" value="no" class="sub-radio-btn mr-2 accent-indigo-600" ${state.filterSubscription === 'no' ? 'checked' : ''}>
                Sin suscripción / Pago único
              </label>
            </div>
          </div>

          <!-- Price filter range -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wide">Precio Máximo</label>
              <span id="price-display" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">${state.priceRange}€</span>
            </div>
            <input type="range" id="price-range" min="20" max="250" step="5" value="${state.priceRange}" class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
            <div class="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>20€</span>
              <span>135€</span>
              <span>250€</span>
            </div>
          </div>

          <!-- Banner Informativo -->
          <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-950 leading-relaxed">
            <div class="flex items-center font-bold text-indigo-900 mb-1.5">
              <span class="mr-1.5">${icons.info}</span>
              ¿Por qué pagar cuota mensual?
            </div>
            Los localizadores con tarjeta SIM integrada permiten rastrear a tu mascota a cualquier distancia en tiempo real, incluso cruzando fronteras. El abono cubre estos costes de telefonía del dispositivo.
          </div>
        </div>

        <!-- Product Cards Grid -->
        <div class="lg:col-span-3 space-y-6">
          
          <div class="flex justify-between items-center">
            <p class="text-sm font-medium text-slate-600">Se han encontrado <span class="text-slate-900 font-bold">${filtered.length}</span> collares GPS</p>
            <div class="text-xs text-indigo-600 font-semibold cursor-pointer tab-trigger hover:underline" data-tab="guide">
              ¿No sabes cuál elegir? Ver Guía Express &rarr;
            </div>
          </div>

          ${filtered.length === 0 ? `
            <div class="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div class="text-slate-300 text-5xl mb-4">🔍</div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">No hay productos que coincidan</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Prueba a aumentar el rango de precio máximo, quitar algún filtro o limpiar el buscador para encontrar más localizadores.
              </p>
              <button id="clear-search-btn" class="mt-4 text-xs font-semibold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all-300">
                Ver todos los productos
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="products-grid-list">
              ${filtered.map(prod => renderProductCard(prod)).join('')}
            </div>
          `}

          <!-- Quick Comparison Intro section for anchoring -->
          <div id="comparador" class="mt-12 bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
            <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <div class="relative z-10 max-w-xl">
              <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">Herramienta Interactiva</span>
              <h3 class="text-xl md:text-2xl font-black mt-3">Compara hasta 3 localizadores cara a cara</h3>
              <p class="text-xs text-slate-300 leading-relaxed mt-2">
                Añade tus dispositivos favoritos a la comparativa pinchando en "Comparar" dentro de su ficha. Podrás ver diferencias de batería, cuotas, peso y notas de forma interactiva.
              </p>
              <div class="flex items-center gap-4 mt-6">
                <span class="text-xs text-slate-400">Total en lista: <strong class="text-white font-bold" id="compare-indicator-count">${state.selectedProducts.length}</strong></span>
                ${state.selectedProducts.length > 0 ? `
                  <button id="trigger-compare-now" class="px-4 py-2 text-xs font-bold bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all-300 shadow">
                    Comparar Ahora
                  </button>
                ` : `
                  <span class="text-xs text-slate-500 italic">Selecciona collares arriba para empezar</span>
                `}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}

// Render a single product card
function renderProductCard(prod) {
  const isSelected = state.selectedProducts.includes(prod.id);
  const starsArray = [];
  const fullStars = Math.floor(prod.rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsArray.push(icons.star);
    } else {
      starsArray.push('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-slate-300"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
    }
  }

  // Badges logic
  let ribbonHtml = '';
  if (prod.score >= 9.2) {
    ribbonHtml = `<span class="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm z-10">La Mejor Elección ⭐</span>`;
  } else if (!prod.requiresSubscription) {
    ribbonHtml = `<span class="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm z-10">Sin Cuota Mensual</span>`;
  }

  return `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all-300 flex flex-col relative overflow-hidden">
      ${ribbonHtml}

      <!-- Product Image Section with placeholder/mock look -->
      <div class="h-48 bg-slate-100 flex items-center justify-center p-6 relative cursor-pointer prod-detail-trigger" data-id="${prod.id}">
        <!-- Dynamic colored pet silhouette or item logo representing tracking -->
        <div class="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white"></div>
        
        <!-- Mock Collar visual layout -->
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 mb-2">
            <span class="text-3xl">${prod.brand === 'Tractive' ? '🛰️' : prod.brand === 'Kippy' ? '🐕' : prod.brand === 'Weenect' ? '📡' : '🏷️'}</span>
          </div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${prod.brand}</span>
          <span class="text-sm font-bold text-slate-800 text-center">${prod.name}</span>
        </div>

        <!-- Float score badge -->
        <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center text-xs font-bold text-indigo-950">
          <span class="text-indigo-600 font-black mr-1">${prod.score}</span> / 10
        </div>
      </div>

      <!-- Card Body Content -->
      <div class="p-5 flex-grow flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-base font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-all-300 prod-detail-trigger" data-id="${prod.id}">
              ${prod.brand} ${prod.name}
            </h3>
            <div class="flex items-center gap-1.5 mt-1">
              <div class="flex">${starsArray.join('')}</div>
              <span class="text-xs text-slate-400 font-semibold">(${prod.rating})</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-black text-slate-900">${prod.initialPrice}€</span>
            <p class="text-[10px] text-slate-400 font-bold uppercase">${prod.requiresSubscription ? 'Suscripción Req.' : 'Sin Mensualidad'}</p>
          </div>
        </div>

        <!-- Category / Tag specs -->
        <div class="flex flex-wrap gap-2 my-3">
          ${prod.suitableFor.map(cat => getCategoryBadge(cat)).join('')}
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
            ⚖️ ${prod.weight}g
          </span>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed flex-grow mt-1 line-clamp-3">
          ${prod.description}
        </p>

        <!-- Subscription price display if applies -->
        <div class="bg-slate-50 rounded-xl p-3 my-4 border border-slate-100">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Coste de suscripción:</span>
            <span class="font-bold text-slate-900">${prod.subscriptionPrice}</span>
          </div>
          <div class="flex justify-between items-center text-xs mt-1">
            <span class="text-slate-500 font-medium">Batería promedio:</span>
            <span class="font-semibold text-slate-900">${prod.batteryLife}</span>
          </div>
        </div>

        <!-- Pros check quicklist -->
        <div class="space-y-1.5 mb-5">
          ${prod.pros.slice(0, 2).map(pro => `
            <div class="flex items-start text-xs text-slate-600">
              <span class="mr-1.5 mt-0.5">${icons.check}</span>
              <span>${pro}</span>
            </div>
          `).join('')}
        </div>

        <!-- Action CTA Buttons -->
        <div class="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100">
          <button class="compare-toggle-btn w-full px-3 py-2 text-xs font-bold rounded-lg border transition-all-300 flex items-center justify-center gap-1 ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}" data-id="${prod.id}">
            <span>${isSelected ? icons.check : '➕'}</span>
            <span>${isSelected ? 'Añadido' : 'Comparar'}</span>
          </button>
          <a href="${prod.amazonLink}" target="_blank" rel="noopener noreferrer" class="w-full px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all-300 flex items-center justify-center gap-1 shadow-sm">
            <span>Ver Oferta</span>
            <span>${icons.arrowRight}</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render Comparison Drawer at bottom of screen
function updateCompareDrawer() {
  const drawer = document.getElementById('compare-drawer');
  if (!drawer) return;

  const count = state.selectedProducts.length;
  const countBadge = document.getElementById('compare-badge-count');
  if (countBadge) countBadge.innerText = count;

  const compareIndicatorCount = document.getElementById('compare-indicator-count');
  if (compareIndicatorCount) compareIndicatorCount.innerText = count;

  if (count === 0) {
    drawer.classList.add('translate-y-full');
    return;
  }

  // Retrieve full product objects for the selected IDs
  const listProds = products.filter(p => state.selectedProducts.includes(p.id));

  drawer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <!-- Left info -->
        <div class="flex items-center gap-3">
          <div class="bg-indigo-600 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center">
            ⚖️
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Comparativa de Localizadores</h4>
            <p class="text-xs text-slate-500 mt-1">Comparing ${listProds.length} de un máximo de 3 collares GPS.</p>
          </div>
        </div>

        <!-- Selected items microcards -->
        <div class="flex flex-wrap gap-2.5 max-w-xl">
          ${listProds.map(p => `
            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 gap-1.5 shadow-sm">
              <span class="font-bold">${p.brand} ${p.name}</span>
              <button class="remove-compare-p-btn text-slate-400 hover:text-slate-600 font-bold transition-all-300" data-id="${p.id}">&times;</button>
            </div>
          `).join('')}
          ${listProds.length < 3 ? `
            <div class="flex items-center border border-dashed border-slate-300 text-slate-400 text-xs rounded-xl px-3 py-1.5 italic">
              + añade otro más
            </div>
          ` : ''}
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 self-end md:self-auto">
          <button id="clear-all-compares" class="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all-300">Vaciar</button>
          <button id="open-comparison-detail-btn" class="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all-300 shadow-sm flex items-center gap-1.5">
            <span>Ver Tabla Comparativa</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  `;

  // Animate drawer entrance if we just added items
  drawer.classList.remove('translate-y-full');

  // Bind drawer events
  document.querySelectorAll('.remove-compare-p-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id) {
        state.selectedProducts = state.selectedProducts.filter(pId => pId !== id);
        updateCompareDrawer();
        renderCurrentTab(); // refresh catalogs to sync state
      }
    });
  });

  const clearBtn = document.getElementById('clear-all-compares');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.selectedProducts = [];
      updateCompareDrawer();
      renderCurrentTab();
    });
  }

  const openComparisonBtn = document.getElementById('open-comparison-detail-btn');
  if (openComparisonBtn) {
    openComparisonBtn.addEventListener('click', () => {
      renderCompareModalTable(listProds);
    });
  }
}

// Setup Content Event Listeners (specific elements rendered inside the tab views)
function setupContentEventListeners() {
  // Category Button Clicks
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-cat');
      if (cat) {
        state.currentCategory = cat;
        renderCurrentTab();
      }
    });
  });

  // Sort Select Dropdown
  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCurrentTab();
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.priceRange = 150;
      state.filterSubscription = 'all';
      state.currentCategory = 'all';
      renderCurrentTab();
    });
  }

  // Search Input change
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Add simple input handler
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
    });
    // Add keydown enter handler to trigger full refresh immediately
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        renderCurrentTab();
      }
    });
    // Fallback trigger after delay for smoother experience
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderCurrentTab();
      }, 500);
    });
  }

  // Radio button subscriptions
  document.querySelectorAll('.sub-radio-btn').forEach(rad => {
    rad.addEventListener('change', (e) => {
      state.filterSubscription = e.target.value;
      renderCurrentTab();
    });
  });

  // Price range slider
  const priceRange = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      state.priceRange = parseInt(e.target.value);
      if (priceDisplay) priceDisplay.innerText = `${e.target.value}€`;
    });
    // Trigger render on range release
    priceRange.addEventListener('change', () => {
      renderCurrentTab();
    });
  }

  // Clear search on zero match page
  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.priceRange = 250;
      state.filterSubscription = 'all';
      state.currentCategory = 'all';
      renderCurrentTab();
    });
  }

  // Trigger compare from sticky banner anchor
  const triggerCompareNow = document.getElementById('trigger-compare-now');
  if (triggerCompareNow) {
    triggerCompareNow.addEventListener('click', () => {
      const listProds = products.filter(p => state.selectedProducts.includes(p.id));
      renderCompareModalTable(listProds);
    });
  }

  // Toggle compare selection on cards
  document.querySelectorAll('.compare-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (id) {
        const index = state.selectedProducts.indexOf(id);
        if (index > -1) {
          state.selectedProducts.splice(index, 1);
        } else {
          if (state.selectedProducts.length >= 3) {
            alert("Puedes comparar hasta un máximo de 3 localizadores a la vez. Quita uno de la lista inferior para añadir este.");
            return;
          }
          state.selectedProducts.push(id);
        }
        updateCompareDrawer();
        renderCurrentTab(); // update cards state visually
      }
    });
  });

  // Detail Modal Trigger Click
  document.querySelectorAll('.prod-detail-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const prod = products.find(p => p.id === id);
      if (prod) {
        renderProductDetailModal(prod);
      }
    });
  });
}

// Render the detailed review modal of a single product
function renderProductDetailModal(prod) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const starsArray = [];
  const fullStars = Math.floor(prod.rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsArray.push(icons.star);
    } else {
      starsArray.push('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-slate-300"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
    }
  }

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100">
      
      <!-- Sticky close button -->
      <button id="close-modal-btn" class="absolute top-4 right-4 bg-slate-100 text-slate-600 hover:text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all-300 z-10">
        ${icons.x}
      </button>

      <!-- Banner/Intro color section -->
      <div class="p-6 md:p-8 bg-slate-50 border-b border-slate-100 relative">
        <div class="flex flex-wrap gap-2 mb-3">
          ${prod.suitableFor.map(cat => getCategoryBadge(cat)).join('')}
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Nota: ${prod.score} / 10
          </span>
        </div>

        <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">${prod.brand} ${prod.name}</h2>
        <div class="flex items-center gap-1.5 mt-2">
          <div class="flex">${starsArray.join('')}</div>
          <span class="text-xs text-slate-500 font-semibold">Valoración media de los usuarios: ${prod.rating} / 5</span>
        </div>
      </div>

      <div class="p-6 md:p-8 space-y-6">
        <!-- Main Description -->
        <div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Análisis de Nuestro Experto</h3>
          <p class="text-sm text-slate-600 leading-relaxed">${prod.fullReview}</p>
        </div>

        <!-- Technical specifications table -->
        <div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Especificaciones Técnicas</h3>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 block font-medium">Batería Promedio</span>
              <strong class="text-slate-800 text-sm mt-0.5 block">${prod.batteryLife}</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 block font-medium">Peso del Dispositivo</span>
              <strong class="text-slate-800 text-sm mt-0.5 block">${prod.weight} gramos</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 block font-medium">Precio de Salida</span>
              <strong class="text-slate-800 text-sm mt-0.5 block">${prod.initialPrice}€</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl">
              <span class="text-slate-400 block font-medium">Suscripción Mensual</span>
              <strong class="text-slate-800 text-sm mt-0.5 block">${prod.subscriptionPrice}</strong>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl col-span-2">
              <span class="text-slate-400 block font-medium">Tipo de Conectividad</span>
              <strong class="text-slate-800 text-sm mt-0.5 block">${prod.connectivity}</strong>
            </div>
          </div>
        </div>

        <!-- Pros & Cons Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div class="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
            <h4 class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center">
              <span class="mr-1.5">${icons.check}</span>Puntos Fuertes
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${prod.pros.map(pro => `
                <li class="flex items-start">
                  <span class="text-emerald-600 font-bold mr-2">•</span>
                  <span>${pro}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
            <h4 class="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center">
              <span class="mr-1.5">⚠</span>A Tener en Cuenta
            </h4>
            <ul class="space-y-2 text-xs text-slate-600">
              ${prod.cons.map(con => `
                <li class="flex items-start">
                  <span class="text-rose-500 font-bold mr-2">•</span>
                  <span>${con}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Call to action button inside modal -->
        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left">
            <span class="text-xs text-slate-400 font-medium">Mejor oferta actual en tienda oficial:</span>
            <div class="text-2xl font-black text-slate-900 mt-0.5">${prod.initialPrice}€</div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button id="add-to-compare-modal-btn" class="w-full sm:w-auto px-5 py-3 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all-300">
              ${state.selectedProducts.includes(prod.id) ? 'Quitar de la comparativa' : 'Añadir al comparador'}
            </button>
            <a href="${prod.amazonLink}" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-5 py-3 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all-300 text-center shadow">
              Comprar en Amazon
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  // Event handlers
  const closeBtn = document.getElementById('close-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Modal Add to compare toggle
  const modalCompareBtn = document.getElementById('add-to-compare-modal-btn');
  if (modalCompareBtn) {
    modalCompareBtn.addEventListener('click', () => {
      const index = state.selectedProducts.indexOf(prod.id);
      if (index > -1) {
        state.selectedProducts.splice(index, 1);
        modalCompareBtn.innerText = 'Añadir al comparador';
      } else {
        if (state.selectedProducts.length >= 3) {
          alert("Puedes comparar hasta un máximo de 3 localizadores a la vez. Quita uno de la lista inferior para añadir este.");
          return;
        }
        state.selectedProducts.push(prod.id);
        modalCompareBtn.innerText = 'Quitar de la comparativa';
      }
      updateCompareDrawer();
      renderCurrentTab();
    });
  }
}

// Render the comparison table inside a modal
function renderCompareModalTable(selectedProductsList) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  if (selectedProductsList.length === 0) {
    alert("Por favor, selecciona al menos un collar para comparar.");
    return;
  }

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 p-6 md:p-8">
      
      <!-- Close button -->
      <button id="close-modal-btn" class="absolute top-4 right-4 bg-slate-100 text-slate-600 hover:text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all-300">
        ${icons.x}
      </button>

      <div class="mb-6">
        <h2 class="text-xl md:text-2xl font-black text-slate-900">Tabla Comparativa Detallada</h2>
        <p class="text-xs text-slate-500 mt-1">Hemos organizado las métricas y características clave cara a cara para facilitarte la elección.</p>
      </div>

      <!-- Responsive Table Container -->
      <div class="overflow-x-auto border border-slate-200 rounded-2xl">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="p-4 font-bold text-slate-500 w-1/4">Característica</th>
              ${selectedProductsList.map(p => `
                <th class="p-4 font-black text-slate-900 text-center w-1/4">
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">${p.brand}</p>
                  <p class="text-sm font-black">${p.name}</p>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Precio del Aparato</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center font-bold text-slate-950 text-sm">${p.initialPrice}€</td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Requiere Cuota</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center">
                  <span class="inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${p.requiresSubscription ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}">
                    ${p.requiresSubscription ? 'Sí, cuota obligatoria' : 'No, sin cuota'}
                  </span>
                </td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Precio Suscripción</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center text-slate-600 font-medium">${p.subscriptionPrice}</td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Duración de Batería</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center text-slate-600 font-medium">${p.batteryLife}</td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Peso total</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center text-slate-600 font-medium">${p.weight} g</td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Cobertura / Conectividad</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center text-slate-600 font-medium">${p.connectivity}</td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Nota de Calidad</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center">
                  <span class="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">${p.score}</span> <span class="text-slate-400 font-semibold">/10</span>
                </td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Puntos a Favor</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-slate-600">
                  <ul class="list-disc pl-4 space-y-1 text-[11px]">
                    ${p.pros.slice(0, 3).map(pro => `<li>${pro}</li>`).join('')}
                  </ul>
                </td>
              `).join('')}
            </tr>
            <tr>
              <td class="p-4 font-semibold text-slate-700 bg-slate-50/30">Enlace Directo</td>
              ${selectedProductsList.map(p => `
                <td class="p-4 text-center">
                  <a href="${p.amazonLink}" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all-300 text-xs">
                    Ver en Amazon &rarr;
                  </a>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 text-center text-[11px] text-slate-400 font-medium">
        ℹ️ Recomendamos revisar siempre la web oficial del fabricante para conocer ofertas de suscripción anuales y ofertas especiales de fin de semana.
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  // Event handlers
  const closeBtn = document.getElementById('close-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// Render Buying Guide View
function renderGuide(container) {
  container.innerHTML = `
    <!-- Top banner -->
    <section class="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl font-black tracking-tight mb-3">Guía de Compra para Localizadores de Mascotas</h1>
        <p class="text-sm text-indigo-200">
          Aprende qué buscar en un collar GPS y descubre la tecnología ideal según el tamaño y hábitos de tu perro o gato.
        </p>
      </div>
    </section>

    <!-- Main article container -->
    <section class="max-w-4xl mx-auto px-4 py-12 text-slate-800 leading-relaxed text-sm">
      <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-8">
        
        <!-- Section 1: Intro -->
        <div>
          <h2 class="text-xl font-black text-slate-900 mb-4 flex items-center">
            <span class="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg mr-2.5 text-xs">1</span>
            ¿Qué tecnología de localización utiliza cada dispositivo?
          </h2>
          <p class="mb-4">
            Al buscar un rastreador para mascotas, te toparás con tres tecnologías principales, cada una adaptada a diferentes situaciones:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="border border-slate-100 bg-slate-50 rounded-2xl p-4">
              <span class="text-xl mb-2 block">🛰️</span>
              <strong class="text-slate-900 text-xs block font-bold mb-1">GPS Tradicional + Datos Celulares</strong>
              <p class="text-xs text-slate-500 leading-relaxed">
                Usa satélites para la localización y telefonía móvil para enviar los datos al móvil. Es ilimitado en distancia y perfecto para aventuras al aire libre.
              </p>
            </div>
            <div class="border border-slate-100 bg-slate-50 rounded-2xl p-4">
              <span class="text-xl mb-2 block">📡</span>
              <strong class="text-slate-900 text-xs block font-bold mb-1">Frecuencia de Radio (RF)</strong>
              <p class="text-xs text-slate-500 leading-relaxed">
                Utiliza ondas de radio locales enviadas desde un mando emisor. No tiene suscripciones y funciona donde no hay señal móvil, pero el alcance suele limitarse a un par de kilómetros.
              </p>
            </div>
            <div class="border border-slate-100 bg-slate-50 rounded-2xl p-4">
              <span class="text-xl mb-2 block">🏷️</span>
              <strong class="text-slate-900 text-xs block font-bold mb-1">Rastreadores Bluetooth (AirTags)</strong>
              <p class="text-xs text-slate-500 leading-relaxed">
                No disponen de chip GPS. Rebotan su señal Bluetooth con dispositivos móviles cercanos para reportar su posición de forma pasiva. Funciona solo en zonas concurridas.
              </p>
            </div>
          </div>
        </div>

        <hr class="border-slate-100">

        <!-- Section 2: Dogs vs Cats -->
        <div>
          <h2 class="text-xl font-black text-slate-900 mb-4 flex items-center">
            <span class="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg mr-2.5 text-xs">2</span>
            Diferencias críticas: GPS para Perros vs. GPS para Gatos
          </h2>
          <p class="mb-4">
            No utilices un localizador genérico o diseñado para un perro grande en el cuello de un felino doméstico. Aquí te explicamos los motivos principales:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <h3 class="text-sm font-bold text-blue-900 mb-2">🐕 Collares para Perros</h3>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2 font-bold">•</span>
                  <span>Suelen ser más robustos y resistentes a mordiscos y golpes contra rocas.</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2 font-bold">•</span>
                  <span>Ofrecen mayor resistencia al agua (inmersión completa para nadar).</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2 font-bold">•</span>
                  <span>Admiten mayor tamaño y peso, lo que permite baterías más grandes de hasta 3 semanas de duración.</span>
                </li>
              </ul>
            </div>
            <div class="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
              <h3 class="text-sm font-bold text-purple-900 mb-2">🐈 Collares para Gatos</h3>
              <ul class="space-y-2 text-xs text-slate-600">
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2 font-bold">•</span>
                  <span>Extremadamente ligeros: el peso debe ser inferior a 30 gramos.</span>
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2 font-bold">•</span>
                  <span>Forma curvada ergonómica que no obstaculiza su limpieza.</span>
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2 font-bold">•</span>
                  <span><strong>Obligatorio:</strong> Cierre de seguridad de liberación rápida que se abra si el gato se enreda con una valla.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr class="border-slate-100">

        <!-- Section 3: Subscription or not -->
        <div>
          <h2 class="text-xl font-black text-slate-900 mb-4 flex items-center">
            <span class="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg mr-2.5 text-xs">3</span>
            ¿Merece la pena pagar una suscripción?
          </h2>
          <p class="mb-3">
            Para la mayoría de los usuarios, **sí**. Los modelos con suscripción (Tractive, Kippy, Weenect) garantizan que tu mascota estará localizada sin importar la distancia: si salta una valla y corre 20 kilómetros, la aplicación seguirá actualizando su posición en vivo cada 3 segundos.
          </p>
          <p class="mb-4">
            Sin embargo, si tus necesidades son puntuales, vives en un piso de ciudad o tu perro nunca se separa de ti, los modelos sin suscripción basados en Bluetooth te pueden ahorrar un gasto recurrente.
          </p>
        </div>

        <!-- Section 4: Quick Wizard -->
        <div class="bg-slate-900 text-white rounded-3xl p-6 md:p-8">
          <h3 class="text-lg font-bold mb-3">Resumen de decisión rápida</h3>
          <p class="text-xs text-slate-400 leading-relaxed mb-6">
            Si aún no tienes claro qué dispositivo elegir para tu mascota, guíate por este mapa de recomendaciones rápidas de nuestro analista:
          </p>
          <div class="space-y-4 text-xs">
            <div class="flex items-start gap-3">
              <div class="bg-indigo-500/10 text-indigo-400 p-1 rounded-lg font-bold">A</div>
              <div>
                <p class="font-bold text-white">¿Quieres la máxima seguridad y cobertura en el campo y ciudad?</p>
                <p class="text-slate-400 mt-0.5">Compra un <strong>Tractive GPS Dog</strong> o <strong>Tractive GPS Cat</strong>.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-indigo-500/10 text-indigo-400 p-1 rounded-lg font-bold">B</div>
              <div>
                <p class="font-bold text-white">¿No quieres pagar cuotas mensuales bajo ningún concepto?</p>
                <p class="text-slate-400 mt-0.5">Opta por un <strong>Lapa GPS Sin Abono</strong> o añade un <strong>Apple AirTag</strong> (solo si hay iPhones cerca).</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-indigo-500/10 text-indigo-400 p-1 rounded-lg font-bold">C</div>
              <div>
                <p class="font-bold text-white">¿Buscas funciones de salud avanzadas y control de actividad física?</p>
                <p class="text-slate-400 mt-0.5">El localizador <strong>Kippy EVO</strong> ofrece gráficos de salud excelentes tipo smartwatch.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}

// Render FAQ (Frequently Asked Questions) View
function renderFAQ(container) {
  container.innerHTML = `
    <!-- Top banner -->
    <section class="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl font-black tracking-tight mb-3">Preguntas Frecuentes sobre Localizadores GPS</h1>
        <p class="text-sm text-indigo-200">
          Resolvemos las dudas y conceptos técnicos más comunes relacionados con el rastreo de perros y gatos.
        </p>
      </div>
    </section>

    <!-- FAQ list accordion style -->
    <section class="max-w-4xl mx-auto px-4 py-12">
      <div class="space-y-4">
        ${faqs.map((faq, index) => `
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-all-300 cursor-pointer faq-item-container" data-index="${index}">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-bold text-slate-900 pr-4 flex items-center">
                <span class="text-indigo-600 mr-2.5">Q.</span>
                ${faq.question}
              </h3>
              <span class="faq-icon text-slate-400 font-bold transition-all-300" id="faq-icon-${index}">&plus;</span>
            </div>
            <div class="faq-answer mt-4 text-xs text-slate-600 leading-relaxed hidden border-t border-slate-100 pt-4" id="faq-answer-${index}">
              ${faq.answer}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Call to Action bottom info banner -->
      <div class="mt-12 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="max-w-md">
          <h4 class="text-sm font-bold text-indigo-950">¿Tienes alguna duda que no aparece en la guía?</h4>
          <p class="text-xs text-indigo-700/80 mt-1">Escríbenos a nuestro equipo de analistas y actualizaremos la guía con tu consulta.</p>
        </div>
        <button class="px-5 py-3 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all-300 shadow-sm whitespace-nowrap">
          Enviar Pregunta por Correo
        </button>
      </div>
    </section>
  `;

  // Bind FAQ Accordion clicks
  document.querySelectorAll('.faq-item-container').forEach(item => {
    item.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-index');
      const ans = document.getElementById(`faq-answer-${idx}`);
      const icon = document.getElementById(`faq-icon-${idx}`);
      if (ans && icon) {
        const isHidden = ans.classList.contains('hidden');
        if (isHidden) {
          ans.classList.remove('hidden');
          icon.innerHTML = '&minus;';
        } else {
          ans.classList.add('hidden');
          icon.innerHTML = '&plus;';
        }
      }
    });
  });
}

// Start application after window finishes rendering
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

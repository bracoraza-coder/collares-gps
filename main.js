import './style.css';
import Chart from 'chart.js/auto';
import { products } from './products.js';

// State Management
const state = {
  currentView: 'home', // 'home', 'detail', 'compare', 'guide', 'faqs'
  viewParams: {},      // e.g., { id: 3 }
  filters: {
    search: '',
    category: 'Todos',
    marca: 'Todas',
    no_subscription: false
  },
  sortBy: 'rating', // 'rating', 'name_asc'
  selectedForCompare: [] // Array of product IDs
};

// Unique list of brands for filter dropdown
const brands = ['Todas', ...new Set(products.map(p => p.marca))];

// Function to dynamically add internal links for SEO and qualities
function addInternalLinks(text, excludeId = null) {
  if (!text) return '';
  
  const items = [
    // Brands/Products
    { phrase: 'Tractive GPS Adventure', id: 4 },
    { phrase: 'Tractive CAT Mini', id: 17 },
    { phrase: 'Tractive Adventure', id: 4 },
    { phrase: 'Weenect Dog XS', id: 2 },
    { phrase: 'Weenect Dog', id: 3 },
    { phrase: 'Kippy Cat V2', id: 18 },
    { phrase: 'Kippy Cat', id: 18 },
    { phrase: 'PitPat', id: 0 },
    { phrase: 'Tractive', id: 1 },
    { phrase: 'Weenect', id: 2 },
    { phrase: 'TKMARS', id: 12 },
    { phrase: 'Pawfit 2', id: 13 },
    { phrase: 'Pawfit', id: 13 },
    { phrase: 'Kippy', id: 18 },
    { phrase: 'PAJ GPS', id: 5 },
    { phrase: 'Denash', id: 19 },
    { phrase: 'Winnes', id: 16 },
    { phrase: 'PETLOC8', id: 14 },
    { phrase: 'AirTag', id: 6 },
    { phrase: 'AirTags', id: 6 },

    // Qualities/Features mapped to relevant products
    { phrase: 'sin suscripción mensual', id: 0 },
    { phrase: 'sin suscripción de por vida', id: 10 },
    { phrase: 'sin suscripción de ningún tipo', id: 0 },
    { phrase: 'sin suscripción', id: 0 },
    { phrase: 'sin cuotas mensuales', id: 0 },
    { phrase: 'sin cuotas fijas', id: 0 },
    { phrase: 'sin cuotas', id: 0 },
    { phrase: 'sin tarifas', id: 15 },
    { phrase: 'seguimiento en tiempo real', id: 1 },
    { phrase: 'localización en tiempo real', id: 1 },
    { phrase: 'rastreo en tiempo real', id: 1 },
    { phrase: 'localizar a tu mascota', id: 15 },
    { phrase: 'geolocalizar a tu mascota', id: 15 },
    { phrase: 'batería de larga autonomía', id: 12 },
    { phrase: 'batería de larguísima duración', id: 0 },
    { phrase: 'batería de larga duración', id: 12 },
    { phrase: 'larga autonomía', id: 12 },
    { phrase: 'batería descomunal', id: 12 },
    { phrase: 'luz de seguridad LED', id: 14 },
    { phrase: 'luces de seguridad', id: 14 },
    { phrase: 'luz de seguridad', id: 14 },
    { phrase: 'iluminación de seguridad', id: 14 },
    { phrase: 'comandos de voz', id: 13 },
    { phrase: 'llamadas de voz', id: 9 },
    { phrase: 'micrófono integrado', id: 9 },
    { phrase: 'adiestramiento por vibración', id: 2 },
    { phrase: 'valla de seguridad circular', id: 7 },
    { phrase: 'valla inalámbrica', id: 7 },
    { phrase: 'valla virtual', id: 1 },
    { phrase: 'análisis de salud', id: 8 },
    { phrase: 'monitor de bienestar', id: 13 },
    { phrase: 'estadísticas de bienestar', id: 16 },
    { phrase: 'nivel de actividad', id: 8 },
    { phrase: 'podómetro inteligente', id: 0 },
    { phrase: 'cierre anti-enganches', id: 17 },
    { phrase: 'sistema de liberación de seguridad', id: 17 },
    { phrase: 'antiestrangulamiento', id: 18 },
    { phrase: 'collar elástico de seguridad', id: 18 },
    { phrase: 'sumergible en agua dulce o salada', id: 4 },
    { phrase: 'carcasa ultra resistente', id: 4 },
    { phrase: 'tarjeta SIM multi-red', id: 2 }
  ];

  // Filter out any link targets matching the current active product ID
  const filteredItems = items.filter(item => item.id !== excludeId);

  // Sort by phrase length descending
  const sortedItems = [...filteredItems].sort((a, b) => b.phrase.length - a.phrase.length);

  let tempText = text;
  const placeholders = [];

  sortedItems.forEach((item, index) => {
    const escapedPhrase = item.phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Match Spanish words boundaries safely (preceding/succeeding non-alphabetic or edge)
    const regex = new RegExp(`(^|[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ])(${escapedPhrase})([^a-záéíóúüñA-ZÁÉÍÓÚÜÑ]|$)`, 'gi');
    
    tempText = tempText.replace(regex, (match, p1, p2, p3) => {
      const placeholder = `__INTERNAL_LINK_${index}_${placeholders.length}__`;
      placeholders.push({
        placeholder,
        html: `${p1}<a href="#" onclick="navigate('detail', {id: ${item.id}}); return false;" class="text-indigo-600 hover:text-indigo-800 font-bold transition-colors duration-150 underline decoration-indigo-300 decoration-1 hover:decoration-indigo-600 underline-offset-2">${p2}</a>${p3}`
      });
      return placeholder;
    });
  });

  // Replace placeholders back
  placeholders.forEach(p => {
    tempText = tempText.replace(p.placeholder, p.html);
  });

  return tempText;
}

// DOM references
let appContainer = null;
let activeChart = null; // Ref for detail view chart
let compareChart = null; // Ref for compare view chart

// Initialize App
function init() {
  appContainer = document.getElementById('app');
  renderApp();
  
  // Back/forward navigation support
  window.addEventListener('popstate', (event) => {
    if (event.state) {
      state.currentView = event.state.view || 'home';
      state.viewParams = event.state.params || {};
      renderApp();
    }
  });

  // Save initial history state
  history.replaceState({ view: state.currentView, params: state.viewParams }, '');
}

// Router/Navigation function
function navigate(view, params = {}) {
  state.currentView = view;
  state.viewParams = params;
  history.pushState({ view, params }, '', `#${view}${params.id ? '?id=' + params.id : ''}`);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global functions attached to window for HTML event handlers
window.navigate = navigate;
window.toggleCompare = function(id) {
  const index = state.selectedForCompare.indexOf(id);
  if (index > -1) {
    state.selectedForCompare.splice(index, 1);
  } else {
    if (state.selectedForCompare.length >= 3) {
      alert('Puedes comparar un máximo de 3 collares a la vez.');
      return;
    }
    state.selectedForCompare.push(id);
  }
  renderApp();
};
window.clearCompare = function() {
  state.selectedForCompare = [];
  renderApp();
};

// Render whole app layout
function renderApp() {
  if (!appContainer) return;
  
  appContainer.innerHTML = `
    ${renderHeader()}
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
      ${renderActiveView()}
    </main>
    ${renderFooter()}
  `;

  // Initialize view-specific components after DOM insertion
  if (state.currentView === 'detail' && state.viewParams.id !== undefined) {
    initDetailChart(state.viewParams.id);
  } else if (state.currentView === 'compare') {
    initCompareChart();
  }
}

// Header with dynamic navigation tabs and comparison counter
function renderHeader() {
  const isTabActive = (view) => state.currentView === view ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300';
  
  return `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex items-center cursor-pointer" onclick="navigate('home')">
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-2 rounded-xl shadow-md mr-3">
              <i class="class-icon lucide-map-pin text-xl"></i>
            </div>
            <div>
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">RastreaCan</span>
              <p class="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Rastreadores de Mascotas</p>
            </div>
          </div>

          <!-- Desk Nav -->
          <nav class="hidden md:flex space-x-8 h-full">
            <button onclick="navigate('home')" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-all ${isTabActive('home')}">
              <i class="lucide-home mr-1.5 text-sm"></i> Inicio
            </button>
            <button onclick="navigate('compare')" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-all ${isTabActive('compare')}">
              <i class="lucide-git-compare mr-1.5 text-sm"></i> Comparador
              ${state.selectedForCompare.length > 0 ? `<span class="ml-1.5 bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">${state.selectedForCompare.length}</span>` : ''}
            </button>
            <button onclick="navigate('guide')" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-all ${isTabActive('guide')}">
              <i class="lucide-book-open mr-1.5 text-sm"></i> Guía de Compra
            </button>
            <button onclick="navigate('faqs')" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-all ${isTabActive('faqs')}">
              <i class="lucide-help-circle mr-1.5 text-sm"></i> Preguntas Frecuentes
            </button>
          </nav>

          <!-- Compare Floating Button for Mobile -->
          <div class="flex items-center space-x-2">
            <button onclick="navigate('compare')" class="md:hidden relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <i class="lucide-git-compare text-xl"></i>
              ${state.selectedForCompare.length > 0 ? `<span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">${state.selectedForCompare.length}</span>` : ''}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Sub-Navigation Bar -->
      <div class="flex md:hidden border-t border-slate-100 bg-slate-50 justify-around text-xs py-2">
        <button onclick="navigate('home')" class="flex flex-col items-center ${state.currentView === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-500'}">
          <i class="lucide-home text-base"></i>
          <span>Inicio</span>
        </button>
        <button onclick="navigate('compare')" class="flex flex-col items-center ${state.currentView === 'compare' ? 'text-indigo-600 font-bold' : 'text-slate-500'}">
          <i class="lucide-git-compare text-base"></i>
          <span>Comparar</span>
        </button>
        <button onclick="navigate('guide')" class="flex flex-col items-center ${state.currentView === 'guide' ? 'text-indigo-600 font-bold' : 'text-slate-500'}">
          <i class="lucide-book-open text-base"></i>
          <span>Guía</span>
        </button>
        <button onclick="navigate('faqs')" class="flex flex-col items-center ${state.currentView === 'faqs' ? 'text-indigo-600 font-bold' : 'text-slate-500'}">
          <i class="lucide-help-circle text-base"></i>
          <span>Ayuda</span>
        </button>
      </div>
    </header>
  `;
}

// Footer content
function renderFooter() {
  return `
    <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center text-white mb-4">
              <div class="bg-indigo-600 p-1.5 rounded-lg mr-2">
                <i class="lucide-map-pin text-sm"></i>
              </div>
              <span class="text-lg font-bold">RastreaCan</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Comparamos y analizamos los mejores localizadores y collares GPS para perros y gatos del mercado para ayudarte a mantener a tus amigos de cuatro patas siempre a salvo.
            </p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Secciones</h4>
            <ul class="space-y-2 text-xs">
              <li><button onclick="navigate('home')" class="hover:text-indigo-400 transition-colors">Inicio y Comparativas</button></li>
              <li><button onclick="navigate('compare')" class="hover:text-indigo-400 transition-colors">Comparador Multidispositivo</button></li>
              <li><button onclick="navigate('guide')" class="hover:text-indigo-400 transition-colors">Guía Completa de Compra</button></li>
              <li><button onclick="navigate('faqs')" class="hover:text-indigo-400 transition-colors">Preguntas Frecuentes</button></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Nota de Afiliación</h4>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Participamos en el Programa de Afiliados de Amazon. Eso significa que si compras a través de nuestros enlaces de Amazon, recibimos una pequeña comisión sin ningún coste adicional para ti. Esto nos ayuda a seguir publicando análisis independientes.
            </p>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; 2026 RastreaCan. Todos los derechos reservados.</p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <span class="hover:text-slate-500 cursor-pointer">Aviso Legal</span>
            <span class="hover:text-slate-500 cursor-pointer">Política de Privacidad</span>
            <span class="hover:text-slate-500 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Router switcher
function renderActiveView() {
  switch (state.currentView) {
    case 'home':
      return renderHomeView();
    case 'detail':
      return renderDetailView(state.viewParams.id);
    case 'compare':
      return renderCompareView();
    case 'guide':
      return renderGuideView();
    case 'faqs':
      return renderFaqsView();
    default:
      return renderHomeView();
  }
}

// --- Home View ---
function renderHomeView() {
  // Apply filtering logic
  let filtered = products.filter(p => {
    // Search
    const matchSearch = p.name.toLowerCase().includes(state.filters.search.toLowerCase()) || 
                        p.marca.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                        p.description.toLowerCase().includes(state.filters.search.toLowerCase());
    
    // Category
    const matchCategory = state.filters.category === 'Todos' || p.category === state.filters.category;
    
    // Brand
    const matchBrand = state.filters.marca === 'Todas' || p.marca === state.filters.marca;
    
    // Subscription Free
    const isFree = !p.pros.toLowerCase().includes('requiere suscripción') && 
                   !p.contras.toLowerCase().includes('requiere suscripción') &&
                   !p.description.toLowerCase().includes('suscripción') &&
                   !p.contras.toLowerCase().includes('exige plan') &&
                   !p.contras.toLowerCase().includes('suscripción obligatoria') &&
                   !p.contras.toLowerCase().includes('suscripción mensual');
    const matchSub = !state.filters.no_subscription || isFree;
    
    return matchSearch && matchCategory && matchBrand && matchSub;
  });

  // Sort
  if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.valoracion_media - a.valoracion_media);
  } else if (state.sortBy === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Bind filter change events
  setTimeout(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        renderApp();
        document.getElementById('search-input').focus();
      });
    }
  }, 50);

  return `
    <!-- Hero Banner -->
    <section class="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white mb-8 relative overflow-hidden shadow-lg">
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="relative z-10 max-w-2xl">
        <span class="bg-indigo-500/35 text-indigo-300 text-xs uppercase tracking-widest px-3 py-1 rounded-full font-bold">Guía Comparativa 2026</span>
        <h1 class="text-2xl sm:text-4xl font-bold mt-4 tracking-tight leading-tight">Encuentra el Collar GPS Perfecto para tu Mascota</h1>
        <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Comparamos los 20 mejores rastreadores para perros y gatos. Filtra por tipo de actividad, precio o cuota mensual y mantén a tu mejor amigo seguro de forma inteligente.
        </p>
      </div>
    </section>

    <!-- App Grid: Sidebar Filters + Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- Filters Sidebar -->
      <aside class="bg-white p-6 rounded-xl border border-slate-200 h-fit space-y-6 shadow-xs">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 class="font-bold text-slate-800 flex items-center">
            <i class="lucide-sliders-horizontal mr-2 text-indigo-600 text-sm"></i> Filtrar y Buscar
          </h3>
          <button onclick="resetFilters()" class="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors">Limpiar</button>
        </div>

        <!-- Search -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Buscar</label>
          <div class="relative">
            <input id="search-input" type="text" value="${state.filters.search}" placeholder="Modelo, marca o función..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all">
            <i class="lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          </div>
        </div>

        <!-- Brand -->
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Marca</label>
          <select onchange="updateFilter('marca', this.value)" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 transition-all">
            ${brands.map(b => `<option value="${b}" ${state.filters.marca === b ? 'selected' : ''}>${b}</option>`).join('')}
          </select>
        </div>
      </aside>

      <!-- Products Listing Area -->
      <section class="lg:col-span-3 space-y-6">
        <!-- Sort and counter header -->
        <div class="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs gap-4">
          <p class="text-sm font-medium text-slate-600">Se han encontrado <span class="text-slate-900 font-bold">${filtered.length}</span> collares GPS</p>
        </div>

        <!-- Cards Grid (5 filas de 4 productos en desktop para 20 en total) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          ${filtered.length === 0 ? renderEmptyState() : filtered.map(p => renderAAWPBox(p)).join('')}
        </div>
      </section>

    </div>
  `;
}

// Handler functions for sorting/filtering
window.updateFilter = function(key, val) {
  state.filters[key] = val;
  renderApp();
};
window.toggleSubscriptionFilter = function() {
  state.filters.no_subscription = !state.filters.no_subscription;
  renderApp();
};
window.updateSort = function(val) {
  state.sortBy = val;
  renderApp();
};
window.resetFilters = function() {
  state.filters = {
    search: '',
    category: 'Todos',
    marca: 'Todas',
    no_subscription: false
  };
  renderApp();
};

function renderEmptyState() {
  return `
    <div class="text-center bg-white py-16 px-4 rounded-xl border border-slate-200 shadow-xs">
      <div class="bg-slate-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
        <i class="lucide-alert-circle text-2xl text-slate-400"></i>
      </div>
      <h3 class="font-bold text-slate-800 text-lg">No hay resultados que coincidan</h3>
      <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Prueba a limpiar los filtros o a buscar con un término diferente.</p>
      <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">Limpiar Filtros</button>
    </div>
  `;
}

// AAWP Affiliate Box style product card
function renderAAWPBox(p) {
  const isCompared = state.selectedForCompare.includes(p.id);
  const ratingStars = renderStars(p.valoracion_media);
  const mainPros = p.pros.split('|').slice(0, 3);
  
  // Tag styles
  const categoryLabels = {
    'Caza': 'Caza y Montaña',
    'Mixto': 'Uso Mixto',
    'Urbano': 'Uso Urbano',
    'Mini': 'Mascotas Mini / Gatos'
  };

  return `
    <article class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full relative" id="product-card-${p.id}">
      <!-- Badge for Top Features -->
      ${p.isFeatured ? `
        <span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10 shadow-xs flex items-center">
          <i class="lucide-sparkles mr-1 text-[11px]"></i> Destacado
        </span>
      ` : ''}

      <!-- Product Image Area -->
      <div class="w-full h-48 bg-slate-50 flex items-center justify-center relative p-4 border-b border-slate-100 shrink-0">
        <img src="${p.image_url}" alt="${p.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain mix-blend-multiply rounded-lg transform hover:scale-105 transition-all duration-300">
      </div>

      <!-- Content Area -->
      <div class="flex-grow p-5 flex flex-col justify-between">
        <div>
          <!-- Title & Brand -->
          <div class="flex justify-between items-start gap-2 mb-2">
            <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">${p.marca}</span>
            <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">${categoryLabels[p.category] || p.category}</span>
          </div>
          <h3 onclick="navigate('detail', {id: ${p.id}})" class="text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer leading-snug transition-colors min-h-[40px]">${p.name}</h3>

          <!-- Star Ratings -->
          <div class="flex items-center space-x-1 mt-2">
            <div class="flex text-amber-400 text-xs">
              ${ratingStars}
            </div>
            <span class="text-xs font-bold text-slate-700">${p.valoracion_media}</span>
          </div>

          <!-- Highlighted Pros -->
          <ul class="mt-4 space-y-2">
            ${mainPros.map(pro => `
              <li class="flex items-start text-xs text-slate-600 leading-tight">
                <i class="lucide-check text-emerald-500 mr-1.5 shrink-0 text-xs mt-0.5"></i>
                <span class="line-clamp-2">${pro}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="border-t border-slate-100 pt-4 mt-4 space-y-2 shrink-0">
          <div class="flex items-center space-x-2">
            <!-- Details Button -->
            <button onclick="navigate('detail', {id: ${p.id}})" class="flex-grow px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 flex items-center justify-center">
              Detalles
            </button>
            
            <!-- Compare Toggle Button -->
            <button onclick="toggleCompare(${p.id})" class="p-2 rounded-lg border transition-all flex items-center justify-center shrink-0 ${isCompared ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}" title="Comparar">
              <i class="lucide-git-compare text-xs"></i>
            </button>
          </div>

          <!-- Amazon Buy Button -->
          <a href="${p.affiliate_link}" target="_blank" rel="noopener noreferrer" class="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1">
            Ver en Amazon <i class="lucide-external-link text-xs"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}

// Helpers for stars
function renderStars(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += '<i class="lucide-star fill-amber-400 text-amber-400"></i>';
    } else if (i === fullStars + 1 && halfStar) {
      starsHtml += '<i class="lucide-star-half fill-amber-400 text-amber-400"></i>';
    } else {
      starsHtml += '<i class="lucide-star text-slate-200"></i>';
    }
  }
  return starsHtml;
}

// --- Detail View ---
function renderDetailView(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return renderEmptyState();

  const isCompared = state.selectedForCompare.includes(p.id);
  const allPros = p.pros.split('|');
  const allContras = p.contras.split('|');

  return `
    <div class="space-y-8">
      <!-- Back Header -->
      <div class="flex items-center justify-between">
        <button onclick="navigate('home')" class="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          <i class="lucide-arrow-left mr-1.5 text-base"></i> Volver a la lista
        </button>
        <button onclick="toggleCompare(${p.id})" class="inline-flex items-center text-xs font-bold border rounded-lg px-4 py-2 transition-all ${isCompared ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600'}">
          <i class="lucide-git-compare mr-1.5"></i> ${isCompared ? 'Agregado al comparador' : 'Agregar al comparador'}
        </button>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Image and CTA (4 cols) -->
        <div class="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between h-fit gap-6">
          <div class="bg-slate-50 w-full h-80 rounded-xl flex items-center justify-center p-6 relative">
            <img src="${p.image_url}" alt="${p.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain mix-blend-multiply">
          </div>
          
          <div class="space-y-4">
            <a href="${p.affiliate_link}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-center rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2">
              Ver en Amazon <i class="lucide-external-link text-sm"></i>
            </a>
          </div>
        </div>

        <!-- Right: Details and Radar Chart (8 cols) -->
        <div class="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
          <div>
            <div class="flex items-center space-x-2">
              <span class="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">${p.marca}</span>
              <span class="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-semibold uppercase">${p.category}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">${p.name}</h1>
            
            <div class="flex items-center space-x-2 mt-3">
              <div class="flex text-amber-400 text-sm">${renderStars(p.valoracion_media)}</div>
              <span class="text-sm font-bold text-slate-800">${p.valoracion_media} de 5</span>
              <span class="text-xs text-slate-400">basado en opiniones verificadas</span>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-slate text-sm text-slate-600 leading-relaxed">
            <h3 class="font-bold text-slate-800 text-base mb-2">Descripción General</h3>
            <p>${p.description}</p>
          </div>

          <!-- Chart Area -->
          <div class="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 class="font-bold text-slate-800 text-base mb-4 flex items-center">
              <i class="lucide-activity text-indigo-600 mr-2 text-sm"></i> Análisis de Características
            </h3>
            <div class="w-full max-w-sm mx-auto h-72">
              <canvas id="detail-radar-chart"></canvas>
            </div>
          </div>

          <!-- Pros and Cons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
              <h4 class="font-bold text-emerald-800 text-sm mb-3 flex items-center">
                <i class="lucide-smile mr-2 text-emerald-600"></i> Ventajas clave
              </h4>
              <ul class="space-y-2 text-xs text-slate-600">
                ${allPros.map(pro => `
                  <li class="flex items-start">
                    <i class="lucide-check text-emerald-500 mr-2 shrink-0 text-sm mt-0.5"></i>
                    <span>${pro}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-rose-50/50 border border-rose-100 rounded-xl p-5">
              <h4 class="font-bold text-rose-800 text-sm mb-3 flex items-center">
                <i class="lucide-frown mr-2 text-rose-600"></i> Aspectos a mejorar
              </h4>
              <ul class="space-y-2 text-xs text-slate-600">
                ${allContras.map(con => `
                  <li class="flex items-start">
                    <i class="lucide-x text-rose-400 mr-2 shrink-0 text-sm mt-0.5"></i>
                    <span>${con}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

// Chart Initializer for Detail View
function initDetailChart(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  const ctx = document.getElementById('detail-radar-chart');
  if (!ctx) return;

  // Destroy previous chart if it exists
  if (activeChart) {
    activeChart.destroy();
  }

  activeChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Precisión GPS', 'Autonomía', 'Alcance', 'Ergonomía/Peso', 'Calidad App', 'Relación Calidad/Precio'],
      datasets: [{
        label: p.name,
        data: p.radar_scores,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: 'rgb(79, 70, 229)',
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(79, 70, 229)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            font: {
              size: 8
            }
          },
          grid: {
            color: '#e2e8f0'
          },
          pointLabels: {
            font: {
              size: 9,
              weight: 'bold'
            },
            color: '#475569'
          }
        }
      }
    }
  });
}

// --- Compare View ---
function renderCompareView() {
  const selectedProds = products.filter(p => state.selectedForCompare.includes(p.id));

  if (selectedProds.length === 0) {
    return `
      <div class="text-center bg-white py-16 px-4 rounded-xl border border-slate-200 shadow-xs">
        <div class="bg-indigo-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
          <i class="lucide-git-compare text-2xl text-indigo-600"></i>
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Tu comparador está vacío</h3>
        <p class="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Vuelve al catálogo principal y marca la casilla de comparar en los collares que te interesen.</p>
        <button onclick="navigate('home')" class="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">Ver Catálogo</button>
      </div>
    `;
  }

  return `
    <div class="space-y-8">
      <!-- Compare header -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-xs gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 flex items-center">
            <i class="lucide-git-compare text-indigo-600 mr-2 text-base"></i> Tabla Comparativa Especializada
          </h2>
          <p class="text-xs text-slate-500 mt-1">Comparando ${selectedProds.length} de un máximo de 3 collares GPS.</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="clearCompare()" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-bold transition-all">Limpiar Comparador</button>
          <button onclick="navigate('home')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs">Añadir Más</button>
        </div>
      </div>

      <!-- Comparison Matrix Grid -->
      <div class="grid grid-cols-1 md:grid-cols-${selectedProds.length + 1} gap-6 items-stretch">
        <!-- Labels Column -->
        <div class="hidden md:flex flex-col justify-between bg-slate-50 rounded-xl border border-slate-200/60 p-5 font-bold text-xs text-slate-500 space-y-8">
          <div class="h-44 flex items-center">Dispositivo</div>
          <div class="py-2 border-b border-slate-200/40">Marca</div>
          <div class="py-2 border-b border-slate-200/40">Uso Ideal</div>
          <div class="py-2 border-b border-slate-200/40">Valoración</div>
          <div class="py-2 border-b border-slate-200/40">Ventaja Principal</div>
          <div class="py-2">Acción</div>
        </div>

        <!-- Product Columns -->
        ${selectedProds.map(p => `
          <div class="bg-white rounded-xl border border-indigo-600/10 shadow-xs p-6 flex flex-col justify-between hover:border-indigo-600/25 transition-all text-center relative">
            <button onclick="toggleCompare(${p.id})" class="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors" title="Eliminar de la comparación">
              <i class="lucide-x-circle text-lg"></i>
            </button>
            
            <!-- Basic Info Header -->
            <div class="h-44 flex flex-col items-center justify-center">
              <div class="w-24 h-24 flex items-center justify-center mb-3">
                <img src="${p.image_url}" alt="${p.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain">
              </div>
              <h3 onclick="navigate('detail', {id: ${p.id}})" class="font-black text-slate-900 text-sm hover:text-indigo-600 cursor-pointer line-clamp-2">${p.name}</h3>
            </div>

            <!-- Brand -->
            <div class="py-3 border-b border-slate-100 md:border-transparent flex justify-between md:block">
              <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Marca</span>
              <span class="text-xs font-bold text-slate-800">${p.marca}</span>
            </div>

            <!-- Uso Ideal -->
            <div class="py-3 border-b border-slate-100 md:border-transparent flex justify-between md:block">
              <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Uso Ideal</span>
              <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold font-mono">${p.category}</span>
            </div>

            <!-- Valoración -->
            <div class="py-3 border-b border-slate-100 md:border-transparent flex justify-between md:block items-center">
              <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Valoración</span>
              <div class="flex items-center justify-center space-x-1">
                <span class="text-xs font-bold text-slate-800">${p.valoracion_media}</span>
                <i class="lucide-star fill-amber-400 text-amber-400 text-[11px] h-3 w-3"></i>
              </div>
            </div>

            <!-- Ventaja Principal -->
            <div class="py-4 flex flex-col items-center justify-center">
              <span class="md:hidden text-xs text-slate-400 font-bold uppercase mb-1">Pros Clave</span>
              <p class="text-xs text-slate-500 italic max-w-[200px] leading-relaxed line-clamp-2">"${p.pros.split('|')[0]}"</p>
            </div>

            <!-- Action CTA -->
            <div class="pt-5 space-y-2">
              <button onclick="navigate('detail', {id: ${p.id}})" class="w-full py-2 bg-slate-50 border hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors">Ficha Técnica</button>
              <a href="${p.affiliate_link}" target="_blank" rel="noopener noreferrer" class="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-lg shadow-xs flex items-center justify-center gap-1">
                Ver en Amazon <i class="lucide-external-link text-[10px]"></i>
              </a>
            </div>

          </div>
        `).join('')}
      </div>

      <!-- Dynamic Multi-line Radar Comparison Chart -->
      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <h3 class="font-bold text-slate-900 text-base mb-6 flex items-center">
          <i class="lucide-activity text-indigo-600 mr-2 text-sm"></i> Gráfica de Comparación Simultánea
        </h3>
        <div class="w-full max-w-xl mx-auto h-96">
          <canvas id="compare-radar-chart"></canvas>
        </div>
      </div>

    </div>
  `;
}

// Chart Initializer for Compare View
function initCompareChart() {
  const selectedProds = products.filter(p => state.selectedForCompare.includes(p.id));
  if (selectedProds.length === 0) return;

  const ctx = document.getElementById('compare-radar-chart');
  if (!ctx) return;

  if (compareChart) {
    compareChart.destroy();
  }

  // Pre-configured distinct colors for up to 3 datasets
  const colors = [
    { bg: 'rgba(79, 70, 229, 0.1)', border: 'rgb(79, 70, 229)' }, // Indigo
    { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgb(16, 185, 129)' }, // Emerald
    { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgb(245, 158, 11)' } // Amber
  ];

  const datasets = selectedProds.map((p, i) => {
    const theme = colors[i % colors.length];
    return {
      label: p.name,
      data: p.radar_scores,
      backgroundColor: theme.bg,
      borderColor: theme.border,
      pointBackgroundColor: theme.border,
      pointBorderColor: '#fff',
      borderWidth: 2
    };
  });

  compareChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Precisión GPS', 'Autonomía', 'Alcance', 'Ergonomía/Peso', 'Calidad App', 'Relación Calidad/Precio'],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 10,
              weight: 'bold'
            },
            color: '#334155'
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            font: {
              size: 8
            }
          },
          grid: {
            color: '#e2e8f0'
          },
          pointLabels: {
            font: {
              size: 10,
              weight: 'bold'
            },
            color: '#475569'
          }
        }
      }
    }
  });
}

// --- Buying Guide View ---
function renderGuideView() {
  return `
    <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-10">
      <div>
        <span class="text-indigo-600 text-xs font-bold uppercase tracking-widest font-mono">Consejo de Expertos</span>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 mt-2">¿Cómo Elegir el Mejor Collar GPS para tu Mascota?</h1>
        <p class="text-slate-500 text-sm mt-1">Guía completa de compra sobre tecnologías de rastreo, pesos recomendados, cobertura móvil y costes ocultos de los planes de suscripción.</p>
      </div>

      <!-- Introduction Section -->
      <div class="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4">
        <p>
          Encontrar el <strong>mejor collar GPS para perros</strong> o el <strong>localizador GPS para gatos</strong> adecuado no es una tarea sencilla. Hoy en día, el mercado ofrece una enorme variedad de dispositivos con filosofías de funcionamiento muy diferentes. Para tomar la decisión acertada y garantizar la seguridad de tu fiel compañero, debes valorar aspectos esenciales como la precisión de localización en tiempo real, el peso sobre su cuello, la resistencia al agua y, muy especialmente, la presencia o no de cuotas de suscripción obligatorias.
        </p>
      </div>

      <!-- Table Section -->
      <section class="space-y-4 border-t border-slate-100 pt-6">
        <h3 class="font-bold text-slate-800 text-base">Comparativa de Tecnologías de Rastreo y Localización</h3>
        <p class="text-xs text-slate-500">Un resumen de las tres principales familias tecnológicas de localizadores de mascotas disponibles en el mercado actual:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="p-3 font-bold text-slate-700">Tecnología</th>
                <th class="p-3 font-bold text-slate-700">Alcance</th>
                <th class="p-3 font-bold text-slate-700">Suscripción</th>
                <th class="p-3 font-bold text-slate-700">Uso Recomendado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr>
                <td class="p-3 font-bold text-slate-900">GPS / Red Celular (4G LTE)</td>
                <td class="p-3 text-slate-600">Ilimitado (Sujeto a cobertura celular móvil)</td>
                <td class="p-3 text-indigo-600 font-semibold">${addInternalLinks('Sí (Suscripción mensual o anual)')}</td>
                <td class="p-3 text-slate-600">${addInternalLinks('Mascotas en zonas urbanas, suburbanas o de campo habitual.')}</td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-slate-900">Radiofrecuencia (VHF)</td>
                <td class="p-3 text-slate-600">Hasta 15 km (Línea de vista directa)</td>
                <td class="p-3 text-emerald-600 font-semibold">${addInternalLinks('No (Sin cuotas de suscripción)')}</td>
                <td class="p-3 text-slate-600">${addInternalLinks('Perros de caza, alta montaña, bosques profundos o zonas sin cobertura.')}</td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-slate-900">Ecosistema Bluetooth (Apple Buscar)</td>
                <td class="p-3 text-slate-600">Dependiente de iPhones y iPads cercanos</td>
                <td class="p-3 text-emerald-600 font-semibold">${addInternalLinks('No (Sin cuotas ni contratos)')}</td>
                <td class="p-3 text-slate-600">${addInternalLinks('Mascotas tranquilas, estrictamente urbanas o paseos controlados.')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Key Factors Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
        <div class="space-y-3">
          <h4 class="font-bold text-slate-800 text-sm flex items-center">
            <i class="lucide-shield-check text-indigo-600 mr-2 text-base"></i> Peso, Ergonomía y Seguridad Cervical
          </h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            ${addInternalLinks('Para gatos y perros de menos de 4-5 kg, es crucial elegir un localizador GPS mini ultra ligero de menos de 30 gramos. El Tractive CAT Mini, por ejemplo, destaca por incluir un collar de seguridad Rogz con cierre anti-enganches diseñado para soltarse ante tirones. Del mismo modo, el Kippy Cat V2 cuenta con un collar elástico de seguridad con sistema antiestrangulamiento. Evita colocar modelos pesados pensados para perros grandes en felinos o cachorros, pues limitarán su movilidad y pondrán en grave riesgo su seguridad.')}
          </p>
          <p class="text-xs text-slate-500 leading-relaxed">
            ${addInternalLinks('Un dispositivo pesado como el TKMARS o collares robustos de caza de más de 100 gramos pueden provocar dolores de cuello crónicos o lesiones graves en las cervicales de las mascotas pequeñas si se usan a diario.')}
          </p>
        </div>

        <div class="space-y-3">
          <h4 class="font-bold text-slate-800 text-sm flex items-center">
            <i class="lucide-wallet text-indigo-600 mr-2 text-base"></i> Coste de Adquisición vs Suscripción Mensual
          </h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            ${addInternalLinks('Muchos de los collares de marcas líderes como Tractive o Weenect requieren un plan de suscripción mensual obligatorio (entre 4€ y 10€ al mes) para financiar la tarjeta SIM multi-red integrada que se conecta a las antenas celulares. Si prefieres un collar GPS sin suscripción mensual ni cuotas de mantenimiento recurrentes, puedes optar por localizadores que funcionan con una tarjeta SIM de prepago de tu elección (como Denash o los de la marca Suscripción Libre) o modelos premium de pago único de por vida como PitPat.')}
          </p>
          <p class="text-xs text-slate-500 leading-relaxed">
            ${addInternalLinks('Hacer un cálculo del coste total de propiedad a 2 o 3 años te permitirá saber si te compensa un desembolso inicial superior para obtener un collar sin cuotas, o si prefieres el pago fraccionado de las cuotas de suscripción móvil para disfrutar de soporte técnico prioritario, mapas premium de calor y vallas virtuales inmediatas.')}
          </p>
        </div>
      </div>

      <!-- Additional Tips Section -->
      <div class="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 space-y-3 text-xs text-slate-600 leading-relaxed">
        <h4 class="font-bold text-indigo-900 text-sm flex items-center">
          <i class="lucide-lightbulb text-indigo-600 mr-2 text-base"></i> Recomendaciones Especiales para un Rendimiento Óptimo
        </h4>
        <ul class="list-disc pl-5 space-y-2">
          <li>
            ${addInternalLinks('<strong>Zonas sin cobertura móvil:</strong> Si vives en áreas rurales profundas, bosques o valles montañosos con mala cobertura telefónica, evita los localizadores basados exclusivamente en redes 2G o 4G y prefiere rastreadores profesionales por radiofrecuencia o modelos resistentes de alta potencia satelital como el TKMARS.')}
          </li>
          <li>
            ${addInternalLinks('<strong>Resistencia al agua:</strong> Asegúrate de que el dispositivo disponga de certificación IP67 o IP68 contra inmersiones. Modelos reforzados de alta durabilidad como el Tractive GPS Adventure son completamente sumergible en agua dulce o salada, idóneos para perros aficionados a los chapuzones o salidas de campo.')}
          </li>
          <li>
            ${addInternalLinks('<strong>Funciones de adiestramiento:</strong> Algunos dispositivos como Pawfit 2 permiten emitir comandos de voz personalizados a distancia para educar de forma interactiva a tu perro, mientras que el Weenect Dog XS permite realizar adiestramiento por vibración o pitido para avisarle de que es la hora de comer.')}
          </li>
        </ul>
      </div>
    </div>
  `;
}

// --- FAQs View ---
function renderFaqsView() {
  const faqs = [
    {
      q: "¿Cómo funciona exactamente un collar GPS para perros y gatos?",
      a: "Un collar GPS cuenta con una antena interna de posicionamiento de alta precisión que recibe y procesa las señales de los satélites GPS y GLONASS que orbitan sobre la Tierra para calcular las coordenadas exactas del animal en cada segundo. Posteriormente, mediante un módem y una tarjeta SIM multi-red integrada, el rastreador se conecta de forma automática a la red de telefonía celular móvil disponible más fuerte para transmitir de forma continua esa localización geográfica en tiempo real directamente a la aplicación que has instalado en tu teléfono smartphone, permitiéndote rastrear a tu mascota sin límites de distancia."
    },
    {
      q: "¿Es obligatoria la suscripción mensual en todos los collares y localizadores?",
      a: "No, en absoluto. Existe una clara división: por un lado, los collares de marcas de gran consumo como Tractive, Weenect o Pawfit exigen una cuota de suscripción periódica para mantener activa la tarjeta SIM y cubrir el tráfico de datos móviles ilimitado. Por otro lado, si prefieres un collar GPS sin suscripción de ningún tipo, puedes optar por dispositivos que funcionan mediante radiofrecuencia tradicional, soluciones compatibles con la red Buscar de Apple como el AirTag (que utiliza Bluetooth de forma inteligente sin tarifas ni cuotas fijas), o bien localizadores universales como Denash que te permiten introducir tu propia tarjeta SIM de prepago de un operador convencional, pagando únicamente por los SMS o datos consumidos sin ataduras contractuales."
    },
    {
      q: "¿Sirve un Apple AirTag para buscar a mi mascota en el bosque o campo abierto?",
      a: "No se recomienda en absoluto para zonas de campo, montaña, bosques profundos o áreas rurales con baja densidad de personas. El AirTag no contiene un receptor GPS satelital ni conexión de telefonía celular móvil propia; en su lugar, emite señales Bluetooth cifradas que dependen de que un teléfono iPhone o iPad de otra persona pase a menos de 15 metros para geolocalizar a tu mascota mediante la red Buscar de Apple. En exteriores despoblados o áreas montañosas de senderismo, si tu perro o gato se pierde, no habrá nadie cerca con un dispositivo Apple para triangular su señal, dejándote sin opciones para localizarlo. Para estas situaciones rústicas, es imprescindible optar por un verdadero localizador GPS satelital con cobertura móvil o sistemas profesionales por radiofrecuencia."
    },
    {
      q: "¿Son sumergibles al agua y resistentes al barro los collares GPS actuales?",
      a: "Sí, la gran mayoría de los collares actuales están certificados con IP67 o IP68 de resistencia al agua y polvo. Esto significa que están herméticamente sellados para evitar daños en la electrónica interna. Con un collar impermeable como el Tractive GPS Adventure, tu mascota puede nadar en ríos, jugar en la playa en agua dulce o salada, correr bajo tormentas severas y rebozarse en el barro sin sufrir averías. Solamente es necesario enjuagar el cargador y los conectores metálicos con agua limpia después del paseo para evitar la acumulación de sedimentos corrosivos."
    },
    {
      q: "¿Cuánto dura de media la batería de estos rastreadores y cómo optimizarla?",
      a: "La duración varía sustancialmente según el tamaño, peso y configuración del rastreador. Un localizador GPS mini ultra ligero enfocado en gatos o perros pequeños de escasos gramos dispone de baterías pequeñas que suelen durar entre 2 y 5 días. En contraste, los localizadores de construcción robusta y alta autonomía como el TKMARS incorporan acumuladores de gran capacidad capaces de funcionar hasta 30 días con una sola carga. Para optimizar al máximo la duración, la mayoría de aplicaciones móviles te permiten configurar zonas de ahorro de energía (como la red WiFi de tu casa) que pausan el GPS satelital cuando tu mascota está segura bajo techo, o reducir el intervalo de actualizaciones continuas del posicionamiento en tiempo real fuera de los paseos habituales."
    },
    {
      q: "¿Qué diferencia a un collar GPS para gatos de uno para perros en términos de seguridad?",
      a: "La diferencia radica en el peso de la carcasa y en el sistema de cierre físico para evitar asfixias. Los gatos son animales ágiles que trepan a árboles, vallas y tejados, por lo que un collar estándar podría quedar enganchado y provocar un estrangulamiento. Por este motivo, el Tractive CAT Mini incluye un collar de seguridad Rogz con cierre anti-enganches ajustable, el cual se abre de forma automática bajo el peso del felino ante tirones bruscos. Del mismo modo, el Kippy Cat V2 incorpora un collar elástico de seguridad con sistema antiestrangulamiento. Además de estas medidas mecánicas críticas, los modelos para gatos se benefician de funciones como mapas de calor del territorio para visualizar de manera gráfica dónde pasa el tiempo tu felino doméstico durante sus exploraciones."
    }
  ];

  return `
    <div class="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      <div class="text-center">
        <span class="text-indigo-600 text-xs font-bold uppercase tracking-widest font-mono">Dudas habituales</span>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 mt-2">Preguntas Frecuentes</h1>
        <p class="text-slate-500 text-sm mt-1">Resolvemos todas las dudas sobre el funcionamiento real de los localizadores GPS para mascotas.</p>
      </div>

      <div class="space-y-6 pt-4">
        ${faqs.map((faq, i) => `
          <div class="border-b border-slate-100 pb-5 last:border-0 last:pb-0 font-medium">
            <h4 class="font-bold text-slate-900 text-base flex items-start leading-snug">
              <span class="text-indigo-600 font-mono mr-2">Q${i+1}.</span>
              <span>${faq.q}</span>
            </h4>
            <div class="text-slate-500 text-xs mt-2 pl-7 leading-relaxed space-y-2">
              <p>${addInternalLinks(faq.a)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Start App when loaded
window.addEventListener('DOMContentLoaded', init);
init();

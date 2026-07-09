import './style.css';
import Chart from 'chart.js/auto';
import { products } from './products.js';

// State Management
const state = {
  currentView: 'home', // 'home', 'detail', 'compare', 'guide', 'faqs', 'amazon_search'
  viewParams: {},      // e.g., { id: 3 }
  filters: {
    search: '',
    category: 'Todos',
    marca: 'Todas',
    no_subscription: false
  },
  sortBy: 'rating', // 'rating', 'name_asc'
  selectedForCompare: [], // Array of product IDs
  affiliateTag: localStorage.getItem('rastreacan_affiliate_tag') || 'sosa0af-21',
  transientSearch: '',
  transientCategory: 'aps',
  transientUrl: ''
};

// Unique list of brands for filter dropdown
const brands = ['Todas', ...new Set(products.map(p => p.marca))];

// Product ASINs mapping on Amazon.es for dynamic affiliate links
const productAsins = {
  0: 'B0C23R8C88',
  1: 'B0868KK4CH',
  2: 'B0BGN9SXYY',
  3: 'B07KGPXKBW',
  4: 'B0C9C7B6J8',
  5: 'B08L7VMD9S',
  6: 'B09355X27X',
  7: 'B0F48FZLSS',
  8: 'B0BN1BKKH7',
  9: 'B087JVWJFS',
  10: 'B09BCM4C8Z',
  11: 'B08HGLP8C8',
  12: 'B07F2D6B51',
  13: 'B07YKW16V9',
  14: 'B0B3C1X44T',
  15: 'B07T29MRN7',
  16: 'B07F2D6B51',
  17: 'B0BGY9X4G3',
  18: 'B09G3BHLH9',
  19: 'B087C29Z9Y'
};

window.getProductLink = function(p) {
  const asin = productAsins[p.id];
  if (asin) {
    return `https://www.amazon.es/dp/${asin}?tag=${state.affiliateTag}`;
  }
  
  // Fallback: If the link is a full Amazon URL, ensure the correct affiliate tag is present
  let link = p.affiliate_link || '';
  if (link.includes('amazon.es')) {
    if (link.includes('tag=')) {
      link = link.replace(/tag=[^&]+/, `tag=${state.affiliateTag}`);
    } else {
      link += (link.includes('?') ? '&' : '?') + `tag=${state.affiliateTag}`;
    }
  }
  return link;
};

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
  
  // Call cookie consent banner check on init
  if (typeof checkAndShowCookieBanner === 'function') {
    checkAndShowCookieBanner();
  }
  
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

window.executeHomeAmazonSearch = function() {
  const input = document.getElementById('home-amazon-query-input');
  const val = input ? input.value.trim() : '';
  const tag = state.affiliateTag;
  const url = val 
    ? `https://www.amazon.es/s?k=${encodeURIComponent(val)}&tag=${tag}`
    : `https://www.amazon.es/gp/goldbox?tag=${tag}`;
  window.open(url, '_blank');
};

window.executeAmazonSearchPageSearch = function() {
  const input = document.getElementById('amazon-query-input');
  const val = input ? input.value.trim() : '';
  const categorySelect = document.getElementById('amazon-category-select');
  const category = categorySelect ? categorySelect.value : 'aps';
  const tag = state.affiliateTag;
  
  const url = val 
    ? `https://www.amazon.es/s?k=${encodeURIComponent(val)}${category !== 'aps' ? `&i=${category}` : ''}&tag=${tag}`
    : `https://www.amazon.es/gp/goldbox?tag=${tag}`;
  window.open(url, '_blank');
};

window.loadSearchSuggestion = function(text, cat) {
  const tag = state.affiliateTag;
  const url = `https://www.amazon.es/s?k=${encodeURIComponent(text)}${cat !== 'aps' ? `&i=${cat}` : ''}&tag=${tag}`;
  window.open(url, '_blank');
};

window.saveAffiliateTag = function() {
  const input = document.getElementById('affiliate-tag-input');
  if (input) {
    const val = input.value.trim();
    if (val) {
      state.affiliateTag = val;
      localStorage.setItem('rastreacan_affiliate_tag', val);
      
      // Render success feedback visually in the UI rather than alerting
      const feedbackEl = document.getElementById('affiliate-save-feedback');
      if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        feedbackEl.innerText = `¡ID guardado con éxito! Ahora se utiliza: ${val}`;
        setTimeout(() => {
          feedbackEl.classList.add('hidden');
        }, 4000);
      }
      
      // Re-render other views to reflect changes instantly
      renderApp();
    }
  }
};

window.openAmazonSearchUrl = function(url) {
  if (url) {
    window.open(url, '_blank');
  }
};

window.copyToClipboard = function(text, btnId) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i class="lucide-check text-emerald-600 mr-1"></i> ¡Copiado!`;
      btn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
      }, 2000);
    }
  }).catch(err => {
    console.error('No se pudo copiar: ', err);
  });
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

  // Dynamically update document title and meta tags for SEO optimization
  updateMetaTags(state.currentView, state.viewParams);

  // Initialize view-specific components after DOM insertion
  if (state.currentView === 'detail' && state.viewParams.id !== undefined) {
    initDetailChart(state.viewParams.id);
  } else if (state.currentView === 'compare') {
    initCompareChart();
  }
}

// Function to dynamically update document title and meta tags for SEO optimization
function updateMetaTags(view, params) {
  let title = 'RastreaCan | Comparador Especializado de Collares GPS para Mascotas';
  let description = 'Encuentra y compara el mejor collar GPS para tu perro o gato. Análisis técnico, comparativas, precios en Amazon y modelos sin suscripción mensual.';

  if (view === 'detail' && params.id !== undefined) {
    const p = products.find(prod => prod.id === params.id);
    if (p) {
      title = `${p.name} (${p.marca}) | Análisis, Características y Opiniones | RastreaCan`;
      const cleanDesc = p.description ? p.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 155) : '';
      description = `${cleanDesc}... Descubre ventajas, desventajas, autonomía y precio del collar GPS ${p.name} en RastreaCan.`;
    }
  } else if (view === 'compare') {
    title = 'Comparativa de Collares GPS para Perros y Gatos | RastreaCan';
    description = 'Compara especificaciones técnicas, duración de la batería, impermeabilidad y precios de collares GPS líderes como Tractive, Weenect, Kippy y más.';
  } else if (view === 'guide') {
    title = 'Guía de Compra: ¿Cómo elegir el mejor Collar GPS? | RastreaCan';
    description = 'Análisis completo de expertos sobre tecnologías de rastreo, pesos adecuados para gatos, cobertura móvil 4G LTE y coste de las suscripciones.';
  } else if (view === 'faqs') {
    title = 'Preguntas Frecuentes sobre Localizadores GPS de Mascotas | RastreaCan';
    description = 'Todo lo que necesitas saber sobre el funcionamiento, cobertura, sumergibilidad y duración de la batería de los collares de rastreo satelital.';
  } else if (view === 'amazon_search') {
    title = 'Buscador de Accesorios y Productos para Mascotas en Amazon | RastreaCan';
    description = 'Encuentra las mejores ofertas de pienso, juguetes, camas, comederos y rascadores para perros y gatos en Amazon España con precios oficiales.';
  } else if (view === 'legal_aviso') {
    title = 'Aviso Legal y Condiciones de Uso | RastreaCan';
    description = 'Datos identificativos del titular, exclusión de responsabilidad de precios de Amazon y condiciones generales de uso del comparador RastreaCan.';
  } else if (view === 'legal_privacidad') {
    title = 'Política de Privacidad | RastreaCan';
    description = 'Información sobre el tratamiento de datos y privacidad en RastreaCan. No recopilamos datos personales de forma directa ni registramos cuentas.';
  } else if (view === 'legal_cookies') {
    title = 'Política de Cookies y Consentimiento | RastreaCan';
    description = 'Detalle de las cookies técnicas, de análisis de Google Analytics y de afiliación de Amazon utilizadas en nuestro comparador de GPS.';
  }

  // Update Title
  document.title = title;

  // Update Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Update OpenGraph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Update OpenGraph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);
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
            <button onclick="navigate('amazon_search')" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-all ${isTabActive('amazon_search')}">
              <i class="lucide-shopping-bag mr-1.5 text-sm text-amber-500"></i> Buscador Amazon
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
      <div class="flex md:hidden border-t border-slate-100 bg-slate-50 justify-around text-[10px] py-2">
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
        <button onclick="navigate('amazon_search')" class="flex flex-col items-center ${state.currentView === 'amazon_search' ? 'text-indigo-600 font-bold' : 'text-slate-500'}">
          <i class="lucide-shopping-bag text-base text-amber-500"></i>
          <span>Buscador</span>
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
              <li><button onclick="navigate('amazon_search')" class="hover:text-indigo-400 transition-colors">Buscador Amazon</button></li>
              <li><button onclick="navigate('faqs')" class="hover:text-indigo-400 transition-colors">Preguntas Frecuentes</button></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Declaración de Afiliado</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Como afiliado de Amazon, obtengo ingresos por compras adscritas que cumplen los requisitos aplicables. RastreaCan participa en el Programa de Afiliados de Amazon de la UE, un programa de publicidad para afiliados diseñado para ofrecer a los sitios web un modo de obtener comisiones por publicidad, mediante publicidad y enlaces a Amazon.es.
            </p>
          </div>
        </div>

        <div class="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; 2026 RastreaCan. Todos los derechos reservados.</p>
          <div class="flex space-x-6 mt-4 sm:mt-0">
            <span onclick="navigate('legal_aviso')" class="hover:text-slate-400 cursor-pointer transition-colors">Aviso Legal</span>
            <span onclick="navigate('legal_privacidad')" class="hover:text-slate-400 cursor-pointer transition-colors">Política de Privacidad</span>
            <span onclick="navigate('legal_cookies')" class="hover:text-slate-400 cursor-pointer transition-colors">Política de Cookies</span>
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
    case 'amazon_search':
      return renderAmazonSearchView();
    case 'legal_aviso':
      return renderLegalAvisoView();
    case 'legal_privacidad':
      return renderLegalPrivacidadView();
    case 'legal_cookies':
      return renderLegalCookiesView();
    default:
      return renderHomeView();
  }
}

// --- Amazon Affiliate Search View ---
function renderAmazonSearchView() {
  const categories = [
    { value: 'aps', label: 'Todas las Categorías (Recomendado)' },
    { value: 'electronics', label: 'Tecnología y Electrónica' },
    { value: 'home', label: 'Hogar, Cocina y Herramientas' },
    { value: 'sports', label: 'Deporte, Fitness y Motor' },
    { value: 'pets', label: 'Mascotas y Cuidado Animal' }
  ];

  const suggestions = [
    { text: 'Inflador Eléctrico', cat: 'aps', catLabel: 'Motor' },
    { text: 'Auriculares Bluetooth', cat: 'electronics', catLabel: 'Tecnología' },
    { text: 'Reloj Inteligente', cat: 'electronics', catLabel: 'Tecnología' },
    { text: 'Robot Aspirador', cat: 'home', catLabel: 'Hogar' },
    { text: 'Pienso Mascotas', cat: 'pets', catLabel: 'Mascotas' },
    { text: 'Ropa Deportiva', cat: 'sports', catLabel: 'Deportes' },
    { text: 'Cargador Carga Rápida', cat: 'electronics', catLabel: 'Accesorios' },
    { text: 'Pistola de Masaje', cat: 'sports', catLabel: 'Bienestar' }
  ];

  return `
    <div class="space-y-10 animate-fade-in">
      <!-- Page Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-indigo-900 to-indigo-950"></div>
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <i class="lucide-sparkles mr-1.5 text-xs"></i> Chollos y Ofertas Online
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-100">Buscador de Ofertas y Productos en Amazon</h1>
          <p class="text-indigo-100 max-w-2xl text-sm leading-relaxed">
            Encuentra los mejores precios y chollos en tecnología, hogar, deporte, herramientas, motor y mascotas en Amazon España. Tu ID de afiliado se aplicará de forma automática y 100% segura.
          </p>
        </div>
      </div>

      <!-- Affiliate Tag Configuration & Strategy Dashboard (Sleek Collapsible Panel) -->
      <details class="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-100 group overflow-hidden transition-all duration-300">
        <summary class="flex items-center justify-between p-5 cursor-pointer select-none list-none">
          <div class="flex items-center gap-3">
            <span class="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 group-open:bg-indigo-600 group-open:text-white transition-colors">
              <i class="lucide-settings text-sm"></i>
            </span>
            <div class="text-left">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Estrategia y Configuración de Afiliado (Opcional)
              </h3>
              <p class="text-[10px] text-slate-500">Haz clic aquí para personalizar tu ID de Amazon España y recibir comisiones directas.</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              <span class="relative flex h-1.5 w-1.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              ID Activo: ${state.affiliateTag}
            </div>
            <i class="lucide-chevron-down text-slate-400 group-open:rotate-180 transition-transform text-sm"></i>
          </div>
        </summary>
        
        <div class="p-6 pt-0 border-t border-indigo-100/60 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-1">
          <!-- Form Section -->
          <div class="lg:col-span-5 space-y-3.5">
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tu Tag de Afiliado (Amazon España):</label>
              <div class="flex gap-2">
                <div class="relative flex-grow">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <i class="lucide-tag text-xs"></i>
                  </span>
                  <input 
                    type="text" 
                    id="affiliate-tag-input" 
                    value="${state.affiliateTag}" 
                    placeholder="ej. sosa0af-21" 
                    class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-all shadow-2xs"
                  >
                </div>
                <button 
                  onclick="saveAffiliateTag()" 
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
              <p id="affiliate-save-feedback" class="text-xs text-emerald-600 font-bold hidden flex items-center gap-1">
                <i class="lucide-check-circle text-sm"></i> ¡Guardado correctamente!
              </p>
            </div>
            <p class="text-[10px] text-slate-500 leading-normal">
              El tag se guardará de forma persistente en tu navegador y se aplicará al instante en todos los collares GPS, comparativas, búsquedas manuales y sugerencias del comparador.
            </p>
          </div>

          <!-- Strategy & Learning Section -->
          <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200/60 p-4 space-y-3 shadow-3xs">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <i class="lucide-graduation-cap text-indigo-600"></i> ¿Cómo funciona tu Estrategia de Comisiones?
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                <span class="text-[10px] font-extrabold text-indigo-600">PASO 1</span>
                <p class="text-[10px] font-bold text-slate-800 leading-tight">Enlace con tu ID</p>
                <p class="text-[9px] text-slate-500 leading-normal">Cuando un usuario busca o pulsa "Ver en Amazon", se abre la tienda con tu tag: <code class="text-[8px] bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded font-mono">tag=${state.affiliateTag}</code>.</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                <span class="text-[10px] font-extrabold text-indigo-600">PASO 2</span>
                <p class="text-[10px] font-bold text-slate-800 leading-tight">Cookie de 24 Horas</p>
                <p class="text-[9px] text-slate-500 leading-normal">Amazon almacena una cookie temporal que asocia ese navegador contigo durante 24 horas continuas.</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg space-y-1">
                <span class="text-[10px] font-extrabold text-indigo-600">PASO 3</span>
                <p class="text-[10px] font-bold text-slate-800 leading-tight">Comisión Completa</p>
                <p class="text-[9px] text-slate-500 leading-normal">Si compra **cualquier producto** (un inflador eléctrico, pienso, o electrónica), Amazon te asigna la comisión de toda la compra.</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i class="lucide-search text-indigo-600 text-base"></i> ¿Qué estás buscando hoy?
          </h3>
          <p class="text-xs text-slate-500 mt-1">Busca cualquier palabra clave y categoría para abrir de inmediato las mejores ofertas de Amazon España con tu tag integrado.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div class="md:col-span-6 space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Término de Búsqueda:</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <i class="lucide-search text-slate-400 text-sm"></i>
              </span>
              <input 
                type="text" 
                id="amazon-query-input" 
                placeholder="Ej. inflador eléctrico, auriculares inalámbricos, robot aspirador..." 
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                onkeydown="if(event.key === 'Enter') executeAmazonSearchPageSearch()"
              >
            </div>
          </div>

          <div class="md:col-span-3 space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Categoría:</label>
            <select 
              id="amazon-category-select"
              class="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all h-[46px]"
            >
              ${categories.map(cat => `
                <option value="${cat.value}">${cat.label}</option>
              `).join('')}
            </select>
          </div>

          <div class="md:col-span-3">
            <button 
              onclick="executeAmazonSearchPageSearch()" 
              class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 h-[46px] cursor-pointer"
            >
              <i class="lucide-external-link text-sm"></i> Buscar Ofertas
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Suggestions Section (Categorized search helpers) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <i class="lucide-zap text-amber-500 text-sm"></i> Sugerencias de Búsqueda Rápida
          </h3>
          <p class="text-xs text-slate-500">
            Haz clic en cualquiera de estas sugerencias para abrir de inmediato las ofertas de esta categoría en Amazon.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${suggestions.map(sug => {
            return `
              <button 
                onclick="loadSearchSuggestion('${sug.text}', '${sug.cat}')" 
                class="p-3 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 rounded-xl transition-all group flex flex-col justify-between gap-3 text-xs cursor-pointer"
              >
                <span class="font-bold text-slate-700 group-hover:text-indigo-800 transition-colors leading-snug">${sug.text}</span>
                <span class="text-[9px] bg-slate-200/60 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider self-start transition-all">${sug.catLabel}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Informational Block: Why this method is safe and works perfectly -->
      <div class="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
        <div class="text-indigo-600 shrink-0 mt-0.5">
          <i class="lucide-shield-check text-2xl"></i>
        </div>
        <div class="space-y-2 text-xs">
          <h4 class="font-bold text-indigo-900">Garantía Oficial de Compra</h4>
          <p class="text-slate-600 leading-relaxed">
            Al realizar tu búsqueda desde RastreaCan, te redirigimos de forma totalmente transparente y segura a la plataforma oficial de Amazon España. 
            Todas tus transacciones contarán con el soporte de pago seguro de Amazon, su política oficial de devoluciones de 30 días y tus ventajas de envío rápido Prime si cuentas con suscripción activa.
          </p>
        </div>
      </div>
    </div>
  `;
}

// --- Home View ---
function renderHomeView() {
  // We can just use the full list of products
  let filtered = [...products];

  // Sort
  if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.valoracion_media - a.valoracion_media);
  } else if (state.sortBy === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return `
    <!-- Hero Banner -->
    <section class="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white mb-8 relative overflow-hidden shadow-lg">
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="relative z-10 max-w-2xl">
        <span class="bg-indigo-500/35 text-indigo-300 text-xs uppercase tracking-widest px-3 py-1 rounded-full font-bold">Guía Comparativa 2026</span>
        <h1 class="text-2xl sm:text-4xl font-bold mt-4 tracking-tight leading-tight">Encuentra el Collar GPS Perfecto para tu Mascota</h1>
        <p class="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Comparamos los 20 mejores rastreadores para perros y gatos. Encuentra el dispositivo ideal para tu mascota y mantenla siempre a salvo de forma inteligente.
        </p>
      </div>
    </section>

    <!-- Amazon Affiliate Search Widget -->
    <section class="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-md mb-8 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-5 space-y-2.5">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <i class="lucide-shopping-bag mr-1.5 text-xs"></i> Buscador de Ofertas y Chollos
          </div>
          <h2 class="text-xl md:text-2xl font-bold tracking-tight">Buscador de Productos en Amazon</h2>
          <p class="text-xs text-slate-300 leading-relaxed max-w-md">
            Encuentra al instante ofertas y mejores precios en tecnología, hogar, deporte, motor, herramientas o mascotas en Amazon España con tu tag de afiliado activo.
          </p>
        </div>

        <div class="lg:col-span-7 w-full">
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="relative flex-grow">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <i class="lucide-search text-slate-400 text-sm"></i>
              </span>
              <input 
                type="text" 
                id="home-amazon-query-input" 
                placeholder="Buscar: inflador eléctrico, tecnología, deporte, hogar, herramientas..." 
                class="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 focus:bg-white/15 transition-all"
                onkeydown="if(event.key === 'Enter') executeHomeAmazonSearch()"
              >
            </div>
            <button 
              onclick="executeHomeAmazonSearch()" 
              class="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              Buscar en Amazon.es
            </button>
          </div>
          <p class="text-[10px] text-slate-400 mt-2.5 flex items-center gap-1">
            <i class="lucide-shield-check text-emerald-400"></i> Accede de forma segura. Tus compras mantendrán las garantías oficiales y condiciones Prime de Amazon España.
          </p>
        </div>
      </div>
    </section>

    <!-- Products Listing Area (Full Width) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="lucide-list-collapse text-indigo-600 text-sm"></i> Catálogo Completo de Collares GPS (${filtered.length} Dispositivos)
        </h3>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400">Ordenar por:</span>
          <select 
            onchange="updateSort(this.value)" 
            class="bg-white border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Mejor Valoración</option>
            <option value="name_asc" ${state.sortBy === 'name_asc' ? 'selected' : ''}>Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Cards Grid (5 filas de 4 productos en desktop para 20 en total) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${filtered.length === 0 ? renderEmptyState() : filtered.map(p => renderAAWPBox(p)).join('')}
      </div>
    </section>
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
          <a href="${getProductLink(p)}" target="_blank" rel="noopener noreferrer" class="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1">
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
            <a href="${getProductLink(p)}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-center rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2">
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

// --- Helper to get specific metrics/specs for products ---
function getProductSpecs(p) {
  let sub = "Sí";
  let subDetail = "Suscripción mensual";
  let battery = "5-7 días";
  let water = "IP67 / Impermeable";
  let weight = "35g";

  switch(p.id) {
    case 0:
      sub = "No";
      subDetail = "Sin cuotas de por vida";
      battery = "Hasta 1 año (Pila)";
      water = "IP68 / Sumergible";
      weight = "30g";
      break;
    case 1:
      sub = "Sí";
      subDetail = "Suscripción obligatoria";
      battery = "5-7 días";
      water = "IPX7 / Impermeable";
      weight = "35g";
      break;
    case 2:
      sub = "Sí";
      subDetail = "Suscripción obligatoria";
      battery = "3 días promedio";
      water = "IP68 / Sumergible";
      weight = "27g";
      break;
    case 3:
      sub = "Sí";
      subDetail = "Suscripción mensual";
      battery = "3 días promedio";
      water = "IP67 / Impermeable";
      weight = "29g";
      break;
    case 4:
      sub = "Sí";
      subDetail = "Suscripción mensual";
      battery = "Hasta 10 días";
      water = "IP68 / Sumergible Premium";
      weight = "40g";
      break;
    case 5:
      sub = "Sí";
      subDetail = "Suscripción mensual";
      battery = "5-7 días";
      water = "Sumergible / Silicona";
      weight = "32g";
      break;
    case 6:
      sub = "No";
      subDetail = "Totalmente libre de cuotas";
      battery = "Hasta 1 año (Pila)";
      water = "Resistente a lluvia";
      weight = "12g";
      break;
    case 7:
      sub = "No";
      subDetail = "Sin cuotas mensuales";
      battery = "4-5 días";
      water = "IP67 / Impermeable";
      weight = "45g";
      break;
    case 8:
      sub = "Sí";
      subDetail = "Plan de datos activo";
      battery = "Unos 5 días";
      water = "IP68 / Sumergible";
      weight = "30g";
      break;
    case 9:
      sub = "No";
      subDetail = "Usa tarjeta SIM prepago propia";
      battery = "4-6 días";
      water = "Resistente a lluvia";
      weight = "28g";
      break;
    case 10:
      sub = "No";
      subDetail = "Sin cuotas (SMS/Prepago)";
      battery = "5-7 días";
      water = "Protección lluvia IP66";
      weight = "25g";
      break;
    case 11:
      sub = "No";
      subDetail = "Sin suscripciones";
      battery = "2-3 días";
      water = "Resistente a salpicaduras";
      weight = "25g";
      break;
    case 12:
      sub = "No";
      subDetail = "Sin cuotas de marca";
      battery = "Hasta 30 días";
      water = "IP66 / Resistente y estanco";
      weight = "80g";
      break;
    case 13:
      sub = "Sí";
      subDetail = "Suscripción obligatoria";
      battery = "4-6 días";
      water = "IP68 / Sumergible 3m";
      weight = "40g";
      break;
    case 14:
      sub = "Sí";
      subDetail = "Suscripción obligatoria";
      battery = "5-7 días";
      water = "IP67 / Impermeable";
      weight = "35g";
      break;
    case 15:
      sub = "No";
      subDetail = "Sin cuotas fijas";
      battery = "5-7 días";
      water = "Resistente a lluvia y polvo";
      weight = "30g";
      break;
    case 16:
      sub = "Sí";
      subDetail = "Suscripción obligatoria";
      battery = "4-5 días";
      water = "Resistente a salpicaduras";
      weight = "30g";
      break;
    case 17:
      sub = "Sí";
      subDetail = "Suscripción mensual";
      battery = "2-3 días";
      water = "IPX7 / Impermeable";
      weight = "25g";
      break;
    case 18:
      sub = "Sí";
      subDetail = "Suscripción activa";
      battery = "2-4 días";
      water = "Impermeable IP67";
      weight = "25g";
      break;
    case 19:
      sub = "No";
      subDetail = "Sin cuotas (SIM propia)";
      battery = "4-6 días";
      water = "Resistente a lluvia y barro";
      weight = "30g";
      break;
  }
  return { sub, subDetail, battery, water, weight };
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
        <div class="hidden md:flex flex-col justify-between bg-slate-50 rounded-xl border border-slate-200/60 p-5 font-bold text-xs text-slate-500 space-y-1">
          <div class="h-44 flex items-center border-b border-slate-200/40">Dispositivo</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Marca</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Uso Recomendado</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Planes / Suscripción</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Autonomía Real</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Grado de Impermeabilidad</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Peso del Dispositivo</div>
          <div class="h-14 flex items-center border-b border-slate-200/40">Valoración Media</div>
          <div class="h-24 flex items-center border-b border-slate-200/40">Ventaja Principal</div>
          <div class="h-24 flex items-center">Acción</div>
        </div>

        <!-- Product Columns -->
        ${selectedProds.map(p => {
          const specs = getProductSpecs(p);
          return `
            <div class="bg-white rounded-xl border border-indigo-600/10 shadow-xs p-6 flex flex-col justify-between hover:border-indigo-600/25 transition-all text-center relative">
              <button onclick="toggleCompare(${p.id})" class="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors" title="Eliminar de la comparación">
                <i class="lucide-x-circle text-lg"></i>
              </button>
              
              <!-- Basic Info Header -->
              <div class="h-44 flex flex-col items-center justify-center border-b border-slate-100 md:border-transparent pb-4 md:pb-0">
                <div class="w-24 h-24 flex items-center justify-center mb-3">
                  <img src="${p.image_url}" alt="${p.name}" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain">
                </div>
                <h3 onclick="navigate('detail', {id: ${p.id}})" class="font-black text-slate-900 text-sm hover:text-indigo-600 cursor-pointer line-clamp-2">${p.name}</h3>
              </div>

              <!-- Brand -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Marca</span>
                <span class="text-xs font-bold text-slate-800">${p.marca}</span>
              </div>

              <!-- Uso Ideal -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Uso Ideal</span>
                <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold font-mono">${p.category}</span>
              </div>

              <!-- Suscripción -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Suscripción</span>
                <span class="text-xs ${specs.sub === 'No' ? 'text-emerald-700 bg-emerald-50 font-bold' : 'text-indigo-700 bg-indigo-50 font-bold'} px-2 py-0.5 rounded">${specs.subDetail}</span>
              </div>

              <!-- Autonomía -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Autonomía</span>
                <span class="text-xs text-slate-700 font-semibold">${specs.battery}</span>
              </div>

              <!-- Resistencia al agua -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Agua</span>
                <span class="text-xs text-slate-700 font-semibold">${specs.water}</span>
              </div>

              <!-- Peso -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Peso</span>
                <span class="text-xs text-slate-700 font-mono">${specs.weight}</span>
              </div>

              <!-- Valoración -->
              <div class="h-14 flex items-center justify-between md:justify-center border-b border-slate-100 px-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase">Valoración</span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs font-bold text-slate-800">${p.valoracion_media}</span>
                  <i class="lucide-star fill-amber-400 text-amber-400 text-[11px] h-3 w-3"></i>
                </div>
              </div>

              <!-- Ventaja Principal -->
              <div class="h-24 flex items-center justify-center border-b border-slate-100 md:border-transparent py-2">
                <span class="md:hidden text-xs text-slate-400 font-bold uppercase mr-2">Pros Clave</span>
                <p class="text-xs text-slate-500 italic max-w-[200px] leading-relaxed line-clamp-3">"${p.pros.split('|')[0]}"</p>
              </div>

              <!-- Action CTA -->
              <div class="h-24 flex flex-col justify-center space-y-1.5 pt-2">
                <button onclick="navigate('detail', {id: ${p.id}})" class="w-full py-1.5 bg-slate-50 border hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors">Ficha Técnica</button>
                <a href="${getProductLink(p)}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-lg shadow-xs flex items-center justify-center gap-1">
                  Ver en Amazon <i class="lucide-external-link text-[10px]"></i>
                </a>
              </div>

            </div>
          `;
        }).join('')}
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

// --- Legal Views ---

// --- legal_aviso view ---
function renderLegalAvisoView() {
  return `
    <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      <!-- Back Link -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <button onclick="navigate('home')" class="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <i class="lucide-arrow-left mr-1.5 text-sm"></i> Volver al Inicio
        </button>
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Documento Legal</span>
      </div>

      <div class="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Aviso Legal y Condiciones de Uso</h1>
        <p class="text-slate-500 italic text-xs">Última actualización: 5 de julio de 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">1. Datos Identificativos (LSSI-CE)</h2>
          <p>
            En cumplimiento de la obligación de información contenida en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan a continuación los siguientes datos del titular de este sitio web:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Titular Responsable:</strong> Miguel Ángel</li>
            <li><strong>Domicilio Social:</strong> Dos Hermanas (Sevilla, España)</li>
            <li><strong>Correo Electrónico de Contacto:</strong> <a href="mailto:bracoraza@gmail.com" class="text-indigo-600 hover:underline">bracoraza@gmail.com</a></li>
            <li><strong>Actividad de la Web:</strong> Divulgación, comparación y análisis de localizadores GPS y collares inteligentes para mascotas.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">2. Condiciones Generales de Uso</h2>
          <p>
            El acceso y uso de este portal atribuye la condición de <strong>USUARIO</strong>, que acepta de manera plena e incondicional, desde dicho acceso y/o uso, las presentes condiciones de uso aquí reflejadas.
          </p>
          <p>
            <strong>RastreaCan</strong> proporciona acceso a multitud de informaciones, comparativas de productos y enlaces de interés pertenecientes al titular o a sus licenciantes. El USUARIO asume la responsabilidad del uso del portal. Esta responsabilidad se extiende al correcto comportamiento técnico de navegación. El portal es de acceso totalmente libre y gratuito, de carácter netamente informativo y consultivo.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">3. Declaración de Afiliación de Amazon (Obligatoria)</h2>
          <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <p class="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">Declaración de Participación de Afiliado</p>
            <p class="text-xs text-amber-800 leading-relaxed font-medium">
              "Como afiliado de Amazon, obtengo ingresos por compras adscritas que cumplen los requisitos aplicables. RastreaCan participa en el Programa de Afiliados de Amazon de la UE, un programa de publicidad para afiliados diseñado para ofrecer a los sitios web un modo de obtener comisiones por publicidad, mediante publicidad y enlaces a Amazon.es."
            </p>
          </div>
          <p>
            Esta web monetiza su actividad recomendando productos de comercio electrónico a través del Programa de Afiliados de Amazon. Esto significa que al hacer clic en los enlaces de compra provistos ("Ver en Amazon"), el usuario es redirigido de forma segura a la plataforma de Amazon España. Si el usuario realiza una compra elegible dentro del plazo correspondiente, Amazon asignará una pequeña comisión a este sitio web sin que ello suponga variación alguna en el importe final abonado por el usuario.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">4. Exclusión de Responsabilidad</h2>
          <p>
            El titular de la web realiza el mayor esfuerzo posible por ofrecer descripciones y fichas técnicas precisas extraídas de la información oficial de los fabricantes. No obstante, no garantiza la total exactitud, exhaustividad ni vigencia de las ofertas, precios o stock en Amazon, los cuales son dinámicos y pueden verse modificados por el vendedor de forma inmediata. Corresponde al usuario verificar en Amazon.es los precios finales antes de realizar cualquier transacción.
          </p>
          <p>
            Asimismo, el titular no asume responsabilidad alguna por los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas de seguridad necesarias para evitarlo.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">5. Propiedad Intelectual e Industrial</h2>
          <p>
            Todos los derechos de Propiedad Intelectual e Industrial de los elementos de este sitio web (incluyendo textos, código de programación, logotipo, imágenes, diseño estructural y base de datos) son titularidad de Miguel Ángel o bien dispone de los derechos oportunos. Queda expresamente prohibida la reproducción, distribución y comunicación pública de la totalidad o parte de los contenidos de esta página web con fines comerciales en cualquier soporte sin la autorización expresa del titular.
          </p>
          <p>
            Los nombres comerciales, logotipos, marcas e imágenes oficiales de productos mostrados de terceros (tales como Tractive, Kippy, Pawfit, Weenect, etc.) son marcas registradas de sus respectivos fabricantes y propietarios, siendo expuestos aquí exclusivamente bajo un fin ilustrativo y de comparación objetiva de productos.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">6. Modificaciones y Vigencia</h2>
          <p>
            El titular se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados. Las presentes condiciones estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">7. Legislación Aplicable y Jurisdicción</h2>
          <p>
            La relación entre el titular y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y Tribunales competentes del domicilio del titular, renunciando a cualquier otro fuero que pudiera corresponderles por ley.
          </p>
        </section>
      </div>
    </div>
  `;
}

// --- legal_privacidad view ---
function renderLegalPrivacidadView() {
  return `
    <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      <!-- Back Link -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <button onclick="navigate('home')" class="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <i class="lucide-arrow-left mr-1.5 text-sm"></i> Volver al Inicio
        </button>
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Documento Legal</span>
      </div>

      <div class="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Política de Privacidad</h1>
        <p class="text-slate-500 italic text-xs">Última actualización: 5 de julio de 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">1. Compromiso de Privacidad y Responsable del Tratamiento</h2>
          <p>
            Nos tomamos muy en serio la seguridad y privacidad de tu navegación. En cumplimiento del Reglamento General de Protección de Datos de la UE (RGPD, Reglamento 2016/679) y de la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD), te informamos de que el responsable del tratamiento de los datos es:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Identidad:</strong> Miguel Ángel</li>
            <li><strong>Domicilio:</strong> Dos Hermanas (Sevilla, España)</li>
            <li><strong>Correo Electrónico:</strong> <a href="mailto:bracoraza@gmail.com" class="text-indigo-600 hover:underline">bracoraza@gmail.com</a></li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">2. Inexistencia de Recopilación de Datos Directos</h2>
          <p>
            Este sitio web ha sido diseñado bajo los principios de <strong>minimización de datos</strong> y <strong>privacidad por diseño</strong>. Queremos que navegues con total tranquilidad:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>No disponemos de registro de usuarios:</strong> No puedes crear una cuenta ni identificarte en nuestra plataforma.</li>
            <li><strong>No recopilamos correos electrónicos:</strong> No hay boletines informativos (newsletters) ni suscripciones comerciales directas.</li>
            <li><strong>No existen comentarios públicos:</strong> No guardamos nombres ni correos asociados a opiniones.</li>
            <li><strong>No hay formularios de contacto:</strong> Evitamos la recogida directa de datos. Si deseas comunicarte con nosotros, debes hacerlo voluntariamente a través de nuestro email de soporte.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">3. Datos de Navegación y Finalidad (Google Analytics)</h2>
          <p>
            Al navegar por RastreaCan, únicamente se recogen datos estadísticos anónimos y de carácter seudónimo para comprender la interacción global de las visitas. Esto se realiza de la siguiente manera:
          </p>
          <p>
            <strong>Google Analytics:</strong> Si otorgas tu consentimiento expreso en el Banner de Cookies, Google Analytics recopilará información técnica de tu navegación (como el tipo de dispositivo, navegador, páginas visitadas dentro de nuestra web, clics salientes e IP). Para garantizar tu máxima privacidad, <strong>hemos configurado Google Analytics para que anonimice automáticamente las direcciones IP</strong> antes de su almacenamiento, de modo que resulta técnicamente inviable asociar los informes estadísticos generales a una persona física identificable.
          </p>
          <p>
            La finalidad de este tratamiento es meramente estadística (conocer las secciones más exitosas, las marcas más comparadas y el rendimiento de la web) para poder perfeccionar el servicio y optimizar la experiencia de usuario.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">4. Legitimación del Tratamiento</h2>
          <p>
            La base legal que legitima el tratamiento de tus datos técnicos de navegación es tu <strong>consentimiento inequívoco</strong> (artículo 6.1.a del RGPD), el cual prestas al aceptar las cookies analíticas en el banner de acceso. Tienes el derecho de revocar este consentimiento en cualquier momento sin efectos retroactivos.
          </p>
          <p>
            Las cookies técnicas estrictamente necesarias para recordar tu consentimiento o dar soporte a las funciones operativas básicas de la interfaz se amparan en el <strong>interés legítimo</strong> del responsable (artículo 6.1.f del RGPD) para poder prestarte el servicio web que estás demandando de forma segura y estable.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">5. Conservación de los Datos y Transferencia Internacional</h2>
          <p>
            Las estadísticas agregadas e informes de Google Analytics se conservan por un periodo máximo de 14 meses antes de ser eliminados. Las cookies de consentimiento locales expiran a los 12 meses.
          </p>
          <p>
            La información analítica puede ser procesada en servidores de Google LLC ubicados en los Estados Unidos. Google garantiza un nivel adecuado de protección mediante la adopción de las Cláusulas Contractuales Tipo (CCT) de la Comisión Europea para salvaguardar la privacidad de las transferencias fuera del Espacio Económico Europeo.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">6. Tus Derechos como Interesado</h2>
          <p>
            A pesar de que no guardamos datos nominativos (nombres o emails), tienes reconocidos legalmente los derechos de <strong>acceso, rectificación, supresión, limitación, oposición y portabilidad</strong> de los datos personales que pudiesen llegar a tratarse (por ejemplo, si nos envías un correo electrónico directamente de consulta, trataremos tu email únicamente para responderte).
          </p>
          <p>
            Para ejercer tus derechos, puedes remitir una comunicación escrita al correo electrónico <a href="mailto:bracoraza@gmail.com" class="text-indigo-600 hover:underline">bracoraza@gmail.com</a>, indicando el derecho que deseas ejercer.
          </p>
          <p>
            Si consideras que tus derechos de protección de datos han sido vulnerados, tienes derecho a presentar una reclamación ante la Autoridad de Control competente: la <strong>Agencia Española de Protección de Datos (AEPD)</strong> a través de su sede electrónica oficial en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline">www.aepd.es</a>.
          </p>
        </section>
      </div>
    </div>
  `;
}

// --- legal_cookies view ---
function renderLegalCookiesView() {
  return `
    <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      <!-- Back Link -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <button onclick="navigate('home')" class="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <i class="lucide-arrow-left mr-1.5 text-sm"></i> Volver al Inicio
        </button>
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Documento Legal</span>
      </div>

      <div class="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Política de Cookies</h1>
        <p class="text-slate-500 italic text-xs">Última actualización: 5 de julio de 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">1. ¿Qué es una Cookie?</h2>
          <p>
            Una cookie es un pequeño fragmento de texto que los sitios web que visitas envían y almacenan de forma segura en tu navegador (ordenador, tablet o smartphone). Las cookies permiten que el sitio recuerde información útil sobre tu visita para agilizar tu navegación y ofrecerte contenidos adaptados. Son esenciales para el funcionamiento de internet y no dañan en absoluto tu dispositivo.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">2. Clasificación de las Cookies que Utilizamos</h2>
          <p>
            De conformidad con la legislación española (LSSI-CE) y las directrices de la Agencia Española de Protección de Datos (AEPD), te detallamos los tres tipos de cookies que interactúan con este portal:
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <strong>Cookies Técnicas / Esenciales (Propias):</strong> Son indispensables para el correcto funcionamiento del comparador de collares GPS. Se utilizan exclusivamente para almacenar tus preferencias de aceptación de cookies y garantizar la seguridad técnica de la web. Están exentas de consentimiento y siempre se encuentran activas.
            </li>
            <li>
              <strong>Cookies de Análisis Estadístico (Terceros - Google Analytics):</strong> Nos ayudan a conocer el volumen de visitas, el porcentaje de rebote, la duración de la navegación y qué modelos de GPS se comparan con mayor frecuencia. Se procesan de forma seudonimizada mediante direcciones IP enmascaradas. Solo se instalan con tu consentimiento previo.
            </li>
            <li>
              <strong>Cookies de Afiliación (Terceros - Amazon España):</strong> Al pulsar en cualquiera de los enlaces de redirección o botones "Ver en Amazon", se activa temporalmente una cookie propia de Amazon.es en tu dispositivo. Esta cookie permite registrar de manera cifrada que provienes de RastreaCan, de modo que si compras el localizador de mascotas u otro artículo de Amazon en las 24 horas siguientes, Amazon atribuye la comisión por publicidad a esta web. Ello ayuda a financiar el soporte y los análisis de nuestro portal. Solo se instalan con tu aceptación de cookies.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">3. Cuadro Detallado de Cookies del Sitio</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600 border border-slate-200 rounded-lg overflow-hidden">
              <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th class="p-3">Nombre</th>
                  <th class="p-3">Proveedor</th>
                  <th class="p-3">Finalidad</th>
                  <th class="p-3">Duración</th>
                  <th class="p-3">Tipo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="p-3 font-mono font-bold text-slate-800">rastreacan_cookies_consent</td>
                  <td class="p-3">RastreaCan (Propia)</td>
                  <td class="p-3">Almacena las preferencias de consentimiento del usuario respecto al banner de cookies.</td>
                  <td class="p-3">12 meses</td>
                  <td class="p-3"><span class="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Esencial</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-slate-800">_ga</td>
                  <td class="p-3">Google LLC (Tercero)</td>
                  <td class="p-3">ID único anónimo para recopilar estadísticas globales agregadas de visitas y comportamiento del portal.</td>
                  <td class="p-3">2 años</td>
                  <td class="p-3"><span class="bg-indigo-100 text-indigo-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Estadística</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-slate-800">_gid</td>
                  <td class="p-3">Google LLC (Tercero)</td>
                  <td class="p-3">Agrupa de forma agregada el comportamiento de un usuario único por sesión de navegación.</td>
                  <td class="p-3">24 horas</td>
                  <td class="p-3"><span class="bg-indigo-100 text-indigo-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Estadística</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-slate-800">session-id / ubid-acbes / etc.</td>
                  <td class="p-3">Amazon.es (Tercero)</td>
                  <td class="p-3">Controlar la sesión de compra y atribuir la comisión de afiliación a este comparador por compras válidas.</td>
                  <td class="p-3">Sesión / 24 Horas</td>
                  <td class="p-3"><span class="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Afiliación</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Dynamic Consent Center: Masterclass feature -->
        <section class="bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-2xl text-center space-y-4">
          <div class="max-w-xl mx-auto space-y-2">
            <h3 class="font-bold text-slate-900 text-base">Panel de Gestión y Revocación de Consentimiento</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Cumpliendo estrictamente con la guía de cookies de la AEPD, te proporcionamos una herramienta directa para revocar tu consentimiento en tiempo real o cambiar tus decisiones. Pulsa el botón inferior para abrir nuevamente el selector inteligente de cookies.
            </p>
          </div>
          <div class="pt-2">
            <button onclick="reopenCookieBanner()" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-md transition-all">
              <i class="lucide-cookie text-sm"></i> Reconfigurar Preferencias de Cookies
            </button>
          </div>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">4. Desactivación desde el Navegador</h2>
          <p>
            Te recordamos que puedes restringir, bloquear o borrar las cookies de este portal (o de cualquier otra web en internet) en cualquier momento modificando las preferencias de tu propio navegador web:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Google Chrome:</strong> Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Ajustes > Privacidad & Seguridad > Cookies y datos del sitio.</li>
            <li><strong>Apple Safari:</strong> Preferencias > Privacidad > Bloquear todas las cookies.</li>
            <li><strong>Microsoft Edge:</strong> Configuración > Cookies y permisos del sitio > Administrar y eliminar cookies.</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

// --- Cookie Consent Banner and Script Blocking Engine ---

function checkAndShowCookieBanner() {
  const consent = localStorage.getItem('rastreacan_cookies_consent');
  if (!consent) {
    showCookieBanner(false);
  } else {
    try {
      const parsed = JSON.parse(consent);
      initializeScriptsBasedOnConsent(parsed);
    } catch (e) {
      showCookieBanner(false);
    }
  }
}

function showCookieBanner(isConfigMode = false) {
  let banner = document.getElementById('cookie-banner-overlay');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'cookie-banner-overlay';
    banner.className = 'fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 bg-slate-900 text-slate-100 shadow-2xl border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 md:px-12';
    document.body.appendChild(banner);
  }

  // Bind handlers
  window.acceptAllCookies = () => {
    const consent = { necessary: true, analytics: true, amazon: true, timestamp: Date.now() };
    localStorage.setItem('rastreacan_cookies_consent', JSON.stringify(consent));
    banner.remove();
    initializeScriptsBasedOnConsent(consent);
  };

  window.rejectAllCookies = () => {
    const consent = { necessary: true, analytics: false, amazon: false, timestamp: Date.now() };
    localStorage.setItem('rastreacan_cookies_consent', JSON.stringify(consent));
    banner.remove();
    initializeScriptsBasedOnConsent(consent);
  };

  window.showCookieSettings = () => {
    showCookieBanner(true);
  };

  window.saveCookieSettings = () => {
    const analyticsChecked = document.getElementById('cookie-opt-analytics').checked;
    const amazonChecked = document.getElementById('cookie-opt-amazon').checked;
    const consent = {
      necessary: true,
      analytics: analyticsChecked,
      amazon: amazonChecked,
      timestamp: Date.now()
    };
    localStorage.setItem('rastreacan_cookies_consent', JSON.stringify(consent));
    banner.remove();
    initializeScriptsBasedOnConsent(consent);
  };

  if (!isConfigMode) {
    banner.className = 'fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 bg-slate-900 text-slate-100 shadow-2xl border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 md:px-12';
    banner.innerHTML = `
      <div class="max-w-4xl text-left space-y-2">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="lucide-cookie text-indigo-400"></i> Control de Privacidad y Cookies
        </h4>
        <p class="text-xs text-slate-300 leading-relaxed">
          Utilizamos cookies propias y de terceros para garantizar el correcto funcionamiento del comparador de collares GPS, medir el rendimiento y estadísticas del sitio (Google Analytics), y posibilitar la atribución del programa de afiliados de Amazon si decides adquirir algún producto. Para cumplir con la legislación española (LSSI-CE y RGPD), necesitamos tu consentimiento antes de activar cookies no esenciales.
        </p>
        <p class="text-[11px] text-slate-400">
          Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias detalladamente. Consulta nuestra 
          <a href="#" onclick="navigate('legal_cookies'); return false;" class="text-indigo-400 hover:underline font-bold">Política de Cookies</a> para más información.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end">
        <button onclick="showCookieSettings()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all border border-slate-700">Configurar</button>
        <button onclick="rejectAllCookies()" class="px-4 py-2 bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 text-xs font-bold rounded-lg transition-all border border-slate-700 hover:border-rose-900">Rechazar</button>
        <button onclick="acceptAllCookies()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all">Aceptar Todas</button>
      </div>
    `;
  } else {
    // Configuration Mode
    let currentConsent = { analytics: false, amazon: false };
    try {
      const saved = localStorage.getItem('rastreacan_cookies_consent');
      if (saved) currentConsent = JSON.parse(saved);
    } catch(e){}

    banner.className = 'fixed inset-x-0 bottom-0 z-50 p-6 bg-slate-900 text-slate-100 shadow-2xl border-t border-slate-800 flex flex-col gap-6 transition-all duration-300 max-w-5xl mx-auto md:rounded-t-2xl md:border-x';
    banner.innerHTML = `
      <div class="flex justify-between items-center pb-3 border-b border-slate-800">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="lucide-sliders-horizontal text-indigo-400"></i> Configuración de Preferencias de Cookies
        </h4>
        <button onclick="showCookieBanner(false)" class="text-xs text-slate-400 hover:text-white transition-colors">Volver</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <!-- Necesarias -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-xs font-bold text-white">1. Técnicas (Necesarias)</h5>
              <span class="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Obligatorio</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Esenciales para permitir la navegación, recordar tus preferencias de cookies, y almacenar el estado del comparador. No recopilan información de identificación personal y no se pueden desactivar.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-500">
            <span>Estado: Siempre activo</span>
            <input type="checkbox" checked disabled class="accent-indigo-500 rounded h-4 w-4 cursor-not-allowed">
          </div>
        </div>

        <!-- Analíticas -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-xs font-bold text-white">2. Estadísticas (Google Analytics)</h5>
              <span class="text-[9px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Opcional</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Nos ayuda a entender cómo interactúan los visitantes con el comparador (páginas vistas, modelos de GPS más comparados, etc.) de forma completamente anónima. Nos permite mejorar continuamente la interfaz de usuario.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-400">
            <span>¿Permitir analíticas?</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="cookie-opt-analytics" type="checkbox" ${currentConsent.analytics ? 'checked' : ''} class="sr-only peer">
              <div class="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
            </label>
          </div>
        </div>

        <!-- Afiliación -->
        <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h5 class="text-xs font-bold text-white">3. Afiliación de Amazon</h5>
              <span class="text-[9px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Opcional</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Permite registrar el identificador de afiliado temporalmente (24 horas) en Amazon cuando haces clic en el botón "Ver en Amazon". Sin esta cookie, Amazon no nos puede asociar las comisiones de afiliación por tu compra.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-400">
            <span>¿Permitir cookies de afiliación?</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="cookie-opt-amazon" type="checkbox" ${currentConsent.amazon ? 'checked' : ''} class="sr-only peer">
              <div class="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <p class="text-[10px] text-slate-500 max-w-xl text-center sm:text-left">
          Al pulsar "Guardar selección" se aplicará el consentimiento únicamente a los tipos de cookies marcados. Tu consentimiento se almacenará localmente por un periodo máximo de 12 meses.
        </p>
        <div class="flex gap-2 w-full sm:w-auto justify-end">
          <button onclick="acceptAllCookies()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-all border border-slate-700">Aceptar Todas</button>
          <button onclick="saveCookieSettings()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-sm transition-all">Guardar Selección</button>
        </div>
      </div>
    `;
  }
}

function initializeScriptsBasedOnConsent(consent) {
  const GA_ID = 'G-L2XF3E5Z9Y';
  
  if (consent && consent.analytics) {
    window[`ga-disable-${GA_ID}`] = false;
    
    if (!document.getElementById('google-analytics-script')) {
      const scriptTag = document.createElement('script');
      scriptTag.id = 'google-analytics-script';
      scriptTag.async = true;
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(scriptTag);
      
      const inlineScript = document.createElement('script');
      inlineScript.id = 'google-analytics-inline';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { 'anonymize_ip': true });
        console.log('Google Analytics (anónimo) inicializado responsablemente tras consentimiento RGPD.');
      `;
      document.head.appendChild(inlineScript);
    }
  } else {
    window[`ga-disable-${GA_ID}`] = true;
    console.log('Google Analytics desactivado según preferencias de privacidad del usuario (Opt-out activo).');
    
    const script = document.getElementById('google-analytics-script');
    if (script) script.remove();
    const inline = document.getElementById('google-analytics-inline');
    if (inline) inline.remove();
  }
}

window.reopenCookieBanner = function() {
  showCookieBanner(false);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

// Start App when loaded
window.addEventListener('DOMContentLoaded', init);
init();

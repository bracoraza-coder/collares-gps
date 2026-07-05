export const products = [
  {
    id: "tractive-gps-dog",
    brand: "Tractive",
    name: "GPS Dog 4",
    suitableFor: ["dog"],
    initialPrice: 49,
    requiresSubscription: true,
    subscriptionPrice: "Desde 4,17€/mes (Plan Bienal)",
    batteryLife: "5 a 10 días",
    weight: 35,
    connectivity: "GPS, LTE/4G, Bluetooth, Wifi",
    rating: 4.6,
    score: 9.6,
    description: "Tractive es el estándar de oro en collares GPS para perros. Te ofrece un rastreo inmediato en tu móvil con cobertura en decenas de países, avisándote al instante si tu perro sale del jardín.",
    pros: [
      "Rastreo en directo (LIVE) cada 2-3 segundos",
      "Vallas virtuales con alarma inmediata al salir de casa",
      "Historial de ubicaciones de hasta 365 días",
      "Seguimiento de actividad y sueño incorporado"
    ],
    cons: [
      "No funciona sin plan de suscripción obligatorio",
      "Soporte de goma algo endeble para perros muy traviesos"
    ],
    amazonLink: "https://www.amazon.es/dp/B08M9DQLH9",
    fullReview: "El Tractive GPS Dog 4 es sin duda el mejor rastreador calidad-precio del mercado español. Su sistema de satélite es sumamente preciso y la aplicación móvil es muy interactiva y madura. Destacamos especialmente las zonas de ahorro de energía wifi, que apagan el GPS celular mientras el perro esté dentro de casa para prolongar la batería hasta un máximo de 10 días."
  },
  {
    id: "tractive-gps-cat",
    brand: "Tractive",
    name: "GPS Cat Mini",
    suitableFor: ["cat"],
    initialPrice: 49,
    requiresSubscription: true,
    subscriptionPrice: "Desde 4,17€/mes (Plan Bienal)",
    batteryLife: "2 a 5 días",
    weight: 25,
    connectivity: "GPS, LTE/4G, Bluetooth, Wifi",
    rating: 4.4,
    score: 9.3,
    description: "La versión mini de Tractive pensada especialmente para la anatomía del gato. Incluye collar de seguridad Rogz con hebilla de liberación rápida regulable según el peso.",
    pros: [
      "Súper ligero: solo pesa 25 gramos",
      "Collar de seguridad anti-enganches Rogz incluido",
      "Permite rastrear el territorio que recorre tu gato"
    ],
    cons: [
      "La duración de la batería es más ajustada (3 días de media)",
      "Un poco voluminoso para gatos menores de 3,5 kg"
    ],
    amazonLink: "https://www.amazon.es/dp/B0B5T6XFQC",
    fullReview: "Adaptar un GPS para gatos siempre es un reto técnico, pero Tractive lo ha conseguido reducir a solo 25g. Lo mejor es que incluye el collar Rogz, el cual se abre inmediatamente bajo presión, salvándole la vida a tu gato si se queda enganchado saltando una verja o en un árbol."
  },
  {
    id: "kippy-evo",
    brand: "Kippy",
    name: "EVO Localizador",
    suitableFor: ["dog", "cat"],
    initialPrice: 39,
    requiresSubscription: true,
    subscriptionPrice: "Desde 3,33€/mes (Plan Bienal)",
    batteryLife: "7 a 15 días",
    weight: 38,
    connectivity: "GPS, GSM, Bluetooth, Wifi",
    rating: 4.3,
    score: 8.9,
    description: "Kippy EVO une la localización GPS ultraprecisa con un sofisticado monitor de salud. Te avisa si tu perro se rasca en exceso, corre menos de lo habitual o tiene pautas de sueño alteradas.",
    pros: [
      "Algoritmos de salud y bienestar de mascotas avanzados",
      "Linterna integrada que puedes encender desde el móvil",
      "Suscripciones mensuales muy asequibles"
    ],
    cons: [
      "Su tamaño es excesivo para gatos pequeños",
      "El cargador de pines propietario puede ser incómodo"
    ],
    amazonLink: "https://www.amazon.es/dp/B07R49969Y",
    fullReview: "Kippy EVO destaca por encima de sus competidores si te interesa la salud diaria de tu mascota. Su panel de control monitoriza actividades como juego, sueño, carreras y calorías consumidas de una forma muy precisa. Es ideal para perros medianos y grandes que duermen en el jardín."
  },
  {
    id: "weenect-dog",
    brand: "Weenect",
    name: "XS Dog Tracker",
    suitableFor: ["dog"],
    initialPrice: 49,
    requiresSubscription: true,
    subscriptionPrice: "Desde 4,16€/mes (Plan Familiar)",
    batteryLife: "3 a 7 días",
    weight: 27,
    connectivity: "GPS, LTE-M/NB-IoT, Bluetooth",
    rating: 4.2,
    score: 8.8,
    description: "El localizador GPS para perros más pequeño del mundo con tarjeta SIM multired de cobertura total que conmuta automáticamente entre operadores para evitar zonas muertas.",
    pros: [
      "Ultra compacto y ergonómico",
      "Función de vibración y pitido ideal para adiestramiento de llamada",
      "Tarjeta SIM multioperador integrada"
    ],
    cons: [
      "La batería disminuye rápido en zonas boscosas sin wifi",
      "Funda de silicona se desgasta con los meses"
    ],
    amazonLink: "https://www.amazon.es/dp/B08YRPWDXW",
    fullReview: "Weenect XS utiliza las modernas redes móviles NB-IoT (Internet de las cosas), lo que le permite consumir menos energía buscando señal en entornos remotos. Su timbre y zumbador interno son geniales para entrenar al perro a que regrese a por su comida cuando oiga vibrar el collar."
  },
  {
    id: "lapa-no-sub",
    brand: "Lapa",
    name: "Localizador Sin Abono",
    suitableFor: ["dog", "cat"],
    initialPrice: 119,
    requiresSubscription: false,
    subscriptionPrice: "0€/mes (Gratis de por vida)",
    batteryLife: "2 a 3 días",
    weight: 42,
    connectivity: "Radiofrecuencia (LORA), GPS Local",
    rating: 4.1,
    score: 8.5,
    description: "Un localizador premium que no requiere ninguna cuota ni pago de suscripción recurrente. Funciona mediante un módulo transmisor conectado a tu smartphone que rastrea la señal.",
    pros: [
      "Sin cuotas mensuales ni gastos ocultos",
      "Ideal para zonas de montaña sin cobertura celular",
      "Instalación instantánea sin registrar tarjetas SIM"
    ],
    cons: [
      "El alcance máximo real es de 2 km en campo abierto",
      "El dispositivo es algo más pesado y voluminoso"
    ],
    amazonLink: "https://www.amazon.es/dp/B09D8H7V2K",
    fullReview: "La alternativa perfecta para cazadores o senderistas que pasean con su perro por zonas de montaña profunda donde la cobertura celular tradicional es nula. Al usar ondas de radio de largo alcance, el emisor se comunica directamente con tu smartphone sin depender de Orange, Movistar o Vodafone."
  }
];

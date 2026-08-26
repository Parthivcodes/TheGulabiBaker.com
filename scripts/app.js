/* ==========================================================================
   THE GULABI BAKER — LUXURY INTERACTIVE JAVASCRIPT & BACKEND CLIENT ENGINE
   Location: Glen Eden, Auckland, New Zealand
   ========================================================================== */

const API_BASE_URL = 'http://localhost:5000/api';

// --- OFFICIAL MENU CATALOGUE WITH REAL PHOTOS, SIZES & NZD PRICING ---
let PRODUCTS = {
  'item-gulab-cake': {
    id: 'item-gulab-cake',
    dbId: 40,
    name: 'Gulab Jamun Cake',
    shortDesc: 'A magnificent centerpiece layered with cardamom sponge, rosewater syrup, slow-simmered mawa cream, and whole golden gulab jamuns.',
    category: 'cakes',
    price: 70.00,
    sizes: {
      '5 inch': 70.00,
      '6 inch': 85.00,
      '7 inch': 110.00,
      '9 inch': 160.00,
      '11/12 inch': 220.00
    },
    serves: 'Available in 5", 6", 7", 9", and 11/12" Sizes',
    image: 'assets/images/card_hero_gulab_jamun_3tier.jpg',
    diets: ['eggless', 'signature'],
    tag: 'SIGNATURE SHOWPIECE ⭐',
    sensory: { floral: 80, sweetness: 65, richness: 90 },
    pairing: "Chef's Pairing: Darjeeling First Flush or Espresso.",
    notes: ['Mawa Cream', 'Rosewater Syrup', 'Whole Gulab Jamuns', '24k Gold']
  },
  'item-kesar-pista-cake': {
    id: 'item-kesar-pista-cake',
    dbId: 41,
    name: 'Kesar Pista Cake',
    shortDesc: 'Saffron-infused hung curd cream mousse, golden saffron streaks, toasted Iranian pistachios, and aromatic cardamom chiffon sponge.',
    category: 'cakes',
    price: 80.00,
    sizes: {
      '5 inch': 80.00,
      '6 inch': 100.00,
      '7 inch': 120.00,
      '9 inch': 170.00,
      '11/12 inch': 240.00
    },
    serves: 'Available in 5", 6", 7", 9", and 11/12" Sizes',
    image: 'assets/images/card_kesar_pista_cake.jpg',
    diets: ['eggless', 'signature'],
    tag: 'ROYAL SAFFRON & PISTACHIO',
    sensory: { floral: 70, sweetness: 50, richness: 85 },
    pairing: "Chef's Pairing: Single-Estate Assam Golden Tips or Jasmine Tisane.",
    notes: ['Kesar Saffron', 'Pistachio Flakes', 'Pure NZ Butter']
  },
  'item-biscoff-cake': {
    id: 'item-biscoff-cake',
    dbId: 47,
    name: 'Biscoff Fresh Cream Cake',
    shortDesc: 'Layers of light vanilla sponge, Lotus Biscoff spread drip, caramelized speculoos cookie crunch, and whipped New Zealand fresh cream.',
    category: 'cakes',
    price: 70.00,
    sizes: {
      '5 inch': 70.00,
      '6 inch': 85.00,
      '7 inch': 110.00,
      '9 inch': 160.00,
      '11/12 inch': 220.00
    },
    serves: 'Available in 5", 6", 7", 9", and 11/12" Sizes',
    image: 'assets/images/card_biscoff_fresh_cream_cake.jpg',
    diets: ['eggless', 'signature'],
    tag: 'LOTUS CARAMEL CRUNCH',
    sensory: { floral: 30, sweetness: 70, richness: 88 },
    pairing: "Chef's Pairing: Double Espresso or Flat White.",
    notes: ['Lotus Biscoff', 'Speculoos Crumbs', 'Fresh Cream Swirls']
  },
  'item-chai-cake': {
    id: 'item-chai-cake',
    dbId: 42,
    name: 'Masala Chai Cake',
    shortDesc: 'Infused with freshly crushed ginger, cinnamon, green cardamom, and rich Assam tea steeped in pure New Zealand dairy with Parle-G biscuits.',
    category: 'cakes',
    price: 65.00,
    sizes: {
      '5 inch': 65.00,
      '6 inch': 80.00,
      '7 inch': 100.00,
      '9 inch': 145.00,
      '11/12 inch': 200.00
    },
    serves: 'Available in 5", 6", 7", 9", and 11/12" Sizes',
    image: 'assets/images/card_masala_chai_cake.jpg',
    diets: ['eggless'],
    tag: 'SPICED CHAI & PARLE-G',
    sensory: { floral: 40, sweetness: 50, richness: 75 },
    pairing: "Chef's Pairing: Steaming Masala Chai or Hot Americano.",
    notes: ['Assam Black Tea', 'Parle-G Biscuits', 'Crushed Spices']
  },
  'item-rasmalai-cake': {
    id: 'item-rasmalai-cake',
    dbId: 39,
    name: 'Rasmalai Cake',
    shortDesc: 'Cardamom-infused soft sponge layered with saffron rabdi cream, authentic soft rasmalai dumplings, pistachio flakes, and pure NZ butter.',
    category: 'cakes',
    price: 75.00,
    sizes: {
      '5 inch': 75.00,
      '6 inch': 95.00,
      '7 inch': 115.00,
      '9 inch': 165.00,
      '11/12 inch': 230.00
    },
    serves: 'Available in 5", 6", 7", 9", and 11/12" Sizes',
    image: 'assets/images/card_rasmalai_cake_real.jpg',
    diets: ['eggless', 'signature'],
    tag: 'BEST SELLER ⭐',
    sensory: { floral: 85, sweetness: 45, richness: 88 },
    pairing: "Chef's Pairing: Kashmiri Kahwa or NZ Single-Origin Flat White.",
    notes: ['Kesar Rabdi', 'Green Cardamom', 'Soft Rasmalai', 'Pure NZ Butter']
  },
  'item-gulab-cupcake': {
    id: 'item-gulab-cupcake',
    dbId: 44,
    name: 'Gulab Jamun Cupcake ⭐',
    shortDesc: 'Handcrafted vanilla crumb crowned with authentic soft gulab jamun, rosewater mawa buttercream, pistachio dust, and 24k gold leaf.',
    category: 'cupcakes',
    price: 6.99,
    serves: 'Standard Handcrafted Cupcake',
    image: 'assets/images/card_gulab_jamun_cupcakes.jpg',
    diets: ['eggless', 'signature'],
    tag: 'BEST SELLER ⭐',
    sensory: { floral: 85, sweetness: 65, richness: 80 },
    pairing: "Chef's Pairing: French Roast Arabica or Rosé Tisane.",
    notes: ['Soft Gulab Jamun', 'Rosewater Mawa', '24k Gold']
  },
  'item-rasmalai-cupcake': {
    id: 'item-rasmalai-cupcake',
    dbId: 43,
    name: 'Rasmalai Cupcake ⭐',
    shortDesc: 'Cardamom sponge soaked in saffron milk, topped with whipped rabdi cream, soft rasmalai crumble, and toasted pistachios.',
    category: 'cupcakes',
    price: 6.99,
    serves: 'Standard Handcrafted Cupcake',
    image: 'assets/images/ispahan_macarons.jpg',
    diets: ['eggless', 'signature'],
    tag: 'BEST SELLER ⭐',
    sensory: { floral: 80, sweetness: 55, richness: 70 },
    pairing: "Chef's Pairing: Earl Grey Supreme or Cold Milk Tea.",
    notes: ['Saffron Rabdi', 'Rasmalai Crumble', 'Pistachio Flakes']
  },
  'item-shrikhand-cupcake': {
    id: 'item-shrikhand-cupcake',
    dbId: 45,
    name: 'Kesar Pista Shrikhand Cupcake',
    shortDesc: 'Cardamom sponge topped with saffron-infused hung curd mousse and roasted Iranian pistachios.',
    category: 'cupcakes',
    price: 7.50,
    serves: 'Standard Handcrafted Cupcake',
    image: 'assets/images/chocolate_rose_dome.jpg',
    diets: ['eggless', 'signature'],
    tag: 'ROYAL FUSION',
    sensory: { floral: 75, sweetness: 50, richness: 82 },
    pairing: "Chef's Pairing: Green Tea or Chai Latte.",
    notes: ['Kesar Shrikhand', 'Pista Crunch', 'Vanilla Bean']
  },
  'item-chai-cupcake': {
    id: 'item-chai-cupcake',
    dbId: 46,
    name: 'Masala Chai Cupcake',
    shortDesc: 'Spiced chai-infused sponge paired with ginger-cardamom buttercream and spiced biscuit crumble.',
    category: 'cupcakes',
    price: 5.99,
    serves: 'Standard Handcrafted Cupcake',
    image: 'assets/images/masala_chai_cake.jpg',
    diets: ['eggless'],
    tag: 'SPICE CRUMB',
    sensory: { floral: 35, sweetness: 50, richness: 70 },
    pairing: "Chef's Pairing: Freshly Brewed Coffee or Hot Milk.",
    notes: ['Chai Spice', 'Ginger Buttercream', 'Crushed Cinnamon']
  }
};

// --- STATE MANAGEMENT ---
let cart = [];
let currentUser = null;
let currentToken = null;
let activeCategory = 'all';
let activeDietFilters = new Set();
let selectedCity = 'Glen Eden';

// --- MODAL STATE ---
let activeModalProduct = null;
let activeModalSelectedSize = '5 inch';
let activeModalSelectedPrice = 75.00;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  loadCartFromStorage();
  initNavbarScroll();
  initCategoryFilters();
  initDietaryFilters();
  initBespokeCustomizer();
  initLiveCountdown();
  initAmbientSound();
  initCardTilt();
  initAuthUI();
  await checkAuthSession();
  await fetchProductsFromBackend();
  renderCart();
});

// --- BACKEND PRODUCT SYNC ---
async function fetchProductsFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.products && data.products.length > 0) {
      data.products.forEach(dbProd => {
        const matchingKey = Object.keys(PRODUCTS).find(k => 
          PRODUCTS[k].name.toLowerCase().includes(dbProd.name.toLowerCase().split(' ')[0]) ||
          dbProd.name.toLowerCase().includes(PRODUCTS[k].name.toLowerCase().split(' ')[0])
        );
        if (matchingKey) {
          PRODUCTS[matchingKey].dbId = dbProd.id;
        }
      });
      console.log('✓ Products synchronized with PostgreSQL database.');
    }
  } catch (err) {
    console.log('Using local high-performance catalogue data.');
  }
}

// --- AUTHENTICATION & USER MANAGEMENT ---
function initAuthUI() {
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', openAuthModal);
  }
}

async function checkAuthSession() {
  try {
    const savedToken = localStorage.getItem('gulabi_jwt_token');
    if (!savedToken) return;

    currentToken = savedToken;
    const res = await fetch(`${API_BASE_URL}/customers/me`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });

    if (res.ok) {
      const data = await res.json();
      currentUser = data.customer;
      updateAuthUI(true);
    } else {
      localStorage.removeItem('gulabi_jwt_token');
      currentToken = null;
      currentUser = null;
      updateAuthUI(false);
    }
  } catch (e) {
    console.warn('Session verification skipped.');
  }
}

function updateAuthUI(isLoggedIn) {
  const label = document.getElementById('authBtnLabel');
  const guestView = document.getElementById('authGuestView');
  const memberView = document.getElementById('authMemberView');

  if (isLoggedIn && currentUser) {
    const firstName = currentUser.name.split(' ')[0];
    if (label) label.textContent = `✦ ${firstName}`;
    if (guestView) guestView.style.display = 'none';
    if (memberView) memberView.style.display = 'block';

    const nameDisp = document.getElementById('memberNameDisplay');
    const emailDisp = document.getElementById('memberEmailDisplay');
    if (nameDisp) nameDisp.textContent = currentUser.name;
    if (emailDisp) emailDisp.textContent = currentUser.email;

    loadMemberOrders();
  } else {
    if (label) label.textContent = 'Atelier Club';
    if (guestView) guestView.style.display = 'block';
    if (memberView) memberView.style.display = 'none';
  }
}

function openAuthModal() {
  const backdrop = document.getElementById('authModalBackdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const backdrop = document.getElementById('authModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function switchAuthTab(tab) {
  const tabSign = document.getElementById('tabSignIn');
  const tabReg = document.getElementById('tabSignUp');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const title = document.getElementById('authModalTitle');

  if (tab === 'login') {
    tabSign.classList.add('active');
    tabReg.classList.remove('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    if (title) title.innerHTML = 'Welcome to <em>The Atelier</em>';
  } else {
    tabReg.classList.add('active');
    tabSign.classList.remove('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    if (title) title.innerHTML = 'Create Your <em>Atelier Profile</em>';
  }
}

async function handleCustomerLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginSubmitBtn');

  if (!email || !password) return;

  try {
    if (btn) btn.innerHTML = '<span>Verifying Credentials...</span>';
    const res = await fetch(`${API_BASE_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Invalid credentials.');
      return;
    }

    currentToken = data.token;
    currentUser = data.customer;
    localStorage.setItem('gulabi_jwt_token', currentToken);
    updateAuthUI(true);
    showToast(`✨ Welcome back, ${currentUser.name}!`);
    closeAuthModal();
  } catch (err) {
    showToast('Network error connecting to Atelier server.');
  } finally {
    if (btn) btn.innerHTML = '<span>Sign In to Atelier</span>';
  }
}

async function handleCustomerSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const phone = document.getElementById('signupPhone').value.trim();
  const address = document.getElementById('signupAddress').value.trim();
  const btn = document.getElementById('signupSubmitBtn');

  if (!name || !email || !password) return;

  try {
    if (btn) btn.innerHTML = '<span>Creating Membership...</span>';
    const res = await fetch(`${API_BASE_URL}/customers/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to create membership.');
      return;
    }

    currentToken = data.token;
    currentUser = data.customer;
    localStorage.setItem('gulabi_jwt_token', currentToken);
    updateAuthUI(true);
    showToast(`✨ Welcome to The Atelier Club, ${currentUser.name}!`);
    closeAuthModal();
  } catch (err) {
    showToast('Network error connecting to Atelier server.');
  } finally {
    if (btn) btn.innerHTML = '<span>Create Atelier Membership</span>';
  }
}

function handleCustomerLogout() {
  localStorage.removeItem('gulabi_jwt_token');
  currentToken = null;
  currentUser = null;
  updateAuthUI(false);
  showToast('You have signed out of The Atelier Club.');
  closeAuthModal();
}

async function loadMemberOrders() {
  const container = document.getElementById('memberOrdersList');
  if (!container || !currentToken) return;

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) throw new Error();
    const data = await res.json();

    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">No previous orders yet. Your bespoke orders will appear here.</div>`;
      return;
    }

    container.innerHTML = data.orders.map(o => `
      <div style="background: white; border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; border: var(--border-fine); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 0.82rem; color: var(--burgundy-dark);">Order #${o.id} • $${parseFloat(o.total_amount).toFixed(2)}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${new Date(o.created_at).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: var(--radius-pill); background: rgba(197, 160, 89, 0.2); color: var(--burgundy-dark);">
          ${o.status}
        </span>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">Unable to load orders at this moment.</div>`;
  }
}

// --- NAVBAR SCROLL EFFECT ---
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }
}

// --- CATEGORY FILTERING ---
function initCategoryFilters() {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.id === 'tabSignIn' || pill.id === 'tabSignUp') return;
      pills.forEach(p => {
        if (p.id !== 'tabSignIn' && p.id !== 'tabSignUp') p.classList.remove('active');
      });
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      applyFilters();
    });
  });
}

// --- DIETARY FILTERING ---
function initDietaryFilters() {
  const dietBtns = document.querySelectorAll('.diet-tag-btn');
  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diet = btn.dataset.diet;
      if (activeDietFilters.has(diet)) {
        activeDietFilters.delete(diet);
        btn.classList.remove('active');
      } else {
        activeDietFilters.add(diet);
        btn.classList.add('active');
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  const cards = document.querySelectorAll('.bento-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = card.dataset.category;
    const cardDiets = (card.dataset.diets || '').split(' ');

    const categoryMatches = (activeCategory === 'all' || cardCategory === activeCategory);
    
    let dietMatches = true;
    activeDietFilters.forEach(diet => {
      if (!cardDiets.includes(diet)) {
        dietMatches = false;
      }
    });

    if (categoryMatches && dietMatches) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      visibleCount++;
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });

  const counterEl = document.getElementById('resultsCounter');
  if (counterEl) {
    counterEl.textContent = `Showing ${visibleCount} Haute Creation${visibleCount === 1 ? '' : 's'}`;
  }
}

// --- 3D INTERACTIVE TILT EFFECT FOR BENTO CARDS ---
function initCardTilt() {
  const cards = document.querySelectorAll('.bento-card');
  if (window.innerWidth < 992) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// --- LIVE OVEN BATCH COUNTDOWN ---
function initLiveCountdown() {
  let secondsRemaining = 6138;

  const timerEl = document.getElementById('liveCountdown');
  if (!timerEl) return;

  setInterval(() => {
    if (secondsRemaining > 0) {
      secondsRemaining--;
    } else {
      secondsRemaining = 7200;
    }

    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;

    const pad = (n) => String(n).padStart(2, '0');
    timerEl.textContent = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
  }, 1000);
}

// --- BESPOKE CAKE ATELIER CUSTOMIZER ---
function initBespokeCustomizer() {
  const pricingMatrix = {
    'gulab-jamun': { '5-inch': 70, '6-inch': 85, '7-inch': 110, '9-inch': 160, '12-inch': 220 },
    'rasmalai': { '5-inch': 75, '6-inch': 95, '7-inch': 115, '9-inch': 165, '12-inch': 230 },
    'shrikhand': { '5-inch': 80, '6-inch': 100, '7-inch': 120, '9-inch': 170, '12-inch': 240 },
    'biscoff': { '5-inch': 70, '6-inch': 85, '7-inch': 110, '9-inch': 160, '12-inch': 220 },
    'masala-chai': { '5-inch': 65, '6-inch': 80, '7-inch': 100, '9-inch': 145, '12-inch': 200 }
  };

  let currentBespoke = {
    size: '5-inch',
    sizeName: '5 Inch ($70)',
    serves: '4 - 6 Guests',
    price: 70,
    flavor: 'gulab-jamun',
    flavorName: 'Gulab Jamun Cake (Mawa & Rose)',
    finish: 'gold-leaf',
    finishName: '24k Edible Gold Leaf & Rose Petals'
  };

  const tierBtns = document.querySelectorAll('#tierSelector .option-btn');
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentBespoke.size = btn.dataset.tier;
      currentBespoke.sizeName = btn.textContent;
      currentBespoke.serves = btn.dataset.serves;
      calculatePrice();
    });
  });

  const flavorBtns = document.querySelectorAll('#flavorSelector .option-btn');
  flavorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flavorBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentBespoke.flavor = btn.dataset.flavor;
      currentBespoke.flavorName = btn.dataset.flavorName;
      calculatePrice();
    });
  });

  const finishBtns = document.querySelectorAll('#finishSelector .option-btn');
  finishBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      finishBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentBespoke.finish = btn.dataset.finish;
      currentBespoke.finishName = btn.dataset.finishName;
      updateBespokeSummary();
    });
  });

  function calculatePrice() {
    const flavorPrices = pricingMatrix[currentBespoke.flavor] || pricingMatrix['gulab-jamun'];
    currentBespoke.price = flavorPrices[currentBespoke.size] || 70;
    updateBespokeSummary();
  }

  function updateBespokeSummary() {
    const specTier = document.getElementById('specTier');
    const specServes = document.getElementById('specServes');
    const specFlavor = document.getElementById('specFlavor');
    const specFinish = document.getElementById('specFinish');
    const estPrice = document.getElementById('bespokeEstimatePrice');
    const titlePreview = document.getElementById('bespokeTitlePreview');

    if (specTier) specTier.textContent = `${currentBespoke.size.replace('-', ' ')} ($${currentBespoke.price})`;
    if (specServes) specServes.textContent = currentBespoke.serves;
    if (specFlavor) specFlavor.textContent = currentBespoke.flavorName;
    if (specFinish) specFinish.textContent = currentBespoke.finishName;
    if (estPrice) estPrice.textContent = `$${currentBespoke.price}`;
    if (titlePreview) titlePreview.textContent = `${currentBespoke.size.replace('-', ' ')} ${currentBespoke.flavorName.split('(')[0].trim()}`;
  }

  const bookBtn = document.getElementById('bookBespokeBtn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const summaryEl = document.getElementById('bespokeInquirySummary');
      const priceEl = document.getElementById('bespokeInquiryPrice');
      if (summaryEl) summaryEl.textContent = `${currentBespoke.size.replace('-', ' ')} • ${currentBespoke.flavorName} • ${currentBespoke.finishName}`;
      if (priceEl) priceEl.textContent = `$${currentBespoke.price}`;

      const modalBackdrop = document.getElementById('bespokeModalBackdrop');
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  }

  const heroAdd = document.getElementById('heroQuickAdd');
  if (heroAdd) {
    heroAdd.addEventListener('click', () => addToBag('item-gulab-cake', '11/12 inch', 220));
  }
}

// --- BAG / CART DRAWER LOGIC ---
const bagBtn = document.getElementById('bagBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');

if (bagBtn) bagBtn.addEventListener('click', openBagDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeBagDrawer);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeBagDrawer);

function openBagDrawer() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeBagDrawer() {
  if (cartDrawer && cartBackdrop) {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function addToBag(productId, customSize = null, customPrice = null) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const size = customSize || (product.sizes ? '5 inch' : 'Standard');
  const price = customPrice !== null ? customPrice : (product.sizes ? (product.sizes[size] || product.price) : product.price);
  const cartKey = `${productId}-${size}`;

  const existing = cart.find(item => item.cartKey === cartKey || (item.id === productId && item.size === size));
  if (existing) {
    existing.qty += 1;
    existing.cartKey = cartKey;
  } else {
    cart.push({
      cartKey: cartKey,
      id: product.id,
      dbId: product.dbId,
      name: product.name,
      size: size,
      price: price,
      serves: size !== 'Standard' ? `Size: ${size}` : product.serves,
      image: product.image,
      qty: 1
    });
  }

  saveCartToStorage();
  renderCart();
  showToast(`Added "${product.name.replace('⭐', '').trim()} (${size})" to Bag`);
  openBagDrawer();
}

function updateCartQty(keyOrId, delta) {
  const item = cart.find(i => i.cartKey === keyOrId || i.id === keyOrId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.cartKey !== keyOrId && i.id !== keyOrId);
  }

  saveCartToStorage();
  renderCart();
}

function removeCartItem(keyOrId) {
  cart = cart.filter(i => i.cartKey !== keyOrId && i.id !== keyOrId);
  saveCartToStorage();
  renderCart();
  showToast('Item removed from Bag');
}

function renderCart() {
  const listEl = document.getElementById('drawerItemsList');
  const bagCountEl = document.getElementById('bagCount');
  const mobileBagCountEl = document.getElementById('mobileBagCount');
  const drawerCountEl = document.getElementById('drawerCount');
  const drawerTotalEl = document.getElementById('drawerTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (bagCountEl) bagCountEl.textContent = totalItems;
  if (mobileBagCountEl) mobileBagCountEl.textContent = totalItems;
  if (drawerCountEl) drawerCountEl.textContent = totalItems;
  if (drawerTotalEl) drawerTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="drawer-empty-state">
        <div style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;">🌹</div>
        <p style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--burgundy-dark); margin-bottom: 0.5rem;">Your Bag is Empty</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Explore our signature collection of bespoke cakes and cupcakes in Glen Eden.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = cart.map(item => {
    const itemKey = item.cartKey || item.id;
    return `
      <div class="drawer-item">
        <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
        <div class="drawer-item-details">
          <span class="drawer-item-title">${item.name}</span>
          <span class="drawer-item-sub">${item.size ? `Size: ${item.size}` : item.serves}</span>
          <span class="drawer-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          <div class="drawer-item-qty">
            <button class="qty-btn" onclick="updateCartQty('${itemKey}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty('${itemKey}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="drawer-item-remove" onclick="removeCartItem('${itemKey}')" title="Remove item" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;
  }).join('');
}

function saveCartToStorage() {
  try {
    localStorage.setItem('gulabi_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Storage unavailable', e);
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('gulabi_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      cart = parsed.map(item => {
        item.cartKey = item.cartKey || `${item.id}-${item.size || 'Standard'}`;
        return item;
      });
    }
  } catch (e) {
    cart = [];
  }
}

function toggleGiftMessage() {
  const checkbox = document.getElementById('giftBoxToggle');
  const input = document.getElementById('giftMessageInput');
  if (checkbox && input) {
    if (checkbox.checked) {
      input.classList.add('active');
      input.focus();
    } else {
      input.classList.remove('active');
    }
  }
}

// --- REAL BACKEND ORDER CHECKOUT ---
async function triggerCheckout() {
  if (cart.length === 0) {
    showToast('Your bag is currently empty.');
    return;
  }

  // Ensure user is signed in
  if (!currentToken || !currentUser) {
    closeBagDrawer();
    openAuthModal();
    showToast('Please sign in or create an account to finalize your order.');
    return;
  }

  const giftToggle = document.getElementById('giftBoxToggle');
  const giftMessage = document.getElementById('giftMessageInput')?.value || '';
  const btn = document.getElementById('checkoutBtn');

  const notesPayload = (giftToggle && giftToggle.checked && giftMessage)
    ? `Complimentary Velvet Gift Wrap: "${giftMessage}" • Store: Glen Eden, Auckland`
    : `Bakehouse Packaging • Store: Glen Eden, Auckland`;

  const addressPayload = currentUser.address || `Glen Eden, Auckland, New Zealand`;

  const orderItemsPayload = cart.map(item => ({
    product_id: item.dbId || 40,
    quantity: item.qty
  }));

  try {
    if (btn) btn.innerHTML = '<span>Recording Order in PostgreSQL...</span>';

    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        items: orderItemsPayload,
        delivery_address: addressPayload,
        notes: notesPayload
      })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to place order.');
      return;
    }

    const orderId = data.order.id;
    const totalAmount = parseFloat(data.order.total_amount);

    closeBagDrawer();
    cart = [];
    saveCartToStorage();
    renderCart();

    showToast(`✨ Order #${orderId} Confirmed in Atelier System!`);
    
    setTimeout(() => {
      alert(`🎉 Thank you, ${currentUser.name}!\n\nOrder #${orderId} has been successfully recorded in PostgreSQL.\nTotal: $${totalAmount.toFixed(2)}\nStatus: ${data.order.status.toUpperCase()}\nBakehouse: Glen Eden, Auckland\n\nOur concierge will prepare your handcrafted order.`);
    }, 300);

  } catch (err) {
    showToast('Error connecting to backend database.');
  } finally {
    if (btn) btn.innerHTML = '<span>Proceed to Atelier Checkout</span>';
  }
}

// --- TASTE PROFILE / CAKE SIZE SELECTION MODAL ---
function openTasteModal(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;
  activeModalProduct = product;

  document.getElementById('modalTag').textContent = product.tag || 'SIGNATURE CREATION';
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalDesc').textContent = product.shortDesc;
  document.getElementById('modalProductImg').src = product.image;
  document.getElementById('modalProductImg').alt = product.name;

  const sizeSection = document.getElementById('modalSizeSection');
  const sizePillsContainer = document.getElementById('modalSizePills');

  if (product.sizes) {
    sizeSection.style.display = 'block';
    const sizeKeys = Object.keys(product.sizes);
    activeModalSelectedSize = sizeKeys[0] || '5 inch';
    activeModalSelectedPrice = product.sizes[activeModalSelectedSize];

    sizePillsContainer.innerHTML = sizeKeys.map(sz => `
      <button class="modal-size-pill ${sz === activeModalSelectedSize ? 'active' : ''}" 
              onclick="selectModalSize('${sz}', ${product.sizes[sz]})">
        ${sz} ($${product.sizes[sz]})
      </button>
    `).join('');

    document.getElementById('modalPrice').textContent = `$${activeModalSelectedPrice.toFixed(2)}`;
  } else {
    sizeSection.style.display = 'none';
    activeModalSelectedSize = 'Standard';
    activeModalSelectedPrice = product.price;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
  }
  
  document.getElementById('meterFloral').style.width = `${product.sensory.floral}%`;
  document.getElementById('valFloral').textContent = `${product.sensory.floral}%`;

  document.getElementById('meterSweet').style.width = `${product.sensory.sweetness}%`;
  document.getElementById('valSweet').textContent = `${product.sensory.sweetness}%`;

  document.getElementById('meterRich').style.width = `${product.sensory.richness}%`;
  document.getElementById('valRich').textContent = `${product.sensory.richness}%`;

  document.getElementById('modalPairing').textContent = `✦ ${product.pairing}`;

  const addBtn = document.getElementById('modalAddBtn');
  addBtn.onclick = () => {
    if (product.sizes) {
      addToBag(productId, activeModalSelectedSize, activeModalSelectedPrice);
    } else {
      addToBag(productId);
    }
    closeTasteModal();
  };

  const backdrop = document.getElementById('tasteModalBackdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function selectModalSize(size, price) {
  activeModalSelectedSize = size;
  activeModalSelectedPrice = price;

  const pills = document.querySelectorAll('.modal-size-pill');
  pills.forEach(pill => {
    if (pill.textContent.includes(size)) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  const priceEl = document.getElementById('modalPrice');
  if (priceEl) {
    priceEl.textContent = `$${price.toFixed(2)}`;
  }
}

function closeTasteModal() {
  const backdrop = document.getElementById('tasteModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function closeBespokeModal() {
  const backdrop = document.getElementById('bespokeModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function submitBespokeForm() {
  closeBespokeModal();
  showToast('✨ Consultation request saved. Our Glen Eden chef will contact you shortly.');
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-gold-dot"></span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// --- AMBIENT SOUND GENERATOR (WEB AUDIO SYNTHESIS) ---
let audioCtx = null;
let isPlayingAmbient = false;
let ambientInterval = null;

function initAmbientSound() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    isPlayingAmbient = !isPlayingAmbient;

    if (isPlayingAmbient) {
      toggleBtn.classList.remove('muted');
      startAmbientSynth();
      showToast('🎵 Atelier Ambience Enabled');
    } else {
      toggleBtn.classList.add('muted');
      stopAmbientSynth();
      showToast('🔇 Ambient Sound Muted');
    }
  });

  toggleBtn.classList.add('muted');
}

function startAmbientSynth() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const notes = [261.63, 329.63, 392.00, 493.88, 587.33, 659.25];

  function playChime() {
    if (!isPlayingAmbient || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const randomFreq = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(randomFreq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 4.6);
  }

  playChime();
  ambientInterval = setInterval(playChime, 3200);
}

function stopAmbientSynth() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
}

// --- NEWSLETTER SUBSCRIPTION ---
function subscribeNewsletter() {
  const input = document.getElementById('newsletterInput');
  if (input && input.value) {
    showToast(`💌 Thank you! ${input.value} subscribed to Glen Eden Gazette.`);
    input.value = '';
  }
}


// --- PAGE SCRIPTS ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 30); }, { passive:true });

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold:0.15 });
revealEls.forEach(el => revealObserver.observe(el));

const phrases = ["Search grilled chicken...", "Search fresh produce...", "Search today's special...", "Search cold drinks..."];
const typeEl = document.getElementById('typeText');
let pIndex = 0, cIndex = 0, deleting = false;
function typeLoop(){
  if(!typeEl) return;
  const current = phrases[pIndex];
  if(!deleting){
    cIndex++;
    typeEl.innerHTML = current.slice(0,cIndex) + '<span class="cursor">&nbsp;</span>';
    if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 1200); return; }
  } else {
    cIndex--;
    typeEl.innerHTML = current.slice(0,cIndex) + '<span class="cursor">&nbsp;</span>';
    if(cIndex === 0){ deleting = false; pIndex = (pIndex+1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}
typeLoop();

const blocks = document.querySelectorAll('.feature-block');
const layers = document.querySelectorAll('.screen-layer');
const storyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const target = entry.target.getAttribute('data-phone');
      blocks.forEach(b => b.classList.toggle('active', b === entry.target));
      layers.forEach(l => l.classList.toggle('active', l.getAttribute('data-screen') === target));
    }
  });
}, { threshold:0.5, rootMargin:"-15% 0px -15% 0px" });
blocks.forEach(b => storyObserver.observe(b));

// --- UNIFIED TREE-LAYOUT MODAL SCRIPTS ---
const SUPABASE_URL = "https://vhrxsjfblldksnalpyio.supabase.co";
const SUPABASE_KEY = "sb_publishable_we3X4oxc_1R2mQVtlSuJVA_gGcQoQ-k";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function openLoginModal(mode = 'signup') {
    const modal = document.getElementById('loginModal');
    const box = document.getElementById('auth-modal-box');
    const title = document.getElementById('modal-auth-title');
    const desc = document.getElementById('modal-auth-desc');
    const treeLayout = document.getElementById('modal-tree-layout');

    // 🌟 SMART CHAMELEON MODAL LOGIC
    if (mode === 'login') {
        // Shrink the modal and hide the selection tree for existing users
        box.style.maxWidth = '420px';
        title.textContent = 'Welcome Back';
        desc.innerHTML = 'Sign in to securely access your business dashboard.';
        treeLayout.style.display = 'none';
        
        // Failsafe: Ensures existing users don't overwrite their DB type on login
        localStorage.removeItem('pending_business_type'); 
    } else {
        // Expand the modal and show the selection tree for new users
        box.style.maxWidth = '680px';
        title.textContent = 'What are you building?';
        desc.innerHTML = 'Select your business type and click <strong style="color: var(--ink);">Continue with Google</strong> to register your new store.';
        treeLayout.style.display = 'flex';
        
        // Auto-select the first restaurant option by default to guide new users
        const firstFoodBtn = document.querySelector('.sub-cat-btn');
        if (firstFoodBtn) selectSubCat('restaurant', firstFoodBtn);
    }

    modal.classList.add('open');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('open');
}

// Highlights the selected sub-category and color-codes it perfectly!
function selectSubCat(mainType, btnElement) {
    // 1. Save the main business type to memory for the database
    localStorage.setItem('pending_business_type', mainType);

    // 2. Reset ALL buttons to neutral gray
    document.querySelectorAll('.sub-cat-btn').forEach(btn => {
        btn.style.borderColor = 'var(--line)';
        btn.style.background = '#fff';
        btn.style.color = 'var(--ink-soft)';
        btn.querySelector('i').style.color = 'var(--ink-faint)';
    });
    
    // 3. Highlight the clicked button based on its parent category
    if (mainType === 'restaurant') {
        btnElement.style.borderColor = 'var(--flame)';
        btnElement.style.background = 'var(--flame-tint)';
        btnElement.style.color = 'var(--flame-dark)';
        btnElement.querySelector('i').style.color = 'var(--flame)';
    } else {
        btnElement.style.borderColor = 'var(--pine)';
        btnElement.style.background = 'var(--pine-tint)';
        btnElement.style.color = 'var(--pine)';
        btnElement.querySelector('i').style.color = 'var(--pine)';
    }
}

async function loginWithGoogle() {
    // Safety fallback
    if (!localStorage.getItem('pending_business_type')) {
        localStorage.setItem('pending_business_type', 'restaurant');
    }

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/menuly/admin.html' }
    });
    if (error) alert("Login Error: " + error.message);
}
// 🌟 Initialize Real 360 VR on Marketing Page
window.addEventListener('load', () => {
    if (typeof pannellum !== 'undefined') {
        pannellum.viewer('marketing-vr-viewer', {
            "type": "equirectangular",
            "panorama": "https://raw.githubusercontent.com/DigiDatas/menuly/main/multimedia/RESTAURANT-PAnorama.jpg",
            "autoLoad": true,
            "showControls": false,
            "mouseZoom": false,
            "keyboardZoom": false,
            "disableKeyboardCtrl": true,
            "autoRotate": -2  // Rotates slowly right to left
        });
    }
});
 

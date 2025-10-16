// --- Auth / helpers ---
function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }
function authHeaders(){ return { 'Authorization': 'Bearer '+getToken(), 'Content-Type':'application/json' }; }
function ensureAuth(){ if(!getToken()) location.href='/login.html'; }
function logout(){ localStorage.removeItem('token'); location.href='/login.html'; }
function toast(msg){
  const t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.style.display='block';
  setTimeout(()=>t.style.display='none',2000);
}

// --- Tema / branding ---
const THEME_KEY='theme';
function applyTheme(){
  const v=localStorage.getItem(THEME_KEY)||'system';
  const root=document.documentElement;
  root.removeAttribute('data-theme');
  if(v==='light'||v==='dark') root.setAttribute('data-theme', v);
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

async function loadBranding(){
  try{
    const r=await fetch('/api/settings/public');
    const d=await r.json();
    document.querySelectorAll('.brand-name').forEach(el=> el.textContent=d.brand_name||'TCCv5');
    document.querySelectorAll('.brand-logo').forEach(el=> el.src=d.brand_logo_url||'/img/logo-placeholder.svg');
    if(d.primary_color) document.documentElement.style.setProperty('--primary', d.primary_color);
  }catch(e){}
}

function setActiveMenu(){
  const p=location.pathname;
  document.querySelectorAll('.menu a').forEach(a=>{
    if(a.getAttribute('href')===p) a.classList.add('active');
  });
}

// --- Drawer (mobile) ---
function openDrawer(){
  const backdrop=document.getElementById('drawer-backdrop');
  const drawer=document.getElementById('drawer');
  if(!backdrop || !drawer) return;
  backdrop.style.display='block';
  drawer.classList.add('open');
  const toggle=document.querySelector('[data-action="open-drawer"]');
  if(toggle) toggle.setAttribute('aria-expanded','true');
}
function closeDrawer(){
  const backdrop=document.getElementById('drawer-backdrop');
  const drawer=document.getElementById('drawer');
  if(!backdrop || !drawer) return;
  backdrop.style.display='none';
  drawer.classList.remove('open');
  const toggle=document.querySelector('[data-action="open-drawer"]');
  if(toggle) toggle.setAttribute('aria-expanded','false');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', ()=>{
  applyTheme();
  loadBranding();
  setActiveMenu();

  // fecha ao clicar no backdrop
  const bd=document.getElementById('drawer-backdrop');
  if(bd) bd.addEventListener('click', closeDrawer);
});

// --- Delegações globais (CSP-safe, sem inline) ---
document.addEventListener('click', (e)=>{
  // abrir drawer
  const openBtn = e.target.closest('[data-action="open-drawer"]');
  if (openBtn) { e.preventDefault(); openDrawer(); return; }

  // fechar drawer
  const closeBtn = e.target.closest('[data-action="close-drawer"]');
  if (closeBtn) { e.preventDefault(); closeDrawer(); return; }

  // sair (logout)
  const logoutBtn = e.target.closest('a[data-action="logout"]');
  if (logoutBtn) { e.preventDefault(); logout(); return; }
});

// fecha com ESC
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') closeDrawer();
});

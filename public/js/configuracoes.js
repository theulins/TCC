async function load(){
  const rp=await fetch('/api/settings/profile',{headers:authHeaders()}); if(rp.ok){ const u=await rp.json(); name.value=u.name||''; email.value=u.email||''; theme.value=u.theme_preference||'system'; }
  const br=await fetch('/api/settings/public'); const b=await br.json(); brand_name.value=b.brand_name||'TCCv5'; primary_color.value=b.primary_color||'#8ab4f8';
}
document.getElementById('btnSaveProfile').addEventListener('click', async ()=>{
  await fetch('/api/settings/profile',{method:'PUT',headers:authHeaders(),body:JSON.stringify({name:name.value})});
  await fetch('/api/settings/theme',{method:'PUT',headers:authHeaders(),body:JSON.stringify({theme:theme.value})});
  localStorage.setItem('theme', theme.value); location.reload();
});
document.getElementById('btnSaveBrand').addEventListener('click', async ()=>{
  const fd=new FormData(); fd.append('brand_name', brand_name.value); fd.append('primary_color', primary_color.value);
  const f=brand_logo.files[0]; if(f) fd.append('logo', f);
  const r=await fetch('/api/settings/branding',{method:'POST',headers:{'Authorization':'Bearer '+getToken()},body:fd});
  if(r.ok){ toast('Branding salvo'); setTimeout(()=>location.reload(),700); } else { const e=await r.json(); toast(e.error||'Erro'); }
});
load();

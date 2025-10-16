async function load(){
  const r=await fetch('/api/users',{headers:authHeaders()}); const tb=document.querySelector('#tbl tbody'); tb.innerHTML='';
  if(!r.ok){ const e=await r.json(); return toast(e.error||'Sem permissão'); }
  const d=await r.json(); (d||[]).forEach(u=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${u.name}</td><td>${u.email}</td><td><span class="badge">${u.role}</span></td>`; tb.appendChild(tr); });
}
document.getElementById('btnCreate').addEventListener('click', async ()=>{
  const body={ name:u_name.value, email:u_email.value, password:u_pass.value, role:u_role.value };
  const r=await fetch('/api/users',{method:'POST',headers:authHeaders(),body:JSON.stringify(body)}); const d=await r.json();
  if(r.ok){ toast('Usuário criado'); load(); } else { toast(d.error||'Erro'); }
});
load();

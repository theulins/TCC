const id=new URLSearchParams(location.search).get('id');
const F=[
['corporate_name','Razão Social','text','col-6'],['fantasy_name','Denominação Comercial','text','col-6'],
['address','Endereço','text','col-12'],['zip','CEP','text','col-3'],['email','E-mail','email','col-5'],['instagram','Instagram','text','col-4'],
['phone','Telefone','text','col-4'],['city','Cidade','text','col-4'],['state','UF','text','col-4'],
['cel','CEL','text','col-4'],['whatsapp','WhatsApp','text','col-4'],['cnpj','CNPJ','text','col-6'],['ie','Inscrição Estadual','text','col-6'],
['business_activity','Ramo de Atividade','text','col-12'],['foundation_date','Data Fundação','text','col-4'],['employees_qty','Quantidade de Funcionários','number','col-4'],['sector','Setor','text','col-4'],
['accounting_firm','Esc. de Contabilidade','text','col-6'],['referral','Indicação de','text','col-6'],
['notes','Observação','textarea','col-12'],
['svc_spc','SPC','checkbox','col-2'],['svc_nfe','NF-e','checkbox','col-2'],['svc_nfce','NFC-e','checkbox','col-2'],['svc_mdfe','MDF-e','checkbox','col-2'],['svc_cte','CT-e','checkbox','col-2'],['svc_cfe','CF-e','checkbox','col-2'],
['services_obs','OBS (Serviços)','textarea','col-12'],['plan_type','Tipo','text','col-4'],['plan_value','Valor','text','col-4'],['due_date','Vencimento','text','col-4'],
['auth_site','Site ACIU','checkbox','col-4'],['auth_whatsapp','Grupo WhatsApp','checkbox','col-4'],['auth_email','E-mail marketing','checkbox','col-4']
];
function renderForm(){ const f=document.getElementById('form'); f.innerHTML=''; F.forEach(([n,l,t,cl])=>{ const w=document.createElement('div'); w.className=cl; w.innerHTML = (t==='textarea')?`<label>${l}</label><textarea id='${n}' rows='${n.includes('obs')?3:2}'></textarea>`: (t==='checkbox')?`<label><input type='checkbox' id='${n}'> ${l}</label>`:`<label>${l}</label><input id='${n}' type='${t}'>`; f.appendChild(w); }); }
renderForm();
async function load(){ const r=await fetch('/api/companies/'+id,{headers:authHeaders()}); const c=await r.json(); if(!r.ok) return toast(c.error||'Erro'); Object.keys(c).forEach(k=>{ const el=document.getElementById(k); if(!el) return; if(el.type==='checkbox') el.checked=!!c[k]; else el.value=c[k]||''; }); }
document.getElementById('btnSave').addEventListener('click', async (e)=>{ e.preventDefault(); if(!confirm('Confirmar salvamento?')) return; const body={}; F.forEach(([n,_,t])=>{ const el=document.getElementById(n); if(!el) return; body[n]=(t==='checkbox')?el.checked:el.value; }); const r=await fetch('/api/companies/'+id,{method:'PUT',headers:authHeaders(),body:JSON.stringify(body)}); const d=await r.json(); if(r.ok){ toast('Salvo! Nova versão gerada.'); } else { toast(d.error||'Erro'); } });
document.getElementById('btnPdf').addEventListener('click', async (e)=>{ e.preventDefault(); const r=await fetch(`/api/companies/${id}/pdf?token=${encodeURIComponent(getToken())}`); if(!r.ok){ const ejs=await r.json().catch(()=>({error:'Erro PDF'})); return toast(ejs.error||'Erro'); } const blob=await r.blob(); const url=URL.createObjectURL(blob); window.open(url,'_blank'); });
load();

// assinatura na edição (opcional)
let signatureEdit=null, hasSigEdit=false;
const cnvE=document.getElementById('signPadEdit'); if(cnvE){ const ctxE=cnvE.getContext('2d');
function resizeE(){const ratio=Math.max(window.devicePixelRatio||1,1); const w=cnvE.clientWidth,h=cnvE.clientHeight; cnvE.width=w*ratio; cnvE.height=h*ratio; ctxE.setTransform(ratio,0,0,ratio,0,0);} resizeE(); window.addEventListener('resize',resizeE);
let drawingE=false; const posE=e=>{const r=cnvE.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:t.clientX-r.left, y:t.clientY-r.top};};
function downE(e){e.preventDefault(); drawingE=true; hasSigEdit=true; const p=posE(e); ctxE.beginPath(); ctxE.moveTo(p.x,p.y);}
function moveE(e){ if(!drawingE) return; const p=posE(e); ctxE.lineWidth=2; ctxE.lineCap='round'; ctxE.strokeStyle='#444'; ctxE.lineTo(p.x,p.y); ctxE.stroke(); }
function upE(){ drawingE=false; }
cnvE.addEventListener('mousedown',downE); cnvE.addEventListener('mousemove',moveE); cnvE.addEventListener('mouseup',upE); cnvE.addEventListener('mouseleave',upE);
cnvE.addEventListener('touchstart',downE,{passive:false}); cnvE.addEventListener('touchmove',moveE,{passive:false}); cnvE.addEventListener('touchend',upE);
document.getElementById('btnClearSignEdit').addEventListener('click',()=>{ ctxE.clearRect(0,0,cnvE.width,cnvE.height); hasSigEdit=false; signatureEdit=null; });
document.getElementById('btnConfirmSignEdit').addEventListener('click',()=>{ if(!hasSigEdit) return toast('Faça a assinatura'); signatureEdit=cnvE.toDataURL('image/png'); toast('Assinatura confirmada'); });
}

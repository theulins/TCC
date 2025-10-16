document.addEventListener('DOMContentLoaded', () => {
  // obrigatório: garante login sem usar onload inline
  ensureAuth();

  // helper para pegar elementos
  const $ = (id) => document.getElementById(id);

  // ---- refs de DOM (todos os campos usados) ----
  const btnLookupCnpj = $('btnLookupCnpj');
  const btnSave       = $('btnSave');

  const corporate_name   = $('corporate_name');
  const fantasy_name     = $('fantasy_name');
  const address          = $('address');
  const zip              = $('zip');
  const email            = $('email');
  const instagram        = $('instagram');
  const phone            = $('phone');
  const city             = $('city');
  const state            = $('state');
  const cel              = $('cel');
  const whatsapp         = $('whatsapp');
  const cnpj             = $('cnpj');
  const ie               = $('ie');
  const business_activity= $('business_activity');
  const foundation_date  = $('foundation_date');
  const employees_qty    = $('employees_qty');
  const sector           = $('sector');
  const accounting_firm  = $('accounting_firm');
  const referral         = $('referral');
  const notes            = $('notes');
  const services_obs     = $('services_obs');
  const plan_type        = $('plan_type');
  const plan_value       = $('plan_value');
  const due_date         = $('due_date');

  const svc_spc  = $('svc_spc');
  const svc_nfe  = $('svc_nfe');
  const svc_nfce = $('svc_nfce');
  const svc_mdfe = $('svc_mdfe');
  const svc_cte  = $('svc_cte');
  const svc_cfe  = $('svc_cfe');

  const lookupCnpj = $('lookupCnpj');

  // ---- BUSCA CNPJ ----
  if (btnLookupCnpj) {
    btnLookupCnpj.addEventListener('click', async () => {
      const cnpjVal = (lookupCnpj?.value || '').trim();
      if (!cnpjVal) return toast('Informe o CNPJ');
      try {
        const r = await fetch('/api/cnpj/lookup', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ cnpj: cnpjVal })
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) return toast(d.error || `Erro CNPJ (${r.status})`);

        corporate_name.value = d.razao_social || d.nome_fantasia || '';
        fantasy_name.value   = d.nome_fantasia || '';
        address.value        = [d.descricao_tipo_de_logradouro, d.logradouro, d.numero].filter(Boolean).join(' ');
        zip.value            = d.cep || '';
        city.value           = d.municipio || '';
        state.value          = d.uf || '';
        cnpj.value           = d.cnpj || cnpjVal;
      } catch (e) {
        toast('Erro de rede na consulta de CNPJ');
      }
    });
  }

  // ---- ASSINATURA (canvas) ----
  let signatureData = null, hasSig = false;
  const cnv = $('signPad');
  if (cnv) {
    const ctx = cnv.getContext('2d');
    function resize() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const w = cnv.clientWidth, h = cnv.clientHeight;
      cnv.width = w * ratio; cnv.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let drawing = false;
    const pos = (e) => {
      const r = cnv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    function down(e) { e.preventDefault(); drawing = true; hasSig = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e)  { if (!drawing) return; const p = pos(e); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#444'; ctx.lineTo(p.x, p.y); ctx.stroke(); }
    function up()     { drawing = false; }

    cnv.addEventListener('mousedown', down);
    cnv.addEventListener('mousemove', move);
    cnv.addEventListener('mouseup',   up);
    cnv.addEventListener('mouseleave',up);
    cnv.addEventListener('touchstart',down, { passive:false });
    cnv.addEventListener('touchmove', move, { passive:false });
    cnv.addEventListener('touchend',  up);

    const btnClearSign   = $('btnClearSign');
    const btnConfirmSign = $('btnConfirmSign');
    if (btnClearSign)   btnClearSign.addEventListener('click', () => { ctx.clearRect(0,0,cnv.width,cnv.height); hasSig=false; signatureData=null; });
    if (btnConfirmSign) btnConfirmSign.addEventListener('click', () => { if(!hasSig) return toast('Faça a assinatura'); signatureData = cnv.toDataURL('image/png'); toast('Assinatura confirmada'); });
  }

  // ---- SALVAR (com erros visíveis) ----
  let saving = false;
  if (btnSave) {
    btnSave.addEventListener('click', async (e) => {
      e.preventDefault();
      if (saving) return;
      if (!confirm('Confirmar salvamento?')) return;

      saving = true; btnSave.disabled = true; btnSave.textContent = 'Salvando...';

      const body = {
        fantasy_name: fantasy_name?.value, corporate_name: corporate_name?.value,
        cnpj: cnpj?.value, ie: ie?.value, address: address?.value, zip: zip?.value,
        city: city?.value, state: state?.value, phone: phone?.value, email: email?.value,
        instagram: instagram?.value, whatsapp: whatsapp?.value, cel: cel?.value,
        business_activity: business_activity?.value, foundation_date: foundation_date?.value,
        employees_qty: parseInt(employees_qty?.value || '0', 10), sector: sector?.value,
        accounting_firm: accounting_firm?.value, referral: referral?.value, notes: notes?.value,
        svc_spc: !!svc_spc?.checked,  svc_nfe: !!svc_nfe?.checked,  svc_nfce: !!svc_nfce?.checked,
        svc_mdfe: !!svc_mdfe?.checked, svc_cte: !!svc_cte?.checked,  svc_cfe:  !!svc_cfe?.checked,
        services_obs: services_obs?.value, plan_type: plan_type?.value, plan_value: plan_value?.value,
        due_date: due_date?.value, auth_site: false, auth_whatsapp: false, auth_email: false,
        partners: [],
        signature_base64: signatureData || null
      };

      try {
        const r = await fetch('/api/companies', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(body)
        });

        if (r.status === 401) {
          toast('Sessão expirada. Faça login novamente.');
          localStorage.removeItem('token'); location.href = '/login.html'; return;
        }
        if (r.status === 403) {
          toast('Acesso negado. Apenas editor/admin podem salvar.'); return;
        }

        if (!r.ok) {
          // tenta JSON, senão texto
          let err = 'Erro ao salvar';
          try {
            const j = await r.json();
            err = j.error || `${err} (${r.status})`;
          } catch {
            const t = await r.text(); if (t) err = `${err}: ${t}`;
          }
          toast(err);
          return;
        }

        // PDF em blob
        const blob = await r.blob();
        const url = URL.createObjectURL(blob);
        try { window.open(url, '_blank'); } catch {}
        toast('Empresa salva e PDF v1 gerado');
        setTimeout(() => { location.href = '/empresas.html'; }, 600);

      } catch (e) {
        toast('Erro de rede ao salvar (verifique o servidor)');
      } finally {
        saving = false; btnSave.disabled = false; btnSave.textContent = 'Salvar (gera PDF v1)';
      }
    });
  }
});

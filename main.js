function openModal(id) {
  document.getElementById('modal-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById('modal-' + id).classList.remove('open');
  document.body.style.overflow = '';
}
// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// ============ PLAN SELECTION ============
let selectedPlan = null;
let selectedPayMethod = null;

function preselectPlan(plan) {
  setTimeout(() => {
    const radio = document.querySelector(`input[value="${plan}"]`);
    if (radio) { radio.checked = true; highlightPlan(plan); }
  }, 100);
}

function highlightPlan(plan) {
  selectedPlan = plan;
  ['4day', 'weekly', 'monthly'].forEach(p => {
    const el = document.getElementById('plan-' + p);
    if (el) {
      el.style.borderColor = p === plan ? 'var(--gold)' : 'var(--border)';
      el.style.background = p === plan ? 'rgba(255,215,0,0.06)' : 'var(--card2)';
    }
  });
}

function selectPay(btn) {
  selectedPayMethod = btn.dataset.method;
  document.querySelectorAll('.pay-btn').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.background = 'var(--card2)';
    b.style.color = '';
  });
  btn.style.borderColor = 'var(--gold)';
  btn.style.background = 'rgba(255,215,0,0.1)';
  btn.style.color = 'var(--gold)';
}

function confirmSubscribe() {
  if (!selectedPlan) { showToast('⚠️ Please select a plan first!'); return; }
  if (!selectedPayMethod) { showToast('⚠️ Please select a payment method!'); return; }

  const planInfo = { '4day': '$50 — 4 Days', 'weekly': '$100 — Weekly', 'monthly': '$200 — Monthly' };
  const payInfo = {
    'Bitcoin': 'Send BTC to: [Your BTC Address Here]',
    'Apple Pay': 'Apple Pay to: [Your Phone/Email Here]',
    'Chime': 'Chime to: $[YourChimeTag]'
  };

  document.getElementById('confirm-msg').textContent = `Send ${planInfo[selectedPlan]} via ${selectedPayMethod}, then DM your receipt to get added instantly.`;
  document.getElementById('confirm-details').innerHTML = `
    <div class="flex justify-between"><span class="text-gray-400">Plan:</span><span class="font-semibold" style="color:var(--gold)">${planInfo[selectedPlan]}</span></div>
    <div class="flex justify-between mt-1"><span class="text-gray-400">Method:</span><span>${selectedPayMethod}</span></div>
    <div class="mt-2 pt-2 text-gray-300" style="border-top:1px solid var(--border)">${payInfo[selectedPayMethod]}</div>
  `;
  closeModal('main');
  openModal('confirm');
}

// ============ COPY UTILS ============
function copyText(id) {
  const el = document.getElementById(id);
  const text = el.textContent;
  navigator.clipboard.writeText(text).then(() => showToast('✅ Copied!'));
}

function copyPayment(method) {
  showToast(`Opening payment info for ${method}...`);
  setTimeout(() => openModal('pay'), 400);
}

// ============ TOAST ============
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ============ MOBILE MENU ============
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ============ SCROLL REVEAL ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============ WIN BARS ============
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.win-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.win-bar-fill').forEach(b => { b.style.width = '0%'; });
document.querySelectorAll('section').forEach(s => barObserver.observe(s));

// ============ ESC to close ============
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});
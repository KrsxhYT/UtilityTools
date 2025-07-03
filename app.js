// Helpers
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showToast(msg, err=false) {
  const d = document.createElement('div');
  d.textContent = msg;
  d.style.cssText = `
    position: fixed; bottom:1rem; right:1rem;
    padding:0.8rem;
    background: ${err ? '#e74c3c' : '#4caf50'};
    color: #fff; border-radius:4px;
  `;
  document.body.append(d);
  setTimeout(() => d.remove(), 3000);
}

// Auth Logic
let users = JSON.parse(localStorage.getItem('users') || '[]');
let session = localStorage.getItem('session');
if (session) {
  showSection('dashboard');
  renderDashboard();
} else {
  showSection('login-screen');
}

// Login / Sign-up
document.getElementById('btn-login').onclick = () => {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  if (!u || !p) return showToast('Fill both', true);

  let user = users.find(x => x.u === u);
  if (!user) {
    user = { u, p, t: Date.now() };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Registered new user');
  } else if (user.p !== p) {
    return showToast('Wrong password', true);
  } else {
    showToast('Login successful');
  }

  localStorage.setItem('session', u);
  session = u;
  renderDashboard();
  setTimeout(() => showSection('dashboard'), 500);
};

// Render Dashboard
function renderDashboard() {
  const user = users.find(x => x.u === session);
  document.getElementById('dash-user').textContent = session;
  document.getElementById('dash-time').textContent = new Date(user.t).toLocaleString();
}

// Logout
document.getElementById('btn-logout').onclick = () => {
  localStorage.removeItem('session');
  location.reload();
};

// Navigation
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.onclick = () => showSection(btn.dataset.view);
});
document.querySelectorAll('.btn-back').forEach(b => b.onclick = () => showSection('dashboard'));

// Currency Converter
document.getElementById('cur-convert').onclick = async () => {
  const amt = parseFloat(document.getElementById('cur-amount').value);
  const from = document.getElementById('cur-from').value;
  const to = document.getElementById('cur-to').value;
  const res = document.getElementById('cur-result');
  if (!amt) return res.textContent = 'Enter valid amount';
  try {
    const data = await (await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)).json();
    const conv = (amt * data.rates[to]).toFixed(2);
    res.textContent = `${amt} ${from} = ${conv} ${to}`;
  } catch(e) {
    res.textContent = 'Error: ' + e.message;
  }
};

// IG Info (Mock demo)
document.getElementById('ig-fetch').onclick = () => {
  const u = document.getElementById('ig-user').value.trim();
  document.getElementById('ig-result').textContent = `Demo only — would fetch IG user "${u}"`;
};

// YT Info (Mock demo)
document.getElementById('yt-fetch').onclick = () => {
  const u = document.getElementById('yt-url').value.trim();
  document.getElementById('yt-result').textContent = `Demo only — would fetch YT info from "${u}"`;
};

// Video Downloader (Demo)
document.getElementById('dl-fetch').onclick = () => {
  const u = document.getElementById('dl-url').value.trim();
  document.getElementById('dl-result').textContent = `Demo: Generate .mp4 download link for "${u}"`;
};

// IP Lookup
document.getElementById('ip-fetch').onclick = async () => {
  const ip = document.getElementById('ip-input').value.trim() || 'json';
  const resEl = document.getElementById('ip-result');
  try {
    const data = await (await fetch(`https://ipapi.co/${ip}/json/`)).json();
    delete data.error;
    resEl.textContent = JSON.stringify(data, null, 2);
  } catch(e) {
    resEl.textContent = 'Error: '+e.message;
  }
};

// Admin Panel
document.getElementById('admin').addEventListener('DOMContentLoaded', populateAdmin) ||
populateAdmin();
function populateAdmin() {
  const tbody = document.getElementById('admin-table');
  tbody.innerHTML = '';
  users.forEach((u, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${u.u}</td><td>${new Date(u.t).toLocaleString()}</td>`;
    tbody.append(tr);
  });
}
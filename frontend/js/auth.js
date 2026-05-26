function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

function updateNav() {
  const user = getUser();
  document.getElementById('login-link').style.display = user ? 'none' : 'inline';
  document.getElementById('logout-link').style.display = user ? 'inline' : 'none';
  document.getElementById('profile-link').style.display = user ? 'inline' : 'none';
  document.getElementById('orders-link').style.display = user ? 'inline' : 'none';
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateNav();
    showPage('products');
  } catch (err) {
    document.getElementById('login-msg').textContent = err.message;
  }
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  try {
    await apiCall('/auth/register', 'POST', { name, email, password });
    document.getElementById('reg-msg').textContent = 'Registered! Please login.';
    switchTab('login');
  } catch (err) {
    document.getElementById('reg-msg').textContent = err.message;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNav();
  showPage('home');
}

function switchTab(tab) {
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-register').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
}
const BASE_URL = 'http://localhost:5000/api';

async function apiCall(endpoint, method = 'GET', body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
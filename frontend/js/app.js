function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');

  if (name === 'products') loadProducts();
  if (name === 'cart') loadCart();
  if (name === 'orders') loadOrders();
}

window.onload = () => {
  updateNav();
  showPage('home');
};
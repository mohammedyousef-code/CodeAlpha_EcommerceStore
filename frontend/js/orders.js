async function placeOrder() {
  try {
    const data = await apiCall('/orders/place', 'POST', null, true);
    alert(`Order placed! Order ID: ${data.order_id}`);
    loadCart();
    showPage('orders');
    loadOrders();
  } catch (err) {
    alert(err.message);
  }
}

async function loadOrders() {
  const user = getUser();
  const content = document.getElementById('orders-content');

  if (!user) {
    content.innerHTML = '<p>Please login to view your orders.</p>';
    return;
  }

  try {
    const orders = await apiCall('/orders/history', 'GET', null, true);
    if (orders.length === 0) {
      content.innerHTML = '<p>No orders yet.</p>';
      return;
    }

    content.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <span>Order #${o.id}</span>
          <span class="status ${o.status}">${o.status}</span>
          <span>$${parseFloat(o.total).toFixed(2)}</span>
          <span>${new Date(o.created_at).toLocaleDateString()}</span>
        </div>
        <div class="order-items">
          ${o.items.map(i => `
            <div class="order-item">
              <img src="${i.image_url}" />
              <span>${i.name}</span>
              <span>x${i.quantity}</span>
              <span>$${parseFloat(i.price).toFixed(2)}</span>
            </div>`).join('')}
        </div>
      </div>`).join('');
  } catch (err) {
    content.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}
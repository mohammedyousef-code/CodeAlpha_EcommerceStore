async function loadCart() {
  const user = getUser();
  const content = document.getElementById('cart-content');

  if (!user) {
    content.innerHTML = '<p>Please <a onclick="showPage(\'login\')">login</a> to view your cart.</p>';
    return;
  }

  try {
    const items = await apiCall('/cart', 'GET', null, true);
    if (items.length === 0) {
      content.innerHTML = '<p>Your cart is empty.</p>';
      document.getElementById('cart-count').textContent = 0;
      return;
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    document.getElementById('cart-count').textContent = items.length;

    content.innerHTML = `
      <table class="cart-table">
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th></tr></thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td><img src="${i.image_url}" />${i.name}</td>
              <td>$${parseFloat(i.price).toFixed(2)}</td>
              <td>
                <input type="number" min="1" max="${i.stock}" value="${i.quantity}"
                  onchange="updateCartItem(${i.id}, this.value)" />
              </td>
              <td>$${(i.price * i.quantity).toFixed(2)}</td>
              <td><button onclick="removeCartItem(${i.id})">Remove</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div class="cart-total">
        <strong>Total: $${total.toFixed(2)}</strong>
        <button onclick="placeOrder()">Place Order</button>
      </div>`;
  } catch (err) {
    content.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function addToCart(productId) {
  const user = getUser();
  if (!user) { showPage('login'); return; }
  try {
    await apiCall('/cart/add', 'POST', { product_id: productId, quantity: 1 }, true);
    alert('Added to cart!');
    if (document.getElementById('page-cart').classList.contains('active')) loadCart();
  } catch (err) {
    alert(err.message);
  }
}

async function updateCartItem(cartId, quantity) {
  try {
    await apiCall(`/cart/update/${cartId}`, 'PUT', { quantity: parseInt(quantity) }, true);
    loadCart();
  } catch (err) {
    alert(err.message);
  }
}

async function removeCartItem(cartId) {
  try {
    await apiCall(`/cart/remove/${cartId}`, 'DELETE', null, true);
    loadCart();
  } catch (err) {
    alert(err.message);
  }
}
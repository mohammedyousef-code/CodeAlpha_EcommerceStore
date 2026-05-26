let currentPage = 1;

async function loadProducts() {
  const search = document.getElementById('search-input').value;
  const category = document.getElementById('category-filter').value;
  const sort = document.getElementById('sort-filter').value;

  try {
    const data = await apiCall(`/products?page=${currentPage}&limit=8&search=${search}&category=${category}&sort=${sort}`);
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    data.products.forEach(p => {
      grid.innerHTML += `
        <div class="product-card" onclick="showProductDetail(${p.id})">
          <img src="${p.image_url}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p class="category">${p.category}</p>
          <p class="price">$${parseFloat(p.price).toFixed(2)}</p>
          <p class="stock">${p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}</p>
          <button onclick="event.stopPropagation(); addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
            Add to Cart
          </button>
        </div>`;
    });

    renderPagination(data.total, data.limit);
    await loadCategories();
  } catch (err) {
    document.getElementById('products-grid').innerHTML = `<p>Error loading products: ${err.message}</p>`;
  }
}

async function loadCategories() {
  try {
    const cats = await apiCall('/products/meta/categories');
    const sel = document.getElementById('category-filter');
    const current = sel.value;
    sel.innerHTML = '<option value="">All Categories</option>';
    cats.forEach(c => {
      sel.innerHTML += `<option value="${c}" ${current === c ? 'selected' : ''}>${c}</option>`;
    });
  } catch (e) {}
}

function filterProducts() {
  currentPage = 1;
  loadProducts();
}

function renderPagination(total, limit) {
  const pages = Math.ceil(total / limit);
  const pg = document.getElementById('pagination');
  pg.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    pg.innerHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
}

function goToPage(p) {
  currentPage = p;
  loadProducts();
}

async function showProductDetail(id) {
  try {
    const p = await apiCall(`/products/${id}`);
    document.getElementById('product-detail-content').innerHTML = `
      <button class="back-btn" onclick="showPage('products')">Back to Products</button>
      <div class="product-detail">
        <img src="${p.image_url}" alt="${p.name}" />
        <div class="product-info">
          <h2>${p.name}</h2>
          <p class="category">${p.category}</p>
          <p class="description">${p.description}</p>
          <p class="price">$${parseFloat(p.price).toFixed(2)}</p>
          <p class="stock">${p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}</p>
          <button onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>Add to Cart</button>
        </div>
      </div>`;
    showPage('product-detail');
  } catch (err) {
    alert('Error loading product.');
  }
}
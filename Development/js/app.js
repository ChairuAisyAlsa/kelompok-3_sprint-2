/* app.js — inisialisasi aplikasi + utilitas bersama.
   Dimuat paling akhir setelah products, navigation, auth, cart, search. */
(function () {
  window.CG = window.CG || {};

  /* ---------- utilitas ---------- */
  CG.store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('cg_' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) { localStorage.setItem('cg_' + key, JSON.stringify(value)); },
    remove(key) { localStorage.removeItem('cg_' + key); },
  };
  CG.params = new URLSearchParams(location.search);
  CG.rupiah = (n) => 'Rp' + Number(n).toLocaleString('id-ID');
  CG.getProduct = (id) => CG.PRODUCTS.find((p) => p.id === Number(id));
  CG.img = (p) => '../' + p.image;   // halaman ada di /pages, aset di /assets

  let toastTimer;
  CG.toast = function (msg) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 1800);
  };

  CG.productCard = (p) => `
    <article class="product-card">
      <a class="product-card__img" href="product-detail.html?id=${p.id}"><img src="${CG.img(p)}" alt="${p.name}" loading="lazy"></a>
      <div class="product-card__body">
        <h3>${p.name}</h3>
        <span class="product-card__meta">${p.category} · Ukuran ${p.size}</span>
        <span class="product-card__price">${CG.rupiah(p.price)}</span>
        <button class="btn btn-primary btn-sm" data-add="${p.id}">Tambah</button>
      </div>
    </article>`;

  CG.renderGrid = (el, list, emptyMsg) => {
    el.innerHTML = list.length
      ? list.map(CG.productCard).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><strong>Tidak ada hasil</strong>${emptyMsg || ''}</div>`;
  };

  /* ---------- halaman ---------- */
  function initHome() {
    const form = document.getElementById('home-search');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = form.q.value.trim();
      CG.Nav.go('search.html' + (q ? '?q=' + encodeURIComponent(q) : ''));
    });
    document.getElementById('btn-bell').addEventListener('click', () => CG.toast('Belum ada notifikasi baru'));
    CG.renderGrid(document.getElementById('home-grid'), CG.PRODUCTS.slice(0, 8));
  }

  const VIEWS = ['', 'transform:scale(1.7);transform-origin:50% 25%', 'transform:scale(1.7);transform-origin:50% 85%'];

  function initDetail() {
    const p = CG.getProduct(CG.params.get('id'));
    const root = document.getElementById('detail');
    if (!p) {
      root.innerHTML = `<div class="empty-state"><strong>Produk tidak ditemukan</strong>Produk ini mungkin sudah terjual.<br><a class="btn btn-primary" href="catalog.html">Kembali ke katalog</a></div>`;
      document.getElementById('detail-actions').hidden = true;
      return;
    }
    const src = CG.img(p);
    const favs = () => CG.store.get('favorites', []);
    root.innerHTML = `
      <div class="detail-gallery">
        <div class="detail-thumbs">
          ${VIEWS.map((v, i) => `<button class="thumb ${i === 0 ? 'is-active' : ''}" data-view="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" style="${v}"></button>`).join('')}
        </div>
        <div class="detail-main"><img id="detail-img" src="${src}" alt="${p.name}"></div>
      </div>
      <div class="detail-info">
        <div class="detail-info__row">
          <div><h2>${p.name}</h2><p class="detail-price">${CG.rupiah(p.price)}</p></div>
          <button class="fav-btn ${favs().includes(p.id) ? 'is-active' : ''}" id="btn-fav" aria-label="Favorit">${CG.icon('heart', 20)}</button>
        </div>
        <div class="detail-tags">
          <span class="tag">${p.category}</span><span class="tag">Ukuran ${p.size}</span>
          <span class="tag">${p.condition}</span><span class="tag">★ ${String(p.rating).replace('.', ',')}</span>
        </div>
        <p class="detail-desc">${p.description}</p>
      </div>`;

    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-view]');
      if (t) {
        root.querySelectorAll('.thumb').forEach((b) => b.classList.toggle('is-active', b === t));
        document.getElementById('detail-img').setAttribute('style', VIEWS[Number(t.dataset.view)]);
      }
      if (e.target.closest('#btn-fav')) {
        let list = favs();
        const on = !list.includes(p.id);
        list = on ? list.concat(p.id) : list.filter((id) => id !== p.id);
        CG.store.set('favorites', list);
        e.target.closest('#btn-fav').classList.toggle('is-active', on);
        CG.toast(on ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit');
      }
    });
    document.getElementById('btn-add').addEventListener('click', () => { CG.Cart.add(p.id); CG.toast('Masuk ke keranjang'); });
    document.getElementById('btn-buy').addEventListener('click', () => { CG.Cart.add(p.id); CG.Nav.go('cart.html'); });
  }

  /* ---------- start ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (CG.Auth.isProtected(page) && !CG.Auth.current()) return CG.Nav.go('login.html');

    CG.Nav.init(page);

    const init = {
      login: CG.Auth.initLogin, register: CG.Auth.initRegister,
      home: initHome, catalog: CG.Search.initCatalog, search: CG.Search.initSearch,
      'product-detail': initDetail, cart: CG.Cart.initCart, checkout: CG.Cart.initCheckout,
      profile: CG.Auth.initProfile, logout: CG.Auth.initLogout,
    };
    if (init[page]) init[page]();

    CG.hydrateIcons();

    // tombol "Tambah" di kartu produk (berlaku di semua halaman)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      CG.Cart.add(Number(btn.dataset.add));
      CG.toast('Masuk ke keranjang');
    });
  });
})();

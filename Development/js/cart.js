/* cart.js — logika keranjang (tambah, hapus, jumlah) + halaman keranjang & checkout */
(function () {
  window.CG = window.CG || {};

  const SHIPPING = 10000;
  const $ = (id) => document.getElementById(id);
  const read = () => CG.store.get('cart', []);
  const write = (cart) => { CG.store.set('cart', cart); CG.Nav.updateBadge(); };

  /** Gabungkan isi keranjang dengan data produk. */
  function detailed() {
    return read()
      .map((it) => ({ p: CG.getProduct(it.id), qty: it.qty }))
      .filter((it) => it.p);
  }

  const Cart = {
    get: read,
    count() { return read().reduce((n, it) => n + it.qty, 0); },
    subtotal() { return detailed().reduce((s, it) => s + it.p.price * it.qty, 0); },

    add(id, qty) {
      const cart = read();
      const found = cart.find((it) => it.id === id);
      if (found) found.qty += qty || 1; else cart.push({ id, qty: qty || 1 });
      write(cart);
    },
    changeQty(id, delta) {
      const cart = read();
      const it = cart.find((x) => x.id === id);
      if (!it) return;
      it.qty = Math.max(1, Math.min(99, it.qty + delta));
      write(cart);
    },
    remove(id) { write(read().filter((it) => it.id !== id)); },
    clear() { write([]); },

    /* ---------- halaman keranjang ---------- */
    initCart() {
      const list = $('cart-list');
      const bar = $('cart-footer');

      function render() {
        const items = detailed();
        if (!items.length) {
          list.innerHTML = `<div class="empty-state"><strong>Keranjang masih kosong</strong>Yuk, pilih pakaian thrift favoritmu.<br><a class="btn btn-primary" href="catalog.html">Lihat katalog</a></div>`;
          bar.hidden = true;
          return;
        }
        bar.hidden = false;
        list.innerHTML = items.map(({ p, qty }) => `
          <div class="cart-item">
            <a class="cart-item__img" href="product-detail.html?id=${p.id}"><img src="${CG.img(p)}" alt="${p.name}"></a>
            <div class="cart-item__info">
              <div class="cart-item__top">
                <div><h3>${p.name}</h3><p class="muted">Ukuran ${p.size}</p></div>
                <button class="remove-btn" data-remove="${p.id}" aria-label="Hapus ${p.name}">${CG.icon('close', 16)}</button>
              </div>
              <div class="cart-item__bottom">
                <span class="cart-item__price">${CG.rupiah(p.price * qty)}</span>
                <div class="qty">
                  <button data-qty="-1" data-id="${p.id}" aria-label="Kurangi">${CG.icon('minus', 14)}</button>
                  <span>${qty}</span>
                  <button data-qty="1" data-id="${p.id}" aria-label="Tambah">${CG.icon('plus', 14)}</button>
                </div>
              </div>
            </div>
          </div>`).join('');
        $('cart-total-label').textContent = `Total (${Cart.count()} Produk)`;
        $('cart-total').textContent = CG.rupiah(Cart.subtotal());
      }

      list.addEventListener('click', (e) => {
        const q = e.target.closest('[data-qty]');
        const r = e.target.closest('[data-remove]');
        if (q) Cart.changeQty(Number(q.dataset.id), Number(q.dataset.qty));
        else if (r) Cart.remove(Number(r.dataset.remove));
        else return;
        render();
      });
      $('btn-clear').addEventListener('click', () => {
        if (read().length && confirm('Kosongkan semua isi keranjang?')) { Cart.clear(); render(); }
      });
      render();
    },

    /* ---------- halaman checkout ---------- */
    initCheckout() {
      const items = detailed();
      if (!items.length) return CG.Nav.go('cart.html');
      const user = CG.Auth.current();
      let method = 'Transfer Bank';
      let bank = '';

      $('co-name').value = user.name;
      $('co-phone').value = user.phone || '';
      const addrEl = $('co-address');
      const showAddress = () => {
        addrEl.textContent = user.address || 'Tambahkan alamat pengiriman';
        addrEl.style.color = user.address ? '' : 'var(--muted)';
      };
      showAddress();
      $('btn-address').addEventListener('click', () => {
        const a = prompt('Alamat pengiriman lengkap:', user.address || '');
        if (a !== null) { user.address = a.trim(); CG.Auth.updateUser({ address: user.address }); showAddress(); }
      });

      $('co-products').innerHTML = items.map(({ p, qty }) => `
        <div class="checkout-product">
          <img src="${CG.img(p)}" alt="">
          <span>${p.name}<br><span class="muted">${qty} × ${CG.rupiah(p.price)}</span></span>
          <strong>${CG.rupiah(p.price * qty)}</strong>
        </div>`).join('');

      const sub = Cart.subtotal();
      $('co-subtotal').textContent = CG.rupiah(sub);
      $('co-shipping').textContent = CG.rupiah(SHIPPING);
      $('co-total').textContent = CG.rupiah(sub + SHIPPING);

      const METHODS = [
        { key: 'Transfer Bank', icon: 'bank', desc: 'Bayar melalui mobile banking / ATM' },
        { key: 'QRIS', icon: 'qr', desc: 'Scan kode QR untuk pembayaran' },
      ];
      const BANKS = [
        { code: 'BCA', va: '39' }, { code: 'BNI', va: '88' }, { code: 'BRI', va: '26' },
        { code: 'Mandiri', va: '89' }, { code: 'BSI', va: '90' }, { code: 'CIMB Niaga', va: '55' },
      ];

      function renderPay() {
        $('pay-methods').innerHTML = METHODS.map((m) => `
          <button class="pay-method ${m.key === method ? 'is-active' : ''}" data-method="${m.key}" role="radio" aria-checked="${m.key === method}">
            ${CG.icon(m.icon, 26)}
            <span class="pay-method__text"><strong>${m.key.toUpperCase() === 'QRIS' ? 'QRIS' : m.key}</strong><small>${m.desc}</small></span>
            <span class="radio"></span>
          </button>`).join('');
        const list = $('bank-list');
        list.classList.toggle('is-open', method === 'Transfer Bank');
        $('bank-grid').innerHTML = BANKS.map((bk) => `
          <button class="bank-option ${bk.code === bank ? 'is-active' : ''}" data-bank="${bk.code}" role="radio" aria-checked="${bk.code === bank}">
            <span class="bank-option__logo">${bk.code.charAt(0)}</span>${bk.code}
          </button>`).join('');
      }
      $('pay-methods').addEventListener('click', (e) => {
        const b = e.target.closest('[data-method]');
        if (b) { method = b.dataset.method; renderPay(); }
      });
      $('bank-grid').addEventListener('click', (e) => {
        const b = e.target.closest('[data-bank]');
        if (b) { bank = b.dataset.bank; renderPay(); }
      });
      renderPay();

      $('btn-pay').addEventListener('click', () => {
        if (!$('co-name').value.trim() || !$('co-phone').value.trim()) return CG.toast('Lengkapi informasi member dulu');
        if (!user.address) return CG.toast('Tambahkan alamat pengiriman dulu');
        if (method === 'Transfer Bank' && !bank) return CG.toast('Pilih bank untuk transfer dulu');
        const bankInfo = BANKS.find((x) => x.code === bank);
        const va = method === 'Transfer Bank' ? bankInfo.va + String(Math.floor(Math.random() * 1e11)).padStart(11, '0') : '';
        const orders = CG.store.get('orders', []);
        orders.push({
          id: 'CG' + Date.now(), date: new Date().toISOString(), method, bank, va,
          address: user.address, total: sub + SHIPPING,
          items: items.map(({ p, qty }) => ({ id: p.id, name: p.name, qty, price: p.price })),
        });
        CG.store.set('orders', orders);
        Cart.clear();
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const payInfo = method === 'Transfer Bank'
          ? `<p>Transfer ke Virtual Account <strong>${bank}</strong></p><div class="va-box">${va.replace(/(.{4})/g, '$1 ').trim()}</div><p>Total ${CG.rupiah(sub + SHIPPING)} (nomor ini hanya simulasi)</p>`
          : `<p>Pembayaran via QRIS sebesar <strong>${CG.rupiah(sub + SHIPPING)}</strong> (simulasi).</p>`;
        overlay.innerHTML = `<div class="modal"><div class="check">${CG.icon('check', 28)}</div><h3>Pesanan berhasil dibuat</h3>${payInfo}<a class="btn btn-primary" href="home.html">Kembali ke beranda</a></div>`;
        document.body.appendChild(overlay);
      });
    },
  };

  CG.Cart = Cart;
})();

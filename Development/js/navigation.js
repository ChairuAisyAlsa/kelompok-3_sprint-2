/* navigation.js — ikon, navigasi bawah, tombol kembali */
(function () {
  window.CG = window.CG || {};

  const ICON_PATHS = {"bank": "<path d=\"M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M3 10h18\"/>", "qr": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><path d=\"M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1\"/>", "home": "<path d=\"M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/>", "box": "<path d=\"M21 8 12 3 3 8v8l9 5 9-5z\"/><path d=\"M3 8l9 5 9-5M12 13v8\"/>", "cart": "<circle cx=\"9\" cy=\"20\" r=\"1.5\"/><circle cx=\"18\" cy=\"20\" r=\"1.5\"/><path d=\"M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6\"/>", "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4 3.6-7 8-7s8 3 8 7\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m21 21-4.3-4.3\"/>", "bell": "<path d=\"M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8\"/><path d=\"M10 21a2 2 0 0 0 4 0\"/>", "filter": "<path d=\"M3 5h18l-7 8v6l-4 2v-8z\"/>", "back": "<path d=\"m15 18-6-6 6-6\"/>", "chevron": "<path d=\"m9 18 6-6-6-6\"/>", "trash": "<path d=\"M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>", "minus": "<path d=\"M5 12h14\"/>", "eye": "<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "eye-off": "<path d=\"M3 3l18 18\"/><path d=\"M10.6 6.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2\"/><path d=\"M9.9 9.9a3 3 0 0 0 4.2 4.2\"/>", "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"m3 7 9 6 9-6\"/>", "lock": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\"/>", "phone": "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2\"/>", "pin": "<path d=\"M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>", "card": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M2 10h20\"/>", "bag": "<path d=\"M5 8h14l-1 13H6z\"/><path d=\"M9 8V6a3 3 0 0 1 6 0v2\"/>", "heart": "<path d=\"M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z\"/>", "help": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01\"/>", "logout": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9\"/>", "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1\"/>", "close": "<path d=\"M18 6 6 18M6 6l12 12\"/>", "check": "<path d=\"m5 12 5 5 9-10\"/>"};

  /** Mengembalikan string SVG inline untuk sebuah ikon. */
  CG.icon = function (name, size) {
    size = size || 22;
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
  };

  /** Ganti semua elemen [data-icon] dengan SVG. Panggil ulang setelah render dinamis. */
  CG.hydrateIcons = function (root) {
    (root || document).querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = CG.icon(el.dataset.icon, Number(el.dataset.size) || 22);
      el.removeAttribute('data-icon');
    });
  };

  const items = [
    { key: 'home', href: 'home.html', icon: 'home', label: 'Beranda' },
    { key: 'catalog', href: 'catalog.html', icon: 'box', label: 'Katalog' },
    { key: 'cart', href: 'cart.html', icon: 'cart', label: 'Keranjang' },
    { key: 'profile', href: 'profile.html', icon: 'user', label: 'Profil' },
  ];

  // halaman -> tab yang aktif
  const activeFor = {
    home: 'home', search: 'home', catalog: 'catalog', 'product-detail': 'catalog',
    cart: 'cart', checkout: 'cart', profile: 'profile', logout: 'profile',
  };

  CG.Nav = {
    go(url) { window.location.href = url; },

    init(page) {
      const nav = document.getElementById('bottom-nav');
      if (nav) {
        const active = activeFor[page];
        nav.innerHTML = items.map((it) => `
          <a href="${it.href}" class="nav-item ${it.key === active ? 'is-active' : ''}" aria-label="${it.label}">
            ${CG.icon(it.icon, 24)}
            ${it.key === 'cart' ? '<span class="nav-badge" id="cart-badge" hidden>0</span>' : ''}
          </a>`).join('');
        this.updateBadge();
      }
      document.querySelectorAll('[data-back]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (document.referrer && window.history.length > 1) window.history.back();
          else CG.Nav.go(btn.dataset.back || 'home.html');
        });
      });
    },

    updateBadge() {
      const badge = document.getElementById('cart-badge');
      if (!badge || !CG.Cart) return;
      const n = CG.Cart.count();
      badge.textContent = n > 9 ? '9+' : n;
      badge.hidden = n === 0;
    },
  };
})();

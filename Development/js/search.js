/* search.js — pencarian dan filter produk (halaman katalog & hasil pencarian) */
(function () {
  window.CG = window.CG || {};
  const $ = (id) => document.getElementById(id);

  const SORTS = [
    { key: 'default', label: 'Terbaru' },
    { key: 'low', label: 'Harga terendah' },
    { key: 'high', label: 'Harga tertinggi' },
  ];

  /** Filter + urutkan daftar produk. */
  function apply({ q = '', category = 'Semua', sort = 'default', fav = false }) {
    const term = q.trim().toLowerCase();
    const favs = CG.store.get('favorites', []);
    let list = CG.PRODUCTS.filter((p) => {
      if (category !== 'Semua' && p.category !== category) return false;
      if (fav && !favs.includes(p.id)) return false;
      if (!term) return true;
      return [p.name, p.category, p.description].some((t) => t.toLowerCase().includes(term));
    });
    if (sort === 'low') list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === 'high') list = list.slice().sort((a, b) => b.price - a.price);
    return list;
  }

  function renderChips(el, active, onChange) {
    el.innerHTML = CG.CATEGORIES.map((c) =>
      `<button class="chip ${c === active ? 'is-active' : ''}" data-cat="${c}">${c}</button>`).join('');
    el.onclick = (e) => {
      const b = e.target.closest('[data-cat]');
      if (b) { renderChips(el, b.dataset.cat, onChange); onChange(b.dataset.cat); }
    };
  }

  CG.Search = {
    apply,

    initCatalog() {
      const state = { q: CG.params.get('q') || '', category: 'Semua', sort: 'default', fav: CG.params.has('fav') };
      const input = $('search-input');
      input.value = state.q;
      if (state.fav) document.querySelector('.page-header h1').textContent = 'FAVORIT';

      const render = () => CG.renderGrid($('grid'), apply(state),
        state.fav ? 'Belum ada favorit. Tekan ikon hati di halaman produk.' : 'Produk tidak ditemukan. Coba kata kunci atau kategori lain.');

      renderChips($('chips'), state.category, (c) => { state.category = c; render(); });
      input.addEventListener('input', () => { state.q = input.value; render(); });
      $('btn-filter').addEventListener('click', () => {
        const i = (SORTS.findIndex((s) => s.key === state.sort) + 1) % SORTS.length;
        state.sort = SORTS[i].key;
        CG.toast('Urutkan: ' + SORTS[i].label);
        render();
      });
      render();
    },

    initSearch() {
      const state = { q: CG.params.get('q') || '', category: 'Semua', sort: 'default' };
      const input = $('search-input');
      const clear = $('btn-clear');
      input.value = state.q;
      if (!state.q) input.focus();

      function render() {
        const list = apply(state);
        clear.hidden = !state.q;
        $('result-info').textContent = state.q
          ? `Menemukan ${list.length} produk untuk "${state.q}"`
          : `Menampilkan ${list.length} produk`;
        CG.renderGrid($('grid'), list, 'Produk tidak ditemukan. Coba kata kunci lain, misalnya "hoodie" atau "dress".');
        history.replaceState(null, '', state.q ? '?q=' + encodeURIComponent(state.q) : location.pathname);
      }

      input.addEventListener('input', () => { state.q = input.value.trim(); render(); });
      clear.addEventListener('click', () => { input.value = ''; state.q = ''; input.focus(); render(); });
      $('btn-filter').addEventListener('click', () => {
        const i = (SORTS.findIndex((s) => s.key === state.sort) + 1) % SORTS.length;
        state.sort = SORTS[i].key;
        CG.toast('Urutkan: ' + SORTS[i].label);
        render();
      });
      renderChips($('chips'), state.category, (c) => { state.category = c; render(); });
      render();
    },
  };
})();

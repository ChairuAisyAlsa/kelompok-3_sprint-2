/* auth.js — simulasi login, registrasi, sesi, dan halaman profil.
   CATATAN: ini hanya simulasi di localStorage. Untuk produksi gunakan backend + hash password. */
(function () {
  window.CG = window.CG || {};

  const protectedPages = ['home', 'catalog', 'product-detail', 'cart', 'checkout', 'profile', 'search', 'logout'];
  const $ = (id) => document.getElementById(id);
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function users() { return CG.store.get('users', []); }

  function showError(msg) {
    const el = $('form-error');
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function bindPasswordToggles() {
    document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = CG.icon(show ? 'eye-off' : 'eye', 18);
        btn.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
      });
    });
  }

  CG.Auth = {
    isProtected(page) { return protectedPages.includes(page); },

    current() {
      const email = CG.store.get('session', null);
      return email ? users().find((u) => u.email === email) || null : null;
    },

    updateUser(patch) {
      const list = users();
      const i = list.findIndex((u) => u.email === CG.store.get('session', null));
      if (i === -1) return;
      list[i] = Object.assign({}, list[i], patch);
      CG.store.set('users', list);
    },

    logout() {
      CG.store.remove('session');
      CG.Nav.go('login.html');
    },

    initLogin() {
      if (CG.Auth.current()) return CG.Nav.go('home.html');
      bindPasswordToggles();
      $('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('email').value.trim().toLowerCase();
        const password = $('password').value;
        if (!emailOk(email)) return showError('Masukkan alamat email yang valid.');
        if (!password) return showError('Kata sandi belum diisi.');
        const user = users().find((u) => u.email === email && u.password === password);
        if (!user) return showError('Email atau kata sandi salah. Belum punya akun? Daftar dulu.');
        CG.store.set('session', user.email);
        CG.Nav.go('home.html');
      });
    },

    initRegister() {
      if (CG.Auth.current()) return CG.Nav.go('home.html');
      bindPasswordToggles();
      $('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('name').value.trim();
        const email = $('email').value.trim().toLowerCase();
        const phone = $('phone').value.trim();
        const password = $('password').value;
        const confirm = $('confirm').value;
        if (name.length < 2) return showError('Nama lengkap minimal 2 karakter.');
        if (!emailOk(email)) return showError('Masukkan alamat email yang valid.');
        if (!/^[0-9+\s-]{9,16}$/.test(phone)) return showError('Nomor telepon harus 9–15 digit.');
        if (password.length < 6) return showError('Kata sandi minimal 6 karakter.');
        if (password !== confirm) return showError('Konfirmasi kata sandi tidak sama.');
        if (users().some((u) => u.email === email)) return showError('Email ini sudah terdaftar. Silakan login.');
        const list = users();
        list.push({ name, email, phone, password, address: '' });
        CG.store.set('users', list);
        CG.store.set('session', email);
        CG.Nav.go('home.html');
      });
    },

    initProfile() {
      const user = CG.Auth.current();
      $('profile-name').textContent = user.name;
      $('profile-email').textContent = user.email;
      $('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
      $('stat-orders').textContent = CG.store.get('orders', []).length;
      $('stat-fav').textContent = CG.store.get('favorites', []).length;

      const actions = {
        info() {
          const name = prompt('Nama lengkap:', user.name);
          if (name && name.trim()) { CG.Auth.updateUser({ name: name.trim() }); location.reload(); }
        },
        address() {
          const address = prompt('Alamat pengiriman:', user.address || '');
          if (address !== null) { CG.Auth.updateUser({ address: address.trim() }); CG.toast('Alamat disimpan'); }
        },
        payment() { CG.toast('Pilih metode pembayaran saat checkout'); },
        orders() {
          const n = CG.store.get('orders', []).length;
          CG.toast(n ? `Kamu punya ${n} pesanan` : 'Belum ada pesanan');
        },
        favorites() { CG.Nav.go('catalog.html?fav=1'); },
        help() { CG.toast('Hubungi kami: help@closetgirls.id'); },
        logout() { CG.Nav.go('logout.html'); },
        settings() { CG.toast('Pengaturan segera hadir'); },
      };
      document.querySelectorAll('[data-action]').forEach((el) => {
        el.addEventListener('click', () => actions[el.dataset.action]());
      });
    },

    initLogout() {
      $('btn-logout').addEventListener('click', () => CG.Auth.logout());
    },
  };
})();

(function () {
  'use strict';

  // ---------- header shadow on scroll ----------
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- mobile menu ----------
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('primaryNav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  // ---------- project filter ----------
  var row = document.getElementById('filterRow');
  var grid = document.getElementById('projectsGrid');
  if (row && grid) {
    var buttons = row.querySelectorAll('.filter-btn');
    var cards = grid.querySelectorAll('.project-card');
    var empty = document.getElementById('filterEmpty');
    var apply = function (f) {
      var shown = 0;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat === f;
        c.hidden = !show;
        if (show) shown++;
      });
      buttons.forEach(function (b) {
        var on = b.dataset.filter === f;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (empty) empty.hidden = shown !== 0;
    };
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.filter-btn');
      if (!b) return;
      apply(b.dataset.filter);
      history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : '#' + b.dataset.filter);
    });
    var hash = location.hash.replace('#', '');
    if (hash && row.querySelector('[data-filter="' + hash + '"]')) apply(hash);
  }

  // ---------- contact form ----------
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var submit = form.querySelector('.form-submit');
    var label = submit.querySelector('.btn-label');
    var mailto = 'mailto:hafizabdullahawan2@gmail.com';

    form.setAttribute('novalidate', '');
    var say = function (msg, kind) { status.textContent = msg; status.className = 'form-status ' + (kind || ''); };
    var validate = function () {
      var ok = true, first = null;
      ['name', 'email', 'message'].forEach(function (id) {
        var el = form.elements[id], v = el.value.trim(), bad = false;
        if (id === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        else if (id === 'message') bad = v.length < 10;
        else bad = v.length < 2;
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) { ok = false; if (!first) first = el; }
      });
      if (!ok) { say('Please check the highlighted fields (message needs at least 10 characters).', 'err'); first.focus(); }
      return ok;
    };

    if (/[?&]sent=1/.test(location.search)) say('Thank you, your message was sent. I will reply by email soon.', 'ok');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      submit.disabled = true; label.textContent = 'Sending…'; say('');
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data.company_website) { form.reset(); say('Thank you, your message was sent.', 'ok'); submit.disabled = false; label.textContent = 'Send message'; return; }
      delete data.company_website;
      data.subject = 'Portfolio message: ' + (data.subject || 'General') + ' (' + data.name + ')';
      data.replyto = data.email;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.success, j: j }; });
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          say('Thank you, your message was sent. I will reply by email soon.', 'ok');
        } else {
          var errs = (res.j && res.j.message) ? res.j.message : 'The message could not be sent.';
          say(errs + ' You can also email ' + mailto.replace('mailto:', '') + ' directly.', 'err');
        }
      }).catch(function () {
        say('The message could not be sent right now. Please email ' + mailto.replace('mailto:', '') + ' directly.', 'err');
      }).then(function () {
        submit.disabled = false; label.textContent = 'Send message';
      });
    });
  }
})();

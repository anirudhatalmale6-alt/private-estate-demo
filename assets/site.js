/* Holland & Gray — public site behaviour (demo) */
(function () {
  var head = document.querySelector('.site-head');
  var toggle = document.querySelector('.nav-toggle');

  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', document.body.classList.contains('nav-open'));
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* staggered reveal */
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* hero elements come in on load, not on scroll */
  requestAnimationFrame(function () {
    document.querySelectorAll('.hero [data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
  });

  var y = document.querySelector('[data-year]');
  if (y) { y.textContent = new Date().getFullYear(); }

  /* consultation form — demo only, nothing leaves the browser */
  var form = document.querySelector('[data-consult-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var panel = form.querySelector('[data-form-body]');
      var done = form.querySelector('[data-form-done]');
      if (panel && done) { panel.hidden = true; done.hidden = false; done.scrollIntoView({ block: 'center' }); }
    });
  }
})();

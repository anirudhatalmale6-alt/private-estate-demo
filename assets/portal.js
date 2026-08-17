/* Holland & Gray — Private Client Portal (demo behaviour, no back end) */
(function () {

  /* ---- toast ---------------------------------------------------------- */
  var toastEl;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    requestAnimationFrame(function () { toastEl.classList.add('is-up'); });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-up'); }, 3200);
  }
  window.hgToast = toast;

  /* ---- side rail on mobile -------------------------------------------- */
  var railToggle = document.querySelector('.rail-toggle');
  if (railToggle) {
    railToggle.addEventListener('click', function () {
      document.body.classList.toggle('rail-open');
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('rail-open')) return;
      if (e.target.closest('.rail') || e.target.closest('.rail-toggle')) return;
      document.body.classList.remove('rail-open');
    });
  }

  /* ---- modals ---------------------------------------------------------- */
  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var m = document.getElementById(btn.getAttribute('data-modal-open'));
      if (m) { m.hidden = false; var f = m.querySelector('input,textarea,select'); if (f) f.focus(); }
    });
  });
  function closeModal(m) { if (m) m.hidden = true; }
  document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.closest('.modal')); });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
  });

  /* ---- request list filters ------------------------------------------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      filterBar.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      var want = b.getAttribute('data-filter');
      var shown = 0;
      document.querySelectorAll('[data-status]').forEach(function (row) {
        var on = want === 'all' || row.getAttribute('data-status') === want;
        row.style.display = on ? '' : 'none';
        if (on) shown++;
      });
      var count = document.querySelector('[data-filter-count]');
      if (count) count.textContent = shown + (shown === 1 ? ' request' : ' requests');
    });
  }

  /* ---- quote approval -------------------------------------------------- */
  var quote = document.querySelector('[data-quote]');
  if (quote) {
    var decide = function (approved) {
      var head = quote.querySelector('[data-quote-state]');
      var bar = quote.querySelector('.decision-bar');
      var body = quote.querySelector('[data-quote-outcome]');
      if (head) {
        head.className = 'chip ' + (approved ? 'chip--scheduled' : 'chip--declined');
        head.textContent = approved ? 'Approved' : 'Declined';
      }
      if (bar) bar.remove();
      if (body) {
        body.hidden = false;
        body.innerHTML = approved
          ? '<p class="u-mute" style="margin:0">Approved just now. Your estate manager has been notified and will confirm an attendance date within one business day. The request moves to <strong>Scheduled</strong>.</p>'
          : '<p class="u-mute" style="margin:0">Declined just now. Your estate manager has been notified and will follow up to discuss alternatives. No work will be arranged.</p>';
      }
      /* advance the tracker */
      if (approved) {
        var track = document.querySelector('.track');
        if (track) {
          var steps = track.querySelectorAll('li');
          steps.forEach(function (li) { li.classList.remove('now'); });
          if (steps[2]) steps[2].classList.add('done');
          if (steps[3]) { steps[3].classList.add('done', 'now'); }
        }
      }
      toast(approved ? 'Quote approved' : 'Quote declined');
    };
    var yes = quote.querySelector('[data-approve]');
    var no = quote.querySelector('[data-decline]');
    if (yes) yes.addEventListener('click', function () { decide(true); });
    if (no) no.addEventListener('click', function () { decide(false); });
  }

  /* ---- file uploads ---------------------------------------------------- */
  document.querySelectorAll('[data-drop]').forEach(function (drop) {
    var input = drop.querySelector('input[type=file]');
    var list = document.querySelector(drop.getAttribute('data-drop-list')) || drop.parentElement.querySelector('.files');

    var add = function (files) {
      Array.prototype.forEach.call(files, function (f) {
        if (!list) return;
        var ext = (f.name.split('.').pop() || 'file').toUpperCase().slice(0, 4);
        var li = document.createElement('li');
        li.innerHTML = '<span class="file-ico" data-ext="' + ext + '"></span>' +
          '<span><span style="display:block">' + f.name.replace(/[<>]/g, '') + '</span>' +
          '<span class="file-meta">Uploaded just now · ' + Math.max(1, Math.round(f.size / 1024)) + ' KB</span></span>';
        list.insertBefore(li, list.firstChild);
      });
      toast(files.length + (files.length === 1 ? ' file added' : ' files added'));
    };

    drop.addEventListener('click', function () { if (input) input.click(); });
    if (input) input.addEventListener('change', function () { if (input.files.length) add(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
    });
    ['dragleave', 'drop'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
    });
    drop.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files);
    });
  });

  /* ---- message composer ------------------------------------------------ */
  var composer = document.querySelector('[data-composer]');
  if (composer) {
    var thread = document.querySelector('[data-thread]');
    var send = function () {
      var ta = composer.querySelector('textarea');
      var text = (ta.value || '').trim();
      if (!text) return;
      var wrap = document.createElement('div');
      wrap.className = 'msg msg--me';
      wrap.innerHTML = '<p class="meta">You · just now</p><div class="bubble"></div>';
      wrap.querySelector('.bubble').textContent = text;
      thread.appendChild(wrap);
      ta.value = '';
      thread.scrollTop = thread.scrollHeight;
      toast('Message sent');

      setTimeout(function () {
        var reply = document.createElement('div');
        reply.className = 'msg';
        reply.innerHTML = '<p class="meta">Thomas Ashby · Estate Manager · just now</p>' +
          '<div class="bubble">Received, thank you. I will look into this and come back to you before the end of the day.</div>';
        thread.appendChild(reply);
        thread.scrollTop = thread.scrollHeight;
      }, 1500);
    };
    composer.querySelector('[data-send]').addEventListener('click', send);
    composer.querySelector('textarea').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
    });
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  /* ---- new service request -------------------------------------------- */
  var newReq = document.querySelector('[data-new-request]');
  if (newReq) {
    newReq.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = (newReq.querySelector('[name=title]').value || 'New request').trim();
      var area = newReq.querySelector('[name=area]').value;
      var body = document.querySelector('[data-request-rows]');
      if (body) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-status', 'new');
        tr.innerHTML =
          '<td><span class="ref">HG-2026-118</span><br><a class="title" href="request.html">' + title.replace(/[<>]/g, '') + '</a></td>' +
          '<td class="u-mute">' + area + '</td>' +
          '<td><span class="chip chip--new">New</span></td>' +
          '<td class="u-mute num">Just now</td>' +
          '<td class="u-right"><a class="b b--ghost b--sm" href="request.html">Open</a></td>';
        body.insertBefore(tr, body.firstChild);
      }
      closeModal(newReq.closest('.modal'));
      newReq.reset();
      toast('Request submitted — reference HG-2026-118');
    });
  }

  /* ---- login ------------------------------------------------------------ */
  var login = document.querySelector('[data-login]');
  if (login) {
    login.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }
})();

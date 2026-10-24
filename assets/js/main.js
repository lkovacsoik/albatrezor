/* Alba-Trezor Kft. – interakciók és animációk */
(function () {
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.header');
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  var toTop = document.querySelector('.to-top');
  var progress = document.querySelector('.scroll-progress');

  // Fejléc árnyék, görgetési sáv, vissza a tetejére gomb
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 600);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  // Mobil menü
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
      nav.style.top = header.getBoundingClientRect().bottom + 'px';
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.parentElement;
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (!li.contains(e.target) && window.innerWidth > 1080) { li.classList.remove('open'); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-sub.open').forEach(function (li) { li.classList.remove('open'); });
      if (document.body.classList.contains('nav-open')) burger.click();
    }
  });

  // Görgetésre megjelenő elemek
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Számlálók
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  // Kártyák fényfolt + enyhe dőlés az egér alatt
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        var rx = ((y / r.height) - .5) * -5, ry = ((x / r.width) - .5) * 5;
        card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });

    // Hero parallax
    var art = document.querySelector('.hero-art');
    if (art) {
      window.addEventListener('mousemove', function (e) {
        var dx = (e.clientX / window.innerWidth - .5) * 14;
        var dy = (e.clientY / window.innerHeight - .5) * 14;
        art.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      }, { passive: true });
    }
  }

  // Áttűnés oldalváltáskor (ahol a böngésző nem ismeri a View Transitions API-t)
  var supportsVT = 'onpagereveal' in window || (window.CSS && CSS.supports && CSS.supports('view-transition-name', 'none'));
  if (!supportsVT && !reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto|tel|https?):/i.test(href) || /\.pdf$/i.test(href)) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function () { window.location.href = href; }, 220);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('leaving'); });
  }

  // Kapcsolati űrlap: statikus oldalon levelezőprogramot nyit
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // spam csapda
      var name = form.name.value.trim(), email = form.email.value.trim(), phone = form.phone.value.trim(), msg = form.message.value.trim();
      var body = msg + '\n\n--\nNév: ' + name + '\nE-mail: ' + email + '\nTelefon: ' + phone;
      var subject = 'Ajánlatkérés / érdeklődés a weboldalról – ' + name;
      window.location.href = 'mailto:info@albatrezor.hu?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var ok = form.querySelector('.form-ok');
      if (ok) ok.hidden = false;
    });
  }

  // Évszám a láblécben
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();

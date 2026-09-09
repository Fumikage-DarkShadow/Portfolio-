/* ============================================================
   Mesure d'audience du portfolio
   - Google Analytics 4 (ID public, ce n'est pas un secret)
   - GoatCounter (optionnel, sans cookies, peu bloqué)
   Chargé par index.html et assets/floww-preview.html.
   Documentation complète : ANALYTICS.md
   Test en direct : ajouter ?analytics_debug=1 à l'URL puis
   GA4 > Admin > DebugView.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    ga4: 'G-4B3WB26VP4',
    goatcounter: ''   /* ex: 'ilyes-sadadou' -> tableau de bord https://ilyes-sadadou.goatcounter.com */
  };
  window.SITE_ANALYTICS = CONFIG;

  var DEBUG = /[?&]analytics_debug=1/.test(location.search);

  /* ---------- Contexte visiteur (nouveau / récurrent) ---------- */
  var visitCount = 1, firstVisit = '';
  try {
    visitCount = parseInt(localStorage.getItem('pf_visits') || '0', 10) + 1;
    localStorage.setItem('pf_visits', String(visitCount));
    firstVisit = localStorage.getItem('pf_first') || '';
    if (!firstVisit) { firstVisit = new Date().toISOString().slice(0, 10); localStorage.setItem('pf_first', firstVisit); }
  } catch (e) {}

  /* ---------- Chargement GA4 ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('set', 'user_properties', {
    visit_count: visitCount > 9 ? '10+' : String(visitCount),
    visitor_type: visitCount > 1 ? 'returning' : 'new',
    first_visit_date: firstVisit
  });
  window.gtag('config', CONFIG.ga4, {
    allow_google_signals: false,             /* pas de suivi cross-appareils Google */
    allow_ad_personalization_signals: false, /* pas de pub personnalisée */
    debug_mode: DEBUG
  });
  loadScript('https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4);

  /* ---------- Chargement GoatCounter ---------- */
  if (CONFIG.goatcounter) {
    window.goatcounter = { endpoint: 'https://' + CONFIG.goatcounter + '.goatcounter.com/count' };
    loadScript('https://gc.zgo.at/count.js');
  }

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- Envoi d'un événement (GA4 + GoatCounter) ---------- */
  var state = {
    start: Date.now(),
    visibleSince: document.visibilityState === 'visible' ? Date.now() : null,
    activeMs: 0,
    maxScroll: 0,
    clicks: 0,
    events: 0,
    sectionsSeen: []
  };

  function track(name, params, urgent) {
    params = params || {};
    state.events++;
    if (DEBUG) { try { console.log('[analytics]', name, params); } catch (e) {} }
    try {
      var p = {};
      for (var k in params) if (params[k] !== undefined && params[k] !== null && params[k] !== '') p[k] = params[k];
      if (urgent) p.transport_type = 'beacon';
      window.gtag('event', name, p);
    } catch (e) {}
    try {
      if (window.goatcounter && typeof window.goatcounter.count === 'function') {
        window.goatcounter.count({
          path: 'event/' + name + (params.label ? '/' + String(params.label).slice(0, 80) : ''),
          title: name,
          event: true
        });
      }
    } catch (e) {}
  }
  window.trackEvent = track;

  function activeSeconds() {
    var ms = state.activeMs + (state.visibleSince ? Date.now() - state.visibleSince : 0);
    return Math.round(ms / 1000);
  }

  function text(el, sel) {
    var t = sel ? el.querySelector(sel) : el;
    return t ? t.textContent.replace(/\s+/g, ' ').trim().slice(0, 100) : '';
  }

  /* ---------- Temps actif (onglet visible) ---------- */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      state.visibleSince = Date.now();
      track('tab_return', { label: 'visible', total_seconds: activeSeconds() });
    } else {
      if (state.visibleSince) state.activeMs += Date.now() - state.visibleSince;
      state.visibleSince = null;
      closeSection(true);
      track('tab_hidden', summary(), true);
    }
  });

  /* ---------- Sections : vue, temps passé ---------- */
  /* Ce script est chargé dans <head> : tout ce qui touche au DOM attend qu'il existe */
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  var sections = [];
  var currentSection = null, sectionSince = 0, sectionsViewed = {};
  ready(function () { sections = Array.prototype.slice.call(document.querySelectorAll('section[id]')); });

  function sectionAtCenter() {
    var mid = window.innerHeight / 2, best = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { best = sections[i]; break; }
    }
    return best;
  }

  function closeSection(urgent) {
    if (!currentSection) return;
    var secs = Math.round((Date.now() - sectionSince) / 1000);
    if (secs >= 1) track('section_time', { label: currentSection.id, section: currentSection.id, seconds: secs }, urgent);
    currentSection = null;
  }

  function updateSection() {
    var s = sectionAtCenter();
    if (s === currentSection) return;
    closeSection(false);
    currentSection = s;
    sectionSince = Date.now();
    if (s && !sectionsViewed[s.id]) {
      sectionsViewed[s.id] = true;
      state.sectionsSeen.push(s.id);
      track('section_view', { label: s.id, section: s.id, seconds_since_load: Math.round((Date.now() - state.start) / 1000) });
    }
  }

  /* ---------- Profondeur de défilement ---------- */
  var milestones = [25, 50, 75, 100], reached = {};
  function updateScroll() {
    var doc = document.documentElement;
    var total = Math.max(doc.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    var pct = total <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / total) * 100));
    if (pct > state.maxScroll) state.maxScroll = pct;
    milestones.forEach(function (m) {
      if (pct >= m && !reached[m]) {
        reached[m] = true;
        track('scroll_depth', { label: String(m), percent: m, seconds_since_load: Math.round((Date.now() - state.start) / 1000) });
      }
    });
  }

  var scrollTimer = null;
  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () { scrollTimer = null; updateScroll(); updateSection(); }, 300);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  ready(function () { updateScroll(); updateSection(); });
  window.addEventListener('load', function () { updateScroll(); updateSection(); });

  /* ---------- Clics ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    state.clicks++;

    var a = t.closest('a');
    var btn = t.closest('button');
    var sectionEl = t.closest('section');
    var section = sectionEl ? sectionEl.id : 'other';

    /* Expérience : retournement des cartes */
    var tl = t.closest('.timeline-card-wrapper');
    if (tl && !a) {
      track('experience_flip', { label: text(tl, '.timeline-title'), section: section });
      return;
    }

    /* Prank CV : boutons des fausses popups */
    var popup = t.closest('[id^="popup-"]');
    if (popup && btn) {
      track('cv_prank_click', { label: text(btn), popup: popup.id });
      return;
    }
    if (btn && btn.classList.contains('prank-close')) { track('cv_prank_close', { label: 'fermer' }); return; }
    if (btn && btn.classList.contains('back-to-top')) { track('back_to_top', { label: 'button', section: section }); return; }
    if (t.closest('.nav-hamburger')) { track('menu_open', { label: 'mobile' }); return; }

    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || href === '#') return;
    var card = a.closest('.project-card');

    if (/Ilyes-Sadadou-CV\.pdf/i.test(href)) {
      track('cv_download', { label: 'cv_pdf', section: section, seconds_since_load: Math.round((Date.now() - state.start) / 1000) });
      return;
    }
    if (card) {
      track('project_open', {
        label: text(card, '.project-title'),
        link_type: /\.pdf$/i.test(href) ? 'pdf' : (/^https?:/i.test(href) ? 'external' : 'page'),
        link_url: href,
        seconds_since_load: Math.round((Date.now() - state.start) / 1000)
      });
      return;
    }
    if (/recommandation/i.test(href)) { track('recommendation_open', { label: href.split('/').pop(), section: section }); return; }
    if (href.indexOf('mailto:') === 0) { track('contact_click', { label: 'email', section: section }); return; }
    if (/linkedin\.com/i.test(href)) { track('contact_click', { label: 'linkedin', section: section }); return; }
    if (/github\.com/i.test(href)) { track('contact_click', { label: 'github', section: section }); return; }
    if (href.charAt(0) === '#') { track('nav_click', { label: href.slice(1), section: section }); return; }
    if (/^https?:/i.test(href)) {
      var host = '';
      try { host = new URL(href, location.href).hostname; } catch (err) {}
      if (host && host !== location.hostname) track('outbound_click', { label: host, link_url: href, section: section });
      return;
    }
    if (/\.pdf($|\?)/i.test(href)) track('file_open', { label: href.split('/').pop(), section: section });
  }, true);

  /* ---------- Survol prolongé des cartes (ce qui attire l'œil) ---------- */
  var HOVER_MIN_MS = 800, hoverSince = null, hoverEl = null, hovered = {};
  var CARD_SEL = '.project-card, .marquee-item, .timeline-card-wrapper';
  function cardInfo(el) {
    if (el.classList.contains('project-card')) return { type: 'project', label: text(el, '.project-title') };
    if (el.classList.contains('timeline-card-wrapper')) return { type: 'experience', label: text(el, '.timeline-title') };
    var sec = el.closest('section');
    return { type: sec && sec.id === 'certifications' ? 'certification' : 'recommendation', label: text(el, '.marquee-author-name') };
  }
  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest ? e.target.closest(CARD_SEL) : null;
    if (!el || el === hoverEl) return;
    hoverEl = el; hoverSince = Date.now();
  }, true);
  document.addEventListener('mouseout', function (e) {
    if (!hoverEl) return;
    var to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(CARD_SEL) : null;
    if (to === hoverEl) return;
    var ms = Date.now() - hoverSince;
    var info = cardInfo(hoverEl);
    var key = info.type + ':' + info.label;
    if (ms >= HOVER_MIN_MS && !hovered[key]) {
      hovered[key] = true;
      track('card_hover', { label: info.label, card_type: info.type, hover_ms: ms });
    }
    hoverEl = null;
  }, true);

  /* ---------- Formulaire de contact ---------- */
  ready(function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var formStarted = false;
    form.addEventListener('focusin', function () {
      if (formStarted) return;
      formStarted = true;
      track('form_start', { label: 'contact' });
    });
    form.addEventListener('submit', function () {
      if (form.checkValidity()) return;
      var bad = form.querySelector(':invalid');
      track('form_error', { label: bad ? bad.id : 'unknown' });
    }, true);
  });

  /* ---------- Copie de texte (email copié, etc.) ---------- */
  document.addEventListener('copy', function () {
    var sel = '';
    try { sel = String(window.getSelection()); } catch (e) {}
    track('text_copy', { label: /@/.test(sel) ? 'email' : 'text', length: sel.length });
  });

  /* ---------- Sortie de page : bilan de la visite ---------- */
  function summary() {
    return {
      label: 'visit',
      total_seconds: activeSeconds(),
      max_scroll_pct: state.maxScroll,
      sections_seen: state.sectionsSeen.length,
      sections_list: state.sectionsSeen.join(','),
      clicks: state.clicks,
      events_count: state.events
    };
  }
  var exited = false;
  window.addEventListener('pagehide', function () {
    if (exited) return;
    exited = true;
    if (state.visibleSince) { state.activeMs += Date.now() - state.visibleSince; state.visibleSince = null; }
    closeSection(true);
    track('page_exit', summary(), true);
  });
})();

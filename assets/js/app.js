(function () {
  var movimento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cursorFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Cabeçalho ganha uma linha ao rolar
  var topo = $('#topo');
  var marcar = function () { topo.classList.toggle('rolou', window.scrollY > 8); };
  marcar(); window.addEventListener('scroll', marcar, { passive: true });

  // Menu de celular
  var btn = $('#menu-btn'), gaveta = $('#gaveta');
  var fechaGaveta = function () { gaveta.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; };
  btn.addEventListener('click', function () {
    var abrir = gaveta.hidden;
    gaveta.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    btn.textContent = abrir ? 'Fechar' : 'Menu';
  });
  gaveta.addEventListener('click', function (e) { if (e.target.closest('a')) fechaGaveta(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !gaveta.hidden) { fechaGaveta(); btn.focus(); } });

  $$('.ano').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Hora de São Paulo, independente do fuso de quem visita
  var ABRE = 8, FECHA = 22;
  function agoraSP() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false })
      .formatToParts(new Date()).reduce(function (o, x) { o[x.type] = x.value; return o; }, {});
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { h: (+p.hour % 24) + (+p.minute) / 60, dia: dias[p.weekday] };
  }
  var t = agoraSP(), aberto = t.h >= ABRE && t.h < FECHA;

  // Aviso "aberto agora", que muda ao longo do dia
  var fds = t.dia === 0 || t.dia === 6, promo = t.dia >= 1 && t.dia <= 3;
  var aviso;
  if (!aberto) aviso = t.h < ABRE ? 'Fechado agora · abrimos às 8h' : 'Fechado agora · voltamos amanhã às 8h';
  else if (t.h < 12) aviso = 'Aberto agora · café da manhã e croissants';
  else if (t.h < 15) aviso = fds ? 'Aberto agora · brunch de fim de semana' : 'Aberto agora · almoço executivo até as 15h';
  else if (t.h < 19) aviso = 'Aberto agora · café da tarde';
  else aviso = promo ? 'Aberto agora · pizza + vinho por R$ 39,90' : 'Aberto agora · pizza romana e vinho';
  $$('[data-status]').forEach(function (el) {
    el.querySelector('span').textContent = aviso;
    el.classList.toggle('fechado', !aberto);
  });
  $$('.semana li[data-dia="' + t.dia + '"]').forEach(function (li) { li.classList.add('hoje'); });

  // Abas dos turnos + régua do dia
  var abas = $$('.turno');
  if (abas.length) {
    var linha = $('#regua-linha');
    var pos = function (h) { return ((h - ABRE) / (FECHA - ABRE)) * 100; };
    var trechos = abas.map(function (a) {
      var s = document.createElement('span');
      s.className = 'regua-trecho';
      var ini = +a.dataset.ini, fim = +a.dataset.fim;
      s.style.left = pos(ini) + '%';
      s.style.width = 'calc(' + (pos(fim) - pos(ini)) + '% - 4px)';
      linha.appendChild(s);
      return s;
    });
    var seleciona = function (i, foco) {
      abas.forEach(function (a, j) {
        var on = i === j;
        a.setAttribute('aria-selected', String(on));
        a.tabIndex = on ? 0 : -1;
        document.getElementById(a.getAttribute('aria-controls')).hidden = !on;
        trechos[j].classList.toggle('ativo', on);
      });
      if (foco) abas[i].focus();
    };
    abas.forEach(function (a, i) {
      a.addEventListener('click', function () { seleciona(i); });
      a.addEventListener('keydown', function (e) {
        var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (e.key === 'Home') n = -i; if (e.key === 'End') n = abas.length - 1 - i;
        if (n === undefined) return;
        e.preventDefault(); seleciona((i + n + abas.length) % abas.length, true);
      });
    });
    var atual = 0;
    abas.forEach(function (a, i) { if (t.h >= +a.dataset.ini && t.h < +a.dataset.fim) atual = i; });
    seleciona(aberto ? atual : 0);
    var marca = $('#regua-agora');
    if (aberto) { marca.style.left = Math.min(pos(t.h), 96) + '%'; marca.hidden = false; }
  }

  // Cortina entre as casas: cobre a tela na cor do destino, e a página
  // seguinte abre com a mesma cor (o <head> já a deixa fechada).
  var CORES = { 'agua-fria': '#9a4325', 'casa-verde': '#24493a', 'todas': '#211c18' };
  var cortina = $('.cortina');
  if (cortina) {
    if (document.documentElement.classList.contains('chegando')) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.documentElement.classList.remove('chegando');
          cortina.classList.add('cobre');
          requestAnimationFrame(function () { cortina.classList.remove('cobre'); cortina.classList.add('sai'); });
        });
      });
    }
    cortina.addEventListener('transitionend', function (e) {
      if (e.target === cortina && cortina.classList.contains('sai')) cortina.classList.remove('sai');
    });
    if (movimento) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-casa-link]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
        var cor = CORES[a.dataset.casaLink];
        e.preventDefault();
        cortina.style.setProperty('--cortina', cor);
        cortina.classList.remove('sai');
        cortina.classList.add('cobre');
        try { sessionStorage.setItem('panni.cortina', cor); } catch (err) {}
        setTimeout(function () { location.href = a.href; }, 520);
      });
    }
    // Voltar pelo navegador não pode encontrar a tela coberta
    window.addEventListener('pageshow', function (e) { if (e.persisted) cortina.classList.remove('cobre'); });
  }

  // Mapa: só carrega o Google Maps quando a pessoa pede
  $$('[data-mapa]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = b.dataset.mapa; f.title = b.dataset.titulo; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      b.parentNode.classList.add('carregado');
      b.parentNode.appendChild(f);
      b.remove();
    });
  });

  // Faixa de fotos do salão: setas
  $$('[data-faixa]').forEach(function (grupo) {
    var faixa = $('.faixa', grupo);
    $$('[data-dir]', grupo).forEach(function (b) {
      b.addEventListener('click', function () {
        faixa.scrollBy({ left: +b.dataset.dir * faixa.clientWidth * 0.75, behavior: movimento ? 'smooth' : 'auto' });
      });
    });
  });

  if (!movimento) return;

  // ---------- Reações ao cursor ----------

  // As portas da página inicial: a casa sob o cursor se abre e a foto acompanha.
  var portas = $('.portas');
  if (portas && cursorFino) {
    var ps = $$('.porta', portas), alvo = [1, 1], cresc = [1, 1], rodando = false;
    var anima = function () {
      var mexeu = false;
      ps.forEach(function (p, i) {
        cresc[i] += (alvo[i] - cresc[i]) * 0.12;
        if (Math.abs(alvo[i] - cresc[i]) > 0.002) mexeu = true;
        p.style.setProperty('--g', cresc[i].toFixed(3));
      });
      rodando = mexeu;
      if (mexeu) requestAnimationFrame(anima);
    };
    var abre = function (i) {
      alvo = ps.map(function (_, j) { return i === -1 ? 1 : (i === j ? 1.75 : 1); });
      ps.forEach(function (p, j) { p.classList.toggle('aberta', i === j); p.classList.toggle('fechada', i !== -1 && i !== j); });
      if (!rodando) { rodando = true; requestAnimationFrame(anima); }
    };
    ps.forEach(function (p, i) {
      p.addEventListener('pointerenter', function () { abre(i); });
      p.addEventListener('focus', function () { abre(i); });
      p.addEventListener('pointermove', function (e) {
        var r = p.getBoundingClientRect();
        p.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        p.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
      p.addEventListener('pointerleave', function () { p.style.setProperty('--mx', 0); p.style.setProperty('--my', 0); });
    });
    portas.addEventListener('pointerleave', function () { abre(-1); });
    portas.addEventListener('focusout', function (e) { if (!portas.contains(e.relatedTarget)) abre(-1); });
  }

  // Abertura de cada casa: a foto se desloca um pouco contra o cursor.
  var capa = $('.capa-casa');
  if (capa && cursorFino) {
    capa.addEventListener('pointermove', function (e) {
      var r = capa.getBoundingClientRect();
      capa.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      capa.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    capa.addEventListener('pointerleave', function () { capa.style.setProperty('--mx', 0); capa.style.setProperty('--my', 0); });
  }

  // Cartões que inclinam, com uma luz no ponto do cursor
  if (cursorFino) {
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - 0.5) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--px', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--py', (y * 100).toFixed(1) + '%');
        el.classList.add('tocando');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
        el.classList.remove('tocando');
      });
    });
  }

  // Farinha peneirada: cai devagar e se afasta do cursor (ou do dedo).
  $$('canvas[data-farinha]').forEach(function (canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, graos = [], ptr = { x: -9999, y: -9999 }, raf = 0, visivel = false;
    var novo = function (topo) {
      return { x: Math.random() * W, y: topo ? -4 : Math.random() * H, r: 0.6 + Math.random() * 1.9,
        cai: 0.12 + Math.random() * 0.32, a: 0.22 + Math.random() * 0.5, f: Math.random() * 6.28, vx: 0, vy: 0 };
    };
    var medir = function () {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(150, (W * H) / 8000));
      graos = []; for (var i = 0; i < n; i++) graos.push(novo(false));
    };
    var passo = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < graos.length; i++) {
        var g = graos[i];
        g.f += 0.012;
        var dx = g.x - ptr.x, dy = g.y - ptr.y, d2 = dx * dx + dy * dy;
        if (d2 < 16900) { var d = Math.sqrt(d2) || 1, k = (1 - d / 130) * 1.4; g.vx += (dx / d) * k; g.vy += (dy / d) * k; }
        g.vx *= 0.9; g.vy *= 0.9;
        g.x += Math.sin(g.f) * 0.18 + g.vx;
        g.y += g.cai + g.vy;
        if (g.y > H + 4) graos[i] = g = novo(true);
        if (g.x < -4) g.x = W + 4; else if (g.x > W + 4) g.x = -4;
        ctx.globalAlpha = g.a;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(passo);
    };
    var liga = function () { if (!raf && visivel && !document.hidden) { ctx.fillStyle = '#fffaf0'; raf = requestAnimationFrame(passo); } };
    var desliga = function () { cancelAnimationFrame(raf); raf = 0; };
    window.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { ptr.x = ptr.y = -9999; });
    new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; visivel ? liga() : desliga(); }).observe(canvas);
    document.addEventListener('visibilitychange', function () { document.hidden ? desliga() : liga(); });
    if (window.ResizeObserver) new ResizeObserver(function () { medir(); ctx.fillStyle = '#fffaf0'; }).observe(canvas);
    medir();
  });
})();

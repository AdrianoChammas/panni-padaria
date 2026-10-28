(function () {
  // Cabeçalho ganha uma linha ao rolar
  var topo = document.getElementById('topo');
  var marcar = function () { topo.classList.toggle('rolou', window.scrollY > 8); };
  marcar(); window.addEventListener('scroll', marcar, { passive: true });

  // Menu de celular
  var btn = document.getElementById('menu-btn'), gaveta = document.getElementById('gaveta');
  btn.addEventListener('click', function () {
    var abrir = gaveta.hidden;
    gaveta.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    btn.textContent = abrir ? 'Fechar' : 'Menu';
  });
  gaveta.addEventListener('click', function (e) {
    if (e.target.closest('a')) { gaveta.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; }
  });

  document.getElementById('ano').textContent = new Date().getFullYear();

  // Hora de São Paulo, independente do fuso de quem visita
  var ABRE = 8, FECHA = 22;
  function agoraSP() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false })
      .formatToParts(new Date()).reduce(function (o, x) { o[x.type] = x.value; return o; }, {});
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { h: (+p.hour % 24) + (+p.minute) / 60, dia: dias[p.weekday] };
  }

  // Abas dos turnos + régua do dia
  var abas = Array.prototype.slice.call(document.querySelectorAll('.turno'));
  var linha = document.getElementById('regua-linha');
  var pos = function (h) { return ((h - ABRE) / (FECHA - ABRE)) * 100; };
  var trechos = abas.map(function (a) {
    var t = document.createElement('span');
    t.className = 'regua-trecho';
    var ini = +a.dataset.ini, fim = +a.dataset.fim;
    t.style.left = pos(ini) + '%';
    t.style.width = 'calc(' + (pos(fim) - pos(ini)) + '% - 4px)';
    linha.appendChild(t);
    return t;
  });

  function seleciona(i, foco) {
    abas.forEach(function (a, j) {
      var on = i === j;
      a.setAttribute('aria-selected', String(on));
      a.tabIndex = on ? 0 : -1;
      document.getElementById(a.getAttribute('aria-controls')).hidden = !on;
      trechos[j].classList.toggle('ativo', on);
    });
    if (foco) abas[i].focus();
  }
  abas.forEach(function (a, i) {
    a.addEventListener('click', function () { seleciona(i); });
    a.addEventListener('keydown', function (e) {
      var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === 'Home') n = -i; if (e.key === 'End') n = abas.length - 1 - i;
      if (n === undefined) return;
      e.preventDefault(); seleciona((i + n + abas.length) % abas.length, true);
    });
  });

  // Abre no turno de agora e escreve o aviso da abertura
  var t = agoraSP(), aberto = t.h >= ABRE && t.h < FECHA;
  var atual = 0;
  abas.forEach(function (a, i) { if (t.h >= +a.dataset.ini && t.h < +a.dataset.fim) atual = i; });
  seleciona(aberto ? atual : 0);

  var marca = document.getElementById('regua-agora');
  if (aberto) { marca.style.left = Math.min(pos(t.h), 96) + "%"; marca.hidden = false; }

  var fds = t.dia === 0 || t.dia === 6;
  var promo = t.dia >= 1 && t.dia <= 3;
  var aviso;
  if (!aberto) aviso = t.h < ABRE ? 'Fechado agora · abrimos às 8h' : 'Fechado agora · voltamos amanhã às 8h';
  else if (t.h < 12) aviso = 'Aberto agora · café da manhã e croissants';
  else if (t.h < 15) aviso = fds ? 'Aberto agora · brunch de fim de semana' : 'Aberto agora · almoço executivo até as 15h';
  else if (t.h < 19) aviso = 'Aberto agora · café da tarde';
  else aviso = promo ? 'Aberto agora · pizza + vinho por R$ 39,90' : 'Aberto agora · pizza romana e vinho';
  var el = document.getElementById('agora');
  el.querySelector('span').textContent = aviso;
  el.classList.toggle('fechado', !aberto);
})();

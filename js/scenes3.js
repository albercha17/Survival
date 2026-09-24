(function(){
  var A = window.Arena;
  var K = A.SceneKit, P = K.P, rnd = K.rnd, esc = K.esc, SC = A.SceneScripts, H = A.SceneHelpers;

  var HEX = /^#[0-9a-fA-F]{6}$/;
  function safeColor(c){ return HEX.test(c || '') ? c : '#9aa0a8'; }
  A.safeColor = safeColor;

  function banner(S, text, color, delay, top){
    var el = document.createElement('div');
    el.className = 'teambanner';
    el.style.background = safeColor(color);
    el.style.top = (top == null ? 10 : top) + 'px';
    el.textContent = text;
    S.fx.appendChild(el);
    S.anim(el, [{ opacity: 0, transform: 'translateX(-50%) scale(.4) rotate(-6deg)' }, { opacity: 1, transform: 'translateX(-50%) scale(1.12) rotate(2deg)', offset: .6 }, { opacity: 1, transform: 'translateX(-50%) scale(1) rotate(-1deg)' }], { d: 500, delay: delay });
    return el;
  }
  function teamConfetti(S, color, n, delay){
    var cols = [safeColor(color), '#ffffff', '#ffe14a'];
    for(var i = 0; i < n; i++){
      var el = document.createElement('i');
      el.className = 'conf';
      el.style.left = rnd(0, S.W) + 'px';
      el.style.background = cols[i % cols.length];
      S.fx.appendChild(el);
      S.anim(el, [{ opacity: 1, transform: 'translate(0,-14px) rotate(0)' }, { opacity: 0, transform: 'translate(' + rnd(-40, 40) + 'px,' + (S.H + 10) + 'px) rotate(' + rnd(-600, 600) + 'deg)' }], { d: rnd(1800, 2800), delay: delay + rnd(0, 900) });
    }
  }

  SC.warcry = function(S, c){
    S.sky('dusk');
    var color = S.actors[0].teamColor;
    for(var k = 0; k < 3; k++){
      S.actors.forEach(function(_, i){ S.body(i, [{ transform: 'none' }, { transform: 'translateY(-30px) scale(.95,1.08)', offset: .45 }, { transform: 'none' }], 500 + k * 520, 440, 'ease-out'); });
    }
    var cry = (c.entry.text.match(/«([^»]+)»/) || [])[1] || '¡Vamos!';
    banner(S, cry, color, 400, 12);
    S.shake(600, 3, 1400);
    teamConfetti(S, color, 26, 600);
    S.actors.forEach(function(_, i){ S.emote(i, 'anger', 2200 + i * 120, 1000); });
  };

  SC.taunt = function(S){
    S.sky('day');
    S.emote(0, 'laugh', 300, 1100);
    S.hop(0, 350, 20, 350);
    S.body(0, [{ transform: 'none' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'none' }], 700, 700);
    var from = { x: S.X[0] + 40, y: 110 }, to = { x: S.X[1] - 10, y: 120 };
    var tom = H.flyArc(S, 'apple', from, to, 1300, 600, [26, 28], 60);
    S.anim(tom, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 700, delay: 1300 });
    S.burst(to.x, to.y - 10, 1900, { n: 12, colors: ['#d6322f', '#ff7a6a'], r: 44 });
    S.word('¡PLAF!', 1900, { x: to.x, y: 10 });
    S.tint(1, 'sepia(.4) saturate(1.8) hue-rotate(-20deg)', 1900, 300);
    S.emote(1, 'anger', 2100, 1400);
    S.shiver(1, 2100, 600);
    S.emote(0, 'laugh', 2300, 1200);
  };

  SC.ambush = function(S){
    S.sky('night');
    var v = 2;
    S.walk(0, S.X[2] - S.X[0] - 190, 300, 1300);
    S.walk(1, S.X[2] - S.X[1] - 100, 300, 1300);
    S.emote(0, 'evil', 500, 1000); S.emote(1, 'evil', 650, 1000);
    S.emote(v, 'question', 700, 900);
    S.emote(v, 'exclaim', 1600, 800);
    S.word('¡AL ATAQUE!', 1700, { x: S.X[2] - 60, y: 8 });
    S.shake(1750, 5, 400);
    S.burst(S.X[2] - 40, 90, 1750, { n: 12, r: 50 });
    S.hop(0, 1700, 24, 350); S.hop(1, 1750, 24, 350);
    if(S.dead[v]){
      H.dieBy(S, v, 'fall', 1850, 1);
      S.emote(0, 'laugh', 2500, 1100);
    } else {
      S.walk(v, S.W - S.X[2] + 90, 1900, 700);
      S.emote(0, 'anger', 2400, 1000); S.emote(1, 'question', 2450, 1000);
    }
  };

  SC.defect = function(S){
    S.sky('dusk');
    var av = S.els[0].br.querySelector('.avatar');
    S.emote(0, 'dots', 300, 900);
    S.walk(0, S.X[1] - S.X[0] - S.SZ - 10, 900, 1400);
    if(av) S.anim(av, [{ borderColor: 'rgba(255,255,255,.35)' }, { borderColor: safeColor(S.actors[0].teamColor) }], { d: 500, delay: 1800 });
    S.flash(1800, 'rgba(255,255,255,.35)', 300);
    S.word('¡CAMBIO!', 1850, { x: S.W / 2, y: 8 });
    S.emote(1, 'sparkle', 2300, 1200);
    S.emote(0, 'sparkle', 2400, 1200);
    var hands = S.prop('hands', { x: S.X[1] - 50, y: 62, w: 54, h: 36, z: 8 });
    S.anim(hands, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { d: 400, delay: 2400 });
  };

  SC.teamvictory = function(S, c){
    S.sky('gold');
    var color = S.actors[0].teamColor;
    var ray = document.createElement('div');
    ray.className = 'lightray big';
    ray.style.left = (S.W / 2 - 110) + 'px';
    S.back.appendChild(ray);
    H.loop(S, ray, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { d: 9000, ease: 'linear' });
    S.actors.forEach(function(t, i){
      if(t.baby) return;
      var cr = S.attach(i, 'crown', { w: 40, h: 28, left: 22, top: -22, onBody: true });
      S.anim(cr, [{ opacity: 0, transform: 'translateY(-80px)' }, { opacity: 1, transform: 'translateY(0)' }], { d: 700, delay: 400 + i * 150, ease: 'ease-in' });
      for(var k = 0; k < 3; k++) S.hop(i, 1200 + k * 650 + i * 90, 22, 420);
    });
    teamConfetti(S, color, 40, 300);
    for(var j = 0; j < 6; j++) S.burst(rnd(30, S.W - 30), rnd(110, 190), 500 + j * 380, { n: 12, r: 60 });
    S.word('¡VICTORIA!', 900, { x: S.W / 2, y: 6, d: 1600 });
  };

  function teamLineup(root, actors, entry, isStatic){
    var n = actors.length;
    var sz = n <= 4 ? 70 : n <= 8 ? 54 : 40;
    var color = safeColor(entry.teamColor || (actors[0] && actors[0].teamColor));
    var title = entry.teamName ? esc(entry.teamName) : '';
    var h = '<div class="scene sc-lineup team-lineup' + (isStatic ? ' static' : '') + '" style="--sz:' + sz + 'px;--tc:' + color + '">' +
      '<div class="bgl lineupbg teambg"></div>' +
      (title ? '<div class="teamtitle">' + title + '</div>' : '') +
      '<div class="lineupgrid">';
    actors.forEach(function(t, i){
      h += '<div class="lu team" style="--i:' + i + '">' + A.avatar(t, sz) + '<span class="lu-name">' + esc(t.name) + '</span></div>';
    });
    root.innerHTML = h + '</div></div>';
  }

  var baseRender = A.Scenes.render;
  A.Scenes.render = function(el, entry, byId, isStatic){
    try {
      var actors = (entry.ids || []).map(byId).filter(Boolean);
      if(entry.scene === 'teamintro' || (entry.scene === 'teamvictory' && actors.length > 3)){
        teamLineup(el, actors, entry, isStatic || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
        return;
      }
      baseRender(el, entry, byId, isStatic);
    } catch(err){
      try {
        var safe = (entry.ids || []).map(byId).filter(Boolean);
        teamLineup(el, safe, { teamName: '', teamColor: null }, true);
      } catch(e2){ el.innerHTML = ''; }
      if(window.console && console.warn) console.warn('Escena con error, se muestra una alternativa:', err);
    }
  };
})();

(function(){
  var A = window.Arena = window.Arena || {};

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rnd(a, b){ return a + Math.random() * (b - a); }

  var P = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21C6 16.6 3 13.2 3 9.5 3 6.9 5 5 7.4 5c1.8 0 3.4 1 4.6 2.7C13.2 6 14.8 5 16.6 5 19 5 21 6.9 21 9.5c0 3.7-3 7.1-9 11.5z" fill="#ff5c8a"/></svg>',
    gun: '<svg viewBox="0 0 48 30"><path d="M2 3h42v9H21l-2 15H9l3-15H2z" fill="#2a2f36"/><rect x="4" y="5" width="36" height="2" fill="#5a616b"/></svg>',
    bullet: '<svg viewBox="0 0 20 8"><path d="M0 0h11q9 0 9 4t-9 4H0z" fill="#f0c94a"/></svg>',
    flash: '<svg viewBox="0 0 40 40"><path d="M20 0l5 13 13-5-8 11 10 8-13 1 1 13-8-10-9 10 1-13-13-1 10-8L2 8l13 5z" fill="#ffd54a"/><circle cx="20" cy="20" r="7" fill="#fff7c2"/></svg>',
    knife: '<svg viewBox="0 0 14 44"><path d="M7 0l6 26H1z" fill="#d5dbe1"/><rect x="3.5" y="26" width="7" height="16" rx="2.5" fill="#7a4a2a"/></svg>',
    anvil: '<svg viewBox="0 0 56 40"><path d="M2 3h52v8H36c0 7 8 9 12 12v14H8V23c4-3 12-5 12-12H2z" fill="#3a3e46"/><rect x="4" y="4" width="48" height="2" fill="#6a707a"/></svg>',
    piano: '<svg viewBox="0 0 70 52"><rect x="2" y="2" width="66" height="34" rx="5" fill="#17171c"/><rect x="6" y="22" width="58" height="12" fill="#f4f2ea"/><path d="M14 22v9M22 22v9M30 22v9M38 22v9M46 22v9M54 22v9" stroke="#111" stroke-width="3"/><rect x="8" y="36" width="5" height="14" fill="#17171c"/><rect x="57" y="36" width="5" height="14" fill="#17171c"/></svg>',
    meteor: '<svg viewBox="0 0 60 60"><path d="M46 4C54 14 46 30 30 38 20 44 12 44 8 50 6 40 12 28 22 20 32 12 40 8 46 4z" fill="#ff8a2a" opacity=".9"/><circle cx="34" cy="36" r="17" fill="#6b4a3a"/><circle cx="29" cy="31" r="4" fill="#4d3428"/><circle cx="39" cy="42" r="3" fill="#4d3428"/></svg>',
    rock: '<svg viewBox="0 0 56 44"><path d="M4 40C2 26 10 8 28 6c16 0 26 14 24 34z" fill="#7b8088"/><path d="M14 30c4-10 12-14 20-14" stroke="#9aa0a8" stroke-width="3" fill="none"/></svg>',
    bomb: '<svg viewBox="0 0 48 52"><circle cx="24" cy="30" r="18" fill="#22252b"/><rect x="20" y="8" width="8" height="8" fill="#555c66"/><path d="M28 10q8-8 14-2" stroke="#c9a56a" stroke-width="2.5" fill="none"/><circle cx="43" cy="8" r="4" fill="#ffb02a"/></svg>',
    banana: '<svg viewBox="0 0 40 26"><path d="M2 8c8 14 24 18 36 8-2 8-14 12-24 8C8 21 4 15 2 8z" fill="#f5d33a"/><path d="M2 8c2-2 4-2 5 0" stroke="#7a5a12" stroke-width="2" fill="none"/></svg>',
    bolt: '<svg viewBox="0 0 40 160" preserveAspectRatio="none"><path d="M24 0L6 70h14L10 160 36 60H22z" fill="#fff36b" stroke="#ffd12a" stroke-width="2"/></svg>',
    mushroom: '<svg viewBox="0 0 40 40"><path d="M2 22C4 8 14 2 20 2s16 6 18 20z" fill="#d6322f"/><circle cx="12" cy="13" r="3" fill="#fff"/><circle cx="24" cy="9" r="3" fill="#fff"/><circle cx="30" cy="17" r="2.5" fill="#fff"/><rect x="14" y="22" width="12" height="16" rx="4" fill="#f1e6d0"/></svg>',
    bottle: '<svg viewBox="0 0 24 44"><rect x="8" y="0" width="8" height="10" fill="#8a6a3a"/><path d="M8 10h8l6 10v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V20z" fill="#5dd16a"/><rect x="5" y="24" width="14" height="4" fill="#fff" opacity=".4"/></svg>',
    bear: '<svg viewBox="0 0 64 64"><circle cx="14" cy="14" r="9" fill="#7a4d2c"/><circle cx="50" cy="14" r="9" fill="#7a4d2c"/><circle cx="32" cy="34" r="26" fill="#8a5a34"/><ellipse cx="32" cy="42" rx="12" ry="9" fill="#d7b58a"/><circle cx="22" cy="28" r="3" fill="#111"/><circle cx="42" cy="28" r="3" fill="#111"/><ellipse cx="32" cy="38" rx="4" ry="3" fill="#111"/></svg>',
    duck: '<svg viewBox="0 0 64 60"><ellipse cx="30" cy="40" rx="24" ry="16" fill="#ffd93a"/><circle cx="20" cy="20" r="14" fill="#ffd93a"/><path d="M10 20l-10 4 10 5z" fill="#ff8f1f"/><circle cx="18" cy="16" r="3" fill="#111"/><path d="M24 10l-6 3" stroke="#111" stroke-width="2.5" stroke-linecap="round"/><path d="M56 40q-8-8-18 0" fill="#e6b820"/></svg>',
    chest: '<svg viewBox="0 0 56 44"><rect x="3" y="14" width="50" height="28" rx="4" fill="#8a5a2a"/><path d="M3 20C3 6 53 6 53 20z" fill="#a8702f"/><rect x="24" y="18" width="8" height="10" rx="2" fill="#ffd54a"/><rect x="3" y="26" width="50" height="3" fill="#6a4320"/></svg>',
    crate: '<svg viewBox="0 0 64 90"><path d="M4 30C4 8 60 8 60 30z" fill="#e8e6dc"/><path d="M4 30L28 64M60 30L36 64M32 30L32 64" stroke="#c9c6ba" stroke-width="2"/><rect x="20" y="64" width="24" height="22" rx="2" fill="#b98548"/><path d="M20 75h24M32 64v22" stroke="#8a6030" stroke-width="2"/></svg>',
    bush: '<svg viewBox="0 0 120 70" preserveAspectRatio="none"><circle cx="24" cy="44" r="24" fill="#2f7a3a"/><circle cx="56" cy="34" r="30" fill="#39903f"/><circle cx="92" cy="44" r="26" fill="#2f7a3a"/><rect x="0" y="50" width="120" height="20" fill="#2f7a3a"/></svg>',
    ghost: '<svg viewBox="0 0 40 48"><path d="M20 2C9 2 4 11 4 22v22l6-5 5 5 5-5 5 5 5-5 6 5V22C36 11 31 2 20 2z" fill="#f4f6fa"/><circle cx="14" cy="21" r="3" fill="#2a2f3a"/><circle cx="26" cy="21" r="3" fill="#2a2f3a"/><ellipse cx="20" cy="30" rx="3" ry="4" fill="#2a2f3a"/></svg>',
    ring: '<svg viewBox="0 0 30 30"><circle cx="15" cy="19" r="9" fill="none" stroke="#ffd54a" stroke-width="3.5"/><path d="M10 6l5-5 5 5-5 6z" fill="#6ee7ff"/></svg>',
    pan: '<svg viewBox="0 0 70 34"><rect x="34" y="12" width="36" height="9" rx="4" fill="#5a3a22"/><circle cx="20" cy="17" r="17" fill="#2b2e34"/><circle cx="20" cy="17" r="12" fill="#3e424a"/></svg>',
    note: '<svg viewBox="0 0 20 28"><path d="M7 3v17a5 5 0 1 0 3 4.6V9l8-2V3z" fill="#ffd6f6"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 1l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffe14a"/></svg>',
    crown: '<svg viewBox="0 0 48 32"><path d="M3 28L6 8l12 10L24 3l6 15L42 8l3 20z" fill="#ffc933" stroke="#c98d12" stroke-width="2"/><circle cx="6" cy="8" r="3" fill="#ff5c8a"/><circle cx="24" cy="4" r="3" fill="#6ee7ff"/><circle cx="42" cy="8" r="3" fill="#ff5c8a"/></svg>',
    plaster: '<svg viewBox="0 0 40 16"><rect x="1" y="2" width="38" height="12" rx="6" fill="#f0c9a0"/><rect x="14" y="2" width="12" height="12" fill="#e2b184"/></svg>',
    balloon: '<svg viewBox="0 0 40 90"><ellipse cx="20" cy="24" rx="17" ry="22" fill="#e83a4f"/><path d="M20 46l-4 6h8z" fill="#c22a3d"/><path d="M20 52C14 64 26 72 20 90" stroke="#ddd" stroke-width="1.5" fill="none"/><ellipse cx="13" cy="16" rx="4" ry="7" fill="#fff" opacity=".35"/></svg>',
    tear: '<svg viewBox="0 0 10 14"><path d="M5 0C8 5 10 7 10 9a5 5 0 0 1-10 0C0 7 2 5 5 0z" fill="#6ec1ff"/></svg>',
    cake: '<svg viewBox="0 0 44 40"><rect x="4" y="18" width="36" height="20" rx="4" fill="#f6d3a8"/><path d="M4 22c6 6 10-2 16 4s12-4 20 0v-8H4z" fill="#ff86b0"/><rect x="20" y="6" width="4" height="12" fill="#fff"/><path d="M22 1c3 3 0 5 0 5s-3-2 0-5z" fill="#ffb02a"/></svg>',
    chicken: '<svg viewBox="0 0 44 40"><ellipse cx="18" cy="16" rx="15" ry="13" fill="#c8792e"/><rect x="26" y="22" width="14" height="6" rx="3" fill="#f3e6cf" transform="rotate(35 26 22)"/><circle cx="41" cy="30" r="4" fill="#f3e6cf"/></svg>',
    hands: '<svg viewBox="0 0 60 40"><path d="M2 14l16-6 14 8 12-6 14 6-6 10-12 6-10-4-8 4-16-8z" fill="#f0c9a0" stroke="#c99a70" stroke-width="2"/></svg>',
    dust: '<svg viewBox="0 0 90 90"><circle cx="30" cy="50" r="22" fill="#e9e3d8"/><circle cx="56" cy="40" r="24" fill="#f5efe4"/><circle cx="60" cy="62" r="20" fill="#d9d2c4"/><circle cx="36" cy="30" r="15" fill="#f5efe4"/></svg>',
    tree: '<svg viewBox="0 0 40 80"><path d="M20 2L36 40H4z" fill="#2f6b3a"/><path d="M20 22L38 62H2z" fill="#2a5e33"/><rect x="17" y="62" width="6" height="16" fill="#5a3a22"/></svg>'
  };

  var XEYES = '<svg class="xeyes" viewBox="0 0 84 84" aria-hidden="true"><circle cx="35" cy="41.5" r="6" fill="#e6c29f"/><circle cx="49" cy="41.5" r="6" fill="#e6c29f"/><path d="M31 37.5l8 8M39 37.5l-8 8M45 37.5l8 8M53 37.5l-8 8" stroke="#111" stroke-width="2.4" stroke-linecap="round"/></svg>';

  function pr(name, cls, style){
    return '<div class="pr pr-' + name + (cls ? ' ' + cls : '') + '"' + (style ? ' style="' + style + '"' : '') + '>' + P[name] + '</div>';
  }
  function confetti(n){
    var colors = ['#ff5c8a', '#ffd54a', '#6ee7ff', '#7be07b', '#c792ff'];
    var h = '';
    for(var i = 0; i < n; i++){
      h += '<i class="conf" style="left:' + rnd(2, 96).toFixed(0) + '%;background:' + colors[i % colors.length] + ';--cd:' + rnd(0, 2.4).toFixed(2) + 's;--cr:' + rnd(-300, 300).toFixed(0) + 'deg"></i>';
    }
    return h;
  }
  function sparks(n, cx, cy){
    var h = '';
    for(var i = 0; i < n; i++){
      var ang = (i / n) * Math.PI * 2;
      h += pr('star', 'spark', 'left:' + cx + ';bottom:' + cy + ';--dx:' + (Math.cos(ang) * 46).toFixed(0) + 'px;--dy:' + (Math.sin(ang) * -46).toFixed(0) + 'px;--sd:' + (i * 0.12).toFixed(2) + 's');
    }
    return h;
  }
  function orbit(){
    return '<div class="orbit">' + pr('star', 'os o1') + pr('star', 'os o2') + pr('star', 'os o3') + '</div>';
  }

  var DEFAULT = { neutral: 'explore', item: 'item', alliance: 'handshake', romance: 'love', fight: 'brawl', death: 'ghost', announcement: 'lineup', victory: 'victory' };

  var S = {};
  S.love = function(){
    var h = '';
    for(var i = 0; i < 9; i++) h += pr('heart', 'heart-f', 'left:' + rnd(36, 60).toFixed(0) + '%;--hd:' + (i * 0.27).toFixed(2) + 's;--hs:' + rnd(0.7, 1.3).toFixed(2));
    return { post: h + pr('heart', 'big-heart') };
  };
  S.wedding = function(){
    return { post: confetti(16) + pr('ring', 'ring-c') + pr('heart', 'big-heart') };
  };
  S.handshake = function(){
    return { post: pr('hands', 'hs') + sparks(7, '50%', '84px') };
  };
  S.shoot = function(c){
    var vx = c.vi === 0 ? c.xs[c.n - 1] : c.xs[c.vi];
    return {
      vars: '--bx1:' + c.xs[0] + '%;--bx2:' + vx + '%',
      extra: { 0: pr('gun', 'gun') + pr('flash', 'flash') },
      post: pr('bullet', 'bullet'),
      word: '¡PAM!'
    };
  };
  S.stab = function(c){
    return {
      extra: { 0: pr('knife', 'knife') },
      post: pr('note', 'noteh', 'left:calc(' + c.xs[c.vi] + '% - 8px)'),
      word: '¡ZAS!'
    };
  };
  S.brawl = function(c){
    return { post: pr('dust', 'dust', 'left:calc(' + (c.n === 2 ? 50 : c.xs[1]) + '% - 45px)') + sparks(5, '50%', '96px'), word: '¡POW!' };
  };
  S.drop = function(c){
    var prop = c.prop || 'anvil';
    var word = prop === 'meteor' || prop === 'bomb' ? '¡BUM!' : '¡CRASH!';
    return {
      post: pr(prop, 'fall ' + (c.dies ? 'onvictim' : 'beside'), 'left:' + c.xs[c.vi] + '%'),
      word: word
    };
  };
  S.slip = function(c){
    return { pre: pr('banana', 'peel', 'left:calc(' + c.xs[c.vi] + '% - 18px)'), word: '¡BOING!' };
  };
  S.lightning = function(c){
    return { post: '<div class="whiteflash"></div>' + pr('bolt', 'bolt', 'left:calc(' + c.xs[c.vi] + '% - 22px)'), word: '¡ZAP!' };
  };
  S.trap = function(c){
    return { pre: '<div class="hole" style="left:calc(' + c.xs[c.vi] + '% - 52px)"></div>', word: '¡PLAF!' };
  };
  S.poison = function(c){
    var b = '';
    for(var i = 0; i < 6; i++) b += '<i class="bub" style="left:calc(' + c.xs[c.vi] + '% + ' + rnd(-30, 30).toFixed(0) + 'px);--bd:' + (i * 0.4).toFixed(1) + 's"></i>';
    return { post: pr(c.prop || 'mushroom', 'ptem', 'left:calc(' + c.xs[c.vi] + '% + 50px)') + b, word: '¡GLUP!' };
  };
  S.animal = function(c){
    var duck = c.prop === 'duck';
    return {
      pre: c.dies ? '' : '',
      post: pr(duck ? 'duck' : 'bear', 'critter ' + (c.dies ? 'eats' : 'chases'), '--vx:' + c.xs[c.vi] + '%') +
        (c.dies ? pr('dust', 'puff', 'left:calc(' + c.xs[c.vi] + '% - 45px)') : ''),
      word: duck ? '¡CUAC!' : '¡ÑAM!'
    };
  };
  S.fall = function(c){
    return { pre: '<div class="chasm" style="left:calc(' + c.xs[c.vi] + '% + 16px)"></div>', word: '¡AAAH!' };
  };
  S.balloon = function(c){
    return { aiExtra: (function(){ var o = {}; o[c.vi] = pr('balloon', 'balloon'); return o; })(), word: c.dies ? '' : '¡POP!' };
  };
  S.item = function(c){
    var chest = c.prop === 'chest';
    return {
      post: pr(chest ? 'chest' : 'crate', chest ? 'gift chest' : 'gift crate', 'left:calc(' + c.xs[0] + '% + ' + (c.n === 1 ? 64 : 0) + 'px)') + sparks(6, c.xs[0] + '%', '80px'),
      word: '¡TACHÁN!'
    };
  };
  S.hide = function(c){
    return { post: pr('bush', 'bushfront', 'left:calc(' + c.xs[0] + '% - 62px)') };
  };
  S.explore = function(){
    return { pre: pr('tree', 'tr t1') + pr('tree', 'tr t2') + pr('tree', 'tr t3') };
  };
  S.injured = function(c){
    var o = {}; o[0] = pr('plaster', 'plaster') + orbit();
    return { aiExtra: o, word: '¡AY!' };
  };
  S.dance = function(){
    var h = '';
    for(var i = 0; i < 6; i++) h += pr('note', 'noteh2', 'left:' + rnd(12, 88).toFixed(0) + '%;--nd:' + (i * 0.45).toFixed(2) + 's');
    return { pre: h };
  };
  S.feast = function(){
    return { post: '<div class="table"></div>' + pr('cake', 'food', 'left:28%') + pr('chicken', 'food', 'left:60%'), word: '¡ÑAM!' };
  };
  S.mourn = function(c){
    var d = '';
    for(var i = 0; i < 16; i++) d += '<i class="drop" style="left:' + rnd(2, 98).toFixed(0) + '%;--rd:' + rnd(0, 1.2).toFixed(2) + 's"></i>';
    var o = {};
    c.actors.forEach(function(t, i){
      if(!(c.entry.deaths || []).length || c.entry.deaths.indexOf(t.id) === -1){
        o[i] = pr('tear', 'tear t1') + pr('tear', 'tear t2');
      }
    });
    return { pre: d, aiExtra: o };
  };
  S.split = function(){
    return {
      post: '<div class="bheart"><div class="hl">' + P.heart + '</div><div class="hr">' + P.heart + '</div></div>',
      word: '¡CRAC!'
    };
  };
  S.awkward = function(){
    return { post: '<div class="bubble">…</div>' + pr('tear', 'sweat') };
  };
  S.pan = function(c){
    var o = {};
    o[c.vi] = orbit();
    return { extra: { 0: pr('pan', 'pan') }, aiExtra: o, word: '¡BOING!' };
  };
  S.ghost = function(){ return {}; };

  function lineup(actors, isStatic){
    var n = actors.length;
    var sz = n <= 6 ? 64 : n <= 12 ? 50 : 38;
    var h = '<div class="scene sc-lineup' + (isStatic ? ' static' : '') + '" style="--sz:' + sz + 'px">';
    actors.forEach(function(t, i){
      h += '<div class="lu" style="--i:' + i + '">' + A.avatar(t, sz) + '</div>';
    });
    return h + '</div>';
  }

  function victory(t, isStatic){
    return '<div class="scene sc-victory' + (isStatic ? ' static' : '') + '" style="--sz:112px">' +
      '<div class="spot"></div>' + confetti(26) + '<div class="sc-ground"></div>' +
      '<div class="actor a-0 lives" style="--x:50%"><div class="ai">' + A.avatar(t, 112) + pr('crown', 'crown') + '</div><span class="who">' + esc(t.name) + '</span></div>' +
      '</div>';
  }

  A.Scenes = {
    render: function(el, entry, byId, isStatic){
      var key = entry.scene || DEFAULT[entry.type] || 'explore';
      var actors = (entry.ids || []).map(byId).filter(Boolean);
      if(!actors.length){ el.innerHTML = ''; return; }
      if(key === 'victory'){ el.innerHTML = victory(actors[0], isStatic); return; }
      if(key === 'lineup' || actors.length > 3){ el.innerHTML = lineup(actors, isStatic); return; }
      if(!S[key]) key = 'explore';

      var deaths = entry.deaths || [];
      var xs = { 1: [50], 2: [28, 68], 3: [18, 46, 74] }[actors.length];
      var vi = -1;
      actors.forEach(function(t, i){ if(vi < 0 && deaths.indexOf(t.id) !== -1) vi = i; });
      var dies = vi >= 0;
      if(!dies) vi = actors.length - 1;

      var out = S[key]({ n: actors.length, xs: xs, vi: vi, dies: dies, entry: entry, actors: actors, prop: entry.prop }) || {};
      var extra = out.extra || {}, aiExtra = out.aiExtra || {};

      var h = '<div class="scene sc-' + key + ' n' + actors.length + (isStatic ? ' static' : '') + '"' + (out.vars ? ' style="' + out.vars + '"' : '') + '>';
      h += '<div class="sc-ground"></div>' + (out.pre || '');
      actors.forEach(function(t, i){
        var dead = deaths.indexOf(t.id) !== -1;
        h += '<div class="actor a-' + i + (dead ? ' dies' : ' lives') + (i === vi ? ' vic' : '') + '" style="--x:' + xs[i] + '%;--i:' + i + '">' +
          '<div class="ai">' + A.avatar(t, 84) + XEYES + (aiExtra[i] || '') + '</div>' +
          (extra[i] || '') + '<span class="who">' + esc(t.name) + '</span></div>';
      });
      h += (out.post || '');
      if(key !== 'balloon'){
        actors.forEach(function(t, i){
          if(deaths.indexOf(t.id) !== -1) h += '<div class="ghostfloat" style="--x:' + xs[i] + '%">' + P.ghost + '</div>';
        });
      }
      if(out.word) h += '<div class="sc-word">' + out.word + '</div>';
      h += '</div>';
      el.innerHTML = h;
    }
  };
})();

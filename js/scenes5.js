(function(){
  var A = window.Arena;
  var K = A.SceneKit, P = K.P, rnd = K.rnd, SC = A.SceneScripts, H = A.SceneHelpers;

  P.teacup = '<svg viewBox="0 0 30 24"><path d="M3 4h20v8a10 10 0 0 1-20 0z" fill="#f4f1ea"/><path d="M23 7a5 5 0 0 1 0 8" stroke="#f4f1ea" stroke-width="3" fill="none"/><ellipse cx="13" cy="4" rx="10" ry="2.4" fill="#a0612a"/><ellipse cx="13" cy="22" rx="13" ry="2" fill="#dcd6c8"/></svg>';
  P.teapot = '<svg viewBox="0 0 50 40"><ellipse cx="24" cy="24" rx="18" ry="14" fill="#6ec1ff"/><path d="M40 20l10-8-4 14z" fill="#6ec1ff"/><path d="M6 18Q-2 22 6 30" stroke="#6ec1ff" stroke-width="4" fill="none"/><rect x="18" y="6" width="12" height="6" rx="3" fill="#4b9ad6"/><circle cx="24" cy="5" r="3" fill="#4b9ad6"/></svg>';
  P.bombfuse = '<svg viewBox="0 0 40 44"><circle cx="18" cy="26" r="16" fill="#22252b"/><circle cx="12" cy="20" r="4" fill="#4a4f58"/><rect x="15" y="6" width="7" height="6" fill="#555c66"/><path d="M22 8q8-8 14-2" stroke="#c9a56a" stroke-width="2.4" fill="none"/></svg>';
  P.spark = '<svg viewBox="0 0 20 20"><path d="M10 0l2 7 7-2-5 5 5 5-7-2-2 7-2-7-7 2 5-5-5-5 7 2z" fill="#ffd54a"/></svg>';
  P.bat = '<svg viewBox="0 0 40 20"><path d="M20 8q-4-8-10-6 2 4-2 6-4-4-8-2 6 4 8 12 4-6 8-4 2-2 4-2 2 0 4 2 4-2 8 4 2-8 8-12-4-2-8 2-4-2-2-6-6-2-10 6z" fill="#6a5a86"/><circle cx="18" cy="9" r="1" fill="#ff5c5c"/><circle cx="22" cy="9" r="1" fill="#ff5c5c"/></svg>';
  P.robot = '<svg viewBox="0 0 60 80"><rect x="14" y="4" width="32" height="24" rx="5" fill="#9aa4b2"/><circle cx="24" cy="15" r="4" fill="#6ee7ff"/><circle cx="36" cy="15" r="4" fill="#6ee7ff"/><rect x="24" y="22" width="12" height="3" fill="#5a616b"/><path d="M30 4V0" stroke="#5a616b" stroke-width="2"/><circle cx="30" cy="0" r="2" fill="#ff5c5c"/><rect x="10" y="30" width="40" height="30" rx="4" fill="#b9c3d4"/><rect x="22" y="38" width="16" height="10" rx="2" fill="#6ee7ff"/><rect x="2" y="32" width="8" height="22" rx="3" fill="#9aa4b2"/><rect x="50" y="32" width="8" height="22" rx="3" fill="#9aa4b2"/><rect x="16" y="60" width="10" height="18" rx="3" fill="#9aa4b2"/><rect x="34" y="60" width="10" height="18" rx="3" fill="#9aa4b2"/></svg>';
  P.unicorn = '<svg viewBox="0 0 90 70"><ellipse cx="44" cy="40" rx="28" ry="16" fill="#fff"/><path d="M62 30q10-18 22-12-4 10-14 18z" fill="#fff"/><path d="M78 16l8-14-2 16z" fill="#ffd54a"/><circle cx="78" cy="22" r="1.8" fill="#111"/><path d="M60 26q-6-8 0-14q4 8 10 4" fill="#ff7ac2"/><path d="M60 22q-8-2-10 4" stroke="#9be7ff" stroke-width="4" fill="none"/><rect x="24" y="52" width="6" height="16" rx="3" fill="#fff"/><rect x="36" y="52" width="6" height="16" rx="3" fill="#fff"/><rect x="50" y="52" width="6" height="16" rx="3" fill="#fff"/><rect x="60" y="50" width="6" height="16" rx="3" fill="#fff"/><path d="M16 36q-12 4-12 16q8-6 14-8" fill="#c792ff"/></svg>';
  P.rainbow = '<svg viewBox="0 0 200 100" preserveAspectRatio="none"><path d="M0 100A100 100 0 0 1 200 100" stroke="#ff5c5c" stroke-width="10" fill="none"/><path d="M10 100A90 90 0 0 1 190 100" stroke="#ffb02a" stroke-width="10" fill="none"/><path d="M20 100A80 80 0 0 1 180 100" stroke="#ffe14a" stroke-width="10" fill="none"/><path d="M30 100A70 70 0 0 1 170 100" stroke="#7be07b" stroke-width="10" fill="none"/><path d="M40 100A60 60 0 0 1 160 100" stroke="#6ec1ff" stroke-width="10" fill="none"/><path d="M50 100A50 50 0 0 1 150 100" stroke="#c792ff" stroke-width="10" fill="none"/></svg>';
  P.palm = '<svg viewBox="0 0 80 150"><path d="M40 150Q34 90 44 40" stroke="#8a5a2a" stroke-width="9" fill="none"/><path d="M44 40q-30-10-40 8 18-6 40-6zM44 40q30-12 36 6-16-6-36-4zM44 40q-10-28-30-32 16 12 28 32zM44 40q14-26 32-26-18 10-30 28z" fill="#3f8a45"/><circle cx="40" cy="46" r="5" fill="#6a4320"/><circle cx="48" cy="48" r="5" fill="#6a4320"/></svg>';
  P.hammock = '<svg viewBox="0 0 140 40"><path d="M4 4Q70 60 136 4" stroke="#e2c47a" stroke-width="3" fill="none"/><path d="M14 12Q70 50 126 12Q70 36 14 12Z" fill="#e2493f"/></svg>';
  P.coconut = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#6a4320"/><circle cx="7" cy="8" r="1.4" fill="#3b2410"/><circle cx="12" cy="7" r="1.4" fill="#3b2410"/></svg>';
  P.cards = '<svg viewBox="0 0 30 40"><rect x="1" y="1" width="28" height="38" rx="4" fill="#fff" stroke="#ccc"/><path d="M15 12c-3-5-9-1-5 4l5 5 5-5c4-5-2-9-5-4z" fill="#e2493f"/><text x="5" y="34" font-size="8" font-family="sans-serif" fill="#e2493f">A</text></svg>';
  P.bubble = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#bfe8ff" fill-opacity=".25" stroke="#e8f7ff" stroke-width="2.5"/><ellipse cx="32" cy="28" rx="12" ry="7" fill="#fff" fill-opacity=".6" transform="rotate(-30 32 28)"/></svg>';
  P.foot = '<svg viewBox="0 0 90 140"><rect x="22" y="0" width="46" height="90" fill="#f0c9a0"/><path d="M8 90h80q6 0 6 16v14q0 16-16 16H14Q2 136 2 120v-16q0-14 6-14z" fill="#f0c9a0"/><path d="M60 120v12M72 118v14M84 114v18" stroke="#c99a70" stroke-width="2"/></svg>';
  P.surfboard = '<svg viewBox="0 0 90 20"><path d="M2 10Q2 2 30 2H80Q90 10 80 18H30Q2 18 2 10Z" fill="#ffd54a" stroke="#e2493f" stroke-width="2"/><path d="M20 10h56" stroke="#e2493f" stroke-width="3"/></svg>';
  P.kite = '<svg viewBox="0 0 50 60"><path d="M25 0L48 22L25 44L2 22Z" fill="#e2493f"/><path d="M25 0v44M2 22h46" stroke="#fff" stroke-width="1.6"/><path d="M25 44q-6 8 0 16" stroke="#555" stroke-width="1.2" fill="none"/></svg>';

  function pos(S, i){ return S.X[i] + S.pos[i].x; }

  SC.tea = function(S){
    S.sky('warm');
    var m = S.n > 1 ? H.mid(S, 0, S.n - 1) : pos(S, 0) + 70;
    var t = document.createElement('div'); t.className = 'ptable big'; S.front.appendChild(t);
    S.prop('teapot', { x: m, y: 56, w: 44, h: 36, z: 6 });
    S.actors.forEach(function(_, k){
      var cup = S.prop('teacup', { x: pos(S, k) + (k === 0 ? 34 : -34), y: 58, w: 26, h: 20, z: 6 });
      S.anim(cup, [{ transform: 'rotate(0)' }, { transform: 'translateY(-26px) rotate(-30deg)' }, { transform: 'rotate(0)' }], { d: 900, delay: 900 + k * 400 });
      for(var i = 0; i < 3; i++) S.floaty('puff', pos(S, k) + (k === 0 ? 34 : -34), 76, 500 + i * 500 + k * 200, { size: 12, rise: 40, d: 1100 });
    });
    S.word('¡CHIN, CHIN!', 1100, { x: m, y: 8 });
    S.actors.forEach(function(_, k){ S.emote(k, 'sparkle', 1800 + k * 150, 1300); });
  };

  SC.bomb = function(S){
    S.sky('dusk');
    var last = S.n - 1, v = S.vi;
    var holders = S.actors.map(function(_, k){ return k; });
    var bomb = S.prop('bombfuse', { x: pos(S, 0) + 30, y: 96, w: 36, h: 40, z: 9 });
    var fr = [], total = 2400, hops = 5;
    for(var k = 0; k <= hops; k++){
      var who = holders[k % holders.length];
      fr.push({ transform: 'translate(' + (pos(S, who) - pos(S, 0) - (who === 0 ? 0 : 30)) + 'px,' + (k % 2 ? -30 : 0) + 'px) rotate(' + (k * 90) + 'deg)', offset: k / hops });
    }
    var endX = pos(S, v) - pos(S, 0) - (v === 0 ? 0 : 30);
    fr[fr.length - 1] = { transform: 'translate(' + endX + 'px,0) rotate(' + (hops * 90) + 'deg)', offset: 1 };
    S.anim(bomb, fr, { d: total, delay: 300, ease: 'ease-in-out' });
    var sp = S.prop('spark', { x: pos(S, 0) + 42, y: 132, w: 14, h: 14, z: 10 });
    S.anim(sp, fr, { d: total, delay: 300, ease: 'ease-in-out' });
    H.loop(S, sp.firstChild, [{ transform: 'scale(.6)' }, { transform: 'scale(1.3)' }], { d: 120, dir: 'alternate' });
    S.actors.forEach(function(_, k){ S.emote(k, 'exclaim', 400 + k * 300, 700); S.shiver(k, 700, 1800); });
    S.word('¡PATATA CALIENTE!', 500, { x: S.W / 2, y: 6 });
    S.anim(bomb, [{ opacity: 1 }, { opacity: 0 }], { d: 60, delay: 2750 });
    S.anim(sp, [{ opacity: 1 }, { opacity: 0 }], { d: 60, delay: 2750 });
    if(S.hasDeath){
      S.flash(2750, 'rgba(255,200,120,.85)', 400);
      S.burst(pos(S, v), 80, 2750, { n: 18, colors: ['#ffb02a', '#ff5a2a', '#fff3a0'], r: 80 });
      S.word('¡BUM!', 2780, { x: pos(S, v), y: 30 });
      S.shake(2750, 8, 400);
      H.dieBy(S, v, 'launch', 2760, v === 0 ? -1 : 1);
    } else {
      S.confetti(24, 2750);
      S.word('¡ERA DE BROMA!', 2780, { x: S.W / 2, y: 30 });
      S.actors.forEach(function(_, k){ S.emote(k, 'laugh', 3000 + k * 120, 1100); });
    }
  };

  SC.quicksand = function(S){
    S.sky('warm');
    var v = S.vi, x = pos(S, v);
    var pit = document.createElement('div'); pit.className = 'sandpit'; pit.style.left = (x - 70) + 'px'; S.back.appendChild(pit);
    S.anim(pit, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { d: 500, delay: 200 });
    S.body(v, [{ transform: 'translateY(0)' }, { transform: 'translateY(30px)' }, { transform: 'translateY(52px)' }], 500, 2200, 'ease-in');
    S.emote(v, 'exclaim', 600, 900);
    S.emote(v, 'cry', 1700, 900);
    S.word('¡SOCORRO!', 1200, { x: x, y: 8 });
    if(S.n > 1 && !S.hasDeath){
      var res = v === 0 ? 1 : 0;
      var rope = S.prop('rope', { x: (pos(S, res) + x) / 2, y: 70, w: 10, h: 80, z: 7, origin: '50% 0%' });
      S.anim(rope, [{ opacity: 0, transform: 'rotate(-90deg)' }, { opacity: 1, transform: 'rotate(' + (res < v ? -70 : 70) + 'deg)' }], { d: 500, delay: 2300 });
      S.body(v, [{ transform: 'translateY(52px)' }, { transform: 'translateY(0)' }], 2900, 900, 'ease-out');
      S.emote(v, 'heart', 3700, 1200);
    } else if(S.hasDeath){
      S.body(v, [{ transform: 'translateY(52px)', opacity: 1 }, { transform: 'translateY(110px)', opacity: 0 }], 2800, 900, 'ease-in');
      S.ghost(v, 3400);
    } else {
      S.body(v, [{ transform: 'translateY(52px)' }, { transform: 'translateY(0)' }], 2800, 1200, 'ease-out');
      S.emote(v, 'sweat', 3900, 1000);
    }
  };

  SC.bats = function(S){
    S.sky('cave');
    for(var i = 0; i < 16; i++){
      var b = S.prop('bat', { x: -30, y: rnd(90, 190), w: 30, h: 15, z: 8 });
      var tx = S.W + 60, dy = rnd(-50, 30);
      S.anim(b, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + tx * .5 + 'px,' + dy + 'px)' }, { transform: 'translate(' + tx + 'px,' + (-dy) + 'px)' }], { d: rnd(1200, 1900), delay: 300 + i * 90, ease: 'linear' });
      H.loop(S, b.firstChild, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.4)' }], { d: 120, dir: 'alternate' });
    }
    S.actors.forEach(function(_, k){ S.emote(k, 'exclaim', 400 + k * 90, 800); S.body(k, [{ transform: 'none' }, { transform: 'translateY(8px) scale(1.05,.9)' }], 450, 400); });
    S.word('¡IIIIH!', 700, { x: S.W / 2, y: 8 });
    S.shake(600, 2, 1600);
    S.actors.forEach(function(_, k){ S.emote(k, 'sweat', 2400 + k * 100, 1000); });
  };

  SC.robot = function(S){
    S.sky('night');
    var v = S.vi, x = pos(S, v);
    var r = S.prop('robot', { x: S.W + 50, y: 26, w: 58, h: 78, z: 4 });
    var tx = x + 76 - S.W - 50;
    var fr = [{ transform: 'translate(0,0)' }];
    for(var k = 1; k <= 6; k++) fr.push({ transform: 'translate(' + (tx * k / 6) + 'px,' + (k % 2 ? -4 : 0) + 'px) rotate(' + (k % 2 ? 4 : -4) + 'deg)' });
    S.anim(r, fr, { d: 1400, delay: 200, ease: 'linear' });
    S.emote(v, 'question', 900, 900);
    S.word('BIP BUP', 1100, { x: x + 60, y: 10 });
    if(S.hasDeath){
      S.flash(2000, 'rgba(110,231,255,.7)', 400);
      var beam = S.prop('bolt', { x: x + 30, y: 60, w: 24, h: 60, z: 8 });
      S.anim(beam, [{ opacity: 0, transform: 'rotate(80deg)' }, { opacity: 1, transform: 'rotate(80deg)' }, { opacity: 0, transform: 'rotate(80deg)' }], { d: 400, delay: 2000 });
      H.dieBy(S, v, 'burn', 2050);
    } else {
      S.anim(r, [{ transform: 'translate(' + tx + 'px,0) rotate(-10deg)' }, { transform: 'translate(' + tx + 'px,-14px) rotate(10deg)' }], { d: 300, delay: 1800, iter: 6, dir: 'alternate' });
      S.word('¡BAILA!', 1900, { x: S.W / 2, y: 50 });
      H.loop(S, S.els[v].ai, [{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg) translateY(-8px)' }], { d: 300, dir: 'alternate', delay: 2000 });
    }
  };

  SC.unicorn = function(S){
    S.sky('day');
    var rb = S.prop('rainbow', { x: S.W / 2, y: 30, w: S.W * 1.1, h: 150, z: 1, back: true });
    S.anim(rb, [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: .85, clipPath: 'inset(0 0 0 0)' }], { d: 900, delay: 200 });
    var u = S.prop('unicorn', { x: -60, y: 110, w: 86, h: 66, z: 8 });
    S.anim(u, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (S.W * .5 + 60) + 'px,-50px)', offset: .5 }, { transform: 'translate(' + (S.W + 140) + 'px,0)' }], { d: 2600, delay: 700, ease: 'ease-in-out' });
    for(var i = 0; i < 10; i++) S.floaty('star', rnd(40, S.W - 40), rnd(110, 170), 900 + i * 180, { size: rnd(8, 14), rise: 30, d: 900 });
    S.actors.forEach(function(_, k){ S.emote(k, 'heart', 1300 + k * 150, 1600); S.hop(k, 1500 + k * 150, 20, 380); });
    S.word('¡UN UNICORNIO!', 1200, { x: S.W / 2, y: 6 });
  };

  SC.hammock = function(S){
    S.sky('warm');
    var v = S.vi, x = pos(S, v);
    S.prop('palm', { x: x - 80, y: 26, w: 70, h: 140, z: 1, back: true });
    S.prop('palm', { x: x + 80, y: 26, w: 70, h: 140, z: 1, back: true });
    S.prop('hammock', { x: x, y: 58, w: 150, h: 40, z: 2 });
    S.body(v, [{ transform: 'translate(40px,-38px) rotate(-80deg)' }, { transform: 'translate(40px,-38px) rotate(-80deg)' }], 0, 10);
    H.loop(S, S.els[v].actor, [{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }], { d: 1400, dir: 'alternate', ease: 'ease-in-out' });
    S.emote(v, 'zzz', 300, 1500);
    var co = S.prop('coconut', { x: x - 64, y: 150, w: 18, h: 18, z: 9 });
    S.anim(co, [{ transform: 'translate(0,0)' }, { transform: 'translate(0,0)', offset: .6 }, { transform: 'translate(64px,70px)' }], { d: 1600, delay: 900, ease: 'ease-in' });
    S.word('¡TOC!', 2500, { x: x, y: 20 });
    if(S.hasDeath){ S.xeyes(v, 2500); S.grayOut(v, 2600, 400); S.ghost(v, 2900); }
    else { S.hop(v, 2500, 20, 300); S.emote(v, 'anger', 2700, 1100); H.orbitStars(S, v, 2500); }
  };

  SC.kiss = function(S){
    S.sky('love');
    H.approach(S, 0, 1, 300, 900, -6);
    S.lean(0, 12, 1200, 400); S.lean(1, -12, 1200, 400);
    var m = H.mid(S, 0, 1);
    var big = S.prop('heart', { x: m, y: 140, w: 50, h: 50, z: 9 });
    S.anim(big, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.5)', offset: .5 }, { opacity: 1, transform: 'scale(1.1)' }], { d: 600, delay: 1500 });
    H.loop(S, big, [{ transform: 'scale(1.1)' }, { transform: 'scale(1.3)' }], { d: 420, dir: 'alternate', delay: 2100 });
    S.burst(m, 140, 1550, { n: 16, shape: 'heart', r: 80 });
    S.tint(0, 'saturate(1.3) brightness(1.08) sepia(.15)', 1500, 400); S.tint(1, 'saturate(1.3) brightness(1.08) sepia(.15)', 1500, 400);
    S.word('¡MUA!', 1600, { x: m, y: 6 });
    for(var i = 0; i < 8; i++) S.floaty('heart', m + rnd(-30, 30), 120, 1800 + i * 200, { size: rnd(12, 20) });
  };

  SC.poker = function(S, c){
    S.sky('night');
    var last = S.n - 1, m = H.mid(S, 0, last);
    if(S.n === 2) H.approach(S, 0, 1, 200, 600, 50);
    H.tableBetween(S, 0, last, 26);
    for(var i = 0; i < 5; i++){
      var cd = S.prop('cards', { x: m, y: 52, w: 18, h: 24, z: 7 });
      S.anim(cd, [{ opacity: 0, transform: 'translate(0,-60px) rotate(0)' }, { opacity: 1, transform: 'translate(' + rnd(-40, 40) + 'px,0) rotate(' + rnd(-40, 40) + 'deg)' }], { d: 400, delay: 500 + i * 120 });
    }
    S.emote(0, 'dots', 1000, 900); S.emote(last, 'dots', 1100, 900);
    var sleeve = S.attach(0, 'cards', { w: 16, h: 22, left: 56, top: 56 });
    S.anim(sleeve, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { d: 300, delay: 1900 });
    S.emote(last, 'exclaim', 2200, 800);
    S.word('¡TRAMPAS!', 2250, { x: m, y: 8 });
    S.emote(last, 'anger', 2900, 1200); S.emote(0, 'sweat', 2900, 1200);
    if(c.prop){
      var sz = S.itemSize(c.prop);
      var it = H.flyArc(S, c.prop, { x: pos(S, last) - 40, y: 90 }, { x: pos(S, 0) + 40, y: 90 }, 1500, 500, sz, 30);
      S.anim(it, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 600, delay: 1500 });
    }
  };

  SC.bubble = function(S){
    S.sky('day');
    var v = S.vi;
    for(var i = 0; i < 10; i++){
      var b = S.prop('bubble', { x: rnd(20, S.W - 20), y: 30, w: rnd(14, 30), h: 0, z: 3 });
      b.style.height = b.style.width;
      S.anim(b, [{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-40px)', offset: .2 }, { opacity: 0, transform: 'translateY(-170px) translateX(' + rnd(-30, 30) + 'px)' }], { d: rnd(2000, 3000), delay: i * 200 });
    }
    var big = S.prop('bubble', { x: pos(S, v), y: 18, w: 110, h: 110, z: 8 });
    S.anim(big, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: 900 });
    S.emote(v, 'exclaim', 1200, 800);
    var up = S.hasDeath ? S.H + 40 : 80;
    S.anim(big, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + up + 'px) translateX(20px)' }], { d: 2200, delay: 1500, ease: 'ease-in' });
    S.body(v, [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + up + 'px) translateX(20px)' }], 1500, 2200, 'ease-in');
    S.word('¡FLOTA!', 1600, { x: pos(S, v), y: 6 });
    if(S.hasDeath) S.ghost(v, 3300);
    else {
      S.anim(big, [{ opacity: 1 }, { opacity: 0 }], { d: 80, delay: 3700 });
      S.burst(pos(S, v) + 20, 100, 3700, { n: 10, colors: ['#e8f7ff', '#bfe8ff'], r: 40 });
      S.word('¡PLOP!', 3720, { x: pos(S, v), y: 40 });
      S.body(v, [{ transform: 'translateY(-80px) translateX(20px)' }, { transform: 'none' }], 3720, 400, 'ease-in');
    }
  };

  SC.giantfoot = function(S){
    S.sky('day');
    var v = S.vi, x = pos(S, v);
    shadow(S, x, 300, 1400);
    S.emote(v, 'question', 500, 900);
    var ft = S.prop('foot', { x: S.hasDeath ? x : x + 90, y: 20, w: 80, h: 130, z: 9 });
    S.anim(ft, [{ transform: 'translateY(-260px)' }, { transform: 'translateY(-260px)', offset: .6 }, { transform: 'translateY(0)' }], { d: 1600, delay: 300, ease: 'ease-in' });
    S.shake(1900, 9, 400);
    S.word('¡PISOTÓN!', 1900, { x: S.W / 2, y: 8 });
    S.burst(x, 30, 1900, { n: 14, colors: ['#e9e3d8', '#d9d2c4'], r: 70 });
    if(S.hasDeath) S.dieSquash(v, 1900);
    else { S.hop(v, 1700, 36, 400); S.emote(v, 'sweat', 2300, 1100); }
    S.anim(ft, [{ transform: 'translateY(0)' }, { transform: 'translateY(-260px)' }], { d: 700, delay: 2900, ease: 'ease-in' });
  };
  function shadow(S, x, delay, dur){
    var el = document.createElement('div');
    el.className = 'gshadow';
    el.style.left = (x - 50) + 'px'; el.style.width = '100px';
    S.back.appendChild(el);
    S.anim(el, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: .7, transform: 'scale(1.2)' }], { d: dur, delay: delay, ease: 'ease-in' });
  }

  SC.lasers = function(S){
    S.sky('night');
    var v = S.vi, x = pos(S, v);
    for(var i = 0; i < 6; i++){
      var l = document.createElement('div');
      l.className = 'laser';
      l.style.bottom = (40 + i * 22) + 'px';
      l.style.transform = 'rotate(' + rnd(-12, 12) + 'deg)';
      S.front.appendChild(l);
      S.anim(l, [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: .6 }, { opacity: 1 }], { d: 800, delay: 200 + i * 60, iter: 3 });
    }
    S.emote(v, 'exclaim', 600, 800);
    S.body(v, [{ transform: 'none' }, { transform: 'translateY(-20px) rotate(-20deg)' }, { transform: 'translateY(10px) rotate(30deg) scaleY(.8)' }, { transform: 'translateY(-26px) rotate(-10deg)' }, { transform: 'none' }], 900, 1600, 'ease-in-out');
    S.word('¡MISIÓN IMPOSIBLE!', 1000, { x: S.W / 2, y: 6 });
    if(S.hasDeath){ S.flash(2600, 'rgba(255,40,60,.6)', 350); H.dieBy(S, v, 'burn', 2600); }
    else { S.walk(v, S.W - S.X[v] + 80, 2600, 800); S.emote(v, 'sparkle', 2600, 700); }
  };

  SC.surf = function(S){
    S.sky('sea');
    var v = S.vi;
    S.actors.forEach(function(_, k){
      var sb = S.prop('surfboard', { x: pos(S, k), y: 52, w: 86, h: 18, z: 6 });
      S.anim(sb, [{ transform: 'translate(0,0)' }, { transform: 'translate(20px,-30px) rotate(-8deg)', offset: .4 }, { transform: 'translate(40px,-10px) rotate(6deg)', offset: .7 }, { transform: 'translate(0,0)' }], { d: 2600, delay: 400 + k * 100 });
      S.els[k].actor.style.zIndex = 7;
      S.body(k, [{ transform: 'translateY(-38px)' }, { transform: 'translateY(-38px)' }], 0, 10);
    });
    var wv = document.createElement('div'); wv.className = 'bigwave small'; S.front.appendChild(wv);
    S.anim(wv, [{ transform: 'translateX(-' + (S.W + 60) + 'px)' }, { transform: 'translateX(' + (S.W + 60) + 'px)' }], { d: 2600, delay: 400, ease: 'ease-in-out' });
    S.actors.forEach(function(_, k){
      S.anim(S.els[k].actor, [{ transform: 'translate(0,0)' }, { transform: 'translate(20px,-30px) rotate(-8deg)', offset: .4 }, { transform: 'translate(40px,-10px) rotate(6deg)', offset: .7 }, { transform: 'translate(0,0)' }], { d: 2600, delay: 400 + k * 100 });
    });
    S.word('¡OLA!', 900, { x: S.W / 2, y: 6 });
    if(S.hasDeath){ S.emote(v, 'exclaim', 1600, 700); S.body(v, [{ transform: 'translateY(-38px)', opacity: 1 }, { transform: 'translateY(90px) rotate(200deg)', opacity: 0 }], 1900, 800, 'ease-in'); S.ghost(v, 2700); }
    else S.actors.forEach(function(_, k){ S.emote(k, 'sparkle', 2200 + k * 100, 1100); });
  };

  SC.kite = function(S){
    S.sky('day');
    var v = S.vi, x = pos(S, v);
    var kt = S.prop('kite', { x: x + 40, y: 150, w: 44, h: 52, z: 8 });
    H.loop(S, kt, [{ transform: 'rotate(-10deg) translateY(0)' }, { transform: 'rotate(10deg) translateY(-8px)' }], { d: 600, dir: 'alternate' });
    var line = document.createElement('div'); line.className = 'kiteline'; line.style.left = (x + 30) + 'px'; S.front.appendChild(line);
    S.emote(v, 'sparkle', 500, 900);
    S.word('¡SOPLA!', 1300, { x: S.W / 2, y: 8 });
    var up = S.hasDeath ? S.H + 60 : 60;
    S.body(v, [{ transform: 'none' }, { transform: 'translateY(-' + up + 'px) translateX(' + (S.hasDeath ? 90 : 20) + 'px) rotate(-10deg)' }], 1400, S.hasDeath ? 2400 : 1200, 'ease-in');
    S.anim(kt, [{ opacity: 1 }, { opacity: S.hasDeath ? 0 : 1 }], { d: 2400, delay: 1400 });
    S.anim(line, [{ opacity: 1 }, { opacity: 0 }], { d: 400, delay: 1400 });
    S.emote(v, 'exclaim', 1500, 800);
    if(S.hasDeath) S.ghost(v, 3500);
    else { S.body(v, [{ transform: 'translateY(-60px) translateX(20px) rotate(-10deg)' }, { transform: 'none' }], 2700, 600, 'ease-in'); S.emote(v, 'sweat', 3300, 1000); }
  };
})();

(function(){
  var A = window.Arena;
  var K = A.SceneKit, P = K.P, rnd = K.rnd, SC = A.SceneScripts, H = A.SceneHelpers;

  P.tent = '<svg viewBox="0 0 120 80"><path d="M4 78 L60 8 L116 78Z" fill="#c9793a"/><path d="M60 8 L60 78" stroke="#a35f28" stroke-width="2"/><path d="M60 30 L34 78 H86Z" fill="#3b2410"/><path d="M60 8 v-6" stroke="#8a6a3a" stroke-width="3"/><path d="M60 2 l14 5 -14 4z" fill="#ff5c8a"/></svg>';
  P.cavemouth = '<svg viewBox="0 0 140 90"><path d="M0 90 Q4 20 70 6 Q136 20 140 90Z" fill="#5a5060"/><path d="M22 90 Q26 40 70 30 Q114 40 118 90Z" fill="#100c12"/><circle cx="20" cy="70" r="10" fill="#6a6070"/><circle cx="122" cy="64" r="12" fill="#6a6070"/></svg>';
  P.lantern = '<svg viewBox="0 0 24 40"><rect x="8" y="0" width="8" height="5" fill="#6a6a70"/><path d="M6 5h12l2 4v22l-2 4H6l-2-4V9z" fill="#ffd54a" stroke="#6a6a70" stroke-width="2"/><rect x="4" y="34" width="16" height="5" fill="#6a6a70"/></svg>';
  P.stork = '<svg viewBox="0 0 90 60"><path d="M4 30 Q40 6 70 24 L88 24 L70 30 Q40 44 4 30Z" fill="#fff" stroke="#c9c9c9" stroke-width="1.5"/><path d="M40 22 Q46 4 62 8 Q54 14 52 24Z" fill="#fff" stroke="#c9c9c9" stroke-width="1.5"/><path d="M70 24 L88 22 L72 28Z" fill="#ff8a3a"/><circle cx="66" cy="22" r="1.6" fill="#111"/><path d="M22 34 l-6 20M30 36 l-2 20" stroke="#ff8a3a" stroke-width="2"/></svg>';
  P.bundle = '<svg viewBox="0 0 40 44"><path d="M4 14 Q20 -2 36 14 L34 40 H6Z" fill="#fff" stroke="#d6d6d6" stroke-width="1.5"/><path d="M6 30 L34 26" stroke="#ffd54a" stroke-width="3"/><circle cx="20" cy="15" r="7" fill="#f3d7b8"/></svg>';
  P.pot = '<svg viewBox="0 0 50 40"><path d="M4 10h42l-4 26a6 6 0 0 1-6 4H14a6 6 0 0 1-6-4z" fill="#3a3f47"/><rect x="2" y="6" width="46" height="6" rx="3" fill="#5a616b"/><path d="M6 12h4M40 12h4" stroke="#1d2126" stroke-width="3"/></svg>';
  P.rod = '<svg viewBox="0 0 70 50"><path d="M4 46 Q30 4 66 8" stroke="#8a5a2a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M66 8 v34" stroke="#ddd" stroke-width="1"/></svg>';
  P.boot = '<svg viewBox="0 0 34 40"><path d="M8 2h14v22l10 6v8H4V24z" fill="#6a4a2a"/><rect x="8" y="2" width="14" height="6" fill="#8a6a3a"/></svg>';
  P.dice = '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" stroke="#bbb"/><circle cx="8" cy="8" r="2" fill="#222"/><circle cx="16" cy="8" r="2" fill="#222"/><circle cx="12" cy="12" r="2" fill="#222"/><circle cx="8" cy="16" r="2" fill="#222"/><circle cx="16" cy="16" r="2" fill="#222"/></svg>';
  P.mic = '<svg viewBox="0 0 20 44"><circle cx="10" cy="9" r="8" fill="#9aa0a8"/><path d="M8 17h4l-1 26H9z" fill="#2a2f36"/><path d="M4 9h12" stroke="#5a616b" stroke-width="2"/></svg>';
  P.bee = '<svg viewBox="0 0 24 18"><ellipse cx="12" cy="10" rx="8" ry="6" fill="#ffd54a"/><path d="M9 4v12M14 4v12" stroke="#222" stroke-width="2.4"/><ellipse cx="9" cy="3" rx="4" ry="3" fill="#dff2ff" fill-opacity=".8"/><ellipse cx="15" cy="3" rx="4" ry="3" fill="#dff2ff" fill-opacity=".8"/></svg>';
  P.boulder = '<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="33" fill="#7b8088"/><path d="M14 26q8-12 22-8M46 44q8 2 12-6M22 50q6 6 16 4" stroke="#5a6068" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="26" cy="30" r="5" fill="#8b9098"/></svg>';
  P.volcano = '<svg viewBox="0 0 120 80"><path d="M0 80 L44 14 H76 L120 80Z" fill="#5a3a2a"/><path d="M44 14 H76 L70 24 H50Z" fill="#ff5a2a"/><path d="M52 24 l-8 56M68 24 l8 56" stroke="#ff8a2a" stroke-width="3" opacity=".6"/></svg>';
  P.tornado = '<svg viewBox="0 0 70 110"><path d="M4 4h62l-8 14H12zM14 22h42l-8 14H22zM22 40h26l-6 14H28zM28 58h14l-4 14h-6zM31 76h8l-2 12h-4z" fill="#8a94a6" opacity=".9"/></svg>';
  P.eagle = '<svg viewBox="0 0 90 50"><path d="M2 20 Q26 -4 45 18 Q64 -4 88 20 Q64 16 45 34 Q26 16 2 20Z" fill="#7a5a3a"/><circle cx="45" cy="24" r="7" fill="#f4f1de"/><path d="M45 26 l7 3 -7 2z" fill="#ffb02a"/><circle cx="43" cy="22" r="1.4" fill="#111"/></svg>';
  P.croc = '<svg viewBox="0 0 100 44"><path d="M2 30 Q30 8 60 16 L96 20 L96 30 L60 32 Q30 44 2 30Z" fill="#4f8a3a"/><path d="M60 16 L96 20 L96 24 L60 22Z" fill="#6fae52"/><circle cx="58" cy="14" r="4" fill="#ffe14a"/><circle cx="58" cy="14" r="1.6" fill="#111"/><path d="M70 22l3 4 3-4 3 4 3-4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>';
  P.crab = '<svg viewBox="0 0 56 44"><ellipse cx="28" cy="26" rx="16" ry="11" fill="#e2493f"/><circle cx="21" cy="14" r="3" fill="#fff"/><circle cx="35" cy="14" r="3" fill="#fff"/><circle cx="21" cy="14" r="1.3" fill="#111"/><circle cx="35" cy="14" r="1.3" fill="#111"/><path d="M12 24 Q2 20 4 8 Q12 10 14 20ZM44 24 Q54 20 52 8 Q44 10 42 20Z" fill="#e2493f"/><path d="M12 32l-8 6M18 36l-4 6M38 36l4 6M44 32l8 6" stroke="#b83a32" stroke-width="2.4" stroke-linecap="round"/></svg>';
  P.apple = '<svg viewBox="0 0 30 32"><path d="M15 8C6 2 0 12 4 22s8 10 11 8c3 2 7 2 11-8s-2-20-11-14z" fill="#d6322f"/><path d="M15 8q0-5 5-6" stroke="#5a3a1c" stroke-width="2.4" fill="none"/><path d="M17 4q6-3 9 1-4 3-9-1z" fill="#4f9a3a"/></svg>';
  P.letter = '<svg viewBox="0 0 36 26"><rect x="1" y="1" width="34" height="24" rx="3" fill="#fff" stroke="#d9d0c0" stroke-width="1.5"/><path d="M2 3l16 12L34 3" stroke="#d9d0c0" stroke-width="1.6" fill="none"/><path d="M18 9c-2-3-6 0-3 3l3 3 3-3c3-3-1-6-3-3z" fill="#ff5c8a"/></svg>';
  P.soap = '<svg viewBox="0 0 36 22"><rect x="2" y="4" width="32" height="16" rx="7" fill="#9be7ff"/><circle cx="10" cy="4" r="3" fill="#fff" fill-opacity=".8"/><circle cx="26" cy="3" r="2" fill="#fff" fill-opacity=".8"/></svg>';
  P.rocket = '<svg viewBox="0 0 30 60"><path d="M15 2 Q26 16 24 42 H6 Q4 16 15 2Z" fill="#f4f4f0"/><circle cx="15" cy="20" r="4.5" fill="#6ec1ff"/><path d="M6 34l-6 12 8-4zM24 34l6 12-8-4z" fill="#e2493f"/><path d="M9 42h12l-3 12h-6z" fill="#ffb02a"/></svg>';
  P.seesaw = '<svg viewBox="0 0 90 34"><path d="M40 34 L45 16 L50 34Z" fill="#7b8088"/><rect x="2" y="12" width="86" height="6" rx="3" fill="#a06a32" transform="rotate(-8 45 15)"/></svg>';
  P.bird = '<svg viewBox="0 0 24 14"><path d="M1 10Q6 -2 12 8Q18 -2 23 10Q18 5 12 12Q6 5 1 10Z" fill="#222"/></svg>';
  P.babybottle = '<svg viewBox="0 0 20 44"><rect x="6" y="0" width="8" height="8" rx="3" fill="#ff9aa8"/><rect x="3" y="8" width="14" height="34" rx="5" fill="#f4f4f0" stroke="#dcdcdc"/><path d="M5 22h10M5 28h10M5 34h10" stroke="#9ad0ff" stroke-width="1.6"/></svg>';
  P.puff = '<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="#9be08a" fill-opacity=".8"/></svg>';
  P.lava = '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.5" fill="#ff7a2a"/></svg>';

  function fadeActor(S, i, to, delay, dur){
    S.anim(S.els[i].actor, [{ opacity: to ? 0 : 1 }, { opacity: to ? 1 : 0 }], { d: dur || 150, delay: delay });
  }
  function water(S, h){
    var el = document.createElement('div');
    el.className = 'water';
    el.style.height = (h || 52) + 'px';
    S.front.appendChild(el);
    return el;
  }
  function sign(S, text, x, y, delay){
    var el = document.createElement('div');
    el.className = 'sign';
    el.style.left = (x - 44) + 'px'; el.style.bottom = y + 'px';
    el.textContent = text;
    S.front.appendChild(el);
    S.anim(el, [{ opacity: 0, transform: 'translateY(8px) scale(.6)' }, { opacity: 1, transform: 'none' }], { d: 300, delay: delay });
  }
  function birdsAway(S, x, y, delay){
    for(var i = 0; i < 3; i++){
      var b = S.prop('bird', { x: x + i * 8, y: y + i * 6, w: 22, h: 13, z: 8 });
      S.anim(b, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(0,0)', offset: .05 }, { opacity: 1, transform: 'translate(' + (S.W * .5 + i * 30) + 'px,-' + (60 + i * 16) + 'px)', offset: .9 }, { opacity: 0, transform: 'translate(' + (S.W * .6 + i * 30) + 'px,-' + (70 + i * 16) + 'px)' }], { d: 1600, delay: delay + i * 120, ease: 'ease-in' });
    }
  }
  function faint(S, i, delay, back){
    S.body(i, [{ transform: 'none' }, { transform: 'rotate(10deg)', offset: .2 }, { transform: 'translate(8px,-34px) rotate(82deg)' }], delay, 700, 'ease-in');
    S.emote(i, 'dots', delay + 600, 700);
    if(back) S.body(i, [{ transform: 'translate(8px,-34px) rotate(82deg)' }, { transform: 'none' }], back, 500, 'ease-out');
  }

  /* ---------- intimidad y pillados ---------- */
  SC.cave = function(S, c){
    S.sky('night');
    var m = H.mid(S, 0, 1), tent = c.prop === 'tent';
    var sh = S.prop(tent ? 'tent' : 'cavemouth', { x: m, y: 24, w: tent ? 130 : 150, h: tent ? 86 : 96, z: 6 });
    S.walk(0, m - S.X[0] - 12, 250, 900); S.walk(1, m - S.X[1] + 12, 250, 900);
    S.emote(0, 'heart', 400, 900); S.emote(1, 'heart', 500, 900);
    fadeActor(S, 0, false, 1200); fadeActor(S, 1, false, 1200);
    var fr = [{ transform: 'rotate(0)' }], k;
    for(k = 0; k < 12; k++) fr.push({ transform: 'rotate(' + (k % 2 ? 2.2 : -2.2) + 'deg) scaleY(' + (k % 2 ? 1.03 : .97) + ')' });
    fr.push({ transform: 'rotate(0)' });
    S.anim(sh, fr, { d: 1900, delay: 1400, ease: 'linear' });
    for(var i = 0; i < 10; i++) S.floaty('heart', m + rnd(-34, 34), tent ? 100 : 110, 1400 + i * 190, { size: rnd(14, 24), rise: 90 });
    birdsAway(S, m - 30, 118, 1500);
    sign(S, 'NO MOLESTAR', m, 116, 900);
    fadeActor(S, 0, true, 3300); fadeActor(S, 1, true, 3300);
    S.emote(0, 'sweat', 3400, 1100); S.emote(1, 'heart', 3450, 1100);
  };

  SC.caught = function(S, c){
    S.sky('night');
    var m = H.mid(S, 0, 1), type = c.entry.type;
    var tent = S.prop('tent', { x: m, y: 24, w: 140, h: 88, z: 6 });
    S.walk(0, m - S.X[0] - 12, 200, 600); S.walk(1, m - S.X[1] + 12, 200, 600);
    fadeActor(S, 0, false, 850); fadeActor(S, 1, false, 850);
    var fr = [{ transform: 'rotate(0)' }], k;
    for(k = 0; k < 10; k++) fr.push({ transform: 'rotate(' + (k % 2 ? 2 : -2) + 'deg)' });
    fr.push({ transform: 'rotate(0)' });
    S.anim(tent, fr, { d: 1300, delay: 900, ease: 'linear' });
    for(var i = 0; i < 6; i++) S.floaty('heart', m + rnd(-30, 30), 100, 900 + i * 200, { size: rnd(12, 20), rise: 80 });
    S.mv(2, S.W - S.X[2] + 70, 0, 0, 1);
    S.walk(2, 0, 700, 1300);
    S.attach(2, 'lantern', { w: 22, h: 36, left: -12, top: 38, onBody: false });
    S.emote(2, 'exclaim', 2050, 900);
    S.flash(2150, 'rgba(255,230,140,.85)', 380);
    S.word('¡PILLADOS!', 2200, { x: m, y: 4 });
    S.anim(tent, [{ opacity: 1 }, { opacity: .12 }], { d: 250, delay: 2200 });
    fadeActor(S, 0, true, 2200); fadeActor(S, 1, true, 2200);
    S.emote(0, 'sweat', 2300, 1300); S.emote(1, 'exclaim', 2350, 1300);
    if(S.hasDeath){
      S.emote(2, 'anger', 2500, 800);
      var gun = S.attach(2, 'gun', { w: 46, h: 30, left: -50, top: 36, origin: '90% 60%' });
      S.anim(gun, [{ opacity: 0 }, { opacity: 1 }], { d: 100, delay: 2500 });
      S.word('¡PAM!', 2750, { x: S.X[1] + 30, y: 26 });
      S.shake(2800, 6, 300);
      H.dieBy(S, S.vi, 'fall', 2820, -1);
    } else if(type === 'fight'){
      S.emote(2, 'anger', 2500, 900);
      for(var j = 0; j < 4; j++) S.burst(m + rnd(-30, 30), 70 + rnd(0, 40), 2600 + j * 180, { n: 4, r: 34 });
      S.shake(2650, 5, 500);
      S.word('¡POW!', 2700, { x: m - 10, y: 18 });
      S.walk(1, S.pos[1].x - 60, 3000, 500);
    } else if(type === 'alliance'){
      S.emote(2, 'question', 2500, 800);
      S.emote(2, 'sparkle', 3200, 1000);
      var hands = S.prop('hands', { x: (m + S.X[2]) / 2, y: 62, w: 58, h: 40, z: 8 });
      S.anim(hands, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { d: 400, delay: 3100 });
    } else if(type === 'theft' || type === 'betrayal'){
      S.emote(2, 'evil', 2500, 1200);
      S.emote(0, 'cry', 3000, 1000);
    } else {
      S.emote(2, 'dots', 2500, 900);
      S.walk(2, S.W - S.X[2] + 80, 3000, 900);
      S.emote(2, 'laugh', 3000, 900);
    }
  };

  SC.pregnant = function(S){
    S.sky('love');
    S.emote(0, 'question', 400, 900);
    S.emote(0, 'exclaim', 1200, 900);
    S.body(0, [{ transform: 'none' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'none' }], 400, 1600, 'ease-in-out');
    S.word('¡POSITIVO!', 1300, { x: S.X[0] });
    for(var i = 0; i < 8; i++) S.floaty('heart', S.X[0] + rnd(-40, 40), 110, 1500 + i * 220, { size: rnd(14, 22) });
    S.emote(0, 'heart', 2100, 1400);
    S.burst(S.X[0], 130, 1400, { n: 10, r: 60, shape: 'heart' });
    if(S.n === 2){
      S.emote(1, 'exclaim', 1400, 800);
      faint(S, 1, 1500, 3000);
      S.emote(1, 'heart', 3200, 1200);
    }
  };

  SC.birth = function(S, c){
    S.sky(c.prop === 'stork' ? 'day' : 'love');
    var baby = 1, stork = c.prop === 'stork';
    S.anim(S.els[baby].actor, [{ opacity: 0 }, { opacity: 0 }], { d: 10 });
    var t0 = 1500;
    if(!stork){
      S.emote(0, 'exclaim', 300, 800);
      S.emote(0, 'sweat', 1000, 900);
      S.shiver(0, 500, 900);
      if(S.n === 3){ S.emote(2, 'exclaim', 600, 800); faint(S, 2, 1100, 3000); }
    } else {
      var st = S.prop('stork', { x: -60, y: 150, w: 84, h: 56, z: 8 });
      var tx = S.X[baby] + 60;
      S.anim(st, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (tx + 60) + 'px,0)', offset: .5 }, { transform: 'translate(' + (S.W + 90) + 'px,-20px)' }], { d: 2200, delay: 300, ease: 'linear' });
      var bd = S.prop('bundle', { x: S.X[baby], y: 150, w: 34, h: 38, z: 8 });
      S.anim(bd, [{ opacity: 0, transform: 'translate(' + (tx - S.X[baby] - 4) + 'px,0)' }, { opacity: 1, transform: 'translate(' + (tx - S.X[baby] - 4) + 'px,0)', offset: .01 }, { opacity: 1, transform: 'translate(0,80px)', offset: .95 }, { opacity: 0, transform: 'translate(0,84px)' }], { d: 700, delay: 1000, ease: 'ease-in' });
      S.emote(0, 'exclaim', 1300, 900); S.emote(2, 'question', 1400, 900);
      t0 = 1700;
    }
    S.anim(S.els[baby].actor, [{ opacity: 0 }, { opacity: 1 }], { d: 200, delay: t0 });
    S.body(baby, [{ transform: 'scale(0)' }, { transform: 'scale(1.25)', offset: .6 }, { transform: 'scale(1)' }], t0, 500, 'ease-out');
    S.flash(t0, 'rgba(255,240,200,.75)', 400);
    S.word('¡BUAAA!', t0 + 100, { x: S.X[baby], y: 6 });
    S.emote(baby, 'cry', t0 + 600, 1400);
    S.burst(S.X[baby], 100, t0, { n: 14, colors: ['#ff9aa8', '#9ad0ff', '#ffe14a', '#fff'], r: 70 });
    S.confetti(22, t0 + 100);
    for(var i = 0; i < 8; i++) S.floaty('heart', S.X[baby] + rnd(-40, 40), 100, t0 + 200 + i * 180, { size: rnd(14, 22), rise: 100 });
    S.emote(0, 'heart', t0 + 700, 1500);
    if(S.n === 3){ S.hop(2, t0 + 1500, 22, 400); S.emote(2, 'heart', t0 + 1600, 1300); }
  };

  SC.nanny = function(S, c){
    var pr = c.prop || 'heart', baby = S.n - 1;
    S.sky(pr === 'note' || pr === 'zzz' ? 'night' : 'day');
    if(S.n === 2) H.approach(S, 0, 1, 300, 700, 24);
    else { S.mv(0, S.X[1] - S.X[0] - S.SZ - 6, 0, 300, 700); S.mv(2, -(S.X[2] - S.X[1] - 76), 0, 300, 700); }
    var bx = S.X[baby] + S.pos[baby].x;
    if(pr === 'note'){
      S.body(0, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }], 800, 700, 'ease-in-out');
      for(var i = 0; i < 6; i++) S.floaty('note', bx + rnd(-30, 30), 120, 800 + i * 340, { size: 16, rise: 70 });
      S.emote(baby, 'zzz', 2000, 1500);
    } else if(pr === 'stink'){
      for(var j = 0; j < 7; j++) S.floaty('puff', bx + rnd(-18, 18), 70, 900 + j * 220, { size: rnd(16, 26), rise: 70 });
      S.emote(0, 'exclaim', 1000, 800); S.emote(0, 'sweat', 1700, 1100);
      S.walk(0, S.pos[0].x - 36, 1200, 500);
      S.word('¡PUAJ!', 1300, { x: bx, y: 6 });
      S.emote(baby, 'laugh', 1900, 1300);
    } else if(pr === 'cry'){
      for(var r = 0; r < 4; r++){
        var ring = document.createElement('div');
        ring.className = 'wave-ring';
        ring.style.left = (bx - 15) + 'px';
        S.fx.appendChild(ring);
        S.anim(ring, [{ opacity: .9, transform: 'scale(.3)' }, { opacity: 0, transform: 'scale(5)' }], { d: 900, delay: 700 + r * 380 });
      }
      S.emote(baby, 'cry', 700, 2000);
      S.body(0, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }], 800, 500, 'ease-in-out');
      S.emote(0, 'sweat', 1400, 1000);
      birdsAway(S, bx, 130, 900);
      S.emote(0, 'exclaim', 2400, 700);
      S.emote(0, 'laugh', 3000, 1000);
    } else if(pr === 'crawl'){
      S.walk(baby, S.pos[baby].x + 70, 700, 1200);
      S.emote(0, 'exclaim', 900, 700);
      S.walk(0, S.pos[0].x + 90, 1300, 900);
      S.word('¡GATEA!', 1000, { x: bx + 20, y: 10 });
      S.emote(baby, 'sparkle', 1900, 1000);
      S.hop(0, 2300, 16, 300);
    } else if(pr === 'anger'){
      S.emote(0, 'anger', 900, 1100);
      S.hop(0, 1000, 22, 350);
      S.emote(baby, 'laugh', 1000, 1400);
      S.word('¡TIRÓN!', 1050, { x: S.X[0] + S.pos[0].x, y: 8 });
    } else if(pr === 'bottle'){
      var bt = S.attach(baby, 'babybottle', { w: 16, h: 36, left: 44, top: 30, onBody: true });
      S.anim(bt, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { d: 300, delay: 700 });
      S.burst(bx, 90, 1500, { n: 8, colors: ['#fff'], r: 34 });
      S.emote(baby, 'anger', 1500, 900);
      S.emote(0, 'cry', 1900, 1400);
    } else if(pr === 'zzz'){
      S.emote(baby, 'zzz', 700, 1600);
      S.emote(0, 'dots', 1000, 1200);
      var cr = S.prop('cricket', { x: S.W * .5, y: 26, w: 28, h: 18, z: 5 });
      H.loop(S, cr, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], { d: 260, dir: 'alternate', delay: 1200 });
      S.emote(0, 'anger', 2400, 1200);
    } else if(pr === 'photo'){
      S.flash(1700, '#fff', 400);
      S.word('¡FOTO!', 1750, { x: S.X[1], y: 8 });
      S.emote(0, 'sparkle', 900, 900); S.emote(1, 'sparkle', 950, 900); S.emote(baby, 'laugh', 1900, 1400);
    } else {
      for(var h = 0; h < 8; h++) S.floaty('heart', bx + rnd(-30, 30), 110, 900 + h * 220, { size: rnd(14, 22) });
      S.emote(0, 'heart', 1000, 1600); S.emote(baby, 'sparkle', 1200, 1600);
      S.hop(baby, 1500, 18, 380);
    }
  };

  /* ---------- vida cotidiana ---------- */
  SC.bath = function(S){
    S.sky('day');
    var w = water(S, 54);
    S.body(0, [{ transform: 'translateY(0)' }, { transform: 'translateY(30px)' }], 300, 500);
    for(var i = 0; i < 7; i++) S.floaty('star', S.X[0] + rnd(-30, 30), 60, 700 + i * 220, { size: 8, rise: 60, d: 1000 });
    S.emote(0, 'sparkle', 800, 1000);
    S.emote(0, 'exclaim', 1900, 800);
    S.body(0, [{ transform: 'translateY(30px)' }, { transform: 'translateY(-40px)', offset: .5 }, { transform: 'translateY(0)' }], 1900, 700, 'ease-out');
    S.word('¡AUCH!', 1950, { x: S.X[0] });
    S.burst(S.X[0], 60, 1950, { n: 10, colors: ['#9bd6ff', '#fff'], r: 50 });
    S.emote(0, 'anger', 2700, 1000);
  };

  SC.karaoke = function(S){
    S.sky('party');
    S.actors.forEach(function(_, k){
      var mic = S.attach(k, 'mic', { w: 14, h: 34, left: 60, top: 34, onBody: false });
      S.anim(mic, [{ opacity: 0 }, { opacity: 1 }], { d: 200, delay: 300 + k * 100 });
      H.loop(S, S.els[k].ai, [{ transform: 'translateY(0) rotate(-4deg)' }, { transform: 'translateY(-8px) rotate(4deg)' }], { d: 380, dir: 'alternate', delay: 500 + k * 120, ease: 'ease-in-out' });
      S.emote(k, 'sparkle', 800 + k * 200, 1200);
    });
    for(var i = 0; i < 10; i++) S.floaty('note', rnd(30, S.W - 30), 120, 500 + i * 300, { size: rnd(18, 28), rise: 90 });
    birdsAway(S, S.X[0] + 40, 130, 1300);
    S.word('¡LA LA LÁ!', 900, { x: S.W / 2, y: 6 });
  };

  SC.cook = function(S){
    S.sky('warm');
    var m = S.n === 2 ? H.mid(S, 0, 1) : S.X[0] + 60;
    if(S.n === 2) H.approach(S, 0, 1, 250, 700, 70);
    var fire = S.prop('fire', { x: m, y: 26, w: 40, h: 48, z: 6, origin: '50% 100%' });
    H.loop(S, fire, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.12) scaleX(.93)' }], { d: 380, dir: 'alternate' });
    S.prop('pot', { x: m, y: 62, w: 48, h: 38, z: 6 });
    for(var i = 0; i < 8; i++) S.floaty('puff', m + rnd(-10, 10), 96, 500 + i * 260, { size: 14, rise: 50, d: 1100 });
    S.body(0, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }], 600, 400, 'ease-in-out');
    S.emote(0, 'idea', 800, 1100);
    S.emote(S.n === 2 ? 1 : 0, 'heart', 1900, 1400);
    S.word('¡ÑAM!', 1900, { x: m, y: 4 });
    S.hop(0, 2000, 18, 380);
  };

  SC.fish = function(S){
    S.sky('day');
    water(S, 40);
    S.actors.forEach(function(_, k){
      var rod = S.attach(k, 'rod', { w: 56, h: 40, left: 52, top: -10, origin: '5% 95%' });
      S.anim(rod, [{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' }], { d: 300, delay: 1500 });
    });
    S.emote(0, 'dots', 500, 1000);
    S.emote(0, 'exclaim', 1500, 700);
    var boot = S.prop('boot', { x: S.X[0] + 96, y: 40, w: 30, h: 36, z: 8 });
    S.anim(boot, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(-24px,-70px) rotate(-100deg)', offset: .5 }, { opacity: 1, transform: 'translate(-48px,20px) rotate(-200deg)' }], { d: 900, delay: 1600, ease: 'ease-out' });
    S.word('¡PIQUÓ!', 1600, { x: S.X[0] + 60, y: 8 });
    S.emote(0, 'question', 2600, 1000);
    if(S.n > 1) S.emote(1, 'laugh', 2400, 1200);
  };

  SC.gamble = function(S, c){
    S.sky('night');
    var last = S.n - 1, m = H.mid(S, 0, last);
    if(S.n === 2) H.approach(S, 0, 1, 250, 700, 50);
    H.tableBetween(S, 0, last, 24);
    var d1 = S.prop('dice', { x: m - 12, y: 52, w: 22, h: 22, z: 7 }), d2 = S.prop('dice', { x: m + 12, y: 52, w: 22, h: 22, z: 7 });
    [d1, d2].forEach(function(d, i){
      S.anim(d, [{ transform: 'translateY(-70px) rotate(0)' }, { transform: 'translateY(0) rotate(360deg)', offset: .6 }, { transform: 'translateY(-14px) rotate(540deg)', offset: .8 }, { transform: 'translateY(0) rotate(720deg)' }], { d: 900, delay: 900 + i * 100, ease: 'ease-in' });
    });
    S.emote(0, 'dots', 500, 800);
    S.word('¡SIETE!', 1900, { x: m, y: 4 });
    if(c.entry.type === 'theft'){
      var sz = S.itemSize(c.prop || 'bag');
      var fly = H.flyArc(S, c.prop || 'bag', { x: S.X[1] + S.pos[1].x - 30, y: 96 }, { x: S.X[0] + S.pos[0].x + 30, y: 96 }, 2300, 700, sz, 50);
      S.anim(fly, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 1000, delay: 2300 });
      S.hop(0, 3000, 22, 380); S.emote(0, 'laugh', 3000, 1300); S.emote(1, 'anger', 3050, 1300);
    } else {
      S.emote(0, 'sparkle', 2200, 1100); S.emote(last, 'anger', 2300, 1100);
      if(S.n === 3) S.emote(1, 'laugh', 2400, 1100);
    }
  };

  SC.argue = function(S){
    S.sky('dusk');
    var last = S.n - 1;
    H.approach(S, 0, last, 250, 500, 10);
    S.emote(0, 'anger', 700, 1200); S.emote(last, 'anger', 900, 1200);
    for(var k = 0; k < 4; k++){
      S.hop(0, 800 + k * 420, 14, 260);
      S.hop(last, 950 + k * 420, 14, 260);
    }
    S.word('¡NO!', 900, { x: H.mid(S, 0, last) - 26, y: 14 });
    S.word('¡SÍ!', 1500, { x: H.mid(S, 0, last) + 30, y: 48 });
    S.word('¡NO!', 2100, { x: H.mid(S, 0, last) - 20, y: 20 });
    S.shake(1200, 3, 500);
    S.walk(0, -20, 2600, 700); S.walk(last, 20, 2600, 700);
    S.emote(0, 'dots', 3000, 1000);
    if(S.n === 3) S.emote(1, 'question', 900, 2200);
  };

  SC.hug = function(S){
    S.sky('love');
    H.approach(S, 0, 1, 250, 800, 0);
    var m = H.mid(S, 0, 1);
    S.lean(0, 8, 1000, 500); S.lean(1, -8, 1000, 500);
    S.body(0, [{ transform: 'rotate(8deg)' }, { transform: 'rotate(8deg) scale(.94,1.04)' }, { transform: 'rotate(8deg)' }], 1500, 900);
    S.body(1, [{ transform: 'rotate(-8deg)' }, { transform: 'rotate(-8deg) scale(.94,1.04)' }, { transform: 'rotate(-8deg)' }], 1500, 900);
    var big = S.prop('heart', { x: m, y: 150, w: 40, h: 40, z: 8 });
    S.anim(big, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.3)', offset: .5 }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: 1100 });
    for(var i = 0; i < 8; i++) S.floaty('heart', m + rnd(-24, 24), 118, 1300 + i * 200, { size: rnd(12, 20) });
    S.word('¡ABRAZO!', 1300, { x: m, y: 4 });
    S.emote(1, 'dots', 2000, 1100);
    S.emote(0, 'sparkle', 2200, 1100);
  };

  /* ---------- peligros ---------- */
  SC.bees = function(S){
    S.sky('day');
    var v = S.vi, x = H.vx(S);
    for(var i = 0; i < 12; i++){
      var b = S.prop('bee', { x: x + rnd(-40, 40), y: 90 + rnd(0, 40), w: 20, h: 15, z: 8 });
      var dx = rnd(-46, 46), dy = rnd(-24, 24);
      H.loop(S, b, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + (-dx) + 'px,' + (-dy * .6) + 'px)' }, { transform: 'translate(0,0)' }], { d: rnd(420, 760), delay: 300 + i * 40, ease: 'ease-in-out' });
    }
    S.emote(v, 'exclaim', 500, 800);
    S.word('¡BZZZ!', 700, { x: x, y: 8 });
    S.walk(v, S.pos[v].x - 60, 900, 500); S.walk(v, S.pos[v].x + 30, 1400, 600); S.walk(v, S.pos[v].x - 50, 2000, 500);
    S.emote(v, 'anger', 1400, 900);
    if(S.hasDeath) H.dieBy(S, v, 'fall', 2600, 1);
    else { S.body(v, [{ transform: 'none' }, { transform: 'scale(1.12,1.06)' }], 2500, 500); S.tint(v, 'sepia(.5) saturate(1.5)', 2500, 400); S.emote(v, 'cry', 2800, 1100); }
  };

  SC.boulder = function(S){
    S.sky('day');
    var v = S.vi, x = H.vx(S), W = S.W;
    var b = S.prop('boulder', { x: -50, y: 26, w: 70, h: 70, z: 7 });
    var total = 1900, hit = 300 + total * ((x - 10 + 60) / (W + 120));
    S.anim(b, [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(' + (W + 120) + 'px) rotate(1080deg)' }], { d: total, delay: 300, ease: 'linear' });
    S.emote(v, 'exclaim', 350, 800);
    S.walk(v, S.pos[v].x + 30, 500, 600);
    S.shake(hit - 100, 3, 1200);
    if(S.hasDeath){
      H.dieBy(S, v, 'squash', Math.max(hit, 900));
      S.word('¡CRASH!', Math.max(hit, 900), { x: x });
    } else {
      S.hop(v, Math.max(hit - 300, 700), 60, 500);
      S.emote(v, 'sweat', Math.max(hit, 900) + 400, 1100);
    }
  };

  SC.wave = function(S){
    S.sky('day');
    var v = S.vi, x = H.vx(S), W = S.W;
    var wv = document.createElement('div');
    wv.className = 'bigwave';
    S.front.appendChild(wv);
    S.anim(wv, [{ transform: 'translateX(-' + (W + 60) + 'px)' }, { transform: 'translateX(' + (W + 60) + 'px)' }], { d: 1700, delay: 700, ease: 'ease-in-out' });
    S.emote(v, 'exclaim', 350, 800);
    S.word('¡SPLASH!', 1200, { x: x, y: 6 });
    S.shake(1200, 4, 600);
    S.burst(x, 90, 1250, { n: 14, colors: ['#9bd6ff', '#fff'], r: 70 });
    if(S.hasDeath){
      S.body(v, [{ transform: 'none', opacity: 1 }, { transform: 'translate(' + (W * .4) + 'px,-20px) rotate(300deg)', opacity: 1, offset: .7 }, { transform: 'translate(' + (W * .6) + 'px,-10px) rotate(600deg)', opacity: 0 }], 1250, 1200, 'ease-in');
      S.ghost(v, 2200);
    } else {
      S.tint(v, 'brightness(.9) saturate(1.3) hue-rotate(-10deg)', 1250, 300);
      S.shiver(v, 1500, 900);
      S.emote(v, 'anger', 1900, 1200);
    }
  };

  SC.volcano = function(S){
    S.sky('dusk');
    var v = S.vi, x = H.vx(S), W = S.W;
    S.prop('volcano', { x: W * .82, y: 44, w: 130, h: 86, z: 1, back: true });
    S.emote(v, 'sparkle', 400, 1000);
    S.emote(v, 'exclaim', 1400, 700);
    S.flash(1500, 'rgba(255,90,40,.55)', 500);
    S.shake(1500, 5, 700);
    for(var i = 0; i < 12; i++){
      var l = S.prop('lava', { x: W * .82, y: 122, w: 12, h: 12, z: 8 });
      var dx = rnd(-W * .7, W * .1), peak = rnd(60, 110);
      S.anim(l, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(0,0)', offset: .02 }, { opacity: 1, transform: 'translate(' + dx * .5 + 'px,-' + peak + 'px)', offset: .5 }, { opacity: 0, transform: 'translate(' + dx + 'px,' + (90 - peak * .2) + 'px)' }], { d: rnd(900, 1300), delay: 1500 + i * 60, ease: 'ease-in-out' });
    }
    S.word('¡BUUM!', 1550, { x: W * .7, y: 6 });
    if(S.hasDeath) H.dieBy(S, v, 'burn', 2200);
    else { S.tint(v, 'sepia(.6) brightness(.8)', 2200, 400); S.emote(v, 'sweat', 2400, 1200); S.hop(v, 2200, 20, 350); }
  };

  SC.tornado = function(S){
    S.sky('storm');
    var v = S.vi, x = H.vx(S), W = S.W;
    var tw = S.prop('tornado', { x: -40, y: 26, w: 58, h: 96, z: 7 });
    S.anim(tw, [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(' + (x + 40) + 'px) rotate(6deg)', offset: .55 }, { transform: 'translateX(' + (W + 100) + 'px) rotate(-4deg)' }], { d: 2600, delay: 300, ease: 'linear' });
    S.emote(v, 'exclaim', 700, 800);
    S.word('¡FIUUU!', 1300, { x: x, y: 6 });
    if(S.hasDeath){
      S.body(v, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-70px) rotate(360deg)', offset: .35 }, { transform: 'translate(' + (W * .3) + 'px,-' + (S.H + 40) + 'px) rotate(1440deg) scale(.4)', opacity: 1 }], 1300, 2000, 'ease-in');
      S.ghost(v, 3000);
    } else {
      S.shiver(v, 1300, 600);
      S.emote(v, 'question', 2000, 1200);
      S.body(v, [{ transform: 'none' }, { transform: 'rotate(-360deg)' }], 1300, 700);
    }
  };

  SC.launch = function(S, c){
    S.sky('night');
    var v = S.vi, x = H.vx(S), W = S.W, rocket = c.prop === 'rocket';
    if(rocket){
      var r = S.attach(v, 'rocket', { w: 22, h: 46, left: 31, top: 22, onBody: false, z: 1 });
      S.anim(r, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], { d: 300, delay: 300 });
      if(S.hasDeath) S.anim(r, [{ transform: 'none', opacity: 1 }, { transform: 'translate(' + (W * .1) + 'px,-' + (S.H * 1.5) + 'px) rotate(720deg) scale(.6)', opacity: 1, offset: .95 }, { transform: 'translate(' + (W * .12) + 'px,-' + (S.H * 1.6) + 'px) scale(.4)', opacity: 0 }], { d: 1300, delay: 1500, ease: 'ease-out' });
    } else {
      S.prop('seesaw', { x: x, y: 26, w: 100, h: 34, z: 4 });
      var rk = S.prop('rock', { x: x + 40, y: 220, w: 44, h: 34, z: 8 });
      S.anim(rk, [{ transform: 'translateY(0)' }, { transform: 'translateY(190px)' }], { d: 380, delay: 1200, ease: 'ease-in' });
      S.anim(rk, [{ opacity: 1 }, { opacity: 0 }], { d: 100, delay: 1580 });
    }
    S.emote(v, 'evil', 500, 900);
    S.emote(v, 'exclaim', 1200, 500);
    S.shake(1500, 5, 500);
    S.burst(x, 40, 1500, { n: 12, colors: ['#ffb02a', '#ff5a2a', '#fff3a0'], r: 60 });
    S.word(rocket ? '¡FIUUU!' : '¡BOING!', 1550, { x: x, y: 6 });
    if(S.hasDeath){
      S.body(v, [{ transform: 'none', opacity: 1 }, { transform: 'translate(10px,-40px) scale(1.1,.9)', offset: .1 }, { transform: 'translate(' + (W * .1) + 'px,-' + (S.H * 1.5) + 'px) rotate(720deg) scale(.3)', opacity: 1, offset: .95 }, { transform: 'translate(' + (W * .12) + 'px,-' + (S.H * 1.6) + 'px) scale(.2)', opacity: 0 }], 1500, 1300, 'ease-out');
      S.burst(x + W * .1, S.H - 26, 2700, { n: 14, r: 70 });
      S.ghost(v, 2500);
    } else {
      S.body(v, [{ transform: 'none' }, { transform: 'translate(0,-150px) rotate(360deg)', offset: .5 }, { transform: 'translate(-40px,0) rotate(720deg)' }], 1500, 1500, 'ease-in-out');
      S.tint(v, 'sepia(.5) brightness(.8)', 2900, 300);
      S.emote(v, 'sweat', 3100, 1100);
    }
  };

  SC.snatch = function(S){
    S.sky('day');
    var v = S.vi, x = H.vx(S), W = S.W;
    var eg = S.prop('eagle', { x: W + 50, y: 190, w: 84, h: 48, z: 9 });
    var down = 190 - 100, ex = x - W - 50;
    S.anim(eg, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + ex + 'px,' + down + 'px)', offset: .5 }, { transform: 'translate(' + ex + 'px,' + down + 'px)', offset: .58 },
      S.hasDeath ? { transform: 'translate(' + (ex - 200) + 'px,-60px)' } : { transform: 'translate(' + (ex + 220) + 'px,-40px)' }], { d: 2400, delay: 500, ease: 'ease-in-out' });
    S.emote(v, 'question', 500, 800);
    S.emote(v, 'exclaim', 1300, 700);
    S.word('¡ÑAP!', 1600, { x: x, y: 6 });
    S.shake(1650, 4, 300);
    if(S.hasDeath){
      S.body(v, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-30px)', offset: .15 }, { transform: 'translate(-200px,-190px) scale(.4)', opacity: 1, offset: .95 }, { transform: 'translate(-210px,-200px) scale(.3)', opacity: 0 }], 1650, 1300, 'ease-in');
      S.ghost(v, 2600);
    } else {
      S.body(v, [{ transform: 'none' }, { transform: 'translateY(-40px)', offset: .3 }, { transform: 'none' }], 1650, 900, 'ease-in-out');
      S.word('¡PLOF!', 2500, { x: x, y: 40 });
      S.emote(v, 'sweat', 2500, 1100);
    }
  };
})();

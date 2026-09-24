(function(){
  var A = window.Arena;
  var K = A.SceneKit, P = K.P, rnd = K.rnd, SC = A.SceneScripts, H = A.SceneHelpers;
  var SP = K.Stage.prototype;

  /* ---------------- dibujos nuevos ---------------- */
  P.ufo = '<svg viewBox="0 0 110 50"><ellipse cx="55" cy="32" rx="52" ry="13" fill="#8a94a6"/><ellipse cx="55" cy="28" rx="52" ry="11" fill="#b9c3d4"/><path d="M30 26 Q55 -8 80 26Z" fill="#9be7ff" fill-opacity=".85"/><circle cx="22" cy="33" r="3" fill="#ffe14a"/><circle cx="42" cy="37" r="3" fill="#ff5c8a"/><circle cx="68" cy="37" r="3" fill="#7be07b"/><circle cx="88" cy="33" r="3" fill="#ffe14a"/></svg>';
  P.sword = '<svg viewBox="0 0 12 60"><path d="M6 0l4 8v34H2V8z" fill="#dfe6ee"/><path d="M6 2v40" stroke="#aab4be" stroke-width="1.2"/><rect x="-1" y="42" width="14" height="4" rx="2" fill="#c9a23f"/><rect x="3.5" y="46" width="5" height="12" rx="2" fill="#6a4320"/></svg>';
  P.snowball = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#f4f8ff"/><circle cx="7" cy="7" r="3" fill="#fff"/><path d="M4 13q6 4 12-1" stroke="#cfd9e6" stroke-width="1.4" fill="none"/></svg>';
  P.pillow = '<svg viewBox="0 0 50 34"><path d="M4 6Q25 0 46 6Q52 17 46 28Q25 34 4 28Q-2 17 4 6Z" fill="#f4f1fb" stroke="#d6cfe6" stroke-width="2"/><path d="M14 17h22" stroke="#e6dff2" stroke-width="2"/></svg>';
  P.feather = '<svg viewBox="0 0 12 24"><path d="M6 0Q12 8 6 24Q0 8 6 0Z" fill="#fff"/><path d="M6 2v20" stroke="#ddd" stroke-width=".8"/></svg>';
  P.arrow = '<svg viewBox="0 0 60 10"><path d="M0 5h50" stroke="#8a5a2a" stroke-width="2.4"/><path d="M50 1l10 4-10 4z" fill="#9aa0a8"/><path d="M0 1l6 4-6 4M5 1l6 4-6 4" stroke="#e2493f" stroke-width="1.6" fill="none"/></svg>';
  P.hat = '<svg viewBox="0 0 50 50"><path d="M25 0L40 38H10Z" fill="#4b3aa8"/><ellipse cx="25" cy="40" rx="24" ry="7" fill="#3a2c86"/><circle cx="22" cy="20" r="2.4" fill="#ffe14a"/><circle cx="29" cy="28" r="1.8" fill="#ffe14a"/></svg>';
  P.wand = '<svg viewBox="0 0 40 10"><rect x="0" y="3" width="32" height="4" rx="2" fill="#2a2f36"/><rect x="28" y="3" width="6" height="4" fill="#fff"/><circle cx="37" cy="5" r="3" fill="#ffe14a"/></svg>';
  P.frog = '<svg viewBox="0 0 50 40"><ellipse cx="25" cy="26" rx="20" ry="13" fill="#4fae4a"/><circle cx="15" cy="12" r="7" fill="#4fae4a"/><circle cx="35" cy="12" r="7" fill="#4fae4a"/><circle cx="15" cy="11" r="3.5" fill="#fff"/><circle cx="35" cy="11" r="3.5" fill="#fff"/><circle cx="15" cy="11" r="1.6" fill="#111"/><circle cx="35" cy="11" r="1.6" fill="#111"/><path d="M14 28q11 7 22 0" stroke="#2c6a2a" stroke-width="2" fill="none"/></svg>';
  P.shovel = '<svg viewBox="0 0 20 60"><rect x="8" y="0" width="4" height="38" fill="#8a5a2a"/><rect x="4" y="0" width="12" height="5" rx="2" fill="#6a4320"/><path d="M2 38h16v10q0 10-8 12-8-2-8-12z" fill="#9aa0a8"/></svg>';
  P.bigtree = '<svg viewBox="0 0 90 170"><rect x="38" y="70" width="14" height="100" fill="#6a4320"/><path d="M45 70l-14-20M45 90l16-18" stroke="#6a4320" stroke-width="5"/><circle cx="45" cy="45" r="36" fill="#2f7a3a"/><circle cx="22" cy="60" r="20" fill="#39903f"/><circle cx="68" cy="58" r="22" fill="#2a6e33"/><circle cx="45" cy="22" r="22" fill="#39903f"/><circle cx="60" cy="40" r="4" fill="#d6322f"/><circle cx="30" cy="36" r="4" fill="#d6322f"/></svg>';
  P.fin = '<svg viewBox="0 0 40 30"><path d="M2 30Q14 20 26 0Q30 18 38 30Z" fill="#6a7684"/></svg>';
  P.dolphin = '<svg viewBox="0 0 70 40"><path d="M2 26Q20 2 50 10Q62 13 68 22Q58 18 52 22Q40 30 20 30Q10 34 2 26Z" fill="#6ea8d8"/><path d="M34 10l6-9 4 10z" fill="#5a92c2"/><circle cx="54" cy="16" r="1.8" fill="#111"/></svg>';
  P.snowman = '<svg viewBox="0 0 50 80"><circle cx="25" cy="60" r="19" fill="#f4f8ff"/><circle cx="25" cy="32" r="14" fill="#f4f8ff"/><circle cx="25" cy="12" r="10" fill="#f4f8ff"/><path d="M25 13l10 3-10 1z" fill="#ff8a2a"/><circle cx="21" cy="9" r="1.5" fill="#111"/><circle cx="29" cy="9" r="1.5" fill="#111"/><circle cx="25" cy="30" r="1.8" fill="#111"/><circle cx="25" cy="38" r="1.8" fill="#111"/></svg>';
  P.blanket = '<svg viewBox="0 0 160 30"><path d="M0 8L160 0L150 30L10 30Z" fill="#e2493f"/><path d="M40 6l-4 24M80 4l-2 26M120 2l-2 28M4 18l150-8" stroke="#fff" stroke-width="3" opacity=".8"/></svg>';
  P.basket = '<svg viewBox="0 0 44 36"><path d="M4 14h36l-5 20H9z" fill="#b98548"/><path d="M8 14Q22 -6 36 14" stroke="#8a6030" stroke-width="3" fill="none"/><path d="M8 20h28M10 26h24" stroke="#8a6030" stroke-width="1.6"/></svg>';
  P.ant = '<svg viewBox="0 0 20 10"><circle cx="4" cy="5" r="2.4" fill="#222"/><circle cx="9" cy="5" r="2" fill="#222"/><circle cx="14.5" cy="5" r="3" fill="#222"/><path d="M8 5l-2 5M10 5l1 5M9 5l-3-5M10 5l2-5" stroke="#222" stroke-width=".8"/></svg>';
  P.phone = '<svg viewBox="0 0 20 34"><rect x="1" y="1" width="18" height="32" rx="4" fill="#2a2f36"/><rect x="3" y="4" width="14" height="24" rx="2" fill="#6ec1ff"/><circle cx="10" cy="30.5" r="1.4" fill="#5a616b"/></svg>';
  P.peace = '<svg viewBox="0 0 24 30"><path d="M8 30V16L4 2l4-1 4 13 3-13 4 1-4 15v13z" fill="#f0c9a0" stroke="#c99a70" stroke-width="1.2"/></svg>';
  P.drum = '<svg viewBox="0 0 50 40"><ellipse cx="25" cy="10" rx="22" ry="7" fill="#f4f1de"/><path d="M3 10v20q22 12 44 0V10" fill="#d6322f"/><path d="M3 18l44 0M8 12l8 22M25 13v24M42 12l-8 22" stroke="#ffd54a" stroke-width="1.6" fill="none"/></svg>';
  P.guitar = '<svg viewBox="0 0 30 64"><ellipse cx="15" cy="48" rx="13" ry="14" fill="#c9793a"/><ellipse cx="15" cy="36" rx="9" ry="9" fill="#c9793a"/><circle cx="15" cy="44" r="4" fill="#3b2410"/><rect x="12.5" y="2" width="5" height="34" fill="#5a3a1c"/><rect x="10" y="0" width="10" height="7" rx="2" fill="#3b2410"/></svg>';
  P.catapult = '<svg viewBox="0 0 100 60"><rect x="8" y="46" width="84" height="8" rx="3" fill="#6a4320"/><circle cx="20" cy="56" r="5" fill="#3b2410"/><circle cx="80" cy="56" r="5" fill="#3b2410"/><path d="M50 46L40 26" stroke="#6a4320" stroke-width="5"/><path d="M60 46L40 26" stroke="#6a4320" stroke-width="5"/></svg>';
  P.catarm = '<svg viewBox="0 0 70 20"><rect x="0" y="8" width="60" height="5" rx="2" fill="#8a5a2a"/><path d="M52 2q14 0 14 10-6 8-14 0z" fill="#6a4320"/></svg>';
  P.dragon = '<svg viewBox="0 0 140 70"><path d="M20 40Q40 20 70 30Q96 38 116 30L132 22L128 36Q110 50 80 50Q50 56 30 50Z" fill="#4f9a3a"/><path d="M50 32Q60 -2 90 4Q76 14 72 32Z" fill="#3b7a2c"/><path d="M116 30l12-10 6 6-6 6z" fill="#3b7a2c"/><circle cx="124" cy="26" r="2" fill="#ffe14a"/><path d="M20 40Q6 30 2 42Q12 44 20 48Z" fill="#3b7a2c"/><path d="M40 48l-4 14M70 50l-2 14" stroke="#3b7a2c" stroke-width="5" stroke-linecap="round"/></svg>';
  P.firecone = '<svg viewBox="0 0 60 120" preserveAspectRatio="none"><path d="M26 0h8L60 120H0Z" fill="#ff8a2a" opacity=".85"/><path d="M28 0h4L44 120H16Z" fill="#ffd54a" opacity=".9"/></svg>';
  P.pie = '<svg viewBox="0 0 40 24"><ellipse cx="20" cy="16" rx="19" ry="7" fill="#c98b3d"/><ellipse cx="20" cy="12" rx="17" ry="7" fill="#fff"/><circle cx="14" cy="10" r="2.4" fill="#e2493f"/><circle cx="24" cy="9" r="2.4" fill="#e2493f"/></svg>';
  P.splat = '<svg viewBox="0 0 60 60"><path d="M30 4q6 10 14 4-2 12 12 12-10 6-2 16-12-2-12 12-6-10-14-4 2-12-12-12 10-6 2-16 12 2 12-12z" fill="#fff"/></svg>';
  P.spiral = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#fff" stroke="#222" stroke-width="1.6"/><path d="M20 20m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a11 11 0 1 1 22 0a15 15 0 1 1-30 0" stroke="#222" stroke-width="2.4" fill="none"/></svg>';
  P.rocketfw = '<svg viewBox="0 0 8 20"><rect x="2" y="2" width="4" height="14" rx="2" fill="#ff5c8a"/><path d="M4 0l3 4H1z" fill="#ffe14a"/></svg>';
  P.flake = '<svg viewBox="0 0 12 12"><path d="M6 0v12M0 6h12M2 2l8 8M10 2l-8 8" stroke="#fff" stroke-width="1.4"/></svg>';
  P.mudpool = '<svg viewBox="0 0 200 30" preserveAspectRatio="none"><ellipse cx="100" cy="15" rx="98" ry="13" fill="#6b4a2a"/><ellipse cx="80" cy="12" rx="30" ry="4" fill="#8a6038"/></svg>';
  P.leaf = '<svg viewBox="0 0 16 16"><path d="M1 15Q1 1 15 1Q15 15 1 15Z" fill="#6fae52"/><path d="M1 15L13 3" stroke="#3f7a2c" stroke-width="1"/></svg>';

  A.SceneKit.P = P;

  /* ---------------- ampliación del cielo ---------------- */
  var baseSky = SP.sky;
  SP.sky = function(kind){
    if(kind === 'snow'){
      baseSky.call(this, 'storm');
      var s = this.scene;
      s.style.setProperty('--sA', '#7c93b3'); s.style.setProperty('--sB', '#d8e4f2');
      s.style.setProperty('--h1', '#c9d6e6'); s.style.setProperty('--h2', '#b3c3d8');
      s.style.setProperty('--g', '#eef3fa'); s.style.setProperty('--g2', '#cfdcec');
      [].forEach.call(this.bgl.querySelectorAll('.drop'), function(d){ d.className = 'snowflake'; });
      return;
    }
    if(kind === 'sea'){
      baseSky.call(this, 'day');
      var w = document.createElement('div');
      w.className = 'water deep';
      this.front.appendChild(w);
      return;
    }
    baseSky.call(this, kind);
  };

  function attachAt(S, i, name, w, h, left, top, origin){ return S.attach(i, name, { w: w, h: h, left: left, top: top, origin: origin }); }
  function pos(S, i){ return S.X[i] + S.pos[i].x; }
  function death(S, i, style, delay, dir){ H.dieBy(S, i, style, delay, dir); }

  /* ================= ESCENAS ================= */
  SC.ufo = function(S){
    S.sky('night');
    var v = S.vi, x = pos(S, v);
    var ufo = S.prop('ufo', { x: x, y: 170, w: 110, h: 50, z: 9 });
    S.anim(ufo, [{ transform: 'translate(' + (S.W) + 'px,-60px)' }, { transform: 'translate(0,0)' }], { d: 1000, delay: 200, ease: 'ease-out' });
    H.loop(S, ufo, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], { d: 600, dir: 'alternate', delay: 1200 });
    var beam = document.createElement('div');
    beam.className = 'ufobeam';
    beam.style.left = (x - 45) + 'px';
    S.back.appendChild(beam);
    S.anim(beam, [{ opacity: 0, transform: 'scaleX(.2)' }, { opacity: 1, transform: 'scaleX(1)' }], { d: 400, delay: 1200 });
    S.emote(v, 'exclaim', 1100, 800);
    S.word('¡BZZZ!', 1300, { x: x + 40, y: 60 });
    S.body(v, [{ transform: 'none' }, { transform: 'translateY(-40px) rotate(-10deg)', offset: .4 }, { transform: 'translateY(-110px) rotate(20deg) scale(.6)' }], 1500, 1300, 'ease-in');
    if(S.hasDeath){
      S.body(v, [{ opacity: 1 }, { opacity: 0 }], 2700, 200);
      S.anim(ufo, [{ transform: 'translate(0,0)' }, { transform: 'translate(-' + (S.W + 80) + 'px,-80px)' }], { d: 900, delay: 3000, ease: 'ease-in' });
      S.ghost(v, 3100);
    } else {
      S.body(v, [{ transform: 'translateY(-110px) rotate(20deg) scale(.6)' }, { transform: 'translateY(0) rotate(0) scale(1)', offset: .8 }, { transform: 'translateY(-12px)', offset: .9 }, { transform: 'none' }], 3000, 700, 'ease-in');
      S.emote(v, 'question', 3700, 1200);
    }
  };

  SC.snowball = function(S){
    S.sky('snow');
    var last = S.n - 1;
    for(var k = 0; k < 4; k++){
      var fromL = k % 2 === 0;
      var a = fromL ? 0 : last, b = fromL ? last : 0;
      var from = { x: pos(S, a) + (fromL ? 40 : -40), y: 90 }, to = { x: pos(S, b) + (fromL ? -10 : 10), y: 100 };
      var sb = H.flyArc(S, 'snowball', from, to, 500 + k * 600, 450, [18, 18], 40);
      S.anim(sb, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 500, delay: 500 + k * 600 });
      S.burst(to.x, to.y, 950 + k * 600, { n: 8, colors: ['#ffffff', '#dfeaf7'], r: 30 });
      S.shiver(b, 950 + k * 600, 300);
      S.body(a, [{ transform: 'none' }, { transform: 'rotate(' + (fromL ? -12 : 12) + 'deg)' }, { transform: 'none' }], 450 + k * 600, 260);
    }
    S.word('¡PLOF!', 1600, { x: S.W / 2 });
    S.emote(0, 'laugh', 2900, 1200); S.emote(last, 'laugh', 3000, 1200);
    if(S.n === 3) S.emote(1, 'sparkle', 1200, 1400);
  };

  SC.pillow = function(S){
    S.sky('night');
    var last = S.n - 1;
    H.approach(S, 0, last, 200, 600, 30);
    [0, last].forEach(function(i, j){
      var p = attachAt(S, i, 'pillow', 46, 32, j ? -30 : 60, 10, j ? '90% 90%' : '10% 90%');
      S.anim(p, [{ transform: 'rotate(0)' }, { transform: 'rotate(' + (j ? 50 : -50) + 'deg)' }, { transform: 'rotate(' + (j ? -30 : 30) + 'deg)' }], { d: 300, delay: 700 + j * 150, iter: 6, dir: 'alternate' });
    });
    for(var f = 0; f < 22; f++){
      var fe = S.prop('feather', { x: H.mid(S, 0, last) + rnd(-30, 30), y: 110, w: 10, h: 20, z: 9 });
      S.anim(fe, [{ opacity: 0, transform: 'translate(0,0) rotate(0)' }, { opacity: 1, transform: 'translate(' + rnd(-80, 80) + 'px,-' + rnd(20, 70) + 'px) rotate(' + rnd(-90, 90) + 'deg)', offset: .3 }, { opacity: 0, transform: 'translate(' + rnd(-110, 110) + 'px,60px) rotate(' + rnd(-200, 200) + 'deg)' }], { d: rnd(1800, 2600), delay: 800 + f * 70, ease: 'ease-out' });
    }
    S.word('¡PAF!', 900, { x: H.mid(S, 0, last) });
    S.emote(0, 'laugh', 2600, 1200); S.emote(last, 'laugh', 2700, 1200);
  };

  SC.swordfight = function(S){
    S.sky('dusk');
    var last = S.n - 1, v = S.vi;
    H.approach(S, 0, last, 200, 600, 50);
    var s1 = attachAt(S, 0, 'sword', 12, 58, 70, -8, '50% 90%');
    var s2 = attachAt(S, last, 'sword', 12, 58, 2, -8, '50% 90%');
    for(var k = 0; k < 4; k++){
      var t = 800 + k * 380;
      S.anim(s1, [{ transform: 'rotate(10deg)' }, { transform: 'rotate(70deg)' }, { transform: 'rotate(10deg)' }], { d: 320, delay: t });
      S.anim(s2, [{ transform: 'rotate(-10deg)' }, { transform: 'rotate(-70deg)' }, { transform: 'rotate(-10deg)' }], { d: 320, delay: t });
      S.burst(H.mid(S, 0, last), 120, t + 150, { n: 6, colors: ['#ffe14a', '#fff'], r: 26 });
    }
    S.word('¡CLANG!', 1000, { x: H.mid(S, 0, last) });
    S.shake(1200, 3, 800);
    if(S.hasDeath){ S.word('¡ZAS!', 2500, { x: pos(S, v), y: 40 }); death(S, v, 'fall', 2500, v === 0 ? -1 : 1); S.emote(v === 0 ? last : 0, 'sparkle', 3000, 1100); }
    else { S.emote(0, 'sweat', 2500, 1100); S.emote(last, 'sweat', 2550, 1100); S.walk(0, S.pos[0].x - 30, 2500, 600); S.walk(last, S.pos[last].x + 30, 2500, 600); }
  };

  SC.archery = function(S){
    S.sky('day');
    var v = S.hasDeath ? S.vi : S.n - 1, x = pos(S, v);
    var bow = attachAt(S, 0, 'bow', 26, 44, 66, 16);
    S.anim(bow, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.8)' }, { transform: 'scaleX(1)' }], { d: 400, delay: 900 });
    S.emote(0, 'evil', 400, 900);
    if(!S.hasDeath){
      var ap = S.attach(v, 'apple', { w: 24, h: 26, left: 30, top: -24, onBody: true });
      S.anim(ap, [{ opacity: 1 }, { opacity: 1, offset: .99 }, { opacity: 0 }], { d: 1600, delay: 0 });
      S.emote(v, 'sweat', 400, 1100);
    }
    var y = S.hasDeath ? 70 : 128;
    var ar = S.prop('arrow', { x: S.X[0] + 70, y: y, w: 50, h: 9, z: 9 });
    S.anim(ar, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 1, transform: 'translateX(' + (x - S.X[0] - 90) + 'px)' }], { d: 350, delay: 1300, ease: 'linear' });
    S.word('¡FIUU!', 1350, { x: (S.X[0] + x) / 2, y: 20 });
    if(S.hasDeath){ death(S, v, 'fall', 1650, 1); S.emote(0, 'dots', 2300, 1000); }
    else { S.burst(x, 150, 1650, { n: 12, colors: ['#d6322f', '#ffd6d0'], r: 40 }); S.word('¡TOMA YA!', 1900, { x: x, y: 8 }); S.hop(0, 1900, 22, 380); S.emote(v, 'exclaim', 1700, 900); }
  };

  SC.magic = function(S){
    S.sky('party');
    var target = S.n > 1 ? 1 : 0, tx = pos(S, target);
    attachAt(S, 0, 'hat', 46, 46, 19, -34);
    var wand = attachAt(S, 0, 'wand', 36, 10, 64, 40, '0 50%');
    S.anim(wand, [{ transform: 'rotate(0)' }, { transform: 'rotate(-40deg)' }, { transform: 'rotate(20deg)' }, { transform: 'rotate(-10deg)' }], { d: 700, delay: 600 });
    for(var i = 0; i < 12; i++) S.floaty('star', pos(S, 0) + 50 + rnd(0, 30), 110, 700 + i * 90, { size: rnd(8, 14), rise: 60, d: 900 });
    S.word('¡ABRACADABRA!', 800, { x: S.W / 2, y: 6 });
    S.flash(1500, 'rgba(190,120,255,.6)', 400);
    S.smoke(tx, 60, 1500); S.smoke(tx - 14, 70, 1550); S.smoke(tx + 14, 66, 1600);
    S.body(target, [{ opacity: 1 }, { opacity: 0, offset: .1 }, { opacity: 0, offset: .8 }, { opacity: 1 }], 1550, 1800);
    var frog = S.prop('frog', { x: tx, y: 26, w: 50, h: 40, z: 6 });
    S.anim(frog, [{ opacity: 0 }, { opacity: 0, offset: .1 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { d: 1800, delay: 1550 });
    S.anim(frog, [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], { d: 400, delay: 2200, iter: 2 });
    S.emote(0, 'question', 2600, 900);
    S.emote(target, 'anger', 3500, 1200);
  };

  SC.fireworks = function(S){
    S.sky('night');
    var colors = [['#ff5c8a', '#ffd6e4'], ['#6ee7ff', '#e0fbff'], ['#ffe14a', '#fff6c2'], ['#7be07b', '#e2ffe0'], ['#c792ff', '#f0e2ff']];
    for(var i = 0; i < 7; i++){
      var x = rnd(40, S.W - 40), h = rnd(120, 175), t = 300 + i * 420;
      var r = S.prop('rocketfw', { x: x, y: 40, w: 8, h: 18, z: 3, back: true });
      S.anim(r, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-' + (h - 40) + 'px)', offset: .95 }, { opacity: 0, transform: 'translateY(-' + (h - 40) + 'px)' }], { d: 600, delay: t, ease: 'ease-out' });
      S.burst(x, h, t + 600, { n: 18, colors: colors[i % colors.length], r: rnd(40, 60) });
    }
    S.actors.forEach(function(_, k){ S.emote(k, k % 2 ? 'heart' : 'sparkle', 900 + k * 250, 1600); S.hop(k, 1500 + k * 200, 18, 380); });
    S.word('¡BOOM!', 900, { x: S.W / 2, y: 8 });
  };

  SC.dig = function(S){
    S.sky('warm');
    var x = pos(S, 0);
    var sh = attachAt(S, 0, 'shovel', 18, 54, 70, 18, '50% 10%');
    S.anim(sh, [{ transform: 'rotate(20deg)' }, { transform: 'rotate(-30deg)' }], { d: 300, delay: 400, iter: 8, dir: 'alternate' });
    for(var i = 0; i < 8; i++) S.burst(x + 80, 30, 500 + i * 300, { n: 5, colors: ['#6b4a2a', '#8a6038'], r: 36 });
    var hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = (x + 80 - 56) + 'px';
    S.back.appendChild(hole);
    S.anim(hole, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { d: 1400, delay: 500 });
    S.emote(0, 'sweat', 1400, 1000);
    var ch = S.prop('chest', { x: x + 80, y: 20, w: 48, h: 38, z: 6 });
    S.anim(ch, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }], { d: 500, delay: 2900 });
    S.burst(x + 80, 70, 3000, { n: 14, r: 55 });
    S.word('¡TESORO!', 3000, { x: x + 60, y: 8 });
    S.hop(0, 3100, 26, 400);
    S.emote(0, 'sparkle', 3300, 1200);
  };

  SC.climb = function(S){
    S.sky('day');
    var v = S.vi, x = pos(S, v);
    S.prop('bigtree', { x: x + 6, y: 26, w: 90, h: 170, z: 1, back: true });
    S.mv(v, 0, 0, 0, 1);
    var steps = [];
    for(var k = 1; k <= 5; k++) steps.push({ transform: 'translateY(-' + (k * 18) + 'px) rotate(' + (k % 2 ? -6 : 6) + 'deg)' });
    S.body(v, [{ transform: 'none' }].concat(steps), 300, 1600, 'linear');
    S.emote(v, 'sparkle', 1500, 900);
    if(S.hasDeath){
      S.emote(v, 'exclaim', 2100, 600);
      S.body(v, [{ transform: 'translateY(-90px)' }, { transform: 'translateY(0) rotate(80deg)' }], 2400, 500, 'ease-in');
      S.shake(2900, 6, 300);
      S.word('¡CATAPLOF!', 2900, { x: x, y: 10 });
      S.xeyes(v, 2900); S.grayOut(v, 3000, 400); S.ghost(v, 3200);
    } else {
      var ap = S.prop('apple', { x: x + 20, y: 150, w: 22, h: 24, z: 7 });
      S.anim(ap, [{ transform: 'translateY(0)' }, { transform: 'translateY(126px)' }], { d: 500, delay: 2300, ease: 'ease-in' });
      S.word('¡ÑAM!', 2900, { x: x, y: 10 });
      S.body(v, [{ transform: 'translateY(-90px)' }, { transform: 'none' }], 3100, 700, 'ease-in-out');
    }
  };

  SC.chase = function(S){
    S.sky('day');
    var ch = 0, ru = S.n - 1, W = S.W;
    S.mv(ru, 0, 0, 0, 1);
    S.walk(ru, W - S.X[ru] + 90, 300, 1200);
    S.walk(ch, W - S.X[ch] + 90, 600, 1300);
    S.emote(ru, 'exclaim', 300, 700);
    S.emote(ch, 'anger', 500, 900);
    S.word('¡CORRE!', 700, { x: W / 2, y: 8 });
    S.mv(ru, -(S.X[ru] + 90), 0, 1600, 1);
    S.mv(ch, -(S.X[ch] + 90), 0, 1950, 1);
    S.walk(ru, 0, 1700, 1100);
    S.walk(ch, S.X[ru] - S.X[ch] - 96, 2050, 1100);
    if(S.hasDeath){ S.emote(ru, 'exclaim', 2800, 600); death(S, ru, 'fall', 3000, 1); }
    else { S.emote(ru, 'sweat', 2900, 1000); S.emote(ch, 'sweat', 3000, 1000); S.body(ch, [{ transform: 'none' }, { transform: 'scale(1.05,.92)' }], 3100, 400); }
  };

  SC.swim = function(S){
    S.sky('sea');
    var v = S.vi;
    S.actors.forEach(function(_, k){
      S.body(k, [{ transform: 'translateY(16px)' }, { transform: 'translateY(16px)' }], 0, 10);
      H.loop(S, S.els[k].actor, [{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }], { d: 700 + k * 90, dir: 'alternate', ease: 'ease-in-out' });
    });
    S.emote(0, 'sparkle', 400, 1000);
    if(S.hasDeath){
      var fin = S.prop('fin', { x: S.W + 30, y: 44, w: 36, h: 28, z: 7 });
      S.anim(fin, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + (pos(S, v) + 30 - S.W - 30) + 'px)' }], { d: 1400, delay: 600, ease: 'ease-in' });
      S.emote(v, 'exclaim', 1600, 700);
      S.word('¡ÑAM!', 2000, { x: pos(S, v), y: 20 });
      S.body(v, [{ transform: 'translateY(16px)', opacity: 1 }, { transform: 'translateY(110px)', opacity: 0 }], 2000, 500, 'ease-in');
      S.burst(pos(S, v), 50, 2000, { n: 12, colors: ['#9bd6ff', '#fff'], r: 40 });
      S.ghost(v, 2600);
    } else {
      var d = S.prop('dolphin', { x: -40, y: 50, w: 66, h: 38, z: 7 });
      S.anim(d, [{ transform: 'translate(0,0) rotate(20deg)' }, { transform: 'translate(' + (S.W * .5) + 'px,-80px) rotate(0)', offset: .5 }, { transform: 'translate(' + (S.W + 80) + 'px,0) rotate(-20deg)' }], { d: 1800, delay: 1000, ease: 'ease-in-out' });
      S.burst(S.W * .5 - 20, 70, 1900, { n: 10, colors: ['#9bd6ff', '#fff'], r: 40 });
      S.word('¡IIIH!', 1900, { x: S.W / 2, y: 8 });
      S.actors.forEach(function(_, k){ S.emote(k, 'heart', 2300 + k * 150, 1200); });
    }
  };

  SC.umbrella = function(S){
    S.sky('storm');
    var last = S.n - 1;
    if(S.n > 1) H.approach(S, 0, last, 300, 800, 0);
    var m = S.n > 1 ? H.mid(S, 0, last) : pos(S, 0);
    var um = S.prop('umbrella', { x: m, y: 118, w: 110, h: 90, z: 8 });
    S.anim(um, [{ opacity: 0, transform: 'scale(.3) rotate(-30deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { d: 500, delay: 1000 });
    S.actors.forEach(function(_, k){ S.emote(k, 'heart', 1500 + k * 200, 1600); });
    for(var i = 0; i < 6; i++) S.floaty('heart', m + rnd(-20, 20), 120, 1600 + i * 250, { size: rnd(12, 18), rise: 70 });
  };

  SC.snowman = function(S){
    S.sky('snow');
    var x = S.n === 1 ? (S.hasDeath ? S.X[0] : S.X[0] + 96) : S.n === 2 ? S.W / 2 : S.W - 28;
    if(S.n === 3){ S.walk(0, -20, 200, 500); S.walk(1, -30, 200, 500); S.walk(2, -40, 200, 500); }
    if(S.hasDeath){ S.shiver(0, 300, 1500); S.tint(0, 'saturate(.3) brightness(1.3) hue-rotate(180deg)', 400, 1600); S.body(0, [{ opacity: 1 }, { opacity: 0 }], 2300, 300); S.ghost(0, 2700); }
    var parts = [[38, 38, 26], [28, 28, 58], [20, 20, 80]];
    parts.forEach(function(p, i){
      var b = S.prop('snowball', { x: x, y: p[2], w: p[0], h: p[1], z: 4 });
      S.anim(b, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { d: 400, delay: 600 + i * 600 });
    });
    var sm = S.prop('snowman', { x: x, y: 26, w: 50, h: 80, z: 5 });
    S.anim(sm, [{ opacity: 0 }, { opacity: 1 }], { d: 300, delay: 2400 });
    if(!S.hasDeath) S.actors.forEach(function(_, k){ S.body(k, [{ transform: 'none' }, { transform: 'translateY(-8px)' }, { transform: 'none' }], 600 + k * 200, 500); S.emote(k, 'sparkle', 2600 + k * 150, 1200); });
    S.word(S.hasDeath ? '¡BRRR!' : '¡TACHÁN!', 2500, { x: x, y: 6 });
  };

  SC.picnic = function(S){
    S.sky('day');
    S.prop('blanket', { x: S.W / 2, y: 22, w: S.W * .8, h: 24, z: 2, back: true });
    var bk = S.prop('basket', { x: S.W / 2, y: 30, w: 40, h: 32, z: 4 });
    S.actors.forEach(function(_, k){ H.loop(S, S.els[k].ai, [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }], { d: 320, dir: 'alternate', delay: k * 90 }); });
    for(var i = 0; i < 7; i++){
      var an = S.prop('ant', { x: S.W / 2 + 10, y: 28, w: 16, h: 8, z: 5 });
      S.anim(an, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + (S.W / 2 + 40) + 'px)' }], { d: 2600, delay: 1000 + i * 200, ease: 'linear' });
    }
    S.anim(bk, [{ transform: 'translateX(0)' }, { transform: 'translateX(0)', offset: .4 }, { transform: 'translateX(' + (S.W / 2 + 50) + 'px)' }], { d: 3000, delay: 1000, ease: 'ease-in' });
    S.emote(0, 'exclaim', 2600, 800);
    S.word('¡HORMIGAS!', 2700, { x: S.W / 2, y: 8 });
    S.actors.forEach(function(_, k){ S.emote(k, 'anger', 3100 + k * 100, 1000); });
  };

  SC.selfie = function(S){
    S.sky('dusk');
    if(S.n === 2) H.approach(S, 0, 1, 200, 700, 0);
    var ph = attachAt(S, 0, 'phone', 18, 30, -16, -10);
    S.anim(ph, [{ opacity: 0, transform: 'rotate(-30deg)' }, { opacity: 1, transform: 'rotate(-10deg)' }], { d: 400, delay: 600 });
    S.actors.forEach(function(_, k){
      S.lean(k, k === 0 ? 8 : -6, 900, 400);
      var pc = S.attach(k, 'peace', { w: 18, h: 24, left: k % 2 ? 60 : -8, top: 6 });
      S.anim(pc, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { d: 300, delay: 1000 + k * 100 });
    });
    S.flash(1700, '#fff', 350);
    S.word('¡PATATA!', 1700, { x: S.W / 2, y: 8 });
    S.actors.forEach(function(_, k){ S.emote(k, 'laugh', 2100 + k * 120, 1300); });
  };

  SC.mud = function(S){
    S.sky('warm');
    var last = S.n - 1;
    S.prop('mudpool', { x: S.W / 2, y: 16, w: S.W * .9, h: 30, z: 2, back: true });
    H.approach(S, 0, last, 200, 600, -14);
    S.actors.forEach(function(_, k){ S.tint(k, 'sepia(.8) brightness(.8) saturate(1.4)', 900 + k * 100, 700); });
    for(var i = 0; i < 6; i++) S.burst(H.mid(S, 0, last) + rnd(-30, 30), 40, 900 + i * 280, { n: 6, colors: ['#6b4a2a', '#8a6038'], r: 40 });
    S.shake(900, 4, 1500);
    S.body(0, [{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(0)' }], 900, 1500);
    S.body(last, [{ transform: 'rotate(0)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], 900, 1500);
    S.word('¡CHOF!', 1000, { x: H.mid(S, 0, last) });
    if(S.hasDeath) death(S, S.vi, 'sink', 2600);
    else { S.emote(0, 'laugh', 2600, 1200); S.emote(last, 'anger', 2700, 1200); }
  };

  SC.yoga = function(S){
    S.sky('day');
    S.actors.forEach(function(_, k){
      S.body(k, [{ transform: 'none' }, { transform: 'rotate(-18deg) translateX(-6px)' }, { transform: 'rotate(18deg) translateX(6px)' }, { transform: 'scaleY(.8) translateY(8px)' }, { transform: 'rotate(180deg) translateY(40px)' }, { transform: 'none' }], 400 + k * 150, 3200, 'ease-in-out');
      S.emote(k, 'dots', 600 + k * 150, 1200);
    });
    var bird = S.prop('bird', { x: -20, y: 170, w: 22, h: 13, z: 9 });
    S.anim(bird, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (pos(S, 0) + 20) + 'px,-50px)' }], { d: 1400, delay: 800, ease: 'ease-out' });
    S.word('¡OMMM!', 1200, { x: S.W / 2, y: 8 });
    S.emote(0, 'question', 2900, 1000);
  };

  SC.band = function(S){
    S.sky('party');
    var inst = ['drum', 'guitar', 'mic'];
    S.actors.forEach(function(_, k){
      var nm = inst[k % 3];
      var el = nm === 'drum' ? S.attach(k, 'drum', { w: 44, h: 36, left: 20, top: 54 }) : nm === 'guitar' ? S.attach(k, 'guitar', { w: 26, h: 56, left: 54, top: 24, origin: '50% 80%' }) : S.attach(k, 'mic', { w: 14, h: 34, left: 60, top: 34 });
      if(nm === 'guitar') H.loop(S, el, [{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }], { d: 260, dir: 'alternate', delay: 400 });
      H.loop(S, S.els[k].ai, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }], { d: 300 + k * 40, dir: 'alternate', delay: 300 + k * 90 });
    });
    for(var i = 0; i < 12; i++) S.floaty('note', rnd(30, S.W - 30), 110, 300 + i * 260, { size: rnd(16, 26), rise: 90 });
    S.word('¡ROCK!', 700, { x: S.W / 2, y: 6 });
    S.shake(800, 2, 2600);
  };

  SC.catapult = function(S){
    S.sky('day');
    var v = S.vi, ok = S.hasDeath;
    var bx = S.n > 1 ? pos(S, 0) + 60 : pos(S, 0) - 70;
    S.prop('catapult', { x: bx, y: 22, w: 96, h: 56, z: 3 });
    var arm = S.prop('catarm', { x: bx - 6, y: 58, w: 64, h: 18, z: 4, origin: '85% 60%' });
    S.anim(arm, [{ transform: 'rotate(0)' }, { transform: 'rotate(0)', offset: .6 }, { transform: 'rotate(80deg)' }], { d: 1200, delay: 300, ease: 'ease-in' });
    var rock = S.prop('rock', { x: bx + 24, y: 72, w: 30, h: 24, z: 6 });
    var tx = ok ? pos(S, v) : bx + 10;
    S.anim(rock, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + (tx - bx - 24) * .5 + 'px,-130px) rotate(200deg)', offset: .5 }, { transform: 'translate(' + (tx - bx - 24) + 'px,' + (ok ? 10 : 40) + 'px) rotate(400deg)' }], { d: 1100, delay: 1030, ease: 'ease-in-out' });
    S.emote(0, 'evil', 300, 900);
    S.word('¡ALLÁ VA!', 1000, { x: bx, y: 8 });
    if(ok){ S.shake(2130, 6, 300); S.word('¡PUM!', 2130, { x: tx, y: 20 }); death(S, v, 'squash', 2130); }
    else { S.burst(bx, 50, 2130, { n: 12, colors: ['#6a4320', '#9aa0a8'], r: 50 }); S.word('¡CRASH!', 2140, { x: bx, y: 20 }); S.emote(0, 'sweat', 2300, 1100); S.emote(S.n - 1, 'laugh', 2400, 1100); }
  };

  SC.dragon = function(S){
    S.sky('dusk');
    var v = S.vi, x = pos(S, v);
    var dr = S.prop('dragon', { x: S.W + 80, y: 140, w: 130, h: 64, z: 9 });
    var tx = x + 40 - (S.W + 80);
    S.anim(dr, [{ transform: 'translate(0,0) scaleX(-1)' }, { transform: 'translate(' + tx + 'px,0) scaleX(-1)', offset: .45 }, { transform: 'translate(' + tx + 'px,-6px) scaleX(-1)', offset: .65 }, { transform: 'translate(-' + (S.W + 220) + 'px,-40px) scaleX(-1)' }], { d: 3200, delay: 300, ease: 'ease-in-out' });
    S.emote(v, 'exclaim', 900, 800);
    var fire = S.prop('firecone', { x: x, y: 60, w: 70, h: 100, z: 8 });
    S.anim(fire, [{ opacity: 0, transform: 'scaleY(.2)' }, { opacity: 1, transform: 'scaleY(1)', offset: .3 }, { opacity: 1, transform: 'scaleY(1)', offset: .7 }, { opacity: 0 }], { d: 900, delay: 1700 });
    S.flash(1750, 'rgba(255,140,40,.55)', 400);
    S.word('¡FUUUSH!', 1750, { x: x, y: 8 });
    if(S.hasDeath) death(S, v, 'burn', 1850);
    else { S.hop(v, 1500, 50, 500); S.tint(v, 'sepia(.6) brightness(.75)', 2100, 300); S.smoke(x, 110, 2200); S.emote(v, 'sweat', 2400, 1200); }
  };

  SC.ghosthunt = function(S){
    S.sky('night');
    var gh = S.prop('ghost', { x: S.W / 2, y: 90, w: 50, h: 60, z: 2, back: true });
    S.anim(gh, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: .9, transform: 'scale(1.3)', offset: .5 }, { opacity: .9, transform: 'scale(1.2)' }], { d: 900, delay: 900 });
    H.loop(S, gh, [{ transform: 'scale(1.2) translateY(0)' }, { transform: 'scale(1.2) translateY(-10px)' }], { d: 700, dir: 'alternate', delay: 1800 });
    S.word('¡BUUU!', 1100, { x: S.W / 2, y: 8 });
    S.actors.forEach(function(_, k){
      S.emote(k, 'exclaim', 1200 + k * 80, 700);
      S.hop(k, 1200 + k * 80, 50, 450);
      S.walk(k, (k % 2 ? 1 : -1) * (S.W * .6), 1800 + k * 100, 900);
    });
  };

  SC.meteorshower = function(S){
    S.sky('night');
    var v = S.vi;
    for(var i = 0; i < 10; i++){
      var sx = rnd(0, S.W), t = 200 + i * 220;
      var m = S.prop('meteor', { x: sx, y: 220, w: 26, h: 26, z: 3, back: true });
      S.anim(m, [{ opacity: 1, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(-80px,190px)', offset: .95 }, { opacity: 0, transform: 'translate(-84px,196px)' }], { d: 700, delay: t, ease: 'ease-in' });
      S.burst(sx - 80, 30, t + 680, { n: 5, colors: ['#ff8a2a', '#ffd54a'], r: 26 });
    }
    S.actors.forEach(function(_, k){ S.emote(k, 'exclaim', 500 + k * 120, 800); });
    S.shake(600, 3, 2200);
    S.word('¡LLUEVEN ROCAS!', 700, { x: S.W / 2, y: 6 });
    if(S.hasDeath){
      var big = S.prop('meteor', { x: pos(S, v) + 70, y: 230, w: 60, h: 60, z: 8 });
      S.anim(big, [{ transform: 'translate(0,0)' }, { transform: 'translate(-70px,204px)' }], { d: 500, delay: 2400, ease: 'ease-in' });
      S.flash(2900, 'rgba(255,190,90,.7)', 350);
      death(S, v, 'squash', 2900);
    } else S.actors.forEach(function(_, k){ S.hop(k, 1200 + k * 200, 30, 400); });
  };

  SC.pie = function(S){
    S.sky('day');
    var v = S.n > 1 ? S.n - 1 : 0, x = pos(S, v);
    S.emote(0, 'evil', 300, 900);
    var p = H.flyArc(S, 'pie', { x: pos(S, 0) + 40, y: 100 }, { x: x - 6, y: 120 }, 900, 500, [36, 22], 40);
    S.anim(p, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 560, delay: 900 });
    var sp = S.attach(v, 'splat', { w: 64, h: 64, left: 10, top: 8, onBody: true });
    S.anim(sp, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.1)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { d: 300, delay: 1400 });
    S.word('¡SPLAT!', 1420, { x: x, y: 10 });
    S.shiver(v, 1450, 400);
    S.emote(v, 'anger', 1900, 1200);
    S.emote(0, 'laugh', 1700, 1400); S.hop(0, 1700, 20, 350);
  };

  SC.hypno = function(S, c){
    S.sky('party');
    var v = S.n > 1 ? 1 : 0;
    var sp = attachAt(S, 0, 'spiral', 36, 36, 64, 20);
    H.loop(S, sp, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { d: 700, ease: 'linear', delay: 300 });
    S.emote(0, 'evil', 400, 1100);
    S.tint(v, 'hue-rotate(200deg) saturate(1.6)', 900, 600);
    S.body(v, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0)' }], 900, 1800, 'ease-in-out');
    S.emote(v, 'dots', 1100, 1500);
    S.word('¡DUERMEEE!', 1000, { x: S.W / 2, y: 8 });
    S.walk(v, -(S.X[v] - S.X[0] - 96), 1900, 1000);
    if(c.prop){
      var sz = S.itemSize(c.prop);
      var it = H.flyArc(S, c.prop, { x: pos(S, v) - 60, y: 90 }, { x: pos(S, 0) + 50, y: 90 }, 3000, 500, sz, 30);
      S.anim(it, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 600, delay: 3000 });
    }
    S.tint(v, 'none', 3500, 300);
    S.emote(v, 'question', 3600, 1000);
  };
})();

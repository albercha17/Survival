(function(){
  var A = window.Arena = window.Arena || {};
  var K = A.SceneKit, Stage = K.Stage, P = K.P, rnd = K.rnd, esc = K.esc;

  var DEFAULT = { neutral: 'explore', item: 'item', alliance: 'handshake', romance: 'love', fight: 'brawl', death: 'ghost',
    announcement: 'lineup', victory: 'victory', theft: 'steal', betrayal: 'stab', heal: 'heal' };

  var SC = {};

  function mid(S, i, j){ return (S.X[i] + S.X[j]) / 2; }
  function vx(S){ return S.X[S.vi] + S.pos[S.vi].x; }
  function approach(S, i, j, delay, dur, gap){
    var g = Math.abs(S.X[j] - S.X[i]) - S.SZ - (gap == null ? 8 : gap);
    var dir = S.X[j] > S.X[i] ? 1 : -1;
    S.mv(i, dir * g / 2, 0, delay, dur);
    S.mv(j, -dir * g / 2, 0, delay, dur);
  }
  function propSize(name){
    return { piano: [84, 62], anvil: [64, 46], meteor: [62, 62], rock: [60, 46], bomb: [54, 58] }[name] || [56, 46];
  }
  function dieBy(S, i, style, delay, dir){
    var f = { fall: 'dieFall', squash: 'dieSquash', launch: 'dieLaunch', sink: 'dieSink', burn: 'dieBurn', explode: 'dieExplode', float: 'dieFloat' }[style] || 'dieFall';
    S[f](i, delay, dir);
  }
  function shadowAt(S, x, delay, dur, w){
    var el = document.createElement('div');
    el.className = 'gshadow';
    el.style.left = (x - (w || 64) / 2) + 'px'; el.style.width = (w || 64) + 'px';
    S.back.appendChild(el);
    S.anim(el, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: .55, transform: 'scale(1)' }], { d: dur, delay: delay, ease: 'ease-in' });
    return el;
  }
  function loop(S, el, frames, o){
    o = o || {}; o.iter = Infinity;
    return S.anim(el, frames, o);
  }
  function flyArc(S, name, from, to, delay, dur, size, lift){
    var el = S.prop(name, { x: from.x, y: from.y, w: size[0], h: size[1], z: 8 });
    var dx = to.x - from.x, dy = to.y - from.y;
    S.anim(el, [
      { opacity: 0, transform: 'translate(0,0) rotate(0)' },
      { opacity: 1, transform: 'translate(' + dx * .5 + 'px,' + (-(dy * .5 + (lift || 50))) + 'px) rotate(180deg)', offset: .5 },
      { opacity: 1, transform: 'translate(' + dx + 'px,' + (-dy) + 'px) rotate(360deg)' }
    ], { d: dur, delay: delay, ease: 'ease-in-out' });
    return el;
  }
  function orbitStars(S, i, delay){
    var o = document.createElement('div');
    o.className = 'orbit';
    o.innerHTML = '<i style="transform:translate(34px,0)">' + P.star + '</i><i style="transform:translate(-17px,29px)">' + P.star + '</i><i style="transform:translate(-17px,-29px)">' + P.star + '</i>';
    S.els[i].actor.appendChild(o);
    S.anim(o, [{ opacity: 0, transform: 'rotate(0)' }, { opacity: 1, transform: 'rotate(120deg)', offset: .1 }, { opacity: 1, transform: 'rotate(3600deg)' }], { d: 9000, delay: delay, ease: 'linear' });
  }
  function crack(S, x, y, delay){
    var h = document.createElement('div');
    h.className = 'bheart';
    h.style.left = (x - 24) + 'px'; h.style.bottom = y + 'px';
    h.innerHTML = '<div class="hl">' + P.heart + '</div><div class="hr">' + P.heart + '</div>';
    S.front.appendChild(h);
    S.anim(h, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { d: 400, delay: delay - 500 });
    S.anim(h.querySelector('.hl'), [{ transform: 'none' }, { transform: 'translate(-16px,10px) rotate(-26deg)' }], { d: 500, delay: delay, ease: 'ease-in' });
    S.anim(h.querySelector('.hr'), [{ transform: 'none' }, { transform: 'translate(16px,10px) rotate(26deg)' }], { d: 500, delay: delay, ease: 'ease-in' });
    S.anim(h, [{ opacity: 1 }, { opacity: 0 }], { d: 500, delay: delay + 700 });
  }
  function tableBetween(S, i, j, h){
    var el = document.createElement('div');
    el.className = 'ptable';
    var w = Math.max(60, Math.abs(S.X[j] - S.X[i]) * .55);
    el.style.width = w + 'px'; el.style.left = (mid(S, i, j) - w / 2) + 'px'; el.style.height = (h || 26) + 'px';
    S.front.appendChild(el);
    return { el: el, w: w };
  }

  /* ---------- amor y alianzas ---------- */
  SC.love = function(S){
    S.sky('love');
    var a = 0, b = S.n === 3 ? 1 : 1, m;
    if(S.n >= 2){ approach(S, a, b, 300, 1000, 6); m = mid(S, a, b); } else m = S.X[0];
    S.emote(a, 'heart', 1000, 2000);
    if(S.n >= 2) S.emote(b, 'heart', 1150, 1900);
    if(S.n === 3) S.emote(2, 'question', 900, 1800);
    S.lean(a, 7, 1300, 500);
    if(S.n >= 2) S.lean(b, -7, 1300, 500);
    for(var i = 0; i < 10; i++) S.floaty('heart', m + rnd(-30, 30), 122, 1100 + i * 170, { size: rnd(14, 24) });
    var big = S.prop('heart', { x: m, y: 158, w: 44, h: 44, z: 7 });
    S.anim(big, [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.35)', offset: .5 }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: 1500, ease: 'ease-out' });
    S.burst(m, 150, 1500, { n: 12, shape: 'heart', r: 70 });
    S.sparkleRing && S.sparkleRing(m, 150, 1500);
  };

  SC.wedding = function(S){
    SC.love(S);
    S.sky('gold');
    var m = mid(S, 0, 1);
    var ring = S.prop('ring', { x: m, y: 196, w: 30, h: 30, z: 9 });
    S.anim(ring, [{ opacity: 0, transform: 'translateY(-80px) rotate(0)' }, { opacity: 1, transform: 'translateY(0) rotate(360deg)', offset: .6 }, { opacity: 1, transform: 'translateY(-10px) rotate(360deg)', offset: .8 }, { opacity: 1, transform: 'translateY(0) rotate(360deg)' }], { d: 900, delay: 1700, ease: 'ease-in' });
    S.confetti(26, 1800);
    S.word('¡SÍ, QUIERO!', 1900, { y: 14 });
  };

  SC.handshake = function(S){
    S.sky('day');
    if(S.n === 2){ approach(S, 0, 1, 300, 800, 4); }
    else if(S.n === 3){ S.mv(0, S.X[1] - S.X[0] - S.SZ - 4, 0, 300, 800); S.mv(2, -(S.X[2] - S.X[1] - S.SZ - 4), 0, 300, 800); }
    var m = S.n === 1 ? S.X[0] : (S.n === 2 ? mid(S, 0, 1) : S.X[1]);
    var hands = S.prop('hands', { x: m, y: 62, w: 58, h: 40, z: 8 });
    S.anim(hands, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1.2)', offset: .4 }, { opacity: 1, transform: 'scale(1) rotate(-8deg)', offset: .55 }, { transform: 'scale(1) rotate(8deg)', offset: .7 }, { transform: 'scale(1) rotate(-6deg)', offset: .85 }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { d: 1200, delay: 1000 });
    S.burst(m, 80, 1150, { n: 12, r: 60 });
    S.emote(0, 'sparkle', 1300, 1500);
    S.emote(S.n === 3 ? 2 : 1, 'sparkle', 1400, 1400);
    S.word('¡TRATO!', 1150);
  };

  SC.date = function(S){
    S.sky('night');
    approach(S, 0, 1, 300, 900, 30);
    var m = mid(S, 0, 1);
    var t = tableBetween(S, 0, 1, 24);
    var candle = S.prop('candle', { x: m, y: 44, w: 14, h: 34, z: 6 });
    S.prop('plate', { x: m - 22, y: 46, w: 32, h: 12, z: 6 });
    S.prop('plate', { x: m + 22, y: 46, w: 32, h: 12, z: 6 });
    loop(S, candle, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.06) rotate(1deg)' }, { transform: 'scaleY(.97) rotate(-1deg)' }], { d: 500, dir: 'alternate' });
    S.emote(0, 'heart', 1100, 1900); S.emote(1, 'heart', 1300, 1700);
    for(var i = 0; i < 7; i++) S.floaty('heart', m + rnd(-24, 24), 90, 1000 + i * 260, { size: rnd(12, 20) });
    S.lean(0, 5, 1200, 500); S.lean(1, -5, 1200, 500);
  };

  SC.gift = function(S, c){
    S.sky(c.entry.type === 'romance' ? 'love' : 'warm');
    var item = c.prop || 'flowers';
    var sz = S.itemSize(item);
    approach(S, 0, 1, 300, 800, 30);
    var gx = S.X[0] + (S.X[1] - S.X[0] - S.SZ - 30) / 2 + 58, rx = S.X[1] - (S.X[1] - S.X[0] - S.SZ - 30) / 2;
    var held = S.attach(0, item, { w: sz[0], h: sz[1], left: 62, top: 34, onBody: true });
    S.anim(held, [{ opacity: 1 }, { opacity: 1, offset: .99 }, { opacity: 0 }], { d: 1250, delay: 0 });
    S.emote(0, 'dots', 800, 800);
    var fly = flyArc(S, item, { x: gx, y: 70 }, { x: rx - 6, y: 138 }, 1250, 650, sz, 40);
    S.anim(fly, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 1900, delay: 1250 });
    var got = S.attach(1, item, { w: sz[0], h: sz[1], left: 16, top: -34, onBody: true });
    S.anim(got, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)', offset: .4 }, { opacity: 1, transform: 'scale(1)' }], { d: 500, delay: 1900 });
    S.hop(1, 1950, 26, 420);
    S.emote(1, c.entry.type === 'romance' ? 'heart' : 'sparkle', 2000, 1400);
    S.burst(rx, 140, 1950, { n: 10, r: 55, shape: c.entry.type === 'romance' ? 'heart' : undefined });
  };

  SC.truce = function(S){
    S.sky('day');
    S.emote(0, 'anger', 300, 900); S.emote(1, 'anger', 400, 900);
    S.shiver(0, 300, 500); S.shiver(1, 350, 500);
    var flag = S.attach(0, 'flag', { w: 44, h: 50, left: 48, top: -18, origin: '10% 100%', onBody: true });
    S.anim(flag, [{ opacity: 0, transform: 'rotate(60deg) scale(.4)' }, { opacity: 1, transform: 'rotate(-8deg) scale(1)', offset: .35 }, { transform: 'rotate(8deg)', offset: .55 }, { transform: 'rotate(-8deg)', offset: .75 }, { opacity: 1, transform: 'rotate(4deg)' }], { d: 1400, delay: 1000 });
    S.emote(1, 'question', 1500, 800);
    approach(S, 0, 1, 2000, 700, 4);
    var m = mid(S, 0, 1);
    var hands = S.prop('hands', { x: m, y: 132, w: 58, h: 40, z: 8 });
    S.anim(hands, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1.2)', offset: .5 }, { opacity: 1, transform: 'scale(1)' }], { d: 600, delay: 2650 });
    S.burst(m, 140, 2700, { n: 10, r: 55 });
    S.emote(0, 'sparkle', 2700, 1200); S.emote(1, 'sparkle', 2750, 1200);
  };

  /* ---------- violencia ---------- */
  SC.shoot = function(S){
    S.sky('dusk');
    var v = S.vi, last = S.n - 1;
    S.mv(0, 22, 0, 250, 500);
    var gun = S.attach(0, 'gun', { w: 46, h: 30, left: 62, top: 36, origin: '10% 60%' });
    S.anim(gun, [{ opacity: 0, transform: 'rotate(60deg)' }, { opacity: 1, transform: 'rotate(-6deg)', offset: .7 }, { opacity: 1, transform: 'rotate(0)' }], { d: 450, delay: 500 });
    S.anim(gun, [{ transform: 'rotate(0)' }, { transform: 'rotate(-22deg) translateX(-4px)', offset: .3 }, { transform: 'rotate(0)' }], { d: 260, delay: 1150 });
    var fl = S.attach(0, 'flash', { w: 40, h: 40, left: 100, top: 18 });
    S.anim(fl, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)', offset: .35 }, { opacity: 0, transform: 'scale(1.5)' }], { d: 240, delay: 1150 });
    S.body(0, [{ transform: 'none' }, { transform: 'translateX(-9px) rotate(-4deg)', offset: .3 }, { transform: 'none' }], 1150, 300);
    S.emote(v, 'exclaim', 700, 900);
    if(S.n === 3) S.emote(1, 'exclaim', 800, 900);
    var x0 = S.X[0] + 22 + 42 + 66 + 44 - 4, y = 50;
    var tx = S.hasDeath ? vx(S) - 44 : S.W + 40;
    var bl = S.prop('bullet', { x: x0, y: y, w: 22, h: 9, z: 8 });
    S.anim(bl, [{ opacity: 0, transform: 'translateX(0)' }, { opacity: 1, transform: 'translateX(0)', offset: .01 }, { opacity: 1, transform: 'translateX(' + (tx - x0) + 'px)', offset: .98 }, { opacity: 0, transform: 'translateX(' + (tx - x0) + 'px)' }], { d: S.hasDeath ? 230 : 420, delay: 1200, ease: 'linear' });
    for(var k = 0; k < 4; k++){
      var tr = S.prop('star', { x: x0 + 30 + k * 20, y: y - 2, w: 6, h: 6, z: 7 });
      S.anim(tr, [{ opacity: 0 }, { opacity: .8, offset: .2 }, { opacity: 0 }], { d: 350, delay: 1230 + k * 30 });
    }
    S.word('¡PAM!', 1180, { x: (S.X[0] + S.X[last]) / 2 });
    if(S.hasDeath){
      S.shake(1420, 6, 320);
      S.burst(vx(S) - 20, 84, 1420, { n: 10, r: 46 });
      dieBy(S, v, 'fall', 1430, 1);
      S.emote(0, 'dots', 1900, 1200);
    } else {
      S.hop(v, 1060, 34, 500);
      S.emote(v, 'sweat', 1500, 1200);
      S.emote(0, 'question', 1700, 1100);
    }
  };

  SC.stab = function(S){
    S.sky('night');
    var v = S.vi;
    var stopAt = vx(S) - S.X[0] - 96;
    S.walk(0, stopAt, 300, 1500);
    S.emote(0, 'evil', 700, 1100);
    for(var i = 0; i < 3; i++) S.floaty('note', vx(S), 128, 300 + i * 600, { size: 16, rise: 40, d: 1500 });
    var knife = S.attach(0, 'knife', { w: 14, h: 42, left: 66, top: -24, origin: '50% 100%' });
    S.anim(knife, [{ opacity: 0, transform: 'rotate(10deg) scale(.5)' }, { opacity: 1, transform: 'rotate(22deg) scale(1)' }], { d: 400, delay: 1500 });
    S.anim(knife, [{ transform: 'rotate(22deg)' }, { transform: 'rotate(120deg) translate(6px,6px)' }], { d: 150, delay: 2000, ease: 'ease-in' });
    S.mv(0, stopAt + 14, 0, 2000, 150, 'ease-in');
    S.word('¡ZAS!', 2080, { x: vx(S) - 30 });
    S.flash(2080, 'rgba(255,70,70,.65)', 320);
    S.shake(2080, 5, 260);
    S.emote(v, 'exclaim', 2100, 900);
    if(S.hasDeath){ dieBy(S, v, 'fall', 2140, 1); S.emote(0, 'dots', 2700, 1000); }
    else { S.hop(v, 2100, 36, 480); S.emote(0, 'sweat', 2300, 1200); }
  };

  SC.brawl = function(S){
    S.sky('warm');
    var last = S.n - 1, m = mid(S, 0, last), x0 = S.X[0], x1 = S.X[last];
    if(S.n === 2){ approach(S, 0, 1, 250, 650, 2); }
    else { S.walk(0, (S.X[1] - S.X[0]) - S.SZ + 20, 250, 650); S.walk(2, -(S.X[2] - S.X[1]) + S.SZ - 20, 250, 650); }
    var dust = S.prop('dust', { x: m, y: 62, w: 96, h: 96, z: 6 });
    S.anim(dust, [{ opacity: 0, transform: 'scale(.2) rotate(0)' }, { opacity: 1, transform: 'scale(1) rotate(180deg)', offset: .25 }, { opacity: 1, transform: 'scale(1.05) rotate(600deg)', offset: .85 }, { opacity: 0, transform: 'scale(1.3) rotate(720deg)' }], { d: 1500, delay: 850, ease: 'linear' });
    for(var i = 0; i < 6; i++) S.burst(m + rnd(-30, 30), 70 + rnd(0, 50), 950 + i * 200, { n: 4, r: 34 });
    S.shake(900, 4, 260); S.shake(1250, 5, 260); S.shake(1600, 6, 260);
    S.word('¡POW!', 1000, { x: m - 30, y: 16 });
    S.word('¡BAM!', 1500, { x: m + 34, y: 60, d: 900 });
    var v = S.vi;
    var win = v === 0 ? last : 0;
    if(S.hasDeath){
      var dir = S.X[v] > m ? 1 : -1;
      dieBy(S, v, Math.random() < .5 ? 'launch' : 'fall', 2100, dir);
      S.hop(win, 2200, 28, 420);
      S.emote(win, 'laugh', 2400, 1200);
    } else {
      S.wobble(0, 2100, 8, 600); S.wobble(last, 2100, 8, 600);
      S.emote(0, 'sweat', 2200, 1200); S.emote(last, 'sweat', 2250, 1200);
      S.mv(0, 0, 0, 2300, 500); S.mv(last, 0, 0, 2300, 500);
    }
  };

  SC.drop = function(S, c){
    S.sky('day');
    var v = S.vi, name = c.prop || 'anvil', sz = propSize(name), x = vx(S);
    shadowAt(S, x, 300, 1000, sz[0] + 10);
    S.lean(v, -9, 600, 400);
    S.emote(v, 'exclaim', 650, 800);
    var landX = x;
    if(!S.hasDeath) S.mv(v, S.pos[v].x + 70, 0, 1100, 260, 'ease-out');
    var el = S.prop(name, { x: landX, y: 26, w: sz[0], h: sz[1], z: 8 });
    S.anim(el, [{ transform: 'translateY(-' + (S.H + 60) + 'px) rotate(' + (name === 'meteor' ? -20 : 0) + 'deg)' }, { transform: 'translateY(0) rotate(0)', offset: .9 }, { transform: 'translateY(-14px)', offset: .96 }, { transform: 'translateY(0)' }], { d: 480, delay: 1250, ease: 'cubic-bezier(.55,0,1,.6)' });
    S.burst(landX, 30, 1730, { n: 10, colors: ['#e9e3d8', '#d9d2c4'], r: 60 });
    S.shake(1730, 8, 320);
    S.word(name === 'meteor' || name === 'bomb' ? '¡BUM!' : '¡CRASH!', 1740, { x: landX });
    if(name === 'meteor' || name === 'bomb') S.flash(1730, 'rgba(255,190,90,.75)', 380);
    if(S.hasDeath){ S.dieSquash(v, 1730); }
    else { S.wobble(v, 1750, 6, 600); S.emote(v, 'sweat', 1800, 1200); S.hop(v, 1700, 20, 300); }
  };

  SC.slip = function(S, c){
    S.sky('day');
    var v = S.vi, x = S.X[v];
    var slipName = c.prop === 'soap' ? 'soap' : 'banana';
    var peel = S.prop(slipName, { x: x, y: 27, w: slipName === 'soap' ? 34 : 36, h: slipName === 'soap' ? 20 : 24, z: 2, back: true });
    S.mv(v, -90, 0, 0, 1);
    S.walk(v, 0, 250, 950);
    for(var i = 0; i < 3; i++) S.floaty('note', x - 40 + i * 20, 128, 350 + i * 250, { size: 14, rise: 34, d: 1100 });
    S.body(v, [
      { transform: 'none' }, { transform: 'translateY(-10px) rotate(-40deg)', offset: .18 },
      { transform: 'translateY(-138px) rotate(-390deg)', offset: .55 }, { transform: 'translateY(0) rotate(-720deg)' }
    ], 1250, 1150, 'ease-in-out');
    S.anim(peel, [{ transform: 'none', opacity: 1 }, { transform: 'translate(-60px,-110px) rotate(-320deg)', opacity: 1, offset: .6 }, { transform: 'translate(-90px,-40px) rotate(-500deg)', opacity: 0 }], { d: 1300, delay: 1250 });
    S.emote(v, 'exclaim', 1200, 700);
    S.word('¡BOING!', 1350, { x: x, y: 10 });
    if(S.hasDeath){ dieBy(S, v, 'fall', 2450, -1); S.shake(2450, 5, 260); }
    else { S.wobble(v, 2450, 7, 700); S.emote(v, 'sweat', 2500, 1100); orbitStars(S, v, 2450); }
  };

  SC.lightning = function(S){
    S.sky('storm');
    var v = S.vi, x = vx(S);
    S.emote(v, 'exclaim', 300, 700);
    S.flash(900, '#fff', 500);
    S.shake(920, 6, 300);
    var bolt = S.prop('bolt', { x: x, y: 100, w: 46, h: 116, z: 7 });
    S.anim(bolt, [{ opacity: 0 }, { opacity: 1, offset: .08 }, { opacity: .3, offset: .2 }, { opacity: 1, offset: .32 }, { opacity: 0 }], { d: 500, delay: 900 });
    S.word('¡ZAP!', 950, { x: x + 34 });
    if(S.n > 1) S.emote(S.vi === 0 ? 1 : 0, 'exclaim', 1000, 900);
    if(S.hasDeath) dieBy(S, v, 'burn', 950);
    else {
      S.anim(S.els[v].br, [{ filter: 'none' }, { filter: 'brightness(4)' }, { filter: 'invert(1)' }, { filter: 'brightness(3)' }, { filter: 'none' }], { d: 700, delay: 950, ease: 'steps(1,end)' });
      S.body(v, [{ transform: 'none' }, { transform: 'scaleY(1.12) translateY(-6px)', offset: .3 }, { transform: 'none' }], 950, 700);
      S.emote(v, 'sweat', 1700, 1200);
    }
  };

  SC.trap = function(S){
    S.sky('warm');
    var v = S.vi, x = vx(S);
    var hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = (x - 56) + 'px';
    S.back.appendChild(hole);
    S.anim(hole, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { d: 380, delay: 650 });
    S.emote(v, 'exclaim', 750, 900);
    S.wobble(v, 800, 9, 500, 2);
    if(S.hasDeath){
      dieBy(S, v, 'sink', 1250);
      S.word('¡PLAF!', 1900, { x: x });
    } else {
      S.hop(v, 1200, 46, 550);
      S.anim(hole, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { d: 350, delay: 1800 });
      S.emote(v, 'sweat', 1700, 1200);
    }
  };

  SC.poison = function(S, c){
    S.sky('night');
    var v = S.vi, name = c.prop || 'mushroom', sz = S.itemSize(name);
    if(name === 'mushroom') sz = [30, 30];
    if(name === 'bottle') sz = [20, 36];
    var el = S.attach(v, name, { w: sz[0], h: sz[1], left: 64, top: 44, onBody: true });
    S.anim(el, [{ opacity: 1, transform: 'none' }, { opacity: 1, transform: 'translate(-30px,-18px) rotate(-30deg)', offset: .6 }, { opacity: 0, transform: 'translate(-34px,-24px) scale(.3)' }], { d: 900, delay: 500 });
    S.emote(v, 'sparkle', 500, 700);
    S.burst(vx(S), 96, 1350, { n: 8, color: '#7be07b', r: 40 });
    S.word('¡GLUP!', 1400, { x: vx(S) });
    S.tint(v, 'hue-rotate(80deg) saturate(1.8)', 1500, 400);
    S.body(v, [{ transform: 'none' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(6deg)' }, { transform: 'none' }], 1500, 1300, 'ease-in-out');
    for(var i = 0; i < 6; i++) S.floaty('star', vx(S) + rnd(-26, 26), 104, 1500 + i * 220, { size: 8, rise: 44, d: 1100 });
    if(S.hasDeath){
      S.emote(v, 'question', 1700, 900);
      dieBy(S, v, 'fall', 2850, 1);
    } else {
      S.emote(v, 'question', 1900, 1200);
      S.tint(v, 'none', 2900, 500);
    }
  };

  SC.animal = function(S, c){
    S.sky('day');
    var v = S.vi, x = vx(S), critter = c.prop || 'bear';
    var sz = { duck: [62, 58], bear: [70, 70], crab: [56, 44], croc: [98, 44] }[critter] || [70, 70];
    var duck = critter === 'duck';
    var word = { duck: '¡CUAC!', crab: '¡CLAC!', croc: '¡ÑAM!', bear: '¡ÑAM!' }[critter] || '¡ÑAM!';
    var cr = S.prop(critter, { x: S.W + 50, y: 26, w: sz[0], h: sz[1], z: 4 });
    var tx = x + 64 - (S.W + 50);
    var frames = [{ transform: 'translate(0,0)' }], k, steps = 6;
    for(k = 1; k <= steps; k++) frames.push({ transform: 'translate(' + (tx * k / steps) + 'px,' + (k % 2 ? -8 : 0) + 'px)' });
    S.anim(cr, frames, { d: 1200, delay: 250, ease: 'linear' });
    S.emote(v, 'exclaim', 700, 800);
    if(S.hasDeath){
      S.wobble(v, 1000, 6, 500, 2);
      var puff = S.prop('dust', { x: x + 34, y: 40, w: 100, h: 100, z: 7 });
      S.anim(puff, [{ opacity: 0, transform: 'scale(.3) rotate(0)' }, { opacity: 1, transform: 'scale(1) rotate(200deg)', offset: .3 }, { opacity: 1, transform: 'scale(1.05) rotate(500deg)', offset: .8 }, { opacity: 0, transform: 'scale(1.3) rotate(600deg)' }], { d: 1000, delay: 1450, ease: 'linear' });
      S.body(v, [{ opacity: 1 }, { opacity: 1, offset: .3 }, { opacity: 0 }], 1450, 600);
      S.burst(x + 20, 70, 1600, { n: 8, r: 40 });
      S.shake(1600, 5, 400);
      S.word(word, 1650, { x: x + 20 });
      S.ghost(v, 2200);
      S.anim(cr, [{ transform: 'translate(' + tx + 'px,0) scaleY(1)' }, { transform: 'translate(' + tx + 'px,-12px) scaleY(1.1)' }, { transform: 'translate(' + tx + 'px,0)' }], { d: 400, delay: 2100 });
    } else {
      S.walk(v, -(x + 70), 700, 1300);
      S.anim(cr, [{ transform: 'translate(' + tx + 'px,0)' }, { transform: 'translate(' + (tx - 130) + 'px,0)' }, { transform: 'translate(' + (S.W + 90) + 'px,0)' }], { d: 1600, delay: 1500, ease: 'ease-in-out' });
      S.word(word, 1800, { x: S.W * .5 });
      S.emote(v, 'sweat', 2000, 1200);
    }
  };

  SC.fall = function(S){
    S.sky('dusk');
    var v = S.vi, x = S.X[v];
    var ch = document.createElement('div');
    ch.className = 'chasm';
    ch.style.left = (x + 26) + 'px';
    S.back.appendChild(ch);
    S.emote(v, 'exclaim', 500, 900);
    S.body(v, [{ transform: 'none' }, { transform: 'rotate(-14deg) translateX(-4px)' }, { transform: 'rotate(12deg) translateX(6px)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(14deg) translateX(8px)' }, { transform: 'none' }], 550, 1000, 'ease-in-out');
    if(S.hasDeath){
      S.body(v, [{ transform: 'none' }, { transform: 'translate(20px,-4px) rotate(24deg)', offset: .2 }, { transform: 'translate(90px,300px) rotate(220deg)' }], 1650, 1200, 'cubic-bezier(.5,0,.9,.6)');
      S.word('¡AAAH!', 1750, { x: x + 40 });
      S.ghost(v, 2400);
      S.emote(v === 0 && S.n > 1 ? 1 : 0, 'exclaim', 2300, 900);
    } else {
      S.hop(v, 1700, 30, 450);
      S.emote(v, 'sweat', 1800, 1200);
    }
  };

  SC.balloon = function(S){
    S.sky('day');
    var v = S.vi;
    var b = S.attach(v, 'balloon', { w: 34, h: 78, left: 25, top: -74, origin: '50% 100%', onBody: true });
    S.anim(b, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { d: 400, delay: 200 });
    loop(S, b, [{ transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }], { d: 900, dir: 'alternate', delay: 600, ease: 'ease-in-out' });
    S.emote(v, 'sparkle', 500, 900);
    if(S.hasDeath){
      S.emote(v, 'exclaim', 1300, 900);
      dieBy(S, v, 'float', 1000);
      S.word('¡ADIÓS!', 2000, { x: vx(S), y: 40 });
    } else {
      S.body(v, [{ transform: 'none' }, { transform: 'translateY(-70px)', offset: .4 }, { transform: 'translateY(-70px)', offset: .5 }, { transform: 'none' }], 900, 1700, 'ease-in-out');
      S.anim(b, [{ opacity: 1 }, { opacity: 0 }], { d: 60, delay: 1400 });
      S.burst(vx(S), 150, 1400, { n: 8, color: '#e83a4f', r: 40 });
      S.word('¡POP!', 1420, { x: vx(S) });
      S.emote(v, 'sweat', 2300, 1000);
    }
  };

  /* ---------- objetos y regalos ---------- */
  SC.item = function(S, c){
    S.sky('day');
    var v = S.vi, x = S.X[0];
    var item = c.prop && c.prop !== 'crate' ? c.prop : null;
    var crate = S.prop('crate', { x: x + 80, y: 26, w: 56, h: 78, z: 4 });
    S.anim(crate, [{ transform: 'translateY(-' + (S.H + 60) + 'px)' }, { transform: 'translateY(0)', offset: .85 }, { transform: 'translateY(-8px)', offset: .93 }, { transform: 'translateY(0)' }], { d: 1000, delay: 200, ease: 'cubic-bezier(.3,.1,.5,1)' });
    S.walk(0, 46, 900, 500);
    S.emote(0, 'exclaim', 700, 700);
    S.anim(crate, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(-14px) scale(1.2)' }], { d: 300, delay: 1500 });
    S.burst(x + 80, 60, 1500, { n: 10, r: 50 });
    if(item){
      var sz = S.itemSize(item);
      var ray = document.createElement('div');
      ray.className = 'lightray';
      ray.style.left = (x + 46 - 60) + 'px';
      S.back.appendChild(ray);
      S.anim(ray, [{ opacity: 0, transform: 'scale(.2) rotate(0)' }, { opacity: 1, transform: 'scale(1) rotate(90deg)', offset: .3 }, { opacity: 1, transform: 'scale(1) rotate(400deg)' }], { d: 1800, delay: 1600, ease: 'linear' });
      var it = S.prop(item, { x: x + 46, y: 132, w: sz[0], h: sz[1], z: 9 });
      S.anim(it, [{ opacity: 0, transform: 'translateY(30px) scale(.3)' }, { opacity: 1, transform: 'translateY(-6px) scale(1.25)', offset: .5 }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { d: 600, delay: 1600 });
      S.hop(0, 1650, 28, 420);
      S.word('¡TACHÁN!', 1700, { x: x + 46 });
      S.burst(x + 46, 150, 1700, { n: 12, r: 60 });
    } else {
      S.hop(0, 1600, 26, 420);
      S.emote(0, 'question', 1900, 1400);
      S.burst(x + 80, 80, 1600, { n: 8, r: 40 });
    }
  };

  SC.steal = function(S, c){
    S.sky('dusk');
    var item = c.prop || 'bag', sz = S.itemSize(item), th = 0, vi = 1;
    var vxp = S.X[vi];
    var held = S.attach(vi, item, { w: sz[0], h: sz[1], left: -22, top: 40, onBody: true });
    var loot = S.attach(th, item, { w: sz[0], h: sz[1], left: 60, top: 40, onBody: true });
    S.anim(loot, [{ opacity: 0 }, { opacity: 0 }], { d: 10, delay: 0 });
    S.lean(vi, -8, 300, 400);
    S.emote(vi, 'question', 450, 1000);
    if(S.n === 3) S.emote(2, 'evil', 700, 1200);
    var stop = vxp - S.X[th] - 96;
    S.walk(th, stop, 500, 900);
    S.emote(th, 'evil', 900, 900);
    S.anim(held, [{ opacity: 1 }, { opacity: 1, offset: .99 }, { opacity: 0 }], { d: 1400, delay: 0 });
    var fly = flyArc(S, item, { x: vxp - 64, y: 70 }, { x: S.X[th] + stop + 70, y: 70 }, 1400, 320, sz, 30);
    S.anim(fly, [{ opacity: 1 }, { opacity: 1, offset: .9 }, { opacity: 0 }], { d: 500, delay: 1400 });
    S.anim(loot, [{ opacity: 0 }, { opacity: 1 }], { d: 60, delay: 1720 });
    S.word('¡ROBO!', 1450, { x: (S.X[th] + vxp) / 2 });
    S.burst((S.X[th] + vxp) / 2, 80, 1450, { n: 8, r: 40 });
    S.walk(th, -(S.X[th] + 100), 1750, 900);
    S.emote(vi, 'exclaim', 1650, 800);
    S.emote(vi, 'anger', 2100, 1200);
    S.walk(vi, -40, 1950, 500);
    S.emote(vi, 'sweat', 2600, 900);
  };

  SC.heal = function(S, c){
    S.sky('day');
    var pat = S.n === 1 ? 0 : 1, doc = 0;
    var kit = S.prop('medkit', { x: S.X[pat] - (S.n === 1 ? 54 : 50), y: 40, w: 38, h: 30, z: 5 });
    S.anim(kit, [{ opacity: 0, transform: 'translateY(-30px) scale(.4)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { d: 400, delay: 300 });
    if(S.n === 2) approach(S, 0, 1, 200, 800, 44);
    S.emote(pat, 'cry', 700, 900);
    for(var i = 0; i < 8; i++) S.floaty('cross', S.X[pat] + rnd(-30, 30), 110, 1200 + i * 220, { size: rnd(14, 22), rise: 70 });
    S.tint(pat, 'brightness(1.2) saturate(1.3)', 1200, 500);
    S.hop(pat, 1500, 14, 400);
    var pl = S.attach(pat, 'plaster', { w: 38, h: 15, left: 18, top: 6, onBody: true });
    S.anim(pl, [{ opacity: 0, transform: 'rotate(-14deg) scale(.4)' }, { opacity: 1, transform: 'rotate(-14deg) scale(1)' }], { d: 300, delay: 1400 });
    S.emote(pat, 'sparkle', 1800, 1300);
    S.word('¡CURADO!', 1500, { x: S.X[pat] });
    S.burst(S.X[pat], 110, 1550, { n: 10, colors: ['#5fe08a', '#b9f5c9', '#fff'], r: 55 });
    S.tint(pat, 'none', 2200, 400);
  };

  SC.rescue = function(S){
    S.sky('day');
    var res = 0, vic = 1, x = S.X[vic];
    var hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = (x - 56) + 'px';
    S.back.appendChild(hole);
    S.mv(vic, 0, 0, 0, 1);
    S.body(vic, [{ transform: 'translateY(48px)' }, { transform: 'translateY(48px)' }], 0, 10);
    S.emote(vic, 'exclaim', 300, 800);
    S.emote(vic, 'cry', 1100, 1000);
    S.walk(res, x - S.X[res] - 150, 500, 900);
    S.emote(res, 'exclaim', 1100, 800);
    var rope = S.prop('rope', { x: x - 60, y: 62, w: 10, h: 78, z: 6, origin: '50% 0%' });
    S.anim(rope, [{ opacity: 0, transform: 'rotate(-70deg) scaleY(.2)' }, { opacity: 1, transform: 'rotate(-20deg) scaleY(1)', offset: .6 }, { opacity: 1, transform: 'rotate(-6deg) scaleY(1)' }], { d: 500, delay: 1500 });
    S.body(vic, [{ transform: 'translateY(48px)' }, { transform: 'translateY(32px) rotate(-6deg)', offset: .3 }, { transform: 'translateY(18px) rotate(5deg)', offset: .6 }, { transform: 'translateY(0) rotate(0)' }], 2000, 1200, 'ease-in-out');
    S.word('¡ARRIBA!', 2400, { x: x - 20 });
    S.hop(vic, 3200, 24, 400);
    S.emote(vic, 'heart', 3200, 1500);
    S.emote(res, 'sparkle', 3300, 1300);
    S.burst(x, 110, 3200, { n: 10, r: 55 });
  };

  SC.rumor = function(S){
    S.sky('night');
    var a = 0, b = S.n > 1 ? 1 : 0;
    S.lean(a, 6, 300, 400);
    S.emote(a, 'dots', 500, 1000);
    S.emote(a, 'gun', 1500, 1000);
    for(var i = 0; i < 4; i++) S.floaty('note', mid(S, a, b) + rnd(-20, 20), 130, 800 + i * 320, { size: 12, rise: 50, d: 1300 });
    S.emote(b, 'question', 1300, 1000);
    S.emote(b, 'exclaim', 2000, 900);
    S.shiver(b, 2000, 500);
    S.emote(b, 'anger', 2700, 1200);
    S.emote(a, 'laugh', 2500, 1300);
  };

  SC.cheat = function(S){
    S.sky('love');
    var w = 0, ch = 1, nw = 2;
    S.emote(w, 'heart', 300, 1000); S.emote(ch, 'heart', 400, 1000);
    for(var i = 0; i < 3; i++) S.floaty('heart', mid(S, w, ch), 122, 350 + i * 260, { size: 16 });
    S.emote(ch, 'sparkle', 1300, 900);
    S.emote(nw, 'heart', 1400, 1300);
    flyArc(S, 'heart', { x: S.X[ch] + 20, y: 130 }, { x: S.X[nw] - 10, y: 130 }, 1400, 700, [26, 26], 40);
    approach(S, ch, nw, 1500, 700, 10);
    crack(S, mid(S, w, ch), 140, 1700);
    S.word('¡CRAC!', 1800, { x: mid(S, w, ch), y: 14 });
    S.emote(w, 'cry', 2000, 1200); S.emote(w, 'anger', 2500, 1200);
    S.shake(1800, 4, 260);
    S.walk(w, -(S.X[w] + 100), 2700, 1000);
    S.lean(ch, 6, 1700, 500);
  };

  SC.sabotage = function(S, c){
    S.sky('night');
    var sab = 0, vic = 1, name = c.prop || 'gun', sz = S.itemSize(name);
    var ix = S.X[vic] - 64;
    S.emote(vic, 'zzz', 300, 1400); S.emote(vic, 'zzz', 1700, 1400);
    S.body(vic, [{ transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }], 0, 900, 'ease-in-out');
    var it = S.prop(name, { x: ix, y: 36, w: sz[0], h: sz[1], z: 5 });
    var stop = ix - S.X[sab] - 60;
    S.walk(sab, stop, 400, 1300);
    S.emote(sab, 'evil', 900, 1000);
    S.anim(it, [{ opacity: 1 }, { opacity: 1, offset: .99 }, { opacity: 0 }], { d: 1800, delay: 0 });
    var h1 = S.prop(name, { x: ix, y: 36, w: sz[0], h: sz[1], z: 5, cls: 'half l' }), h2 = S.prop(name, { x: ix, y: 36, w: sz[0], h: sz[1], z: 5, cls: 'half r' });
    S.anim(h1, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: 'none', offset: .01 }, { opacity: 1, transform: 'translate(-16px,10px) rotate(-30deg)' }], { d: 500, delay: 1800, ease: 'ease-in' });
    S.anim(h2, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: 'none', offset: .01 }, { opacity: 1, transform: 'translate(16px,10px) rotate(30deg)' }], { d: 500, delay: 1800, ease: 'ease-in' });
    S.word('¡CRAC!', 1820, { x: ix });
    S.burst(ix, 50, 1820, { n: 9, r: 40 });
    S.emote(sab, 'laugh', 2300, 1400);
    S.walk(sab, stop - 10, 2300, 300);
  };

  SC.prank = function(S){
    S.sky('day');
    var pr = 0, vic = S.n > 1 ? 1 : 0, x = S.X[vic];
    var rope = S.prop('rope', { x: x, y: 158, w: 8, h: 60, z: 4, back: true });
    var bucket = S.prop('bucket', { x: x, y: 150, w: 40, h: 38, z: 8, origin: '50% 20%' });
    S.emote(pr, 'evil', 300, 1200);
    S.lean(pr, -6, 300, 300);
    S.emote(vic, 'dots', 600, 900);
    S.anim(bucket, [{ transform: 'rotate(0)' }, { transform: 'rotate(0)', offset: .5 }, { transform: 'rotate(150deg) translateY(10px)' }], { d: 1200, delay: 800, ease: 'ease-in' });
    S.anim(rope, [{ opacity: 1 }, { opacity: 0 }], { d: 100, delay: 1300 });
    for(var i = 0; i < 14; i++) S.burst(x + rnd(-24, 24), 132, 1500 + i * 40, { n: 1, color: '#6ec1ff', r: 22 });
    S.word('¡SPLASH!', 1600, { x: x, y: 8 });
    S.tint(vic, 'brightness(.85) saturate(1.3) hue-rotate(-10deg)', 1600, 300);
    S.shiver(vic, 1700, 900);
    S.emote(vic, 'anger', 2000, 1300);
    S.emote(pr, 'laugh', 1700, 1500);
    S.hop(pr, 1800, 18, 300);
  };

  SC.contest = function(S){
    S.sky('warm');
    approach(S, 0, 1, 300, 800, 40);
    var m = mid(S, 0, 1);
    tableBetween(S, 0, 1, 28);
    var hands = S.prop('hands', { x: m, y: 62, w: 52, h: 36, z: 7 });
    S.anim(hands, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { d: 300, delay: 1000 });
    loop(S, hands, [{ transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }], { d: 240, dir: 'alternate', delay: 1300 });
    S.emote(0, 'anger', 1100, 900); S.emote(1, 'anger', 1200, 900);
    S.shiver(0, 1300, 1400); S.shiver(1, 1300, 1400);
    S.emote(0, 'sweat', 2100, 900); S.emote(1, 'sweat', 2200, 900);
    S.word('¡GRRR!', 1400, { x: m });
    S.body(0, [{ transform: 'none' }, { transform: 'scale(1.1,.9)' }], 2700, 400);
    S.body(1, [{ transform: 'none' }, { transform: 'scale(1.1,.9)' }], 2700, 400);
    S.emote(0, 'zzz', 3000, 1200); S.emote(1, 'laugh', 3100, 1200);
  };

  /* ---------- vida cotidiana ---------- */
  SC.hide = function(S){
    S.sky('dusk');
    var x = S.X[0];
    var bush = S.prop('bush', { x: x, y: 24, w: 130, h: 50, z: 5 });
    loop(S, bush, [{ transform: 'rotate(-1.5deg)' }, { transform: 'rotate(1.5deg)' }], { d: 700, dir: 'alternate', delay: 900, ease: 'ease-in-out' });
    S.body(0, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], 0, 800, 'ease-in-out');
    S.emote(0, 'dots', 700, 1000);
    S.emote(0, 'exclaim', 1900, 900);
    S.hop(0, 1950, 12, 300);
    if(S.n > 1){ S.emote(1, 'question', 1200, 1000); }
  };

  SC.sneak = function(S){
    S.sky('day');
    var sp = 0, tg = 1, x = S.X[sp];
    var bush = S.prop('bush', { x: x, y: 24, w: 130, h: 50, z: 5 });
    S.body(sp, [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }], 0, 700, 'ease-in-out');
    S.emote(sp, 'evil', 500, 1200);
    for(var i = 0; i < 3; i++) S.floaty('note', S.X[tg], 128, 300 + i * 600, { size: 16, rise: 40, d: 1500 });
    S.emote(tg, 'exclaim', 1800, 800);
    S.body(sp, [{ transform: 'translateY(0)' }, { transform: 'translateY(40px)' }], 1850, 300);
    S.anim(bush, [{ transform: 'none' }, { transform: 'rotate(4deg) translateY(-4px)' }, { transform: 'none' }], { d: 300, delay: 1850 });
    S.emote(tg, 'question', 2400, 1200);
  };

  SC.explore = function(S){
    S.sky('day');
    var i;
    for(i = 0; i < 5; i++){
      var t = S.prop('tree', { x: S.W + 30, y: 40, w: 34, h: 68, z: 1, back: true });
      loop(S, t, [{ transform: 'translateX(0)' }, { transform: 'translateX(-' + (S.W + 80) + 'px)' }], { d: 4200, delay: -i * 840, ease: 'linear', fill: 'both' });
    }
    S.actors.forEach(function(_, k){
      loop(S, S.els[k].ai, [{ transform: 'translateY(0) rotate(-3deg)' }, { transform: 'translateY(-6px) rotate(3deg)' }], { d: 280, dir: 'alternate', ease: 'ease-in-out' });
    });
    S.emote(0, 'idea', 1300, 1400);
  };

  SC.injured = function(S){
    S.sky('dusk');
    S.actors.forEach(function(_, k){
      loop(S, S.els[k].ai, [{ transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }], { d: 700, dir: 'alternate', ease: 'ease-in-out', delay: 300 });
    });
    var pl = S.attach(0, 'plaster', { w: 38, h: 15, left: 18, top: 6, onBody: true });
    S.anim(pl, [{ opacity: 0, transform: 'rotate(-14deg) scale(.4)' }, { opacity: 1, transform: 'rotate(-14deg) scale(1)' }], { d: 300, delay: 500 });
    orbitStars(S, 0, 400);
    S.word('¡AY!', 300, { x: S.X[0] });
    S.emote(0, 'sweat', 900, 1400);
  };

  SC.dance = function(S){
    S.sky('party');
    S.actors.forEach(function(_, k){
      loop(S, S.els[k].ai, [{ transform: 'translateY(0) rotate(-7deg)' }, { transform: 'translateY(-20px) rotate(7deg)' }], { d: 420, dir: 'alternate', ease: 'ease-in-out', delay: k * 130 });
    });
    if(S.n === 2) approach(S, 0, 1, 200, 800, 26);
    for(var i = 0; i < 8; i++) S.floaty('note', rnd(30, S.W - 30), 118, 200 + i * 420, { size: 18, rise: 90, d: 1800 });
    S.emote(0, 'sparkle', 1200, 1500);
  };

  SC.feast = function(S){
    S.sky('warm');
    var t = document.createElement('div');
    t.className = 'ptable big';
    S.front.appendChild(t);
    S.prop('cake', { x: S.W * .3, y: 54, w: 40, h: 36, z: 5 });
    S.prop('chicken', { x: S.W * .7, y: 54, w: 40, h: 36, z: 5 });
    S.actors.forEach(function(_, k){
      loop(S, S.els[k].ai, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px) scaleY(.97)' }], { d: 300, dir: 'alternate', ease: 'ease-in-out', delay: k * 90 });
    });
    S.emote(0, 'sparkle', 500, 900);
    if(S.hasDeath){
      S.body(S.vi, [{ transform: 'scale(1)' }, { transform: 'scale(1.25,1.1)' }], 900, 700, 'ease-in-out');
      S.emote(S.vi, 'exclaim', 1300, 700);
      S.word('¡ÑAM!', 900, { x: vx(S) });
      S.dieExplode(S.vi, 1700);
    } else {
      S.word('¡ÑAM!', 900, { x: S.W / 2 });
      S.emote(S.n - 1, 'heart', 1500, 1300);
    }
  };

  SC.mourn = function(S){
    S.sky('storm');
    var v = S.vi;
    S.emote(v === 0 && S.n > 1 ? 1 : 0, 'exclaim', 400, 800);
    if(S.hasDeath) dieBy(S, v, 'fall', 600, v === 0 ? 1 : -1);
    S.actors.forEach(function(_, k){
      if(k === v && S.hasDeath) return;
      S.body(k, [{ transform: 'none' }, { transform: 'scaleY(.92) rotate(-4deg)' }], 1400, 700, 'ease-out');
      S.emote(k, 'cry', 1500, 2000);
      for(var i = 0; i < 4; i++) S.floaty('tear', S.X[k] + (i % 2 ? 14 : -14), 88, 1500 + i * 420, { size: 8, rise: -34, d: 900 });
    });
    var fl = S.prop('flowers', { x: S.X[v] + (S.hasDeath ? 30 : 0), y: 30, w: 30, h: 36, z: 6 });
    S.anim(fl, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'translateY(0)' }], { d: 400, delay: 2200 });
  };

  SC.split = function(S){
    S.sky('night');
    var last = S.n - 1, m = mid(S, 0, last);
    S.emote(0, 'heart', 200, 700); if(S.n > 1) S.emote(last, 'heart', 250, 700);
    crack(S, m, 140, 900);
    S.word('¡CRAC!', 950, { x: m, y: 14 });
    S.shake(950, 4, 260);
    S.emote(0, 'anger', 1200, 1200); S.emote(last, 'cry', 1300, 1200);
    S.walk(0, -30, 1300, 900);
    S.walk(last, 30, 1300, 900);
    S.lean(0, -6, 1300, 400); S.lean(last, 6, 1300, 400);
    if(S.n === 3) S.emote(1, 'question', 1200, 1200);
  };

  SC.awkward = function(S){
    S.sky('warm');
    var m = mid(S, 0, S.n - 1);
    S.emote(0, 'dots', 400, 1000); if(S.n > 1) S.emote(1, 'dots', 900, 1000);
    S.emote(0, 'sweat', 1700, 1000);
    var tw = S.prop('tumble', { x: -30, y: 28, w: 32, h: 32, z: 6 });
    S.anim(tw, [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(' + (S.W + 60) + 'px) rotate(900deg)' }], { d: 2600, delay: 700, ease: 'linear' });
    var cr = S.prop('cricket', { x: m, y: 26, w: 28, h: 18, z: 5 });
    loop(S, cr, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], { d: 260, dir: 'alternate', delay: 1000 });
    for(var i = 0; i < 3; i++) S.floaty('note', m, 52, 1100 + i * 500, { size: 10, rise: 30, d: 900 });
  };

  SC.flirt = function(S){
    S.sky('warm');
    var m = mid(S, 0, 1);
    S.emote(0, 'heart', 400, 900);
    S.hop(0, 500, 14, 300);
    S.burst(S.X[0] + 40, 110, 800, { n: 6, r: 34, color: '#ffe14a' });
    S.emote(1, 'dots', 1000, 1400);
    S.emote(0, 'heart', 1600, 900);
    S.emote(0, 'sweat', 2400, 1000);
    var tw = S.prop('tumble', { x: -30, y: 28, w: 30, h: 30, z: 6 });
    S.anim(tw, [{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(' + (S.W + 60) + 'px) rotate(900deg)' }], { d: 2600, delay: 900, ease: 'linear' });
    var cr = S.prop('cricket', { x: m, y: 26, w: 28, h: 18, z: 5 });
    loop(S, cr, [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], { d: 260, dir: 'alternate', delay: 1200 });
  };

  SC.reject = function(S){
    S.sky('love');
    var a = 0, b = 1;
    var fl = S.attach(a, 'flowers', { w: 30, h: 36, left: 62, top: 38, onBody: true });
    S.walk(a, S.X[b] - S.X[a] - S.SZ - 30, 300, 900);
    S.emote(a, 'heart', 1000, 1000);
    S.emote(b, 'exclaim', 1100, 700);
    S.body(b, [{ transform: 'none' }, { transform: 'rotate(-8deg) translateX(6px)' }, { transform: 'rotate(8deg) translateX(-6px)' }, { transform: 'rotate(-8deg) translateX(6px)' }, { transform: 'rotate(8deg) translateX(-6px)' }, { transform: 'none' }], 1500, 900, 'ease-in-out');
    S.emote(b, 'anger', 1700, 1200);
    crack(S, S.X[a] + S.pos[a].x, 158, 2200);
    S.word('¡NO!', 1600, { x: S.X[b] });
    S.emote(a, 'cry', 2400, 1500);
    S.anim(fl, [{ opacity: 1, transform: 'none' }, { opacity: 1, transform: 'translateY(0)', offset: .5 }, { opacity: 1, transform: 'translate(0,44px) rotate(40deg)' }], { d: 700, delay: 2300 });
    S.walk(a, -(S.X[a] + 90), 3000, 1000);
  };

  SC.campfire = function(S){
    S.sky('night');
    var m = mid(S, 0, 1);
    S.prop('log', { x: m, y: 26, w: 56, h: 18, z: 5 });
    var fire = S.prop('fire', { x: m, y: 40, w: 44, h: 54, z: 6, origin: '50% 100%' });
    loop(S, fire, [{ transform: 'scaleY(1) scaleX(1)' }, { transform: 'scaleY(1.12) scaleX(.92)' }, { transform: 'scaleY(.95) scaleX(1.06)' }], { d: 420, dir: 'alternate' });
    approach(S, 0, 1, 200, 700, 56);
    var g = S.prop('ghost', { x: -30, y: 124, w: 34, h: 42, z: 2, back: true });
    S.anim(g, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: .55, transform: 'translate(' + S.W * .35 + 'px,-14px)', offset: .3 }, { opacity: .55, transform: 'translate(' + S.W * .7 + 'px,6px)', offset: .7 }, { opacity: 0, transform: 'translate(' + (S.W + 60) + 'px,-10px)' }], { d: 3200, delay: 900, ease: 'linear' });
    S.emote(0, 'idea', 800, 1100);
    S.emote(1, 'exclaim', 1700, 900);
    S.hop(1, 1750, 22, 350);
    S.lean(1, -6, 2000, 400);
    for(var i = 0; i < 6; i++) S.floaty('star', m + rnd(-12, 12), 90, 500 + i * 400, { size: 8, rise: 70, d: 1300 });
  };

  SC.trade = function(S, c){
    S.sky('warm');
    var n1 = c.prop || 'bag', n2 = c.prop2 || 'map', s1 = S.itemSize(n1), s2 = S.itemSize(n2);
    approach(S, 0, 1, 250, 800, 60);
    var a = S.X[0] + S.pos[0].x, b = S.X[1] + S.pos[1].x;
    var i1 = S.prop(n1, { x: a + 30, y: 138, w: s1[0], h: s1[1], z: 8 });
    var i2 = S.prop(n2, { x: b - 30, y: 138, w: s2[0], h: s2[1], z: 8 });
    var d = (b - 30) - (a + 30);
    S.anim(i1, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(0,0)', offset: .2 }, { opacity: 1, transform: 'translate(' + d * .5 + 'px,-30px)', offset: .6 }, { opacity: 1, transform: 'translate(' + d + 'px,0)', offset: .9 }, { opacity: 1, transform: 'translate(' + d + 'px,0)' }], { d: 1800, delay: 1000 });
    S.anim(i2, [{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, transform: 'translate(0,0)', offset: .2 }, { opacity: 1, transform: 'translate(' + -d * .5 + 'px,30px)', offset: .6 }, { opacity: 1, transform: 'translate(' + -d + 'px,0)', offset: .9 }, { opacity: 1, transform: 'translate(' + -d + 'px,0)' }], { d: 1800, delay: 1000 });
    S.word('¡TRATO!', 1900, { x: (a + b) / 2 });
    S.hop(0, 2450, 22, 380); S.hop(1, 2500, 22, 380);
    S.emote(0, 'evil', 2500, 1300); S.emote(1, 'laugh', 2550, 1300);
  };

  SC.pan = function(S){
    S.sky('day');
    var v = S.vi;
    approach(S, 0, 1, 250, 650, 60);
    var pan = S.attach(0, 'pan', { w: 62, h: 30, left: 60, top: 12, origin: '18% 50%' });
    S.anim(pan, [{ opacity: 0, transform: 'rotate(-110deg)' }, { opacity: 1, transform: 'rotate(-100deg)', offset: .3 }, { opacity: 1, transform: 'rotate(-100deg)' }], { d: 700, delay: 500 });
    S.anim(pan, [{ transform: 'rotate(-100deg)' }, { transform: 'rotate(25deg)' }], { d: 220, delay: 1250, ease: 'ease-in' });
    S.emote(0, 'evil', 700, 700);
    S.emote(v, 'exclaim', 900, 600);
    S.word('¡BOING!', 1450, { x: S.X[v] + S.pos[v].x - 20 });
    S.shake(1470, 6, 300);
    S.burst(S.X[v] + S.pos[v].x - 30, 100, 1470, { n: 8, r: 40 });
    if(S.hasDeath){
      dieBy(S, v, 'launch', 1480, 1);
      S.emote(0, 'dots', 2200, 900);
    } else {
      S.body(v, [{ transform: 'none' }, { transform: 'translateX(14px) rotate(12deg) scaleX(.85)', offset: .25 }, { transform: 'none' }], 1470, 700);
      orbitStars(S, v, 1500);
      S.emote(v, 'question', 1800, 1400);
    }
  };

  SC.abandon = function(S){
    S.sky('dusk');
    var tr = 0, vic = 1, x = S.X[vic];
    var hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.left = (x - 56) + 'px';
    S.back.appendChild(hole);
    S.body(vic, [{ transform: 'translateY(48px)' }, { transform: 'translateY(48px)' }], 0, 10);
    S.emote(vic, 'question', 300, 900);
    S.emote(tr, 'sparkle', 900, 900);
    S.walk(tr, -(S.X[tr] + 100), 1400, 1400);
    S.emote(tr, 'laugh', 1500, 1300);
    S.emote(vic, 'exclaim', 1600, 800);
    S.emote(vic, 'anger', 2200, 1200);
    S.emote(vic, 'cry', 3000, 1000);
  };

  SC.sleep = function(S){
    S.sky('night');
    S.actors.forEach(function(_, k){
      loop(S, S.els[k].ai, [{ transform: 'rotate(-3deg) translateY(0)' }, { transform: 'rotate(3deg) translateY(4px)' }], { d: 1400, dir: 'alternate', ease: 'ease-in-out', delay: k * 200 });
      S.emote(k, 'zzz', 400 + k * 300, 1500);
      S.emote(k, 'zzz', 2200 + k * 300, 1500);
    });
  };

  SC.ghost = function(S){
    S.sky('dusk');
    var v = S.vi;
    S.emote(v, 'exclaim', 500, 800);
    if(S.hasDeath) dieBy(S, v, ['fall', 'squash', 'sink'][Math.floor(Math.random() * 3)], 1000, 1);
    else S.hop(v, 900, 26, 400);
  };

  SC.victory = function(S){
    S.sky('gold');
    if(S.n === 2){ S.mv(0, S.W * .5 - S.X[0] - 34, 0, 0, 1); S.mv(1, S.W * .5 + 62 - S.X[1], 0, 0, 1); S.emote(1, 'heart', 1200, 1600); S.hop(1, 1500, 18, 400); }
    var x = S.X[0] + S.pos[0].x;
    S.body(0, [{ transform: 'scale(1.32)' }, { transform: 'scale(1.32)' }], 0, 10);
    var crown = S.attach(0, 'crown', { w: 50, h: 34, left: 17, top: -26, onBody: true });
    S.anim(crown, [{ opacity: 0, transform: 'translateY(-90px) rotate(-30deg)' }, { opacity: 1, transform: 'translateY(0) rotate(0)', offset: .7 }, { opacity: 1, transform: 'translateY(-8px)', offset: .85 }, { opacity: 1, transform: 'translateY(0)' }], { d: 900, delay: 500, ease: 'ease-in' });
    var ray = document.createElement('div');
    ray.className = 'lightray big';
    ray.style.left = (x - 110) + 'px';
    S.back.appendChild(ray);
    loop(S, ray, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { d: 9000, ease: 'linear' });
    S.confetti(40, 300);
    for(var i = 0; i < 7; i++) S.burst(rnd(30, S.W - 30), rnd(110, 190), 500 + i * 380, { n: 14, r: 62 });
    for(var j = 0; j < 3; j++) S.body(0, [{ transform: 'scale(1.32)' }, { transform: 'scale(1.32) translateY(-18px)' }, { transform: 'scale(1.32)' }], 1400 + j * 700, 500, 'ease-out');
    S.word('¡VICTORIA!', 900, { x: x, y: 4, d: 1600 });
  };

  A.SceneScripts = SC;
  A.SceneHelpers = { mid: mid, vx: vx, approach: approach, propSize: propSize, dieBy: dieBy, shadowAt: shadowAt, loop: loop, flyArc: flyArc, orbitStars: orbitStars, crack: crack, tableBetween: tableBetween };

  function lineup(root, actors, isStatic){
    var n = actors.length;
    var sz = n <= 6 ? 64 : n <= 12 ? 50 : 38;
    var h = '<div class="scene sc-lineup' + (isStatic ? ' static' : '') + '" style="--sz:' + sz + 'px"><div class="bgl lineupbg"></div><div class="lineupgrid">';
    actors.forEach(function(t, i){
      h += '<div class="lu" style="--i:' + i + '">' + A.avatar(t, sz) + '</div>';
    });
    root.innerHTML = h + '</div></div>';
  }

  A.Scenes = {
    render: function(el, entry, byId, isStatic){
      var key = entry.scene || DEFAULT[entry.type] || 'explore';
      var actors = (entry.ids || []).map(byId).filter(Boolean);
      if(!actors.length){ el.innerHTML = ''; return; }
      isStatic = !!isStatic;
      if(key === 'lineup' || actors.length > 3){ lineup(el, actors, isStatic); return; }
      if(key === 'victory') actors = actors.slice(0, 2);
      if(!SC[key]) key = 'explore';
      entry = Object.assign({}, entry, { scene: key });
      var S = new Stage(el, entry, actors, isStatic);
      S.build();
      SC[key](S, { entry: entry, prop: entry.prop, prop2: entry.prop2 });
      if(S.hasDeath && key !== 'balloon' && !S.scene.querySelector('.ghostf')){
        S.dead.forEach(function(d, i){ if(d) dieBy(S, i, 'fall', 2400, S.X[i] > S.W / 2 ? 1 : -1); });
      }
      if(isStatic) S.finish();
    }
  };
})();

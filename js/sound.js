(function(){
  var A = window.Arena = window.Arena || {};

  var ctx = null, master = null, noiseBuf = null;
  var musicNodes = null, musicTimer = null;
  var enabled = true;

  function getCtx(){
    if(ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
    } catch(e){ ctx = null; }
    return ctx;
  }
  function now(){ return ctx ? ctx.currentTime : 0; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  function tone(freq, o){
    if(!ctx) return;
    o = o || {};
    var t0 = now() + (o.delay || 0);
    var dur = o.dur || 0.2;
    var osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if(o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t0 + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, o.peak || 0.22), t0 + (o.attack || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var out = osc;
    if(o.filter){
      var f = ctx.createBiquadFilter();
      f.type = o.filter;
      f.frequency.value = o.filterFreq || 1400;
      osc.connect(f);
      out = f;
    }
    out.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.08);
  }

  function getNoiseBuffer(){
    if(noiseBuf) return noiseBuf;
    var len = ctx.sampleRate;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for(var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function noise(o){
    if(!ctx) return;
    o = o || {};
    var t0 = now() + (o.delay || 0);
    var dur = o.dur || 0.2;
    var src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer();
    var f = ctx.createBiquadFilter();
    f.type = o.filter || 'bandpass';
    f.frequency.value = o.freq || 900;
    f.Q.value = o.q || 1;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, o.peak || 0.3), t0 + (o.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.08);
  }

  var RECIPES = {
    death: function(){
      noise({ filter: 'lowpass', freq: 260, q: .8, dur: .38, peak: .5 });
      tone(190, { type: 'sawtooth', to: 55, dur: .42, peak: .2, filter: 'lowpass', filterFreq: 900 });
    },
    romance: function(){
      tone(659, { type: 'triangle', dur: .3, peak: .16 });
      tone(880, { type: 'triangle', dur: .38, peak: .14, delay: .1 });
    },
    family: function(){
      tone(523, { type: 'sine', dur: .3, peak: .16 });
      tone(784, { type: 'sine', dur: .4, peak: .14, delay: .12 });
    },
    alliance: function(){
      [440, 554, 659].forEach(function(f, i){ tone(f, { type: 'triangle', dur: .18, peak: .14, delay: i * .07 }); });
    },
    heal: function(){
      tone(500, { type: 'sine', to: 900, dur: .4, peak: .16, attack: .05 });
    },
    theft: function(){
      tone(520, { type: 'square', to: 300, dur: .13, peak: .1 });
      tone(360, { type: 'square', to: 210, dur: .15, peak: .1, delay: .11 });
    },
    betrayal: function(){
      tone(340, { type: 'square', to: 160, dur: .18, peak: .13 });
      tone(220, { type: 'square', to: 110, dur: .22, peak: .12, delay: .13 });
    },
    fight: function(){
      noise({ filter: 'highpass', freq: 1800, dur: .1, peak: .3 });
      tone(1100, { type: 'square', dur: .06, peak: .12 });
    },
    item: function(){
      [1046, 1318, 1568].forEach(function(f, i){ tone(f, { type: 'sine', dur: .14, peak: .13, delay: i * .06 }); });
    },
    victory: function(){
      [440, 554, 659, 880, 1108].forEach(function(f, i){
        tone(f, { type: 'sawtooth', dur: .32, peak: .18, delay: i * .12, filter: 'lowpass', filterFreq: 2600 });
      });
    },
    ui_tap: function(){
      tone(680, { type: 'sine', dur: .05, peak: .1 });
    },
    ui_start: function(){
      tone(220, { type: 'sine', to: 660, dur: .28, peak: .14 });
    }
  };

  function startMusic(){
    var c = getCtx();
    if(!c || musicNodes) return;
    var g = ctx.createGain();
    g.gain.value = 0.0001;
    g.connect(master);
    g.gain.linearRampToValueAtTime(0.1, now() + 2.5);
    var specs = [[110, 'sine', .5, -3], [164.81, 'sine', .32, 0], [220, 'triangle', .26, 3]];
    var oscs = specs.map(function(sp){
      var o = ctx.createOscillator();
      o.type = sp[1];
      o.frequency.value = sp[0];
      o.detune.value = sp[3];
      var og = ctx.createGain();
      og.gain.value = sp[2];
      o.connect(og);
      og.connect(g);
      o.start();
      return o;
    });
    var lfo = ctx.createOscillator();
    lfo.frequency.value = 0.045;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    lfo.start();
    musicNodes = { gain: g, oscs: oscs, lfo: lfo };
    (function twinkle(){
      musicTimer = setTimeout(function(){
        if(musicNodes && enabled) tone(pick([880, 987, 1174, 1318, 1568]), { type: 'sine', dur: 1.3, attack: .5, peak: .045 });
        twinkle();
      }, 7000 + Math.random() * 9000);
    })();
  }
  function stopMusic(){
    clearTimeout(musicTimer);
    if(!musicNodes) return;
    var nodes = musicNodes;
    musicNodes = null;
    var g = nodes.gain;
    g.gain.cancelScheduledValues(now());
    g.gain.setValueAtTime(g.gain.value, now());
    g.gain.linearRampToValueAtTime(0.0001, now() + 1);
    setTimeout(function(){
      nodes.oscs.forEach(function(o){ try { o.stop(); } catch(e){} });
      try { nodes.lfo.stop(); } catch(e){}
    }, 1100);
  }

  document.addEventListener('visibilitychange', function(){
    if(!ctx) return;
    if(document.hidden) ctx.suspend();
    else if(enabled) ctx.resume();
  });

  A.Sound = {
    unlock: function(){
      var c = getCtx();
      if(c && c.state === 'suspended') c.resume();
      if(enabled) startMusic();
    },
    setEnabled: function(v){
      enabled = !!v;
      if(!ctx) return;
      if(enabled) startMusic(); else stopMusic();
    },
    isEnabled: function(){ return enabled; },
    isSupported: function(){ return !!(window.AudioContext || window.webkitAudioContext); },
    play: function(type){
      if(!enabled || !ctx || ctx.state === 'suspended') return;
      var fn = RECIPES[type];
      if(fn) fn();
    }
  };
})();

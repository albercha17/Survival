(function(){
  var A = window.Arena = window.Arena || {};
  var synth = window.speechSynthesis;
  var supported = !!(synth && window.SpeechSynthesisUtterance);

  var token = 0;
  var typeTimer = null;
  var safetyTimer = null;
  var voiceCache = null;

  function spanishVoice(){
    if(!supported) return null;
    var voices = synth.getVoices();
    if(!voices.length) return voiceCache;
    var pick = voices.filter(function(v){ return /^es[-_]ES/i.test(v.lang); })[0] ||
               voices.filter(function(v){ return /^es/i.test(v.lang); })[0] || null;
    voiceCache = pick;
    return pick;
  }

  function cancel(){
    token++;
    clearTimeout(typeTimer);
    clearTimeout(safetyTimer);
    if(supported) synth.cancel();
  }

  A.Narrator = {
    voiceSupported: supported,

    cancel: cancel,

    narrate: function(el, text, opts, done){
      cancel();
      var mine = token;
      var speed = opts.speed || 1;
      var useVoice = supported && opts.voice;
      var typed = false, spoken = !useVoice, finished = false;

      function finish(){
        if(finished || mine !== token || !typed || !spoken) return;
        finished = true;
        done();
      }

      el.textContent = '';
      var i = 0;
      var perChar = (useVoice ? 52 : 30) / speed;
      (function tick(){
        if(mine !== token) return;
        i += 1;
        el.textContent = text.slice(0, i);
        if(i >= text.length){ typed = true; finish(); return; }
        typeTimer = setTimeout(tick, perChar);
      })();

      if(useVoice){
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        var v = spanishVoice();
        if(v) u.voice = v;
        u.rate = Math.min(1.6, 1.02 * (speed > 1 ? 1 + (speed - 1) * 0.25 : 1));
        u.onend = u.onerror = function(){ if(mine === token){ spoken = true; finish(); } };
        synth.speak(u);
        safetyTimer = setTimeout(function(){
          if(mine === token){ spoken = true; finish(); }
        }, (text.length * 95) / speed + 3000);
      }
    },

    unlock: function(){
      if(!supported) return;
      var u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      synth.speak(u);
    },

    showInstant: function(el, text){
      cancel();
      el.textContent = text;
    }
  };

  if(supported && synth.addEventListener) synth.addEventListener('voiceschanged', spanishVoice);
})();

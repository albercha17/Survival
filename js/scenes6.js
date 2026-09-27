(function(){
  var A = window.Arena;
  var K = A.SceneKit, P = K.P, rnd = K.rnd;
  var SP = K.Stage.prototype;

  P.cactus = '<svg viewBox="0 0 40 60"><rect x="15" y="10" width="10" height="48" rx="5" fill="#3f8a45"/><path d="M15 24h-9a5 5 0 0 0-5 5v10" stroke="#3f8a45" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M25 34h9a5 5 0 0 1 5 5v8" stroke="#3f8a45" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M17 14v3M20 12v3M23 15v3M17 40v3M22 42v3" stroke="#2c6a30" stroke-width="1.4"/></svg>';
  P.ruin = '<svg viewBox="0 0 90 130" preserveAspectRatio="none"><path d="M4 130V30l14-14 10 10V10l16-8 14 9V26l12-10 10 8v16l10-6v102z" fill="#31343b"/><rect x="14" y="46" width="8" height="10" fill="#ffcf6a" opacity=".8"/><rect x="30" y="70" width="8" height="10" fill="#ffcf6a" opacity="0"/><rect x="50" y="40" width="8" height="10" fill="#ffcf6a" opacity=".8"/><rect x="60" y="90" width="8" height="10" fill="#ffcf6a" opacity=".8"/></svg>';

  var BIOME_REMAP = {
    nieve:    { day: 'snow', dusk: 'snow', warm: 'snow', night: 'snow', storm: 'snow' },
    desierto: { day: 'desert', dusk: 'desert', warm: 'desert', storm: 'desert' },
    selva:    { day: 'jungle', dusk: 'jungle', warm: 'jungle', storm: 'jungle' },
    ciudad:   { day: 'city', dusk: 'city', warm: 'city', night: 'city', storm: 'city' },
    isla:     { day: 'sea', dusk: 'sea', warm: 'sea', night: 'sea_night' }
  };

  var baseSky = SP.sky;
  SP.sky = function(kind){
    var remap = this.biome && BIOME_REMAP[this.biome];
    var k = (remap && remap[kind]) || kind;
    var self = this;

    if(k === 'desert'){
      baseSky.call(this, 'day');
      var s = this.scene;
      s.style.setProperty('--sA', '#e8c07a'); s.style.setProperty('--sB', '#f6e2b0');
      s.style.setProperty('--h1', '#caa15a'); s.style.setProperty('--h2', '#b8863f');
      s.style.setProperty('--g', '#e2b46a'); s.style.setProperty('--g2', '#c9963f');
      [].forEach.call(this.bgl.querySelectorAll('.cloud'), function(c){ c.remove(); });
      this.prop('cactus', { x: this.W * .14, y: 24, w: 34, h: 52, z: 1, back: true });
      if(this.W > 250) this.prop('cactus', { x: this.W * .88, y: 22, w: 28, h: 42, z: 1, back: true });
      return;
    }
    if(k === 'jungle'){
      baseSky.call(this, 'day');
      var sj = this.scene;
      sj.style.setProperty('--sA', '#204a36'); sj.style.setProperty('--sB', '#8bab5a');
      sj.style.setProperty('--h1', '#1c3d28'); sj.style.setProperty('--h2', '#142e1e');
      sj.style.setProperty('--g', '#2f6b34'); sj.style.setProperty('--g2', '#1f4a22');
      [[8, 208], [92, 206], [20, 212]].forEach(function(pos){
        self.prop('leaf', { x: self.W * pos[0] / 100, y: pos[1], w: 26, h: 26, z: 9, cls: 'jungleleaf' });
      });
      return;
    }
    if(k === 'city'){
      baseSky.call(this, 'dusk');
      var sc = this.scene;
      sc.style.setProperty('--sA', '#3a3f4a'); sc.style.setProperty('--sB', '#6a6f78');
      sc.style.setProperty('--h1', '#2a2d33'); sc.style.setProperty('--h2', '#1c1e22');
      sc.style.setProperty('--g', '#4a4d52'); sc.style.setProperty('--g2', '#34363a');
      var lo = this.bgl.querySelector('.sun.low');
      if(lo) lo.style.opacity = '.35';
      [].forEach.call(this.front.querySelectorAll('.tuft'), function(t){ t.remove(); });
      this.prop('ruin', { x: this.W * .16, y: 20, w: 60, h: 130, z: 1, back: true });
      this.prop('ruin', { x: this.W * .82, y: 20, w: 54, h: 110, z: 1, back: true });
      return;
    }
    if(k === 'sea_night'){
      baseSky.call(this, 'night');
      var wn = document.createElement('div');
      wn.className = 'water deep';
      this.front.appendChild(wn);
      return;
    }
    return baseSky.call(this, k);
  };
})();

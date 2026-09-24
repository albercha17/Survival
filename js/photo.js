(function(){
  var A = window.Arena = window.Arena || {};

  var OUT = 176;

  function hexToRgb(h){
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function dist(a, b){
    var dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  }
  function nearest(list, rgb){
    var best = list[0], bd = Infinity;
    list.forEach(function(o){
      var d = dist(hexToRgb(o.hex), rgb);
      if(d < bd){ bd = d; best = o; }
    });
    return best;
  }
  function average(canvas, x0, y0, x1, y1){
    var w = canvas.width;
    var sx = Math.round(x0 * w), sy = Math.round(y0 * w);
    var sw = Math.max(1, Math.round((x1 - x0) * w)), sh = Math.max(1, Math.round((y1 - y0) * w));
    var d = canvas.getContext('2d').getImageData(sx, sy, sw, sh).data;
    var r = 0, g = 0, b = 0, n = d.length / 4;
    for(var i = 0; i < d.length; i += 4){ r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    return [r / n, g / n, b / n];
  }

  function loadImage(file){
    return new Promise(function(resolve, reject){
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function(){ URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function(){ URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen. Prueba con una foto JPG o PNG.')); };
      img.src = url;
    });
  }

  function Cropper(canvas, slider, onZoom){
    var ctx = canvas.getContext('2d');
    var S = canvas.width;
    var img = null, base = 1, zoom = 1, ox = 0, oy = 0;
    var pointers = {};
    var pinchStart = null;

    function sc(){ return base * zoom; }
    function clamp(){
      var w = img.width * sc(), h = img.height * sc();
      ox = Math.min(0, Math.max(S - w, ox));
      oy = Math.min(0, Math.max(S - h, oy));
    }
    function draw(){
      ctx.clearRect(0, 0, S, S);
      if(!img) return;
      ctx.drawImage(img, ox, oy, img.width * sc(), img.height * sc());
      ctx.save();
      ctx.fillStyle = 'rgba(8,10,6,.72)';
      ctx.beginPath();
      ctx.rect(0, 0, S, S);
      ctx.arc(S / 2, S / 2, S / 2 - 3, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(205,162,63,.9)';
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2 - 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath();
      ctx.moveTo(S * 0.16, S * 0.42);
      ctx.lineTo(S * 0.84, S * 0.42);
      ctx.stroke();
      ctx.setLineDash([]);
      [0.35, 0.65].forEach(function(x){
        ctx.beginPath();
        ctx.arc(S * x, S * 0.42, 7, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }
    function setZoom(z, cx, cy){
      var old = sc();
      var ix = (cx - ox) / old, iy = (cy - oy) / old;
      zoom = Math.min(4, Math.max(1, z));
      ox = cx - ix * sc();
      oy = cy - iy * sc();
      clamp();
      slider.value = zoom;
      draw();
    }
    function local(ev){
      var r = canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S / r.width, y: (ev.clientY - r.top) * S / r.height };
    }

    canvas.addEventListener('pointerdown', function(ev){
      if(!img) return;
      canvas.setPointerCapture(ev.pointerId);
      pointers[ev.pointerId] = local(ev);
      pinchStart = null;
    });
    canvas.addEventListener('pointermove', function(ev){
      if(!img || !pointers[ev.pointerId]) return;
      var prev = pointers[ev.pointerId];
      var now = local(ev);
      var ids = Object.keys(pointers);
      if(ids.length >= 2){
        pointers[ev.pointerId] = now;
        var a = pointers[ids[0]], b = pointers[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if(pinchStart){ setZoom(pinchStart.zoom * d / pinchStart.d, (a.x + b.x) / 2, (a.y + b.y) / 2); }
        else pinchStart = { d: d, zoom: zoom };
      } else {
        ox += now.x - prev.x;
        oy += now.y - prev.y;
        pointers[ev.pointerId] = now;
        clamp();
        draw();
      }
    });
    function end(ev){ delete pointers[ev.pointerId]; pinchStart = null; }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('wheel', function(ev){
      if(!img) return;
      ev.preventDefault();
      var p = local(ev);
      setZoom(zoom * (ev.deltaY < 0 ? 1.08 : 0.92), p.x, p.y);
    }, { passive: false });
    slider.addEventListener('input', function(){
      if(img) setZoom(parseFloat(slider.value), S / 2, S / 2);
    });

    return {
      setImage: function(image){
        img = image;
        base = Math.max(S / img.width, S / img.height);
        zoom = 1;
        ox = (S - img.width * base) / 2;
        oy = (S - img.height * base) / 2;
        slider.value = 1;
        draw();
      },
      clear: function(){ img = null; ctx.clearRect(0, 0, S, S); },
      exportRaw: function(){
        var out = document.createElement('canvas');
        out.width = out.height = OUT;
        var k = OUT / S;
        out.getContext('2d').drawImage(img, ox * k, oy * k, img.width * sc() * k, img.height * sc() * k);
        return out;
      }
    };
  }

  function stylize(raw, comic){
    var c = document.createElement('canvas');
    c.width = c.height = raw.width;
    var x = c.getContext('2d');
    x.drawImage(raw, 0, 0);
    if(comic){
      var id = x.getImageData(0, 0, c.width, c.height), p = id.data;
      for(var i = 0; i < p.length; i += 4){
        var l = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        for(var k = 0; k < 3; k++){
          var v = l + (p[i + k] - l) * 1.45;
          v = (v - 128) * 1.2 + 128;
          v = Math.max(0, Math.min(255, v));
          p[i + k] = Math.round(v / 51) * 51;
        }
      }
      x.putImageData(id, 0, 0);
    }
    return c.toDataURL('image/jpeg', 0.82);
  }

  function suggest(raw){
    var skin = nearest(A.SKIN, average(raw, 0.40, 0.52, 0.60, 0.64));
    var hair = nearest(A.HAIR, average(raw, 0.32, 0.03, 0.68, 0.11));
    return { skin: skin.id, hair: hair.id };
  }

  A.Photo = { loadImage: loadImage, Cropper: Cropper, stylize: stylize, suggest: suggest, OUT: OUT };
})();

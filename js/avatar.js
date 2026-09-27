(function(){
  var A = window.Arena = window.Arena || {};

  A.HAIR = [
    { id: 'negro',     label: 'Negro',     hex: '#1e1b1b' },
    { id: 'castano',   label: 'Castaño',   hex: '#5b3a22' },
    { id: 'rubio',     label: 'Rubio',     hex: '#dcb75f' },
    { id: 'pelirrojo', label: 'Pelirrojo', hex: '#b9492a' },
    { id: 'blanco',    label: 'Blanco',    hex: '#e8e4d9' },
    { id: 'azul',      label: 'Azul',      hex: '#4171d3' },
    { id: 'rosa',      label: 'Rosa',      hex: '#d96c9c' }
  ];

  A.EYES = [
    { id: 'marrones', label: 'Marrones', hex: '#6d4120' },
    { id: 'azules',   label: 'Azules',   hex: '#4383c7' },
    { id: 'verdes',   label: 'Verdes',   hex: '#4d9c5d' },
    { id: 'grises',   label: 'Grises',   hex: '#8b959d' },
    { id: 'avellana', label: 'Avellana', hex: '#a37d2e' },
    { id: 'negros',   label: 'Negros',   hex: '#171717' }
  ];

  A.GENDERS = [
    { id: 'chico', label: 'Chico' },
    { id: 'chica', label: 'Chica' }
  ];

  function find(list, id, fallback){
    for(var i = 0; i < list.length; i++) if(list[i].id === id) return list[i];
    return list[fallback || 0];
  }
  A.SKIN = [
    { id: 'muyclaro', label: 'Muy claro', hex: '#f4dcc6', shade: '#dfc0a6' },
    { id: 'claro',    label: 'Claro',     hex: '#e6c29f', shade: '#d2a982' },
    { id: 'medio',    label: 'Medio',     hex: '#d1a074', shade: '#b98a60' },
    { id: 'tostado',  label: 'Tostado',   hex: '#b57f55', shade: '#9c6a44' },
    { id: 'moreno',   label: 'Moreno',    hex: '#8d5a3b', shade: '#754a30' },
    { id: 'oscuro',   label: 'Oscuro',    hex: '#5e3a26', shade: '#4b2d1d' }
  ];

  A.HAIRSTYLES = [
    { id: 'corto',  label: 'Corto' },
    { id: 'largo',  label: 'Largo' },
    { id: 'rizado', label: 'Rizado' },
    { id: 'coleta', label: 'Coleta' },
    { id: 'cresta', label: 'Cresta' },
    { id: 'calvo',  label: 'Calvo' }
  ];
  A.GLASSES = [
    { id: 'ninguna',  label: 'Sin gafas' },
    { id: 'redondas', label: 'Con gafas' }
  ];
  A.HATS = [
    { id: 'ninguno', label: 'Sin sombrero' },
    { id: 'gorra',   label: 'Gorra' },
    { id: 'gorro',   label: 'Gorro' }
  ];
  A.OUTFITS = [
    { id: 'oliva',   label: 'Verde oliva', hex: '#3a4630' },
    { id: 'azul',    label: 'Azul',        hex: '#2c4a73' },
    { id: 'rojo',    label: 'Rojo',        hex: '#7a2f34' },
    { id: 'mostaza', label: 'Mostaza',     hex: '#8a6a1e' },
    { id: 'morado',  label: 'Morado',      hex: '#5a3a7a' },
    { id: 'gris',    label: 'Gris',        hex: '#4a4d52' },
    { id: 'negro',   label: 'Negro',       hex: '#23252b' },
    { id: 'blanco',  label: 'Blanco',      hex: '#d8d4c8' }
  ];

  A.hairOf = function(id){ return find(A.HAIR, id); };
  A.eyesOf = function(id){ return find(A.EYES, id); };
  A.skinOf = function(id){ return find(A.SKIN, id, 1); };
  A.hairstyleOf = function(id){ return find(A.HAIRSTYLES, id); };
  A.glassesOf = function(id){ return find(A.GLASSES, id); };
  A.hatOf = function(id){ return find(A.HATS, id); };
  A.outfitOf = function(id){ return find(A.OUTFITS, id); };

  function shade(hex, factor){
    var m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    if(!m) return hex;
    var n = parseInt(m[1], 16);
    var r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * factor)));
    var g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * factor)));
    var b = Math.max(0, Math.min(255, Math.round((n & 255) * factor)));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  var PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;
  A.validPhoto = function(p){ return typeof p === 'string' && p.length < 60000 && PHOTO_RE.test(p); };

  function hairstylePaths(style, hex){
    switch(style){
      case 'largo':
        return {
          back: '<path d="M16.5 31 Q16 9 32 9 Q48 9 47.5 31 L50 56 Q41 60 32 55 Q23 60 14 56 Z" fill="' + hex + '"/>',
          front: '<path d="M19 31 Q17.5 11 32 11 Q46.5 11 45 31 Q43 20 32 20.5 Q21 20 19 31 Z" fill="' + hex + '"/>'
        };
      case 'rizado':
        var puff = [[20, 24, 6.6], [16.5, 17, 6], [22, 10.5, 6.6], [32, 7.5, 7.2], [42, 10.5, 6.6], [47.5, 17, 6], [44, 24, 6.6]];
        var crown = [[24, 16, 5], [32, 13, 5.6], [40, 16, 5]];
        return {
          back: puff.map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + hex + '"/>'; }).join(''),
          front: crown.map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + hex + '"/>'; }).join('')
        };
      case 'coleta':
        return {
          back: '<path d="M41 15.5 Q50.5 15 51 25 Q53 34 48 45 Q43.5 40 42.5 30 Q41 22 41 15.5Z" fill="' + hex + '"/>' +
            '<rect x="39.5" y="15" width="7.5" height="3.2" rx="1.4" fill="' + shade(hex, .45) + '" opacity=".85"/>',
          front: '<path d="M19.2 29 Q17.5 12 32 12.5 Q46.5 12 44.8 29 Q43 21 38 19.5 Q31 22 25 19.5 Q21 21 19.2 29 Z" fill="' + hex + '"/>'
        };
      case 'cresta':
        return {
          back: '',
          front: '<path d="M25 15 L28 3 L32 9 L36 3 L39 15 Q32 10.5 25 15 Z" fill="' + hex + '"/>'
        };
      case 'calvo':
        return { back: '', front: '<ellipse cx="27" cy="20" rx="5" ry="3" fill="#fff" opacity=".16"/>' };
      case 'corto':
      default:
        return {
          back: '',
          front: '<path d="M19.2 29 Q17.5 12 32 12.5 Q46.5 12 44.8 29 Q43 21 38 19.5 Q31 22 25 19.5 Q21 21 19.2 29 Z" fill="' + hex + '"/>'
        };
    }
  }

  function glassesMarkup(style){
    if(style !== 'redondas') return '';
    return '<circle cx="26.5" cy="31.5" r="6.1" fill="none" stroke="#2a2f36" stroke-width="1.7"/>' +
      '<circle cx="37.5" cy="31.5" r="6.1" fill="none" stroke="#2a2f36" stroke-width="1.7"/>' +
      '<path d="M32.6 31.3h1.8" stroke="#2a2f36" stroke-width="1.7"/>' +
      '<path d="M20.5 29.8 L16.5 27.8" stroke="#2a2f36" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M43.5 29.8 L47.5 27.8" stroke="#2a2f36" stroke-width="1.5" stroke-linecap="round"/>';
  }

  function hatMarkup(style, hex){
    var dark = shade(hex, .68);
    if(style === 'gorra'){
      return '<path d="M18 20.5 Q18 6 32 6 Q46 6 46 20.5 Q46 22 44 22 L20 22 Q18 22 18 20.5 Z" fill="' + hex + '"/>' +
        '<path d="M44.5 19.5 Q54.5 18.5 57 24 Q50 25.5 43 23 Z" fill="' + dark + '"/>';
    }
    if(style === 'gorro'){
      return '<path d="M17 22 Q17 5 32 5 Q47 5 47 22 Z" fill="' + hex + '"/>' +
        '<rect x="17" y="18" width="30" height="5.5" rx="2.75" fill="' + dark + '"/>' +
        '<circle cx="32" cy="4" r="3.3" fill="' + dark + '"/>';
    }
    return '';
  }

  A.avatar = function(c, size){
    var s0 = size || 40;
    var label = c.name ? String(c.name).replace(/[&<>"']/g, '') : 'Personaje';
    if(A.validPhoto(c.photo)){
      return '<svg class="avatar photo" viewBox="0 0 64 64" width="' + s0 + '" height="' + s0 + '" role="img" aria-label="' + label + '">' +
        '<rect width="64" height="64" fill="#1b2015"/>' +
        '<image href="' + c.photo + '" x="0" y="0" width="64" height="64" preserveAspectRatio="xMidYMid slice"/></svg>';
    }
    if(c.baby){
      var bh = A.hairOf(c.hair).hex, be = A.eyesOf(c.eyes).hex, bs = A.skinOf(c.skin);
      var bp = [];
      bp.push('<rect width="64" height="64" fill="#1b2015"/>');
      bp.push('<path d="M6 66 Q8 46 32 46 Q56 46 58 66 Z" fill="#f2dc9a"/>');
      bp.push('<path d="M14 58 Q32 50 50 58" stroke="#e0c476" stroke-width="2" fill="none" stroke-linecap="round"/>');
      bp.push('<circle cx="32" cy="30" r="19" fill="' + bs.hex + '"/>');
      bp.push('<circle cx="18.5" cy="32" r="3.2" fill="' + bs.hex + '"/><circle cx="45.5" cy="32" r="3.2" fill="' + bs.hex + '"/>');
      bp.push('<path d="M26 12.5 Q28 4 33 8 Q32 10.5 35 10 Q34 6 38 8 Q36 13 30 13.5 Q27 14 26 12.5Z" fill="' + bh + '"/>');
      bp.push('<circle cx="24.5" cy="31.5" r="4.2" fill="#fff"/><circle cx="39.5" cy="31.5" r="4.2" fill="#fff"/>');
      bp.push('<circle cx="24.8" cy="32" r="3" fill="' + be + '"/><circle cx="39.8" cy="32" r="3" fill="' + be + '"/>');
      bp.push('<circle cx="24.8" cy="32" r="1.3" fill="#111"/><circle cx="39.8" cy="32" r="1.3" fill="#111"/>');
      bp.push('<circle cx="25.9" cy="30.8" r="1" fill="#fff"/><circle cx="40.9" cy="30.8" r="1" fill="#fff"/>');
      bp.push('<circle cx="19.5" cy="38" r="3" fill="#ff9aa8" fill-opacity=".55"/><circle cx="44.5" cy="38" r="3" fill="#ff9aa8" fill-opacity=".55"/>');
      bp.push('<circle cx="32" cy="41" r="3.6" fill="#7ec8ff"/><circle cx="32" cy="41" r="1.5" fill="#dff2ff"/>');
      return '<svg class="avatar baby" viewBox="0 0 64 64" width="' + s0 + '" height="' + s0 + '" role="img" aria-label="' + label + '">' + bp.join('') + '</svg>';
    }
    var hair = A.hairOf(c.hair).hex;
    var eyes = A.eyesOf(c.eyes).hex;
    var girl = c.gender === 'chica';
    var skinO = A.skinOf(c.skin);
    var skin = skinO.hex, skinShade = skinO.shade;
    var outfit = A.outfitOf(c.outfit).hex;
    var hs = hairstylePaths(c.hairstyle || 'corto', hair);
    var parts = [];
    parts.push('<rect width="64" height="64" fill="#1b2015"/>');
    parts.push(hs.back);
    parts.push('<path d="M7 66 Q9 47 32 47 Q55 47 57 66 Z" fill="' + outfit + '"/>');
    parts.push('<rect x="27.5" y="38" width="9" height="11" rx="3" fill="' + skinShade + '"/>');
    parts.push('<ellipse cx="32" cy="30" rx="12.5" ry="14" fill="' + skin + '"/>');
    parts.push(hs.front);
    [26.5, 37.5].forEach(function(cx){
      parts.push('<ellipse cx="' + cx + '" cy="31.5" rx="3.3" ry="2.7" fill="#f5f2ea"/>');
      parts.push('<circle cx="' + cx + '" cy="31.6" r="1.95" fill="' + eyes + '"/>');
      parts.push('<circle cx="' + cx + '" cy="31.6" r=".85" fill="#111"/>');
    });
    if(girl){
      parts.push('<path d="M22.6 28.6 L24 28 M41.4 28.6 L40 28" stroke="#2a1f1a" stroke-width="1" stroke-linecap="round"/>');
    }
    parts.push('<path d="M28.6 38.4 Q32 40.8 35.4 38.4" stroke="#8a4a42" stroke-width="1.3" fill="none" stroke-linecap="round"/>');
    parts.push(glassesMarkup(c.glasses || 'ninguna'));
    parts.push(hatMarkup(c.hat || 'ninguno', outfit));
    return '<svg class="avatar" viewBox="0 0 64 64" width="' + s0 + '" height="' + s0 + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
  };

  A.describe = function(c){
    var style = A.hairstyleOf(c.hairstyle || 'corto');
    var bits = [(c.gender === 'chica' ? 'Chica' : 'Chico')];
    bits.push('pelo ' + A.hairOf(c.hair).label.toLowerCase() + (style.id !== 'corto' ? ' ' + style.label.toLowerCase() : ''));
    bits.push('ojos ' + A.eyesOf(c.eyes).label.toLowerCase());
    var base = bits.join(' · ');
    return A.validPhoto(c.photo) ? 'Con foto · ' + base : base;
  };
})();

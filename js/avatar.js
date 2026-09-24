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

  A.hairOf = function(id){ return find(A.HAIR, id); };
  A.eyesOf = function(id){ return find(A.EYES, id); };
  A.skinOf = function(id){ return find(A.SKIN, id, 1); };

  var PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;
  A.validPhoto = function(p){ return typeof p === 'string' && p.length < 60000 && PHOTO_RE.test(p); };

  A.avatar = function(c, size){
    var s0 = size || 40;
    var label = c.name ? String(c.name).replace(/[&<>"']/g, '') : 'Personaje';
    if(A.validPhoto(c.photo)){
      return '<svg class="avatar photo" viewBox="0 0 64 64" width="' + s0 + '" height="' + s0 + '" role="img" aria-label="' + label + '">' +
        '<rect width="64" height="64" fill="#1b2015"/>' +
        '<image href="' + c.photo + '" x="0" y="0" width="64" height="64" preserveAspectRatio="xMidYMid slice"/></svg>';
    }
    var hair = A.hairOf(c.hair).hex;
    var eyes = A.eyesOf(c.eyes).hex;
    var girl = c.gender === 'chica';
    var skinO = A.skinOf(c.skin);
    var skin = skinO.hex, skinShade = skinO.shade;
    var parts = [];
    parts.push('<rect width="64" height="64" fill="#1b2015"/>');
    if(girl) parts.push('<path d="M16.5 31 Q16 9 32 9 Q48 9 47.5 31 L50 56 Q41 60 32 55 Q23 60 14 56 Z" fill="' + hair + '"/>');
    parts.push('<path d="M7 66 Q9 47 32 47 Q55 47 57 66 Z" fill="#3a4630"/>');
    parts.push('<rect x="27.5" y="38" width="9" height="11" rx="3" fill="' + skinShade + '"/>');
    parts.push('<ellipse cx="32" cy="30" rx="12.5" ry="14" fill="' + skin + '"/>');
    if(girl){
      parts.push('<path d="M19 31 Q17.5 11 32 11 Q46.5 11 45 31 Q43 20 32 20.5 Q21 20 19 31 Z" fill="' + hair + '"/>');
    } else {
      parts.push('<path d="M19.2 29 Q17.5 12 32 12.5 Q46.5 12 44.8 29 Q43 21 38 19.5 Q31 22 25 19.5 Q21 21 19.2 29 Z" fill="' + hair + '"/>');
    }
    [26.5, 37.5].forEach(function(cx){
      parts.push('<ellipse cx="' + cx + '" cy="31.5" rx="3.3" ry="2.7" fill="#f5f2ea"/>');
      parts.push('<circle cx="' + cx + '" cy="31.6" r="1.95" fill="' + eyes + '"/>');
      parts.push('<circle cx="' + cx + '" cy="31.6" r=".85" fill="#111"/>');
    });
    if(girl){
      parts.push('<path d="M22.6 28.6 L24 28 M41.4 28.6 L40 28" stroke="#2a1f1a" stroke-width="1" stroke-linecap="round"/>');
    }
    parts.push('<path d="M28.6 38.4 Q32 40.8 35.4 38.4" stroke="#8a4a42" stroke-width="1.3" fill="none" stroke-linecap="round"/>');
    return '<svg class="avatar" viewBox="0 0 64 64" width="' + s0 + '" height="' + s0 + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
  };

  A.describe = function(c){
    var base = (c.gender === 'chica' ? 'Chica' : 'Chico') + ' · pelo ' + A.hairOf(c.hair).label.toLowerCase() + ' · ojos ' + A.eyesOf(c.eyes).label.toLowerCase();
    return A.validPhoto(c.photo) ? 'Con foto · ' + base : base;
  };
})();

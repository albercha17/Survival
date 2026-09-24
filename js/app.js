(function(){
  var A = window.Arena;
  var Store = A.Store, Engine = A.Engine, Narrator = A.Narrator;

  var GAME_KEY = 'la-arena-game-v2';
  var PREF_KEY = 'la-arena-prefs-v1';
  var SEEDED_KEY = 'la-arena-seeded-v1';
  var SPEEDS = [1, 2, 4];
  var GAP_MS = 1800;

  var EXAMPLES = [
    { name: 'Aria',  gender: 'chica', hair: 'rubio',     eyes: 'verdes' },
    { name: 'Kade',  gender: 'chico', hair: 'negro',     eyes: 'marrones' },
    { name: 'Mira',  gender: 'chica', hair: 'pelirrojo', eyes: 'avellana' },
    { name: 'Dax',   gender: 'chico', hair: 'castano',   eyes: 'azules' },
    { name: 'Lena',  gender: 'chica', hair: 'negro',     eyes: 'negros' },
    { name: 'Rowan', gender: 'chico', hair: 'blanco',    eyes: 'grises' },
    { name: 'Sable', gender: 'chica', hair: 'azul',      eyes: 'azules' },
    { name: 'Tobin', gender: 'chico', hair: 'rubio',     eyes: 'marrones' }
  ];

  var saved = { phase: 'setup', selectedIds: [], game: null, queue: [], pace: 'media', mode: 'todos', teams: 2 };
  var MODES = ['todos', 'equipos', 'parejas'];
  var PACES = ['corta', 'media', 'larga'];
  var prefs = { voice: false, speed: 1 };
  var data = { characters: [], lists: [] };
  var ui = { tab: 'chars', draft: null, loading: true };

  var playing = false;
  var busy = false;
  var current = null;
  var timer = null;
  var armed = {};

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rand(n){ return Math.floor(Math.random() * n); }

  /* ---------- persistence ---------- */
  function loadSaved(){
    try {
      var raw = JSON.parse(localStorage.getItem(GAME_KEY));
      if(raw && typeof raw === 'object' && ['setup', 'playing', 'victory'].indexOf(raw.phase) !== -1){
        saved = {
          phase: raw.phase,
          selectedIds: Array.isArray(raw.selectedIds) ? raw.selectedIds.filter(function(x){ return typeof x === 'string'; }) : [],
          game: validGame(raw.game) ? raw.game : null,
          queue: Array.isArray(raw.queue) ? raw.queue.filter(validEntry) : [],
          pace: PACES.indexOf(raw.pace) !== -1 ? raw.pace : 'media',
          mode: MODES.indexOf(raw.mode) !== -1 ? raw.mode : 'todos',
          teams: Math.max(2, Math.min(8, parseInt(raw.teams, 10) || 2))
        };
      }
      var p = JSON.parse(localStorage.getItem(PREF_KEY));
      if(p) prefs = { voice: !!p.voice, speed: SPEEDS.indexOf(p.speed) !== -1 ? p.speed : 1 };
    } catch(e){}
    if((saved.phase === 'playing' || saved.phase === 'victory') && !saved.game) saved.phase = 'setup';
  }
  function validEntry(e){
    return !!(e && typeof e === 'object' && typeof e.text === 'string' && Array.isArray(e.ids) && typeof e.type === 'string');
  }
  function validGame(g){
    if(!g || typeof g !== 'object' || !Array.isArray(g.tributes) || !Array.isArray(g.log)) return false;
    if(!g.tributes.every(function(t){ return t && typeof t.id === 'string' && typeof t.name === 'string' && Array.isArray(t.allies); })) return false;
    if(!g.log.every(validEntry)) return false;
    if(g.teams && !Array.isArray(g.teams)) return false;
    return true;
  }
  function persist(){
    try { localStorage.setItem(GAME_KEY, JSON.stringify(saved)); } catch(e){}
  }
  function persistPrefs(){
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e){}
  }

  /* ---------- UI helpers ---------- */
  var toastTimer = null;
  function toast(msg){
    var t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.hidden = true; }, 3200);
  }
  function openSheet(id){
    $('sheet-backdrop').hidden = false;
    ['roster-sheet', 'char-sheet', 'account-sheet'].forEach(function(s){ $(s).hidden = s !== id; });
  }
  function closeSheets(){
    $('sheet-backdrop').hidden = true;
    ['roster-sheet', 'char-sheet', 'account-sheet'].forEach(function(s){ $(s).hidden = true; });
  }
  function confirmTwice(key, btn, armedText, action){
    if(armed[key]){
      clearTimeout(armed[key].t);
      delete armed[key];
      action();
      return;
    }
    var old = btn.textContent;
    btn.textContent = armedText;
    armed[key] = { t: setTimeout(function(){ delete armed[key]; btn.textContent = old; }, 3000) };
  }
  function guarded(btn, fn){
    if(btn.disabled) return Promise.resolve();
    btn.disabled = true;
    return Promise.resolve().then(fn).catch(function(e){ toast(e.message || 'Algo ha fallado'); }).then(function(){ btn.disabled = false; });
  }

  function selectedChars(){
    return data.characters.filter(function(c){ return saved.selectedIds.indexOf(c.id) !== -1; });
  }
  function isSelected(id){ return saved.selectedIds.indexOf(id) !== -1; }
  function setSelection(ids){ saved.selectedIds = ids; persist(); renderSetup(); }

  /* ---------- data ---------- */
  function refreshData(){
    if(!Store.isSignedIn()){
      data = { characters: [], lists: [] };
      return Promise.resolve();
    }
    return Promise.all([Store.listCharacters(), Store.listLists()]).then(function(r){
      data.characters = r[0];
      data.lists = r[1];
      var known = data.characters.map(function(c){ return c.id; });
      saved.selectedIds = saved.selectedIds.filter(function(id){ return known.indexOf(id) !== -1; });
    }).catch(function(e){
      toast('No se pudieron cargar los datos: ' + e.message);
    });
  }

  function seedLocalOnFirstRun(){
    if(Store.isCloud) return Promise.resolve();
    var done = false;
    try { done = !!localStorage.getItem(SEEDED_KEY); } catch(e){}
    if(done || data.characters.length) return Promise.resolve();
    return Store.saveManyCharacters(EXAMPLES).then(function(rows){
      var ids = rows.map(function(c){ return c.id; });
      return Store.saveList({ name: 'Ejemplo', memberIds: ids }).then(function(){
        try { localStorage.setItem(SEEDED_KEY, '1'); } catch(e){}
        saved.selectedIds = ids;
        persist();
        return refreshData();
      });
    });
  }

  /* ---------- setup screen ---------- */
  function renderAccountBtn(){
    var b = $('btn-account');
    if(!Store.isCloud){ b.textContent = 'Solo local'; b.classList.remove('signed'); return; }
    if(Store.isSignedIn()){ b.textContent = Store.userEmail() || 'Cuenta'; b.classList.add('signed'); }
    else { b.textContent = 'Iniciar sesión'; b.classList.remove('signed'); }
  }

  function renderChars(){
    var box = $('char-list');
    if(ui.loading){ box.innerHTML = '<div class="empty"><p>Cargando personajes…</p></div>'; return; }
    if(!Store.isSignedIn()){
      box.innerHTML = '<div class="empty"><p>Inicia sesión para guardar y cargar tus personajes desde cualquier dispositivo.</p><button class="btn-small" type="button" data-act="login">Iniciar sesión</button></div>';
      return;
    }
    if(!data.characters.length){
      box.innerHTML = '<div class="empty"><p>Todavía no tienes personajes. Crea el primero o añade unos de ejemplo.</p>' +
        '<button class="btn-small" type="button" data-act="new">Crear personaje</button>' +
        '<button class="btn-small quiet" type="button" data-act="examples">Añadir 8 de ejemplo</button></div>';
      return;
    }
    box.innerHTML = data.characters.map(function(c){
      var on = isSelected(c.id);
      return '<div class="char-row" data-id="' + esc(c.id) + '">' +
        '<button class="char-main" type="button" data-act="toggle" aria-pressed="' + on + '">' +
          A.avatar(c, 44) +
          '<span class="char-info"><span class="char-name" style="display:block">' + esc(c.name) + '</span><span class="char-desc" style="display:block">' + A.describe(c) + '</span></span>' +
          '<span class="check">✓</span>' +
        '</button>' +
        '<button class="char-edit" type="button" data-act="edit" aria-label="Editar ' + esc(c.name) + '">✎</button>' +
      '</div>';
    }).join('');
  }

  function renderLists(){
    var box = $('list-list');
    $('save-list-hint').textContent = saved.selectedIds.length
      ? saved.selectedIds.length + (saved.selectedIds.length === 1 ? ' personaje elegido' : ' personajes elegidos') + ' se guardarán en la lista.'
      : 'Elige personajes en la pestaña Personajes para guardarlos como lista.';
    if(!Store.isSignedIn()){
      box.innerHTML = '<div class="empty"><p>Inicia sesión para guardar y cargar tus listas.</p><button class="btn-small" type="button" data-act="login">Iniciar sesión</button></div>';
      return;
    }
    if(!data.lists.length){
      box.innerHTML = '<div class="empty"><p>Aún no hay listas. Elige personajes, ponle nombre arriba y guárdalas para reutilizarlas en futuras partidas.</p></div>';
      return;
    }
    box.innerHTML = data.lists.map(function(l){
      var members = l.memberIds.map(function(id){
        return data.characters.filter(function(c){ return c.id === id; })[0];
      }).filter(Boolean);
      var faces = members.slice(0, 7).map(function(c){ return A.avatar(c, 28); }).join('');
      return '<div class="list-row" data-id="' + esc(l.id) + '">' +
        '<div class="list-head"><span class="list-name">' + esc(l.name) + '</span><span class="list-count">' + members.length + (members.length === 1 ? ' personaje' : ' personajes') + '</span></div>' +
        '<div class="list-faces">' + faces + '</div>' +
        '<div class="list-actions">' +
          '<button class="btn-small" type="button" data-act="load">Cargar</button>' +
          '<button class="btn-small quiet" type="button" data-act="update">Actualizar</button>' +
          '<button class="btn-small danger" type="button" data-act="delete">Borrar</button>' +
        '</div></div>';
    }).join('');
  }

  function renderSetup(){
    $('screen-setup').hidden = false;
    $('screen-game').hidden = true;
    $('screen-victory').hidden = true;
    renderAccountBtn();
    var onChars = ui.tab === 'chars';
    $('tab-chars').classList.toggle('active', onChars);
    $('tab-chars').setAttribute('aria-selected', onChars);
    $('tab-lists').classList.toggle('active', !onChars);
    $('tab-lists').setAttribute('aria-selected', !onChars);
    $('pane-chars').hidden = !onChars;
    $('pane-lists').hidden = onChars;
    var n = saved.selectedIds.length;
    $('selection-label').textContent = n + (n === 1 ? ' elegido' : ' elegidos');
    $('btn-start').textContent = 'Comenzar los Juegos' + (n ? ' (' + n + ')' : '');
    renderChars();
    renderLists();
    renderMode();
    renderPace();
  }

  var PACE_HINT = {
    corta: 'Más muertes y partida rápida.',
    media: 'Equilibrio entre muertes y acciones.',
    larga: 'Más robos, romances y traiciones antes del final.'
  };
  function maxTeams(n){ return Math.max(2, Math.min(8, Math.floor(n / 2))); }
  function renderMode(){
    var n = saved.selectedIds.length;
    [].forEach.call(document.querySelectorAll('#mode-seg .seg'), function(b){
      var on = b.getAttribute('data-mode') === saved.mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    var mt = maxTeams(n);
    if(saved.teams > mt) saved.teams = mt;
    if(saved.teams < 2) saved.teams = 2;
    $('teams-stepper').hidden = saved.mode !== 'equipos';
    $('teams-count').textContent = saved.teams;
    $('btn-teams-minus').disabled = saved.teams <= 2;
    $('btn-teams-plus').disabled = saved.teams >= mt;
    var hint;
    if(saved.mode === 'todos') hint = 'Cada uno va por su cuenta. Gana el último en pie.';
    else if(n < 4) hint = 'Necesitas al menos 4 personajes para jugar ' + (saved.mode === 'parejas' ? 'por parejas.' : 'por equipos.');
    else if(saved.mode === 'parejas'){
      var p = Math.floor(n / 2);
      hint = p + ' parejas' + (n % 2 ? ' (una será un trío)' : '') + ', repartidas al azar. Gana la última pareja en pie.';
    } else {
      var k = saved.teams, base = Math.floor(n / k), extra = n % k;
      hint = k + ' equipos de ' + (extra ? base + ' o ' + (base + 1) : base) + ', repartidos al azar. Gana el último equipo en pie.';
    }
    $('mode-hint').textContent = hint;
  }
  function renderPace(){
    [].forEach.call(document.querySelectorAll('#pace-seg .seg'), function(b){
      var on = b.getAttribute('data-pace') === saved.pace;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    $('pace-hint').textContent = PACE_HINT[saved.pace] || '';
  }

  function onCharListClick(ev){
    var target = ev.target.closest('[data-act]');
    if(!target) return;
    var act = target.getAttribute('data-act');
    var row = target.closest('.char-row');
    var id = row ? row.getAttribute('data-id') : null;
    if(act === 'toggle'){
      var ids = saved.selectedIds.slice();
      var at = ids.indexOf(id);
      if(at === -1) ids.push(id); else ids.splice(at, 1);
      $('setup-error').textContent = '';
      setSelection(ids);
    } else if(act === 'edit'){ openCharEditor(id); }
    else if(act === 'new'){ openCharEditor(null); }
    else if(act === 'login'){ openAccount(); }
    else if(act === 'examples'){
      guarded(target, function(){
        return Store.saveManyCharacters(EXAMPLES).then(function(rows){
          saved.selectedIds = rows.map(function(c){ return c.id; });
          persist();
          return refreshData();
        }).then(function(){ renderSetup(); toast('Añadidos 8 personajes de ejemplo'); });
      });
    }
  }

  function onListClick(ev){
    var target = ev.target.closest('[data-act]');
    if(!target) return;
    var act = target.getAttribute('data-act');
    if(act === 'login'){ openAccount(); return; }
    var row = target.closest('.list-row');
    if(!row) return;
    var list = data.lists.filter(function(l){ return l.id === row.getAttribute('data-id'); })[0];
    if(!list) return;
    if(act === 'load'){
      var known = data.characters.map(function(c){ return c.id; });
      var ids = list.memberIds.filter(function(id){ return known.indexOf(id) !== -1; });
      ui.tab = 'chars';
      setSelection(ids);
      toast('Lista «' + list.name + '» cargada: ' + ids.length + (ids.length === 1 ? ' personaje' : ' personajes'));
    } else if(act === 'update'){
      if(!saved.selectedIds.length){ toast('Elige personajes primero'); return; }
      guarded(target, function(){
        return Store.saveList({ id: list.id, name: list.name, memberIds: saved.selectedIds }).then(refreshData).then(function(){
          renderSetup();
          toast('Lista «' + list.name + '» actualizada');
        });
      });
    } else if(act === 'delete'){
      confirmTwice('list-' + list.id, target, '¿Seguro?', function(){
        guarded(target, function(){
          return Store.deleteList(list.id).then(refreshData).then(function(){ renderSetup(); toast('Lista borrada'); });
        });
      });
    }
  }

  function saveListFromSelection(){
    var name = $('list-name').value.trim();
    var hint = $('save-list-hint');
    if(!name){ hint.textContent = 'Ponle un nombre a la lista.'; return; }
    if(!saved.selectedIds.length){ hint.textContent = 'Elige al menos un personaje antes de guardar.'; return; }
    var existing = data.lists.filter(function(l){ return l.name.toLowerCase() === name.toLowerCase(); })[0];
    return guarded($('btn-save-list'), function(){
      return Store.saveList({ id: existing ? existing.id : null, name: name, memberIds: saved.selectedIds }).then(refreshData).then(function(){
        $('list-name').value = '';
        renderSetup();
        toast(existing ? 'Lista «' + name + '» actualizada' : 'Lista «' + name + '» guardada');
      });
    });
  }

  /* ---------- character editor ---------- */
  function openCharEditor(id){
    var c = id ? data.characters.filter(function(x){ return x.id === id; })[0] : null;
    ui.draft = c
      ? { id: c.id, name: c.name, gender: c.gender, hair: c.hair, eyes: c.eyes, skin: c.skin || 'claro', photo: c.photo || null }
      : { name: '', gender: rand(2) ? 'chica' : 'chico', hair: A.HAIR[rand(A.HAIR.length)].id, eyes: A.EYES[rand(A.EYES.length)].id, skin: 'claro', photo: null };
    $('char-sheet-title').textContent = c ? 'Editar personaje' : 'Nuevo personaje';
    $('char-name').value = ui.draft.name;
    $('btn-delete-char').hidden = !c;
    $('char-error').textContent = '';
    showCrop(false);
    renderEditor();
    openSheet('char-sheet');
  }

  var cropper = null;
  function showCrop(on){
    $('crop-panel').hidden = !on;
    $('char-fields').hidden = on;
  }
  function pickPhoto(){
    $('photo-file').value = '';
    $('photo-file').click();
  }
  function onPhotoChosen(){
    var f = $('photo-file').files[0];
    if(!f) return;
    A.Photo.loadImage(f).then(function(img){
      if(!cropper) cropper = new A.Photo.Cropper($('crop-canvas'), $('crop-zoom'));
      ui.draft.name = $('char-name').value;
      cropper.setImage(img);
      $('chk-comic').checked = false;
      $('crop-error').textContent = '';
      showCrop(true);
    }).catch(function(e){ toast(e.message); });
  }
  function applyCrop(){
    var raw = cropper.exportRaw();
    var sug = A.Photo.suggest(raw);
    ui.draft.photo = A.Photo.stylize(raw, $('chk-comic').checked);
    ui.draft.skin = sug.skin;
    ui.draft.hair = sug.hair;
    showCrop(false);
    renderEditor();
    toast('Foto añadida. He ajustado pelo y piel según la foto.');
  }
  function cancelCrop(){
    cropper.clear();
    showCrop(false);
  }
  function renderEditor(){
    var d = ui.draft;
    var hasPhoto = A.validPhoto(d.photo);
    $('char-preview').innerHTML = A.avatar(d, 104);
    $('btn-photo').textContent = hasPhoto ? 'Cambiar foto' : 'Añadir foto';
    $('btn-photo-remove').hidden = !hasPhoto;
    $('photo-hint').textContent = hasPhoto
      ? 'Con foto, el pelo, los ojos y la piel solo se usan si la quitas (y para los textos del narrador).'
      : 'La foto se reduce y se guarda solo en tu cuenta. Se usará como cara del personaje.';
    $('gender-seg').innerHTML = A.GENDERS.map(function(g){
      var on = d.gender === g.id;
      return '<button class="seg' + (on ? ' active' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-gender="' + g.id + '">' + g.label + '</button>';
    }).join('');
    function swatches(list, current, attr){
      return list.map(function(o){
        return '<button class="swatch" type="button" role="radio" aria-checked="' + (current === o.id) + '" data-' + attr + '="' + o.id + '"><i style="background:' + o.hex + '"></i>' + o.label + '</button>';
      }).join('');
    }
    $('hair-swatches').innerHTML = swatches(A.HAIR, d.hair, 'hair');
    $('eyes-swatches').innerHTML = swatches(A.EYES, d.eyes, 'eyes');
    $('skin-swatches').innerHTML = swatches(A.SKIN, d.skin, 'skin');
  }
  function onEditorClick(ev){
    var t = ev.target.closest('button');
    if(!t) return;
    var d = ui.draft;
    if(t.hasAttribute('data-gender')) d.gender = t.getAttribute('data-gender');
    else if(t.hasAttribute('data-hair')) d.hair = t.getAttribute('data-hair');
    else if(t.hasAttribute('data-eyes')) d.eyes = t.getAttribute('data-eyes');
    else if(t.hasAttribute('data-skin')) d.skin = t.getAttribute('data-skin');
    else return;
    renderEditor();
  }
  function saveCharacter(){
    var d = ui.draft;
    d.name = $('char-name').value.trim();
    if(!d.name){ $('char-error').textContent = 'Escribe un nombre.'; return; }
    var isNew = !d.id;
    return guarded($('btn-save-char'), function(){
      return Store.saveCharacter(d).then(function(row){
        if(isNew && saved.selectedIds.indexOf(row.id) === -1){ saved.selectedIds.push(row.id); persist(); }
        return refreshData().then(function(){
          closeSheets();
          renderSetup();
          toast(isNew ? 'Personaje creado y añadido al reparto' : 'Personaje guardado');
        });
      });
    });
  }
  function deleteCharacter(){
    var d = ui.draft;
    var btn = $('btn-delete-char');
    confirmTwice('char-' + d.id, btn, 'Toca otra vez para eliminar', function(){
      guarded(btn, function(){
        return Store.deleteCharacter(d.id).then(function(){
          saved.selectedIds = saved.selectedIds.filter(function(id){ return id !== d.id; });
          persist();
          return refreshData();
        }).then(function(){
          closeSheets();
          renderSetup();
          toast('Personaje eliminado');
        });
      });
    });
  }

  /* ---------- account ---------- */
  function openAccount(){ renderAccount(); openSheet('account-sheet'); }
  function renderAccount(){
    var b = $('account-body');
    if(!Store.isCloud){
      b.innerHTML = '<div class="auth"><p>Ahora mismo tus personajes y listas se guardan <b>solo en este dispositivo</b>.</p>' +
        '<p>Para guardarlos en la nube con Supabase y usarlos desde cualquier dispositivo, pon la URL y la clave de tu proyecto en <code>js/config.js</code>. Los pasos están en el README.</p></div>';
      return;
    }
    if(Store.isSignedIn()){
      b.innerHTML = '<div class="auth"><p>Sesión iniciada como <b>' + esc(Store.userEmail() || '') + '</b>. Tus personajes y listas se guardan en Supabase.</p>' +
        '<button class="btn-secondary" id="btn-signout" type="button">Cerrar sesión</button></div>';
      return;
    }
    b.innerHTML = '<div class="auth"><p>Entra para guardar tus personajes y listas en la nube.</p>' +
      '<input class="text-input" id="auth-email" type="email" placeholder="Correo electrónico" autocomplete="email" autocapitalize="off">' +
      '<input class="text-input" id="auth-pass" type="password" placeholder="Contraseña (mín. 6 caracteres)" autocomplete="current-password">' +
      '<p class="setup-error" id="auth-msg"></p>' +
      '<div class="row"><button class="btn-secondary" id="btn-signin" type="button">Entrar</button>' +
      '<button class="btn-secondary" id="btn-signup" type="button">Crear cuenta</button></div></div>';
  }
  function onAccountClick(ev){
    var id = ev.target.id;
    var msg = function(t){ var m = $('auth-msg'); if(m) m.textContent = t; };
    if(id === 'btn-signout'){
      guarded(ev.target, function(){ return Store.signOut(); });
    } else if(id === 'btn-signin' || id === 'btn-signup'){
      var email = $('auth-email').value.trim();
      var pass = $('auth-pass').value;
      if(!email || pass.length < 6){ msg('Escribe tu correo y una contraseña de al menos 6 caracteres.'); return; }
      msg('');
      guarded(ev.target, function(){
        if(id === 'btn-signin') return Store.signIn(email, pass).then(function(){ closeSheets(); });
        return Store.signUp(email, pass).then(function(r){
          if(r.needsConfirmation) msg('Cuenta creada. Revisa tu correo para confirmarla y luego pulsa Entrar.');
          else closeSheets();
        });
      }).then(function(){}, function(){});
    }
  }
  function onAuthChange(){
    setTimeout(function(){
      refreshData().then(function(){
        ui.loading = false;
        if(saved.phase === 'setup') renderSetup(); else renderAccountBtn();
        if(!$('account-sheet').hidden) renderAccount();
      });
    }, 0);
  }

  /* ---------- game flow ---------- */
  function byId(id){
    var ts = saved.game.tributes;
    for(var i = 0; i < ts.length; i++) if(ts[i].id === id) return ts[i];
    return null;
  }
  function revealedDead(){
    var set = {};
    saved.game.log.forEach(function(e){ (e.deaths || []).forEach(function(id){ set[id] = true; }); });
    return set;
  }
  function revealedBabies(){
    var set = {};
    saved.game.log.forEach(function(e){ if(e.babyId) set[e.babyId] = true; });
    return set;
  }
  function lastLogged(){
    var l = saved.game.log;
    return l.length ? l[l.length - 1] : null;
  }

  var lastRoundShown = -1;
  function updateHeader(){
    var g = saved.game;
    var last = lastLogged();
    var round = last ? last.round : 0;
    if(round !== lastRoundShown){
      lastRoundShown = round;
      var dn = $('day-number');
      dn.classList.remove('pop');
      void dn.offsetWidth;
      dn.classList.add('pop');
    }
    renderStrip();
    $('day-eyebrow').textContent = round === 0 ? 'Prólogo' : 'Día';
    $('day-number').textContent = round === 0 ? '·' : round;
    var deadMap = revealedDead();
    var fighters = g.tributes.filter(function(t){ return !t.baby; });
    var dead = fighters.filter(function(t){ return deadMap[t.id]; }).length;
    var kids = Object.keys(revealedBabies()).length;
    var extraTeams = '';
    if(Engine.isTeamMode && Engine.isTeamMode(g)){
      var tset = {};
      fighters.forEach(function(t){ if(!deadMap[t.id] && t.team) tset[t.team] = 1; });
      var nt = Object.keys(tset).length;
      extraTeams = ' · ' + nt + (nt === 1 ? ' equipo' : ' equipos');
    }
    $('alive-pill').textContent = (fighters.length - dead) + ' de ' + fighters.length + ' vivos' + extraTeams + (kids ? ' · ' + kids + (kids === 1 ? ' bebé' : ' bebés') : '');
  }

  var stripDead = {};
  function renderStrip(){
    var g = saved.game;
    if(!g) return;
    var dead = revealedDead(), babies = revealedBabies();
    var list = g.tributes.filter(function(t){ return !t.baby || babies[t.id]; });
    var box = $('tribute-strip');
    box.innerHTML = list.map(function(t){
      var col = A.safeColor && t.teamColor ? A.safeColor(t.teamColor) : '';
      var justDied = dead[t.id] && !stripDead[t.id];
      return '<span class="ts' + (dead[t.id] ? ' dead' : '') + (justDied ? ' just' : '') + (t.baby ? ' baby' : '') + '"' + (col ? ' style="--tc:' + col + '"' : '') + '>' + A.avatar(t, 30) + '</span>';
    }).join('');
    stripDead = dead;
  }

  function renderStage(entry, isStatic){
    A.Scenes.render($('stage-avatars'), entry, byId, isStatic);
    $('stage').setAttribute('data-type', entry.type);
    var sc = $('stage-avatars').querySelector('.scene');
    if(sc){
      var rb = document.createElement('div');
      rb.className = 'scene-ribbon type-' + entry.type + (isStatic ? ' still' : '');
      rb.textContent = (entry.round === 0 ? 'Apertura' : 'Día ' + entry.round) + ' · ' + Engine.label(entry.type);
      sc.appendChild(rb);
    }
    $('stage-day').textContent = entry.round === 0 ? 'Apertura' : 'Día ' + entry.round;
    var tag = $('stage-tag');
    tag.className = 'log-tag type-' + entry.type;
    tag.textContent = Engine.label(entry.type);
  }

  function historyRow(entry){
    var div = document.createElement('div');
    div.className = 'log-entry type-' + entry.type;
    div.innerHTML = '<div class="log-meta"><span class="log-day">' + (entry.round === 0 ? 'Apertura' : 'Día ' + entry.round) + '</span>' +
      '<span class="log-tag type-' + entry.type + '">' + Engine.label(entry.type) + '</span></div>' +
      '<p class="log-text">' + esc(entry.text) + '</p>';
    var ids = (entry.ids || []).filter(function(id){ return byId(id); });
    if(ids.length && ids.length <= 8){
      var faces = document.createElement('div');
      faces.className = 'log-faces';
      faces.innerHTML = ids.slice(0, 6).map(function(id){
        var t = byId(id);
        return '<span class="lf' + ((entry.deaths || []).indexOf(id) !== -1 ? ' dead' : '') + '">' + A.avatar(t, 22) + '</span>';
      }).join('');
      div.insertBefore(faces, div.firstChild);
    }
    return div;
  }
  function addHistory(entry){
    var log = $('log');
    log.insertBefore(historyRow(entry), log.firstChild);
    while(log.children.length > 120) log.removeChild(log.lastChild);
  }

  var IC = { play: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>', pause: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>', crown: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18l1-11 5 5 3-7 3 7 5-5 1 11z" fill="currentColor"/></svg>', spk: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>', mute: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', skip: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5l9 7-9 7zM13 5l7 7-7 7z" fill="currentColor"/></svg>' };
  function updateControls(){
    var label = playing ? 'Pausa' : (saved.queue.length || !saved.game.finished ? 'Continuar' : 'Ver victoria');
    var icon = playing ? IC.pause : (label === 'Ver victoria' ? IC.crown : IC.play);
    $('btn-play').innerHTML = icon + '<span>' + label + '</span>';
    $('btn-speed').textContent = prefs.speed + '×';
    var v = $('btn-voice');
    v.setAttribute('aria-pressed', prefs.voice ? 'true' : 'false');
    v.setAttribute('aria-label', prefs.voice ? 'Voz activada' : 'Voz desactivada');
    v.innerHTML = (prefs.voice ? IC.spk : IC.mute) + '<span>Voz</span>';
    $('btn-skip').innerHTML = IC.skip + '<span>Saltar</span>';
  }

  function renderGame(){
    $('screen-setup').hidden = true;
    $('screen-game').hidden = false;
    $('screen-victory').hidden = true;
    $('confirm-reset-bar').hidden = true;
    stripDead = revealedDead();
    lastRoundShown = -1;
    var log = $('log');
    log.innerHTML = '';
    saved.game.log.forEach(function(e){ log.insertBefore(historyRow(e), log.firstChild); });
    updateHeader();
    var last = lastLogged();
    if(last){
      renderStage(last, true);
      Narrator.showInstant($('stage-text'), last.text);
    } else {
      $('stage-avatars').innerHTML = '';
      $('stage-day').textContent = '';
      $('stage-tag').textContent = '';
      $('stage-text').textContent = '';
    }
    updateControls();
  }

  function stopNarration(){
    clearTimeout(timer);
    Narrator.cancel();
    busy = false;
    current = null;
  }

  function commit(entry){
    saved.queue.shift();
    saved.game.log.push(entry);
    persist();
    updateHeader();
    addHistory(entry);
    current = null;
  }

  function startBar(entry){
    var fill = $('narr-fill');
    if(!fill) return;
    fill.getAnimations().forEach(function(a){ a.cancel(); });
    var ms = Math.max(600, entry.text.length * (prefs.voice ? 60 : 30) / prefs.speed);
    fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, fill: 'forwards', easing: 'linear' });
  }
  function killFlash(entry){
    if(!(entry.deaths || []).length) return;
    var st = $('stage');
    st.classList.remove('kill');
    void st.offsetWidth;
    st.classList.add('kill');
  }
  function present(entry){
    busy = true;
    current = entry;
    renderStage(entry, false);
    startBar(entry);
    setTimeout(function(){ if(current === entry) killFlash(entry); }, 1200 / prefs.speed);
    Narrator.narrate($('stage-text'), entry.text, { voice: prefs.voice, speed: prefs.speed }, function(){
      commit(entry);
      busy = false;
      if(playing) timer = setTimeout(showNext, GAP_MS / prefs.speed);
    });
  }

  function showNext(){
    if(busy || saved.phase !== 'playing') return;
    if(!saved.queue.length){
      if(saved.game.finished){ enterVictory(); return; }
      try {
        saved.queue = Engine.simulateDay(saved.game);
      } catch(err){
        if(window.console) console.error(err);
        playing = false;
        updateControls();
        toast('Algo ha fallado al generar el día. La partida está guardada: pulsa Continuar para reintentar.');
        return;
      }
      persist();
      if(!saved.queue.length){ enterVictory(); return; }
    }
    present(saved.queue[0]);
  }

  function beginGame(characters){
    stopNarration();
    var game = Engine.newGame(characters, { pace: saved.pace, mode: saved.mode, teams: saved.teams });
    saved.phase = 'playing';
    saved.game = game;
    saved.queue = Engine.introEntries ? Engine.introEntries(game) : [Engine.introEntry(game)];
    persist();
    playing = true;
    renderGame();
    if(prefs.voice) Narrator.unlock();
    showNext();
  }

  function startGame(){
    var chars = selectedChars();
    if(saved.mode !== 'todos' && chars.length < 4){
      $('setup-error').textContent = 'Para jugar ' + (saved.mode === 'parejas' ? 'por parejas' : 'por equipos') + ' necesitas al menos 4 personajes.';
      ui.tab = 'chars';
      renderSetup();
      return;
    }
    if(chars.length < 2){
      $('setup-error').textContent = 'Elige al menos 2 personajes para empezar.';
      ui.tab = 'chars';
      renderSetup();
      return;
    }
    $('setup-error').textContent = '';
    beginGame(chars);
  }

  function enterVictory(){
    stopNarration();
    playing = false;
    saved.phase = 'victory';
    persist();
    renderVictory();
  }

  function renderVictory(){
    $('screen-setup').hidden = true;
    $('screen-game').hidden = true;
    $('screen-victory').hidden = false;
    var conf = $('victory-confetti');
    if(conf && !conf.childNodes.length){
      var cols = ['#ff5c8a', '#ffd54a', '#6ee7ff', '#7be07b', '#c792ff', '#f4a13a'];
      var h = '';
      for(var ci = 0; ci < 36; ci++){
        h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + cols[ci % cols.length] + ';animation-delay:' + (Math.random() * 3).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2.2).toFixed(2) + 's"></i>';
      }
      conf.innerHTML = h;
    }
    var g = saved.game;
    var w = g.winnerId ? byId(g.winnerId) : null;
    $('victory-avatar').innerHTML = w ? A.avatar(w, 120) : '';
    $('victory-eyebrow').textContent = w && w.gender === 'chica' ? 'Ganadora de la arena' : 'Ganador de la arena';
    $('victory-name').textContent = w ? w.name : '—';
    $('victory-days').textContent = g.round;
    $('victory-kills').textContent = w ? w.kills : 0;
    var vic = g.log.filter(function(e){ return e.type === 'victory'; })[0];
    var teamWin = g.winnerTeam && Engine.teamLabel ? g.winnerTeam : null;
    $('victory-team').hidden = !teamWin;
    if(teamWin){
      var winners = g.tributes.filter(function(t){ return t.alive && !t.baby && t.team === teamWin; });
      var col = A.safeColor ? A.safeColor((Engine.teamOf(g, teamWin) || {}).color) : '#e9b83a';
      $('victory-avatar').innerHTML = '';
      $('victory-eyebrow').textContent = g.mode === 'parejas' ? 'Pareja ganadora' : 'Equipo ganador';
      $('victory-name').textContent = Engine.teamLabel(g, teamWin);
      $('victory-kills').textContent = g.tributes.filter(function(t){ return t.team === teamWin; }).reduce(function(s, t){ return s + (t.kills || 0); }, 0);
      $('victory-team').style.setProperty('--tc', col);
      $('victory-team').innerHTML = winners.map(function(t){ return '<div class="vt-member">' + A.avatar(t, 64) + '<span>' + esc(t.name) + '</span></div>'; }).join('');
    }
    var kid = vic && vic.ids && !teamWin && vic.ids[1] ? byId(vic.ids[1]) : null;
    $('victory-family').hidden = !kid;
    if(kid) $('victory-family').textContent = 'Se lleva a casa a ' + kid.name + ', ' + (kid.gender === 'chica' ? 'la bebé' : 'el bebé') + '.';
    var fallen = g.tributes.filter(function(t){ return !t.alive && !t.baby; }).sort(function(a, b){ return (b.diedRound || 0) - (a.diedRound || 0); });
    $('memorial-list').innerHTML = fallen.map(function(t, mi){
      return '<div class="memorial-row" style="animation-delay:' + (0.4 + mi * 0.08).toFixed(2) + 's"><span class="who">' + A.avatar(t, 30) + '<span class="name">' + esc(t.name) + '</span></span><span class="when">Día ' + t.diedRound + '</span></div>';
    }).join('');
  }

  function backToSetup(){
    stopNarration();
    playing = false;
    saved.phase = 'setup';
    saved.game = null;
    saved.queue = [];
    persist();
    renderSetup();
  }

  function replaySameCast(){
    var chars = saved.game.tributes.filter(function(t){ return !t.baby; }).map(function(t){
      return { id: t.id, name: t.name, gender: t.gender, hair: t.hair, eyes: t.eyes, skin: t.skin, photo: t.photo };
    });
    beginGame(chars);
  }

  function renderRoster(){
    var dead = revealedDead();
    var babies = revealedBabies();
    var g = saved.game;
    var list = g.tributes.filter(function(t){ return !t.baby || babies[t.id]; }).sort(function(a, b){
      if(!!a.baby !== !!b.baby) return a.baby ? 1 : -1;
      if((a.team || '') !== (b.team || '')) return (a.team || '').localeCompare(b.team || '');
      var da = !!dead[a.id], db = !!dead[b.id];
      if(da !== db) return da ? 1 : -1;
      if(!da) return (b.kills - a.kills) || a.name.localeCompare(b.name);
      return (b.diedRound || 0) - (a.diedRound || 0);
    });
    var head = g.edition ? '<p class="roster-edition">Edición: <b>' + esc(g.edition.name) + '</b> · ' + esc(g.edition.desc) + '</p>' : '';
    $('roster-list').innerHTML = head + list.map(function(t){
      var isDead = !!dead[t.id];
      var chips = [];
      if(t.baby){
        var pn = (t.parents || []).map(byId).filter(Boolean).map(function(p){ return p.name; });
        chips.push('<span class="chip chip-baby">Bebé de ' + esc(pn.join(' y ')) + '</span>');
        chips.push('<span class="chip chip-baby">Protegido por la arena</span>');
      }
      if(t.team && Engine.teamLabel){
        var col = A.safeColor ? A.safeColor(t.teamColor) : '#9aa0a8';
        chips.push('<span class="chip chip-team" style="border-color:' + col + ';color:' + col + '">' + esc(Engine.teamLabel(g, t.team)) + '</span>');
      }
      if(t.trait && A.TRAITS && A.TRAITS[t.trait]) chips.push('<span class="chip chip-trait">' + esc(t.gender === 'chica' ? A.TRAITS[t.trait].f : A.TRAITS[t.trait].m) + '</span>');
      if(t.kills > 0) chips.push('<span class="chip chip-kills">Bajas: ' + t.kills + '</span>');
      if(t.item && A.ITEMS[t.item]) chips.push('<span class="chip chip-item">Lleva ' + esc(A.ITEMS[t.item].short) + '</span>');
      var allies = t.allies.map(byId).filter(function(x){ return x && !dead[x.id]; });
      if(allies.length) chips.push('<span class="chip chip-ally">Aliados: ' + esc(allies.map(function(x){ return x.name; }).join(', ')) + '</span>');
      if(t.loverId){
        var lover = byId(t.loverId);
        if(lover) chips.push('<span class="chip chip-love">' + (dead[lover.id] ? 'Perdió a ' : (t.gender === 'chica' ? 'Enamorada de ' : 'Enamorado de ')) + esc(lover.name) + '</span>');
      }
      return '<div class="roster-row' + (isDead ? ' is-dead' : '') + '"><div class="roster-main">' +
        A.avatar(t, 32) + '<span class="roster-name">' + esc(t.name) + '</span>' +
        '<span class="roster-status">' + (isDead ? 'Fuera de juego · Día ' + t.diedRound : (t.baby ? 'Bebé' : 'En la arena')) + '</span></div>' +
        (chips.length && !isDead ? '<div class="roster-chips">' + chips.join('') + '</div>' : '') + '</div>';
    }).join('');
  }

  function togglePlay(){
    if(playing){
      playing = false;
      clearTimeout(timer);
    } else {
      playing = true;
      if(!busy) showNext();
    }
    updateControls();
  }
  function cycleSpeed(){
    prefs.speed = SPEEDS[(SPEEDS.indexOf(prefs.speed) + 1) % SPEEDS.length];
    persistPrefs();
    updateControls();
  }
  function toggleVoice(){
    if(!Narrator.voiceSupported){ toast('Este navegador no tiene voz de narrador.'); return; }
    prefs.voice = !prefs.voice;
    if(prefs.voice) Narrator.unlock();
    persistPrefs();
    updateControls();
  }
  function skip(){
    if(saved.phase !== 'playing') return;
    clearTimeout(timer);
    Narrator.cancel();
    if(busy && current){
      Narrator.showInstant($('stage-text'), current.text);
      commit(current);
    }
    busy = false;
    showNext();
  }

  /* ---------- ambience & wiring ---------- */
  function spawnEmbers(){
    var box = $('embers');
    for(var i = 0; i < 10; i++){
      var s = document.createElement('span');
      s.className = 'ember';
      s.style.left = (Math.random() * 100) + '%';
      s.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
      s.style.animationDuration = (7 + Math.random() * 7) + 's';
      s.style.animationDelay = (Math.random() * 8) + 's';
      box.appendChild(s);
    }
  }

  function wire(){
    $('tab-chars').addEventListener('click', function(){ ui.tab = 'chars'; renderSetup(); });
    $('tab-lists').addEventListener('click', function(){ ui.tab = 'lists'; renderSetup(); });
    $('btn-new-char').addEventListener('click', function(){
      if(!Store.isSignedIn()){ openAccount(); return; }
      openCharEditor(null);
    });
    $('btn-sel-all').addEventListener('click', function(){ setSelection(data.characters.map(function(c){ return c.id; })); });
    $('btn-sel-none').addEventListener('click', function(){ setSelection([]); });
    $('char-list').addEventListener('click', onCharListClick);
    $('list-list').addEventListener('click', onListClick);
    $('btn-save-list').addEventListener('click', saveListFromSelection);
    $('list-name').addEventListener('keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); saveListFromSelection(); } });
    $('btn-start').addEventListener('click', startGame);
    $('mode-seg').addEventListener('click', function(ev){
      var b = ev.target.closest('[data-mode]');
      if(!b) return;
      saved.mode = b.getAttribute('data-mode');
      $('setup-error').textContent = '';
      persist();
      renderMode();
    });
    $('btn-teams-minus').addEventListener('click', function(){ saved.teams = Math.max(2, saved.teams - 1); persist(); renderMode(); });
    $('btn-teams-plus').addEventListener('click', function(){ saved.teams = Math.min(maxTeams(saved.selectedIds.length), saved.teams + 1); persist(); renderMode(); });
    $('pace-seg').addEventListener('click', function(ev){
      var b = ev.target.closest('[data-pace]');
      if(!b) return;
      saved.pace = b.getAttribute('data-pace');
      persist();
      renderPace();
    });
    $('btn-account').addEventListener('click', openAccount);
    $('btn-close-account').addEventListener('click', closeSheets);
    $('account-body').addEventListener('click', onAccountClick);

    $('char-sheet').addEventListener('click', onEditorClick);
    $('btn-save-char').addEventListener('click', saveCharacter);
    $('btn-delete-char').addEventListener('click', deleteCharacter);
    $('btn-cancel-char').addEventListener('click', closeSheets);
    $('btn-photo').addEventListener('click', pickPhoto);
    $('photo-file').addEventListener('change', onPhotoChosen);
    $('btn-photo-remove').addEventListener('click', function(){ ui.draft.photo = null; renderEditor(); });
    $('btn-crop-ok').addEventListener('click', applyCrop);
    $('btn-crop-cancel').addEventListener('click', cancelCrop);
    $('char-name').addEventListener('keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); saveCharacter(); } });

    $('sheet-backdrop').addEventListener('click', closeSheets);
    $('btn-roster').addEventListener('click', function(){ renderRoster(); openSheet('roster-sheet'); });
    $('btn-close-roster').addEventListener('click', closeSheets);
    $('btn-reset-game').addEventListener('click', function(){ $('confirm-reset-bar').hidden = false; });
    $('btn-cancel-reset').addEventListener('click', function(){ $('confirm-reset-bar').hidden = true; });
    $('btn-confirm-reset').addEventListener('click', backToSetup);

    $('btn-play').addEventListener('click', togglePlay);
    $('btn-speed').addEventListener('click', cycleSpeed);
    $('btn-voice').addEventListener('click', toggleVoice);
    $('btn-skip').addEventListener('click', skip);
    $('stage').addEventListener('click', function(){ if(saved.phase === 'playing'){ $('stage-hint').hidden = true; skip(); } });
    $('tribute-strip').addEventListener('click', function(){ renderRoster(); openSheet('roster-sheet'); });

    $('btn-replay-same').addEventListener('click', replaySameCast);
    $('btn-back-setup').addEventListener('click', backToSetup);
  }

  function renderApp(){
    if(saved.phase === 'playing') renderGame();
    else if(saved.phase === 'victory') renderVictory();
    else renderSetup();
  }

  var lastErrToast = 0;
  function onGlobalError(){
    var now = Date.now();
    if(now - lastErrToast < 5000) return;
    lastErrToast = now;
    try { toast('Algo ha fallado, pero tu partida sigue guardada.'); } catch(e){}
  }
  window.addEventListener('error', onGlobalError);
  window.addEventListener('unhandledrejection', onGlobalError);

  function init(){
    loadSaved();
    wire();
    spawnEmbers();
    renderApp();
    Store.init(onAuthChange)
      .then(refreshData)
      .then(seedLocalOnFirstRun)
      .catch(function(e){ toast(e.message || 'No se pudo cargar'); })
      .then(function(){
        ui.loading = false;
        if(saved.phase === 'setup'){
          renderSetup();
          if(Store.isCloud && !Store.isSignedIn()) openAccount();
        }
      });
  }

  init();
})();

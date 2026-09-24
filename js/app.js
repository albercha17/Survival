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

  var saved = { phase: 'setup', selectedIds: [], game: null, queue: [], pace: 'media' };
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
      if(raw && raw.phase){
        saved = { phase: raw.phase, selectedIds: raw.selectedIds || [], game: raw.game || null, queue: raw.queue || [], pace: raw.pace || 'media' };
      }
      var p = JSON.parse(localStorage.getItem(PREF_KEY));
      if(p) prefs = { voice: !!p.voice, speed: SPEEDS.indexOf(p.speed) !== -1 ? p.speed : 1 };
    } catch(e){}
    if((saved.phase === 'playing' || saved.phase === 'victory') && !saved.game) saved.phase = 'setup';
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
    renderPace();
  }

  var PACE_HINT = {
    corta: 'Más muertes y partida rápida.',
    media: 'Equilibrio entre muertes y acciones.',
    larga: 'Más robos, romances y traiciones antes del final.'
  };
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
  function lastLogged(){
    var l = saved.game.log;
    return l.length ? l[l.length - 1] : null;
  }

  function updateHeader(){
    var g = saved.game;
    var last = lastLogged();
    var round = last ? last.round : 0;
    $('day-eyebrow').textContent = round === 0 ? 'Prólogo' : 'Día';
    $('day-number').textContent = round === 0 ? '·' : round;
    var dead = Object.keys(revealedDead()).length;
    $('alive-pill').textContent = (g.tributes.length - dead) + ' de ' + g.tributes.length + ' vivos';
  }

  function renderStage(entry, isStatic){
    A.Scenes.render($('stage-avatars'), entry, byId, isStatic);
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
    return div;
  }
  function addHistory(entry){
    var log = $('log');
    log.insertBefore(historyRow(entry), log.firstChild);
    while(log.children.length > 120) log.removeChild(log.lastChild);
  }

  function updateControls(){
    $('btn-play').textContent = playing ? 'Pausa' : (saved.queue.length || !saved.game.finished ? 'Continuar' : 'Ver victoria');
    $('btn-speed').textContent = prefs.speed + '×';
    var v = $('btn-voice');
    v.setAttribute('aria-pressed', prefs.voice ? 'true' : 'false');
    v.textContent = prefs.voice ? 'Voz: sí' : 'Voz: no';
  }

  function renderGame(){
    $('screen-setup').hidden = true;
    $('screen-game').hidden = false;
    $('screen-victory').hidden = true;
    $('confirm-reset-bar').hidden = true;
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

  function present(entry){
    busy = true;
    current = entry;
    renderStage(entry, false);
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
      saved.queue = Engine.simulateDay(saved.game);
      persist();
      if(!saved.queue.length){ enterVictory(); return; }
    }
    present(saved.queue[0]);
  }

  function beginGame(characters){
    stopNarration();
    var game = Engine.newGame(characters, saved.pace);
    saved.phase = 'playing';
    saved.game = game;
    saved.queue = [Engine.introEntry(game)];
    persist();
    playing = true;
    renderGame();
    if(prefs.voice) Narrator.unlock();
    showNext();
  }

  function startGame(){
    var chars = selectedChars();
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
    var g = saved.game;
    var w = g.winnerId ? byId(g.winnerId) : null;
    $('victory-avatar').innerHTML = w ? A.avatar(w, 120) : '';
    $('victory-eyebrow').textContent = w && w.gender === 'chica' ? 'Ganadora de la arena' : 'Ganador de la arena';
    $('victory-name').textContent = w ? w.name : '—';
    $('victory-days').textContent = g.round;
    $('victory-kills').textContent = w ? w.kills : 0;
    var fallen = g.tributes.filter(function(t){ return !t.alive; }).sort(function(a, b){ return (b.diedRound || 0) - (a.diedRound || 0); });
    $('memorial-list').innerHTML = fallen.map(function(t){
      return '<div class="memorial-row"><span class="who">' + A.avatar(t, 30) + '<span class="name">' + esc(t.name) + '</span></span><span class="when">Día ' + t.diedRound + '</span></div>';
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
    var chars = saved.game.tributes.map(function(t){
      return { id: t.id, name: t.name, gender: t.gender, hair: t.hair, eyes: t.eyes, skin: t.skin, photo: t.photo };
    });
    beginGame(chars);
  }

  function renderRoster(){
    var dead = revealedDead();
    var g = saved.game;
    var list = g.tributes.slice().sort(function(a, b){
      var da = !!dead[a.id], db = !!dead[b.id];
      if(da !== db) return da ? 1 : -1;
      if(!da) return (b.kills - a.kills) || a.name.localeCompare(b.name);
      return (b.diedRound || 0) - (a.diedRound || 0);
    });
    $('roster-list').innerHTML = list.map(function(t){
      var isDead = !!dead[t.id];
      var chips = [];
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
        '<span class="roster-status">' + (isDead ? 'Fuera de juego · Día ' + t.diedRound : 'En la arena') + '</span></div>' +
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

    $('btn-replay-same').addEventListener('click', replaySameCast);
    $('btn-back-setup').addEventListener('click', backToSetup);
  }

  function renderApp(){
    if(saved.phase === 'playing') renderGame();
    else if(saved.phase === 'victory') renderVictory();
    else renderSetup();
  }

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

(function(){
  var A = window.Arena = window.Arena || {};
  var cfg = window.ARENA_CONFIG || {};
  var fbCfg = cfg.FIREBASE || {};
  var cloud = !!(fbCfg.apiKey && fbCfg.projectId && window.firebase && window.firebase.firestore && window.firebase.auth);
  var auth = null, db = null, user = null;

  if(cloud){
    window.firebase.initializeApp(fbCfg);
    auth = window.firebase.auth();
    db = window.firebase.firestore();
  }

  var LS_CHARS = 'la-arena-characters-v1';
  var LS_LISTS = 'la-arena-lists-v1';

  var AUTH_ERRORS = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Pulsa Entrar.',
    'auth/weak-password': 'La contraseña es demasiado débil (mínimo 6 caracteres).',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a probar.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
    'auth/operation-not-allowed': 'Activa el acceso con correo en Firebase (Authentication → Sign-in method).',
    'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains).',
    'permission-denied': 'Firestore ha rechazado la operación. Revisa las reglas de seguridad.'
  };
  function wrap(e){
    var code = e && e.code ? e.code.replace(/^firestore\//, '') : '';
    return new Error(AUTH_ERRORS[code] || (e && e.message) || 'Algo ha fallado');
  }
  function guard(promise){
    return promise.catch(function(e){ throw wrap(e); });
  }

  function uid(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function lsGet(key){
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; }
  }
  function lsSet(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){}
  }
  function clean(c){
    return { name: String(c.name || '').trim().slice(0, 40), gender: c.gender === 'chica' ? 'chica' : 'chico', hair: c.hair, eyes: c.eyes };
  }
  function stamp(offset){ return window.firebase.firestore.Timestamp.fromMillis(Date.now() + (offset || 0)); }
  function col(name){ return db.collection('users').doc(user.uid).collection(name); }
  function millis(ts){ return ts && ts.toMillis ? ts.toMillis() : 0; }
  function byCreated(a, b){ return millis(a.createdAt) - millis(b.createdAt); }

  var Store = {
    isCloud: cloud,
    isSignedIn: function(){ return !cloud || !!user; },
    userEmail: function(){ return user ? user.email : null; },

    init: function(onAuthChange){
      if(!cloud) return Promise.resolve();
      return new Promise(function(resolve){
        var first = true;
        auth.onAuthStateChanged(function(u){
          user = u;
          if(first){ first = false; resolve(); }
          else if(onAuthChange) onAuthChange();
        });
      });
    },

    signIn: function(email, password){
      return guard(auth.signInWithEmailAndPassword(email, password)).then(function(){});
    },
    signUp: function(email, password){
      return guard(auth.createUserWithEmailAndPassword(email, password)).then(function(){
        return { needsConfirmation: false };
      });
    },
    signOut: function(){
      return guard(auth.signOut());
    },

    listCharacters: function(){
      if(!cloud) return Promise.resolve(lsGet(LS_CHARS));
      return guard(col('characters').get()).then(function(snap){
        return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); }).sort(byCreated).map(function(c){
          return { id: c.id, name: c.name, gender: c.gender, hair: c.hair, eyes: c.eyes };
        });
      });
    },
    saveCharacter: function(c){
      var row = clean(c);
      if(!cloud){
        var all = lsGet(LS_CHARS);
        if(c.id){
          all = all.map(function(x){ return x.id === c.id ? Object.assign({ id: c.id }, row) : x; });
        } else {
          c = Object.assign({ id: uid() }, row);
          all.push(c);
        }
        lsSet(LS_CHARS, all);
        return Promise.resolve(c.id ? Object.assign({ id: c.id }, row) : c);
      }
      if(c.id){
        return guard(col('characters').doc(c.id).update(row)).then(function(){ return Object.assign({ id: c.id }, row); });
      }
      return guard(col('characters').add(Object.assign({ createdAt: stamp() }, row))).then(function(ref){
        return Object.assign({ id: ref.id }, row);
      });
    },
    saveManyCharacters: function(list){
      if(!cloud){
        var all = lsGet(LS_CHARS);
        var added = list.map(function(c){ return Object.assign({ id: uid() }, clean(c)); });
        lsSet(LS_CHARS, all.concat(added));
        return Promise.resolve(added);
      }
      var batch = db.batch();
      var added2 = list.map(function(c, i){
        var ref = col('characters').doc();
        var row = clean(c);
        batch.set(ref, Object.assign({ createdAt: stamp(i) }, row));
        return Object.assign({ id: ref.id }, row);
      });
      return guard(batch.commit()).then(function(){ return added2; });
    },
    deleteCharacter: function(id){
      if(!cloud){
        lsSet(LS_CHARS, lsGet(LS_CHARS).filter(function(x){ return x.id !== id; }));
        lsSet(LS_LISTS, lsGet(LS_LISTS).map(function(l){
          return Object.assign({}, l, { memberIds: l.memberIds.filter(function(m){ return m !== id; }) });
        }));
        return Promise.resolve();
      }
      return guard(col('lists').where('memberIds', 'array-contains', id).get()).then(function(snap){
        var batch = db.batch();
        snap.docs.forEach(function(d){
          batch.update(d.ref, { memberIds: window.firebase.firestore.FieldValue.arrayRemove(id) });
        });
        batch.delete(col('characters').doc(id));
        return guard(batch.commit());
      });
    },

    listLists: function(){
      if(!cloud) return Promise.resolve(lsGet(LS_LISTS));
      return guard(col('lists').get()).then(function(snap){
        return snap.docs.map(function(d){ return Object.assign({ id: d.id }, d.data()); }).sort(byCreated).map(function(l){
          return { id: l.id, name: l.name, memberIds: l.memberIds || [] };
        });
      });
    },
    saveList: function(list){
      var name = String(list.name || '').trim().slice(0, 40);
      var memberIds = list.memberIds.slice();
      if(!cloud){
        var all = lsGet(LS_LISTS);
        var id = list.id || uid();
        var next = { id: id, name: name, memberIds: memberIds };
        var found = false;
        all = all.map(function(l){ if(l.id === id){ found = true; return next; } return l; });
        if(!found) all.push(next);
        lsSet(LS_LISTS, all);
        return Promise.resolve(next);
      }
      if(list.id){
        return guard(col('lists').doc(list.id).update({ name: name, memberIds: memberIds })).then(function(){
          return { id: list.id, name: name, memberIds: memberIds };
        });
      }
      return guard(col('lists').add({ name: name, memberIds: memberIds, createdAt: stamp() })).then(function(ref){
        return { id: ref.id, name: name, memberIds: memberIds };
      });
    },
    deleteList: function(id){
      if(!cloud){
        lsSet(LS_LISTS, lsGet(LS_LISTS).filter(function(l){ return l.id !== id; }));
        return Promise.resolve();
      }
      return guard(col('lists').doc(id).delete());
    }
  };

  A.Store = Store;
})();

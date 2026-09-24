(function(){
  var A = window.Arena = window.Arena || {};
  var cfg = window.ARENA_CONFIG || {};
  var cloud = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient);
  var sb = cloud ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  var session = null;

  var LS_CHARS = 'la-arena-characters-v1';
  var LS_LISTS = 'la-arena-lists-v1';

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
  function fail(error){
    if(error) throw new Error(error.message || String(error));
  }
  function clean(c){
    return { name: String(c.name || '').trim().slice(0, 40), gender: c.gender === 'chica' ? 'chica' : 'chico', hair: c.hair, eyes: c.eyes };
  }

  var Store = {
    isCloud: cloud,
    isSignedIn: function(){ return !cloud || !!session; },
    userEmail: function(){ return session && session.user ? session.user.email : null; },

    init: function(onAuthChange){
      if(!cloud) return Promise.resolve();
      sb.auth.onAuthStateChange(function(_event, s){
        session = s;
        if(onAuthChange) onAuthChange();
      });
      return sb.auth.getSession().then(function(r){ session = r.data.session; });
    },

    signIn: function(email, password){
      return sb.auth.signInWithPassword({ email: email, password: password }).then(function(r){ fail(r.error); });
    },
    signUp: function(email, password){
      return sb.auth.signUp({ email: email, password: password }).then(function(r){
        fail(r.error);
        return { needsConfirmation: !r.data.session };
      });
    },
    signOut: function(){
      return sb.auth.signOut().then(function(r){ fail(r.error); });
    },

    listCharacters: function(){
      if(!cloud) return Promise.resolve(lsGet(LS_CHARS));
      return sb.from('characters').select('id,name,gender,hair,eyes').order('created_at').then(function(r){ fail(r.error); return r.data; });
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
      var q = c.id ? sb.from('characters').update(row).eq('id', c.id) : sb.from('characters').insert(row);
      return q.select('id,name,gender,hair,eyes').single().then(function(r){ fail(r.error); return r.data; });
    },
    saveManyCharacters: function(list){
      if(!cloud){
        var all = lsGet(LS_CHARS);
        var added = list.map(function(c){ return Object.assign({ id: uid() }, clean(c)); });
        lsSet(LS_CHARS, all.concat(added));
        return Promise.resolve(added);
      }
      return sb.from('characters').insert(list.map(clean)).select('id,name,gender,hair,eyes').then(function(r){ fail(r.error); return r.data; });
    },
    deleteCharacter: function(id){
      if(!cloud){
        lsSet(LS_CHARS, lsGet(LS_CHARS).filter(function(x){ return x.id !== id; }));
        lsSet(LS_LISTS, lsGet(LS_LISTS).map(function(l){
          return Object.assign({}, l, { memberIds: l.memberIds.filter(function(m){ return m !== id; }) });
        }));
        return Promise.resolve();
      }
      return sb.from('characters').delete().eq('id', id).then(function(r){ fail(r.error); });
    },

    listLists: function(){
      if(!cloud) return Promise.resolve(lsGet(LS_LISTS));
      return sb.from('lists').select('id,name,list_members(character_id)').order('created_at').then(function(r){
        fail(r.error);
        return r.data.map(function(l){
          return { id: l.id, name: l.name, memberIds: l.list_members.map(function(m){ return m.character_id; }) };
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
      var head = list.id
        ? sb.from('lists').update({ name: name }).eq('id', list.id).select('id').single()
        : sb.from('lists').insert({ name: name }).select('id').single();
      return head.then(function(r){
        fail(r.error);
        var listId = r.data.id;
        return sb.from('list_members').delete().eq('list_id', listId).then(function(d){
          fail(d.error);
          if(!memberIds.length) return { id: listId, name: name, memberIds: [] };
          return sb.from('list_members').insert(memberIds.map(function(cid){ return { list_id: listId, character_id: cid }; })).then(function(i){
            fail(i.error);
            return { id: listId, name: name, memberIds: memberIds };
          });
        });
      });
    },
    deleteList: function(id){
      if(!cloud){
        lsSet(LS_LISTS, lsGet(LS_LISTS).filter(function(l){ return l.id !== id; }));
        return Promise.resolve();
      }
      return sb.from('lists').delete().eq('id', id).then(function(r){ fail(r.error); });
    }
  };

  A.Store = Store;
})();

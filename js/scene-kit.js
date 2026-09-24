(function(){
  var A = window.Arena = window.Arena || {};

  function rnd(a, b){ return a + Math.random() * (b - a); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  var P = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21C6 16.6 3 13.2 3 9.5 3 6.9 5 5 7.4 5c1.8 0 3.4 1 4.6 2.7C13.2 6 14.8 5 16.6 5 19 5 21 6.9 21 9.5c0 3.7-3 7.1-9 11.5z" fill="#ff5c8a"/><path d="M7 8.5c.6-1.2 1.6-1.6 2.6-1.4" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
    gun: '<svg viewBox="0 0 48 30"><path d="M2 3h42v9H21l-2 15H9l3-15H2z" fill="#2a2f36"/><rect x="4" y="5" width="36" height="2" fill="#5a616b"/><rect x="38" y="4" width="6" height="3" fill="#8a919b"/></svg>',
    bullet: '<svg viewBox="0 0 20 8"><path d="M0 0h11q9 0 9 4t-9 4H0z" fill="#f0c94a"/></svg>',
    flash: '<svg viewBox="0 0 40 40"><path d="M20 0l5 13 13-5-8 11 10 8-13 1 1 13-8-10-9 10 1-13-13-1 10-8L2 8l13 5z" fill="#ffd54a"/><circle cx="20" cy="20" r="7" fill="#fff7c2"/></svg>',
    knife: '<svg viewBox="0 0 14 44"><path d="M7 0l6 26H1z" fill="#d5dbe1"/><path d="M7 2l3 22H7z" fill="#aab3bc"/><rect x="3.5" y="26" width="7" height="16" rx="2.5" fill="#7a4a2a"/></svg>',
    anvil: '<svg viewBox="0 0 56 40"><path d="M2 3h52v8H36c0 7 8 9 12 12v14H8V23c4-3 12-5 12-12H2z" fill="#3a3e46"/><rect x="4" y="4" width="48" height="2" fill="#6a707a"/></svg>',
    piano: '<svg viewBox="0 0 70 52"><rect x="2" y="2" width="66" height="34" rx="5" fill="#17171c"/><rect x="6" y="22" width="58" height="12" fill="#f4f2ea"/><path d="M14 22v9M22 22v9M30 22v9M38 22v9M46 22v9M54 22v9" stroke="#111" stroke-width="3"/><rect x="8" y="36" width="5" height="14" fill="#17171c"/><rect x="57" y="36" width="5" height="14" fill="#17171c"/></svg>',
    meteor: '<svg viewBox="0 0 60 60"><path d="M46 4C54 14 46 30 30 38 20 44 12 44 8 50 6 40 12 28 22 20 32 12 40 8 46 4z" fill="#ff8a2a" opacity=".9"/><circle cx="34" cy="36" r="17" fill="#6b4a3a"/><circle cx="29" cy="31" r="4" fill="#4d3428"/><circle cx="39" cy="42" r="3" fill="#4d3428"/></svg>',
    rock: '<svg viewBox="0 0 56 44"><path d="M4 40C2 26 10 8 28 6c16 0 26 14 24 34z" fill="#7b8088"/><path d="M14 30c4-10 12-14 20-14" stroke="#9aa0a8" stroke-width="3" fill="none"/></svg>',
    bomb: '<svg viewBox="0 0 48 52"><circle cx="24" cy="30" r="18" fill="#22252b"/><rect x="20" y="8" width="8" height="8" fill="#555c66"/><path d="M28 10q8-8 14-2" stroke="#c9a56a" stroke-width="2.5" fill="none"/><circle cx="43" cy="8" r="4" fill="#ffb02a"/></svg>',
    banana: '<svg viewBox="0 0 40 26"><path d="M2 8c8 14 24 18 36 8-2 8-14 12-24 8C8 21 4 15 2 8z" fill="#f5d33a"/><path d="M2 8c2-2 4-2 5 0" stroke="#7a5a12" stroke-width="2" fill="none"/></svg>',
    bolt: '<svg viewBox="0 0 40 160" preserveAspectRatio="none"><path d="M24 0L6 70h14L10 160 36 60H22z" fill="#fff36b" stroke="#ffd12a" stroke-width="2"/></svg>',
    mushroom: '<svg viewBox="0 0 40 40"><path d="M2 22C4 8 14 2 20 2s16 6 18 20z" fill="#d6322f"/><circle cx="12" cy="13" r="3" fill="#fff"/><circle cx="24" cy="9" r="3" fill="#fff"/><circle cx="30" cy="17" r="2.5" fill="#fff"/><rect x="14" y="22" width="12" height="16" rx="4" fill="#f1e6d0"/></svg>',
    bottle: '<svg viewBox="0 0 24 44"><rect x="8" y="0" width="8" height="10" fill="#8a6a3a"/><path d="M8 10h8l6 10v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V20z" fill="#5dd16a"/><rect x="5" y="24" width="14" height="4" fill="#fff" opacity=".4"/></svg>',
    bear: '<svg viewBox="0 0 64 64"><circle cx="14" cy="14" r="9" fill="#7a4d2c"/><circle cx="50" cy="14" r="9" fill="#7a4d2c"/><circle cx="32" cy="34" r="26" fill="#8a5a34"/><ellipse cx="32" cy="42" rx="12" ry="9" fill="#d7b58a"/><circle cx="22" cy="28" r="3" fill="#111"/><circle cx="42" cy="28" r="3" fill="#111"/><ellipse cx="32" cy="38" rx="4" ry="3" fill="#111"/></svg>',
    duck: '<svg viewBox="0 0 64 60"><ellipse cx="30" cy="40" rx="24" ry="16" fill="#ffd93a"/><circle cx="20" cy="20" r="14" fill="#ffd93a"/><path d="M10 20l-10 4 10 5z" fill="#ff8f1f"/><circle cx="18" cy="16" r="3" fill="#111"/><path d="M24 10l-6 3" stroke="#111" stroke-width="2.5" stroke-linecap="round"/><path d="M56 40q-8-8-18 0" fill="#e6b820"/></svg>',
    chest: '<svg viewBox="0 0 56 44"><rect x="3" y="14" width="50" height="28" rx="4" fill="#8a5a2a"/><path d="M3 20C3 6 53 6 53 20z" fill="#a8702f"/><rect x="24" y="18" width="8" height="10" rx="2" fill="#ffd54a"/><rect x="3" y="26" width="50" height="3" fill="#6a4320"/></svg>',
    crate: '<svg viewBox="0 0 64 90"><path d="M4 30C4 8 60 8 60 30z" fill="#e8e6dc"/><path d="M4 30L28 64M60 30L36 64M32 30L32 64" stroke="#c9c6ba" stroke-width="2"/><rect x="20" y="64" width="24" height="22" rx="2" fill="#b98548"/><path d="M20 75h24M32 64v22" stroke="#8a6030" stroke-width="2"/></svg>',
    bush: '<svg viewBox="0 0 120 70" preserveAspectRatio="none"><circle cx="24" cy="44" r="24" fill="#2f7a3a"/><circle cx="56" cy="34" r="30" fill="#39903f"/><circle cx="92" cy="44" r="26" fill="#2f7a3a"/><rect x="0" y="50" width="120" height="20" fill="#2f7a3a"/></svg>',
    ghost: '<svg viewBox="0 0 40 48"><ellipse cx="20" cy="5" rx="9" ry="2.5" fill="none" stroke="#ffe27a" stroke-width="1.6"/><path d="M20 8C9 8 4 16 4 26v20l6-5 5 5 5-5 5 5 5-5 6 5V26C36 16 31 8 20 8z" fill="#f4f6fa"/><circle cx="14" cy="25" r="3" fill="#2a2f3a"/><circle cx="26" cy="25" r="3" fill="#2a2f3a"/><ellipse cx="20" cy="34" rx="3" ry="4" fill="#2a2f3a"/></svg>',
    ring: '<svg viewBox="0 0 30 30"><circle cx="15" cy="19" r="9" fill="none" stroke="#ffd54a" stroke-width="3.5"/><path d="M10 6l5-5 5 5-5 6z" fill="#6ee7ff"/></svg>',
    pan: '<svg viewBox="0 0 70 34"><rect x="34" y="12" width="36" height="9" rx="4" fill="#5a3a22"/><circle cx="20" cy="17" r="17" fill="#2b2e34"/><circle cx="20" cy="17" r="12" fill="#3e424a"/></svg>',
    note: '<svg viewBox="0 0 20 28"><path d="M7 3v17a5 5 0 1 0 3 4.6V9l8-2V3z" fill="#ffd6f6"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 1l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffe14a"/></svg>',
    crown: '<svg viewBox="0 0 48 32"><path d="M3 28L6 8l12 10L24 3l6 15L42 8l3 20z" fill="#ffc933" stroke="#c98d12" stroke-width="2"/><circle cx="6" cy="8" r="3" fill="#ff5c8a"/><circle cx="24" cy="4" r="3" fill="#6ee7ff"/><circle cx="42" cy="8" r="3" fill="#ff5c8a"/></svg>',
    plaster: '<svg viewBox="0 0 40 16"><rect x="1" y="2" width="38" height="12" rx="6" fill="#f0c9a0"/><rect x="14" y="2" width="12" height="12" fill="#e2b184"/></svg>',
    balloon: '<svg viewBox="0 0 40 90"><ellipse cx="20" cy="24" rx="17" ry="22" fill="#e83a4f"/><path d="M20 46l-4 6h8z" fill="#c22a3d"/><path d="M20 52C14 64 26 72 20 90" stroke="#ddd" stroke-width="1.5" fill="none"/><ellipse cx="13" cy="16" rx="4" ry="7" fill="#fff" opacity=".35"/></svg>',
    tear: '<svg viewBox="0 0 10 14"><path d="M5 0C8 5 10 7 10 9a5 5 0 0 1-10 0C0 7 2 5 5 0z" fill="#6ec1ff"/></svg>',
    cake: '<svg viewBox="0 0 44 40"><rect x="4" y="18" width="36" height="20" rx="4" fill="#f6d3a8"/><path d="M4 22c6 6 10-2 16 4s12-4 20 0v-8H4z" fill="#ff86b0"/><rect x="20" y="6" width="4" height="12" fill="#fff"/><path d="M22 1c3 3 0 5 0 5s-3-2 0-5z" fill="#ffb02a"/></svg>',
    chicken: '<svg viewBox="0 0 44 40"><ellipse cx="18" cy="16" rx="15" ry="13" fill="#c8792e"/><rect x="26" y="22" width="14" height="6" rx="3" fill="#f3e6cf" transform="rotate(35 26 22)"/><circle cx="41" cy="30" r="4" fill="#f3e6cf"/></svg>',
    hands: '<svg viewBox="0 0 60 40"><path d="M2 14l16-6 14 8 12-6 14 6-6 10-12 6-10-4-8 4-16-8z" fill="#f0c9a0" stroke="#c99a70" stroke-width="2"/><path d="M20 20l8 6M32 18l8 6" stroke="#c99a70" stroke-width="2" stroke-linecap="round"/></svg>',
    dust: '<svg viewBox="0 0 90 90"><circle cx="30" cy="50" r="22" fill="#e9e3d8"/><circle cx="56" cy="40" r="24" fill="#f5efe4"/><circle cx="60" cy="62" r="20" fill="#d9d2c4"/><circle cx="36" cy="30" r="15" fill="#f5efe4"/></svg>',
    tree: '<svg viewBox="0 0 40 80"><path d="M20 2L36 40H4z" fill="#2f6b3a"/><path d="M20 22L38 62H2z" fill="#2a5e33"/><rect x="17" y="62" width="6" height="16" fill="#5a3a22"/></svg>',
    bow: '<svg viewBox="0 0 30 50"><path d="M6 4Q34 25 6 46" stroke="#8a5a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M6 4L6 46" stroke="#e8e0cf" stroke-width="1.5"/></svg>',
    medkit: '<svg viewBox="0 0 40 32"><rect x="2" y="6" width="36" height="24" rx="5" fill="#f4f4f0"/><rect x="14" y="2" width="12" height="6" rx="2" fill="#c9c9c2"/><path d="M20 12v12M14 18h12" stroke="#e23b3b" stroke-width="5" stroke-linecap="round"/></svg>',
    umbrella: '<svg viewBox="0 0 50 50"><path d="M3 24C3 8 47 8 47 24z" fill="#e2493f"/><path d="M25 24v18a4 4 0 0 1-8 0" stroke="#4a3626" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 24v-9M25 24V10M36 24v-9" stroke="#b83a32" stroke-width="1.6"/></svg>',
    map: '<svg viewBox="0 0 44 36"><path d="M2 6l14-4 14 4 12-4v28l-12 4-14-4-14 4z" fill="#ecd9a4" stroke="#a8874a" stroke-width="1.5"/><path d="M16 2v28M30 6v28" stroke="#a8874a" stroke-width="1"/><path d="M22 14l6 6M28 14l-6 6" stroke="#d1382f" stroke-width="2.4" stroke-linecap="round"/></svg>',
    bag: '<svg viewBox="0 0 40 46"><path d="M8 16C8 6 32 6 32 16l4 24a4 4 0 0 1-4 5H8a4 4 0 0 1-4-5z" fill="#7d5a34"/><path d="M12 16h16" stroke="#4d341c" stroke-width="3"/><rect x="15" y="24" width="10" height="9" rx="2" fill="#a77c46"/></svg>',
    ukulele: '<svg viewBox="0 0 30 56"><ellipse cx="15" cy="42" rx="12" ry="12" fill="#c98b3d"/><circle cx="15" cy="42" r="4" fill="#3b2410"/><rect x="12" y="4" width="6" height="30" fill="#5a3a1c"/><rect x="10" y="0" width="10" height="8" rx="2" fill="#3b2410"/></svg>',
    flowers: '<svg viewBox="0 0 40 46"><path d="M20 24v20" stroke="#3f8a45" stroke-width="3"/><circle cx="12" cy="14" r="6" fill="#ff7aa8"/><circle cx="28" cy="14" r="6" fill="#ffd54a"/><circle cx="20" cy="8" r="6" fill="#ff7aa8"/><circle cx="20" cy="17" r="4" fill="#fff2b8"/><path d="M20 30l-8-4M20 32l8-6" stroke="#3f8a45" stroke-width="2.4"/></svg>',
    sock: '<svg viewBox="0 0 30 40"><path d="M8 2h14v20l6 6a5 5 0 0 1-3 9H12a5 5 0 0 1-4-7z" fill="#e9e6df"/><rect x="8" y="2" width="14" height="6" fill="#4b7bff"/></svg>',
    rope: '<svg viewBox="0 0 12 120" preserveAspectRatio="none"><path d="M6 0c-5 10 5 20 0 30s5 20 0 30 5 20 0 30 5 20 0 30" stroke="#c9a56a" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>',
    flag: '<svg viewBox="0 0 44 50"><rect x="4" y="2" width="3" height="46" fill="#8a6a3a"/><path d="M7 4c10-4 14 4 24 0v20c-10 4-14-4-24 0z" fill="#fff"/></svg>',
    bucket: '<svg viewBox="0 0 36 34"><path d="M4 4h28l-4 28H8z" fill="#6f7f8f"/><ellipse cx="18" cy="4" rx="14" ry="3.5" fill="#9fb2c4"/><path d="M4 4Q18-8 32 4" stroke="#4a5866" stroke-width="2" fill="none"/></svg>',
    candle: '<svg viewBox="0 0 16 40"><rect x="4" y="14" width="8" height="24" rx="1.5" fill="#f6ecd1"/><path d="M8 2c4 5 3 8 0 10-3-2-4-5 0-10z" fill="#ffb02a"/><path d="M8 5c2 3 1 5 0 6-1-1-2-3 0-6z" fill="#fff3a0"/></svg>',
    plate: '<svg viewBox="0 0 40 14"><ellipse cx="20" cy="8" rx="19" ry="5" fill="#f4f2ea"/><ellipse cx="20" cy="7" rx="12" ry="3" fill="#dcd8cc"/></svg>',
    cross: '<svg viewBox="0 0 24 24"><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" fill="#5fe08a"/></svg>',
    tumble: '<svg viewBox="0 0 40 40"><g fill="none" stroke="#a78550" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="20" r="15"/><path d="M6 20c10-9 18 9 28 0M10 9c6 8 14 4 20 14M9 30c8-8 14-2 22-12M20 5c-6 12 6 18 0 30"/></g></svg>',
    cricket: '<svg viewBox="0 0 30 20"><ellipse cx="14" cy="12" rx="10" ry="5" fill="#5b8a2e"/><circle cx="24" cy="9" r="4" fill="#5b8a2e"/><path d="M6 12l-4 6M12 15l-2 5M4 8L1 3" stroke="#3a5a1c" stroke-width="1.6" stroke-linecap="round"/></svg>',
    fire: '<svg viewBox="0 0 40 50"><path d="M20 2c8 10 14 16 14 27a14 14 0 0 1-28 0c0-6 3-10 6-13 0 5 3 7 5 7-2-9 0-15 3-21z" fill="#ff8a2a"/><path d="M20 20c5 6 8 9 8 15a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 4 3 4-1-5-1-8 1-11z" fill="#ffd54a"/></svg>',
    log: '<svg viewBox="0 0 50 16"><rect x="2" y="4" width="46" height="10" rx="5" fill="#6f4a26"/><circle cx="6" cy="9" r="3.5" fill="#a8763d"/></svg>',
    mask: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#8a3fd0"/></svg>'
  };

  var EMO = {
    heart: P.heart,
    exclaim: '<svg viewBox="0 0 24 24"><path d="M9.5 2h5l-1.3 13h-2.4z" fill="#ff4f4f"/><circle cx="12" cy="19.5" r="2.4" fill="#ff4f4f"/></svg>',
    question: '<svg viewBox="0 0 24 24"><path d="M7 8a5 5 0 1 1 7.5 4.3c-1.8 1.1-2.5 1.9-2.5 4" stroke="#4b7bff" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="12" cy="21" r="2" fill="#4b7bff"/></svg>',
    anger: '<svg viewBox="0 0 24 24"><path d="M4 9q4 0 4-5M20 9q-4 0-4-5M4 15q4 0 4 5M20 15q-4 0-4 5" stroke="#e5332a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    sweat: P.tear,
    zzz: '<svg viewBox="0 0 24 24"><path d="M3 5h8l-8 8h8M13 11h6l-6 7h6" stroke="#5b6b9a" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="13" r="2.6" fill="#666"/><circle cx="12" cy="13" r="2.6" fill="#666"/><circle cx="19" cy="13" r="2.6" fill="#666"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="#ffc933"/></svg>',
    cry: '<svg viewBox="0 0 24 24"><path d="M7 4c3 5 5 7 5 10a5 5 0 0 1-10 0c0-3 2-5 5-10zM17 8c2 3 3.5 4.5 3.5 6.5a3.5 3.5 0 0 1-7 0c0-2 1.5-3.5 3.5-6.5z" fill="#6ec1ff"/></svg>',
    evil: '<svg viewBox="0 0 24 24"><path d="M3 3l5 4M21 3l-5 4" stroke="#8a3fd0" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="14" r="8.5" fill="#8a3fd0"/><path d="M7 12l4 1.5M17 12l-4 1.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M7 17q5 5 10 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    laugh: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd54a"/><path d="M6.5 9.5l3 1.4M17.5 9.5l-3 1.4" stroke="#7a4a10" stroke-width="2" stroke-linecap="round"/><path d="M6 13.5q6 8 12 0z" fill="#7a2a1a"/></svg>',
    idea: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6.5" fill="#ffe14a"/><rect x="9" y="16" width="6" height="5" rx="1.5" fill="#9aa0a8"/><path d="M12 1v2M3 5l1.5 1.5M21 5l-1.5 1.5" stroke="#ffb02a" stroke-width="2" stroke-linecap="round"/></svg>',
    gun: P.gun
  };

  var SKY = {
    day:    { a: '#4a86b8', b: '#a9d3e4', h1: '#4d7f57', h2: '#3a6a45', g: '#4f8a45', g2: '#3a6e34', deco: 'sun clouds' },
    dusk:   { a: '#3b2a56', b: '#d5744e', h1: '#3d2f45', h2: '#2a2033', g: '#3c4a2e', g2: '#2a3520', deco: 'sunlow clouds' },
    night:  { a: '#0b1027', b: '#233559', h1: '#17243a', h2: '#0f1a2c', g: '#22331f', g2: '#152213', deco: 'moon stars' },
    storm:  { a: '#20242f', b: '#4a5266', h1: '#2c3444', h2: '#1f2634', g: '#2c3a2a', g2: '#1f2b1f', deco: 'darkclouds' },
    cave:   { a: '#171317', b: '#3a2f36', h1: '#2b232b', h2: '#1c161c', g: '#3a3036', g2: '#28202a', deco: 'stalac' },
    love:   { a: '#5a2a55', b: '#f09aa8', h1: '#7a3f66', h2: '#5a2e50', g: '#5a4a3a', g2: '#45382c', deco: 'sunlow petals' },
    warm:   { a: '#5a3a1a', b: '#e2a95a', h1: '#6a4a2a', h2: '#4c3520', g: '#5a4a2a', g2: '#453820', deco: 'sunlow' },
    danger: { a: '#3a1512', b: '#a83a2a', h1: '#4a2622', h2: '#33191a', g: '#3a2a22', g2: '#2a1d18', deco: 'clouds' },
    gold:   { a: '#5a3f0f', b: '#e9b83a', h1: '#7a5a1e', h2: '#5a4216', g: '#6a5220', g2: '#4f3d17', deco: 'rays' },
    party:  { a: '#3a1f5a', b: '#a24ad0', h1: '#4a2a70', h2: '#33195a', g: '#3a2a55', g2: '#2a1d42', deco: 'lights' }
  };

  var STAR_COLORS = ['#ffe14a', '#ff5c8a', '#6ee7ff', '#7be07b', '#c792ff', '#ffffff'];

  function Stage(root, entry, actors, isStatic){
    this.root = root;
    this.isStatic = isStatic;
    this.anims = [];
    this.n = actors.length;
    this.W = root.clientWidth || 340;
    this.H = 214;
    this.SZ = 84;
    this.GY = 26;
    var xs = { 1: [50], 2: [27, 73], 3: [17, 50, 83] }[this.n];
    this.X = xs.map(function(p){ return this.W * p / 100; }, this);
    this.pos = this.X.map(function(){ return { x: 0, y: 0 }; });
    this.actors = actors;
    this.deaths = entry.deaths || [];
    this.dead = actors.map(function(t){ return this.deaths.indexOf(t.id) !== -1; }, this);
    this.vi = this.dead.indexOf(true);
    this.hasDeath = this.vi >= 0;
    if(this.vi < 0) this.vi = this.n - 1;
    this.propName = entry.prop;
    this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.entry = entry;
  }

  var SP = Stage.prototype;

  SP.anim = function(el, frames, o){
    o = o || {};
    el.__na = (el.__na || 0) + 1;
    var a = el.animate(frames, {
      duration: o.d || 400, delay: o.delay || 0, easing: o.ease || 'ease-out',
      fill: o.fill || (el.__na > 1 ? 'forwards' : 'both'), iterations: o.iter || 1, direction: o.dir || 'normal'
    });
    this.anims.push(a);
    return a;
  };

  SP.build = function(){
    var st = this, root = this.root;
    var h = '<div class="lens"><div class="cam"><div class="bgl"></div><div class="lyr back"></div>';
    this.actors.forEach(function(t, i){
      var photo = A.validPhoto(t.photo);
      var tc = /^#[0-9a-fA-F]{6}$/.test(t.teamColor || '') ? t.teamColor : null;
      h += '<div class="actor a-' + i + (t.baby ? ' baby' : '') + (tc ? ' team' : '') + '" style="left:' + (st.X[i] - st.SZ / 2) + 'px' + (tc ? ';--tc:' + tc : '') + '">' +
        '<div class="shadow"></div>' +
        '<div class="ai"><div class="idle" style="animation-delay:-' + (Math.random() * 3).toFixed(2) + 's"><div class="br">' + A.avatar(t, 84) + st.lidsFor(t, photo) + A.xeyesFor(photo) + '</div></div></div>' +
        '<span class="who">' + esc(t.name) + '</span></div>';
    });
    h += '<div class="lyr front"></div><div class="lyr fx"></div></div></div>';
    root.innerHTML = '<div class="scene sc-' + this.entry.scene + ' n' + this.n + (this.isStatic ? ' static' : '') + '">' + h + '</div>';
    this.scene = root.firstChild;
    this.cam = this.scene.querySelector('.cam');
    this.lens = this.scene.querySelector('.lens');
    this.bgl = this.scene.querySelector('.bgl');
    this.back = this.scene.querySelector('.lyr.back');
    this.front = this.scene.querySelector('.lyr.front');
    this.fx = this.scene.querySelector('.lyr.fx');
    this.els = [].map.call(this.scene.querySelectorAll('.actor'), function(actor){
      return { actor: actor, ai: actor.querySelector('.ai'), idle: actor.querySelector('.idle'), br: actor.querySelector('.br'), xeyes: actor.querySelector('.xeyes'), lids: actor.querySelector('.lids') };
    });
    if(!this.isStatic && !this.reduce) this.anim(this.lens, [{ transform: 'scale(1.09) translateY(6px)' }, { transform: 'scale(1)' }], { d: 900, ease: 'cubic-bezier(.2,.7,.3,1)' });
    this.actors.forEach(function(t, i){
      st.anim(st.els[i].actor, [{ opacity: 0 }, { opacity: 1 }], { d: 260, delay: i * 90, ease: 'ease-out' });
    });
  };

  SP.sky = function(kind){
    if(!this.isStatic && (kind === 'day' || kind === 'dusk' || kind === 'warm') && Math.random() < 0.3) kind = ['day', 'dusk', 'warm', 'night'][Math.floor(Math.random() * 4)];
    var k = SKY[kind] || SKY.day;
    var s = this.scene;
    s.style.setProperty('--sA', k.a); s.style.setProperty('--sB', k.b);
    s.style.setProperty('--h1', k.h1); s.style.setProperty('--h2', k.h2);
    s.style.setProperty('--g', k.g); s.style.setProperty('--g2', k.g2);
    var d = k.deco.split(' '), h = '';
    if(d.indexOf('stars') !== -1){
      for(var i = 0; i < 22; i++) h += '<i class="starbg" style="left:' + rnd(2, 98).toFixed(0) + '%;top:' + rnd(4, 52).toFixed(0) + '%;animation-delay:' + rnd(0, 2.5).toFixed(2) + 's"></i>';
    }
    if(d.indexOf('moon') !== -1) h += '<i class="moon"></i>';
    if(d.indexOf('sun') !== -1) h += '<i class="sun"></i>';
    if(d.indexOf('sunlow') !== -1) h += '<i class="sun low"></i>';
    if(d.indexOf('rays') !== -1) h += '<i class="rays"></i>';
    if(d.indexOf('clouds') !== -1) h += '<i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i>';
    if(d.indexOf('darkclouds') !== -1) h += '<i class="cloud c1 dark"></i><i class="cloud c2 dark"></i><i class="cloud c3 dark"></i>';
    if(d.indexOf('lights') !== -1) h += '<i class="light l1"></i><i class="light l2"></i><i class="light l3"></i>';
    if(d.indexOf('stalac') !== -1) h += '<svg class="stalac" viewBox="0 0 300 40" preserveAspectRatio="none"><path d="M0 0h300v6l-14 22-8-20-16 30-10-30-18 24-10-26-14 22-12-24-16 28-12-28-14 20-14-24-14 26-12-26-16 20V0z" fill="#0f0b10"/></svg>';
    if(kind !== 'cave') h += '<svg class="hills h1" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 52Q50 14 110 44T230 36T340 46T400 30V80H0z"/></svg><svg class="hills h2" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 60Q70 30 150 56T290 50T400 58V80H0z"/></svg>';
    h += '<div class="ground"></div>';
    this.bgl.innerHTML = h;
    if(kind !== 'cave' && kind !== 'party'){
      for(var g = 0; g < 6; g++){
        var tuft = document.createElement('i');
        tuft.className = 'tuft';
        tuft.style.left = (rnd(-2, 98)).toFixed(1) + '%';
        tuft.style.animationDelay = (-rnd(0, 3)).toFixed(2) + 's';
        tuft.style.transform = 'scale(' + rnd(.7, 1.2).toFixed(2) + ')';
        this.front.appendChild(tuft);
      }
    }
    if(d.indexOf('petals') !== -1) this.petals(9);
    if(kind === 'storm') this.rain(26);
  };

  SP.rain = function(n){
    var st = this;
    for(var i = 0; i < n; i++){
      var el = document.createElement('i');
      el.className = 'drop';
      el.style.left = rnd(0, 100) + '%';
      el.style.animationDelay = rnd(0, 0.9).toFixed(2) + 's';
      this.bgl.appendChild(el);
    }
  };
  SP.petals = function(n){
    for(var i = 0; i < n; i++){
      var el = document.createElement('i');
      el.className = 'petal';
      el.style.left = rnd(0, 100) + '%';
      el.style.animationDelay = rnd(0, 4).toFixed(2) + 's';
      el.style.animationDuration = rnd(4, 7).toFixed(1) + 's';
      this.bgl.appendChild(el);
    }
  };

  SP.prop = function(name, o){
    o = o || {};
    var w = o.w || 40, h = o.h || 40;
    var el = document.createElement('div');
    el.className = 'pr pr-' + name + (o.cls ? ' ' + o.cls : '');
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = ((o.x == null ? this.W / 2 : o.x) - w / 2) + 'px';
    el.style.bottom = (o.y == null ? 110 : o.y) + 'px';
    if(o.z) el.style.zIndex = o.z;
    if(o.origin) el.style.transformOrigin = o.origin;
    el.innerHTML = P[name] || '';
    (o.back ? this.back : this.front).appendChild(el);
    return el;
  };
  SP.attach = function(i, name, o){
    o = o || {};
    var el = document.createElement('div');
    el.className = 'pr pr-' + name + (o.cls ? ' ' + o.cls : '');
    el.style.width = (o.w || 40) + 'px';
    el.style.height = (o.h || 40) + 'px';
    el.style.left = (o.left == null ? 60 : o.left) + 'px';
    el.style.top = (o.top == null ? 30 : o.top) + 'px';
    if(o.origin) el.style.transformOrigin = o.origin;
    if(o.z) el.style.zIndex = o.z;
    el.innerHTML = P[name] || '';
    (o.onBody ? this.els[i].br : this.els[i].actor).appendChild(el);
    return el;
  };
  SP.itemSize = function(name){
    return { gun: [40, 26], knife: [14, 40], pan: [56, 28], bow: [26, 44], medkit: [38, 30], umbrella: [46, 46], map: [40, 32],
             bag: [36, 42], ukulele: [26, 50], chest: [48, 38], flowers: [34, 40], sock: [26, 34], rock: [44, 34], crate: [56, 78],
             ring: [28, 28], dice: [26, 26], letter: [32, 24], apple: [28, 30], babybottle: [18, 40] }[name] || [36, 36];
  };

  /* ----- locomoción y cuerpo ----- */
  SP.mv = function(i, dx, dy, delay, dur, ease){
    var p = this.pos[i], el = this.els[i].actor;
    this.anim(el, [
      { transform: 'translate(' + p.x + 'px,' + (-p.y) + 'px)' },
      { transform: 'translate(' + dx + 'px,' + (-dy) + 'px)' }
    ], { d: dur, delay: delay, ease: ease || 'ease-in-out' });
    this.pos[i] = { x: dx, y: dy };
  };
  SP.walk = function(i, dx, delay, dur){
    var p = this.pos[i], el = this.els[i].actor, steps = Math.max(2, Math.round(dur / 260)), fr = [], k;
    for(k = 0; k <= steps; k++){
      var f = k / steps;
      fr.push({ transform: 'translate(' + (p.x + (dx - p.x) * f) + 'px,' + (-(p.y) - (k % 2 ? 5 : 0)) + 'px)' });
    }
    this.anim(el, fr, { d: dur, delay: delay, ease: 'linear' });
    this.pos[i] = { x: dx, y: p.y };
  };
  SP.body = function(i, frames, delay, dur, ease){
    this.anim(this.els[i].ai, frames, { d: dur, delay: delay, ease: ease });
  };
  SP.hop = function(i, delay, h, dur){
    h = h || 26; dur = dur || 420;
    this.body(i, [{ transform: 'none' }, { transform: 'translateY(' + (-h) + 'px) scale(.96,1.06)', offset: .45 }, { transform: 'none' }], delay, dur, 'ease-out');
  };
  SP.wobble = function(i, delay, amp, dur, times){
    amp = amp || 7; dur = dur || 800;
    var fr = [{ transform: 'none' }], k, t = times || 3;
    for(k = 0; k < t; k++){ fr.push({ transform: 'rotate(' + amp + 'deg)' }); fr.push({ transform: 'rotate(' + (-amp) + 'deg)' }); }
    fr.push({ transform: 'none' });
    this.body(i, fr, delay, dur, 'ease-in-out');
  };
  SP.lean = function(i, deg, delay, dur){
    this.body(i, [{ transform: 'none' }, { transform: 'rotate(' + deg + 'deg)' }], delay, dur || 500, 'ease-out');
  };
  SP.squashY = function(i, delay, dur){
    this.body(i, [{ transform: 'none' }, { transform: 'scale(1.15,.8)', offset: .5 }, { transform: 'none' }], delay, dur || 300, 'ease-out');
  };
  SP.shiver = function(i, delay, dur){
    var fr = [{ transform: 'none' }], k;
    for(k = 0; k < 10; k++) fr.push({ transform: 'translateX(' + (k % 2 ? 3 : -3) + 'px)' });
    fr.push({ transform: 'none' });
    this.body(i, fr, delay, dur || 500, 'linear');
  };
  SP.tint = function(i, filter, delay, dur){
    this.anim(this.els[i].br, [{ filter: 'none' }, { filter: filter }], { d: dur || 400, delay: delay });
  };

  /* ----- muertes ----- */
  SP.xeyes = function(i, delay){
    this.anim(this.els[i].xeyes, [{ opacity: 0 }, { opacity: 1 }], { d: 60, delay: delay });
    this.stopIdle(i, delay);
  };
  SP.stopIdle = function(i, delay){
    var e = this.els[i];
    var run = function(){ if(e.idle) e.idle.style.animation = 'none'; if(e.lids) e.lids.style.display = 'none'; };
    if(this.isStatic || !delay) run(); else setTimeout(run, delay);
  };
  SP.zoom = function(x, delay, scale, dur){
    if(this.isStatic || this.reduce) return;
    this.lens.style.transformOrigin = Math.round(x) + 'px 60%';
    var s = scale || 1.14;
    this.anim(this.lens, [{ transform: 'scale(1)' }, { transform: 'scale(' + s + ')', offset: .25 }, { transform: 'scale(' + s + ')', offset: .7 }, { transform: 'scale(1)' }], { d: dur || 1300, delay: delay, ease: 'ease-in-out' });
  };
  SP.lidsFor = function(t, photo){
    if(photo || t.baby) return '';
    var sk = A.skinOf ? A.skinOf(t.skin).hex : '#e6c29f';
    return '<svg class="lids" viewBox="0 0 64 64" aria-hidden="true" style="animation-delay:' + rnd(0, 4).toFixed(2) + 's"><ellipse cx="26.5" cy="31.5" rx="3.9" ry="3.3" fill="' + sk + '"/><ellipse cx="37.5" cy="31.5" rx="3.9" ry="3.3" fill="' + sk + '"/></svg>';
  };
  SP.ghost = function(i, delay){
    var el = document.createElement('div');
    el.className = 'ghostf';
    el.style.left = (this.X[i] + this.pos[i].x - 20) + 'px';
    el.innerHTML = P.ghost;
    this.fx.appendChild(el);
    this.anim(el, [
      { opacity: 0, transform: 'translateY(30px) scale(.7)' },
      { opacity: .95, transform: 'translateY(0) scale(1)', offset: .25 },
      { opacity: .9, transform: 'translate(10px,-24px)', offset: .6 },
      { opacity: .85, transform: 'translate(-6px,-44px)' }
    ], { d: 2600, delay: delay, ease: 'ease-out' });
  };
  SP.grayOut = function(i, delay, dur){
    this.stopIdle(i, delay);
    this.anim(this.els[i].br, [{ filter: 'none' }, { filter: 'grayscale(1) brightness(.6)' }], { d: dur || 400, delay: delay });
  };
  SP.dieFall = function(i, delay, dir){
    dir = dir || 1;
    this.zoom(this.X[i] + this.pos[i].x, delay - 150, 1.13, 1400);
    this.body(i, [
      { transform: 'none' },
      { transform: 'translate(' + (6 * dir) + 'px,0) rotate(' + (-8 * dir) + 'deg)', offset: .22 },
      { transform: 'translate(' + (10 * dir) + 'px,-34px) rotate(' + (82 * dir) + 'deg)' }
    ], delay, 900, 'cubic-bezier(.5,0,.9,.6)');
    this.grayOut(i, delay + 500, 500);
    this.xeyes(i, delay + 380);
    this.ghost(i, delay + 950);
  };
  SP.dieSquash = function(i, delay){
    this.body(i, [{ transform: 'none' }, { transform: 'scale(1.3,.3)', offset: .45 }, { transform: 'scale(1.15,.26)' }], delay, 520, 'ease-in');
    this.grayOut(i, delay + 300, 400);
    this.xeyes(i, delay + 200);
    this.ghost(i, delay + 700);
  };
  SP.dieLaunch = function(i, delay, dir){
    dir = dir || 1;
    this.body(i, [
      { transform: 'none', opacity: 1 },
      { transform: 'translate(' + (18 * dir) + 'px,6px) scale(1.15,.85)', offset: .12 },
      { transform: 'translate(' + (this.W * .65 * dir) + 'px,-' + (this.H * 1.3) + 'px) rotate(' + (900 * dir) + 'deg) scale(.3)', opacity: 1, offset: .95 },
      { transform: 'translate(' + (this.W * .7 * dir) + 'px,-' + (this.H * 1.4) + 'px) rotate(' + (960 * dir) + 'deg) scale(.2)', opacity: 0 }
    ], delay, 1400, 'cubic-bezier(.3,.1,.5,1)');
    var edge = dir > 0 ? this.W - 20 : 20;
    this.burst(edge, this.H - 26, delay + 1300, { n: 8, color: '#ffe14a', r: 40 });
    this.ghost(i, delay + 1000);
  };
  SP.dieSink = function(i, delay){
    this.body(i, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(20px) scale(.95)', offset: .3 }, { transform: 'translateY(140px) scale(.55)', opacity: 0 }], delay, 1000, 'ease-in');
    this.ghost(i, delay + 900);
  };
  SP.dieBurn = function(i, delay){
    var fr = [{ filter: 'none' }, { filter: 'brightness(4)' }, { filter: 'invert(1)' }, { filter: 'brightness(3)' }, { filter: 'invert(1)' }, { filter: 'none' }, { filter: 'grayscale(1) brightness(.28) sepia(.6)' }];
    this.anim(this.els[i].br, fr, { d: 1300, delay: delay, ease: 'steps(1,end)' });
    this.body(i, [{ transform: 'none' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], delay, 600, 'linear');
    this.xeyes(i, delay + 700);
    this.ghost(i, delay + 1200);
    var x = this.X[i] + this.pos[i].x;
    for(var k = 0; k < 3; k++) this.smoke(x + rnd(-14, 14), 96, delay + 900 + k * 260);
  };
  SP.dieExplode = function(i, delay){
    this.body(i, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.7)', filter: 'brightness(1.6)', opacity: 1, offset: .65 }, { transform: 'scale(.1)', opacity: 0 }], delay, 700, 'ease-in');
    this.burst(this.X[i] + this.pos[i].x, 70, delay + 620, { n: 14, color: '#ffb02a', r: 70 });
    this.flash(delay + 620, 'rgba(255,220,140,.7)', 300);
    this.shake(delay + 620, 5, 300);
    this.ghost(i, delay + 900);
  };
  SP.dieFloat = function(i, delay){
    this.body(i, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-60px) rotate(4deg)', offset: .3 }, { transform: 'translateY(-' + (this.H + 40) + 'px) rotate(-6deg) scale(.5)', opacity: 1 }], delay, 3000, 'ease-in');
  };
  SP.smoke = function(x, y, delay){
    var el = document.createElement('div');
    el.className = 'pr smoke';
    el.style.left = (x - 10) + 'px'; el.style.bottom = y + 'px'; el.style.width = '20px'; el.style.height = '20px';
    this.fx.appendChild(el);
    this.anim(el, [{ opacity: 0, transform: 'translateY(0) scale(.5)' }, { opacity: .7, transform: 'translateY(-14px) scale(1)', offset: .3 }, { opacity: 0, transform: 'translateY(-46px) scale(1.7)' }], { d: 1200, delay: delay });
  };

  /* ----- efectos ----- */
  SP.emote = function(i, kind, delay, dur){
    dur = dur || 1200;
    var el = document.createElement('div');
    el.className = 'emote';
    el.innerHTML = '<span>' + (EMO[kind] || '') + '</span>';
    this.els[i].actor.appendChild(el);
    this.anim(el, [
      { opacity: 0, transform: 'translate(-50%,8px) scale(.3)' },
      { opacity: 1, transform: 'translate(-50%,-4px) scale(1.2)', offset: .14 },
      { opacity: 1, transform: 'translate(-50%,-6px) scale(1)', offset: .2 },
      { opacity: 1, transform: 'translate(-50%,-8px) scale(1)', offset: .85 },
      { opacity: 0, transform: 'translate(-50%,-14px) scale(.8)' }
    ], { d: dur, delay: delay });
  };
  SP.word = function(text, delay, o){
    o = o || {};
    var el = document.createElement('div');
    el.className = 'word';
    var wx = o.x == null ? this.W / 2 : o.x;
    el.style.left = Math.max(66, Math.min(this.W - 66, wx)) + 'px';
    el.style.top = (o.y == null ? 22 : o.y) + 'px';
    el.innerHTML = '<svg viewBox="0 0 120 70" preserveAspectRatio="none"><path d="M60 2l9 14 15-9 3 17 17-3-7 16 15 8-16 9 8 15-18-2-2 17-14-11-13 12-6-16-17 6 3-17-16-6 14-10-9-14 18 2 1-18 12 10z" fill="#ffd54a" stroke="#d1382f" stroke-width="3" stroke-linejoin="round"/></svg><b>' + esc(text) + '</b>';
    this.fx.appendChild(el);
    this.anim(el, [
      { opacity: 0, transform: 'translate(-50%,0) scale(0) rotate(-14deg)' },
      { opacity: 1, transform: 'translate(-50%,0) scale(1.35) rotate(5deg)', offset: .22 },
      { opacity: 1, transform: 'translate(-50%,0) scale(1) rotate(-3deg)', offset: .4 },
      { opacity: 1, transform: 'translate(-50%,0) scale(1.04) rotate(-3deg)', offset: .8 },
      { opacity: 0, transform: 'translate(-50%,-6px) scale(.9) rotate(-3deg)' }
    ], { d: o.d || 1100, delay: delay });
  };
  SP.burst = function(x, y, delay, o){
    o = o || {};
    var n = o.n || 10, r = o.r || 50, colors = o.colors || (o.color ? [o.color] : STAR_COLORS);
    for(var i = 0; i < n; i++){
      var el = document.createElement('i');
      el.className = 'pt' + (o.shape === 'heart' ? ' heart' : '');
      var c = colors[i % colors.length];
      if(o.shape === 'heart') el.innerHTML = P.heart; else el.style.background = c;
      el.style.left = x + 'px'; el.style.bottom = y + 'px';
      this.fx.appendChild(el);
      var ang = rnd(0, Math.PI * 2), d = rnd(r * .5, r);
      this.anim(el, [
        { opacity: 1, transform: 'translate(0,0) scale(1) rotate(0)' },
        { opacity: 1, transform: 'translate(' + (Math.cos(ang) * d) + 'px,' + (-Math.sin(ang) * d - 10) + 'px) scale(.9) rotate(' + rnd(-200, 200) + 'deg)', offset: .6 },
        { opacity: 0, transform: 'translate(' + (Math.cos(ang) * d * 1.15) + 'px,' + (-Math.sin(ang) * d + 14) + 'px) scale(.3)' }
      ], { d: rnd(650, 950), delay: delay });
    }
  };
  SP.shake = function(delay, amp, dur){
    if(this.reduce) return;
    amp = amp || 6; dur = dur || 350;
    var fr = [{ transform: 'translate(0,0)' }], k;
    for(k = 0; k < 8; k++) fr.push({ transform: 'translate(' + rnd(-amp, amp).toFixed(1) + 'px,' + rnd(-amp, amp).toFixed(1) + 'px)' });
    fr.push({ transform: 'translate(0,0)' });
    this.anim(this.cam, fr, { d: dur, delay: delay, ease: 'linear' });
  };
  SP.flash = function(delay, color, dur){
    var el = document.createElement('div');
    el.className = 'flashov';
    el.style.background = color || '#fff';
    this.fx.appendChild(el);
    this.anim(el, [{ opacity: 0 }, { opacity: .95, offset: .12 }, { opacity: .1, offset: .4 }, { opacity: .6, offset: .55 }, { opacity: 0 }], { d: dur || 450, delay: delay });
  };
  SP.floaty = function(name, x, y, delay, o){
    o = o || {};
    var s = o.size || 20;
    var el = this.prop(name, { x: x, y: y, w: s, h: s, z: 6 });
    var rise = o.rise || 110;
    this.anim(el, [
      { opacity: 0, transform: 'translate(0,0) scale(.4)' },
      { opacity: 1, transform: 'translate(' + rnd(-10, 10) + 'px,' + (-rise * .3) + 'px) scale(1)', offset: .2 },
      { opacity: 1, transform: 'translate(' + rnd(-16, 16) + 'px,' + (-rise * .7) + 'px) scale(1.05)', offset: .7 },
      { opacity: 0, transform: 'translate(' + rnd(-20, 20) + 'px,' + (-rise) + 'px) scale(.9)' }
    ], { d: o.d || 1900, delay: delay });
    return el;
  };
  SP.confetti = function(n, delay){
    var colors = ['#ff5c8a', '#ffd54a', '#6ee7ff', '#7be07b', '#c792ff'];
    for(var i = 0; i < n; i++){
      var el = document.createElement('i');
      el.className = 'conf';
      el.style.left = rnd(0, this.W) + 'px';
      el.style.background = colors[i % colors.length];
      this.fx.appendChild(el);
      this.anim(el, [
        { opacity: 1, transform: 'translate(0,-14px) rotate(0)' },
        { opacity: 1, transform: 'translate(' + rnd(-30, 30) + 'px,' + (this.H * .5) + 'px) rotate(' + rnd(-360, 360) + 'deg)', offset: .6 },
        { opacity: 0, transform: 'translate(' + rnd(-40, 40) + 'px,' + (this.H + 10) + 'px) rotate(' + rnd(-600, 600) + 'deg)' }
      ], { d: rnd(1800, 2800), delay: delay + rnd(0, 900) });
    }
  };

  SP.finish = function(){
    this.anims.forEach(function(a){ try { a.finish(); } catch(e){ try { a.cancel(); } catch(e2){} } });
  };

  A.SceneKit = { Stage: Stage, P: P, EMO: EMO, esc: esc, rnd: rnd };

  var XEYES = '<svg class="xeyes" viewBox="0 0 84 84" aria-hidden="true"><circle cx="35" cy="41.5" r="6" fill="#e6c29f"/><circle cx="49" cy="41.5" r="6" fill="#e6c29f"/><path d="M31 37.5l8 8M39 37.5l-8 8M45 37.5l8 8M53 37.5l-8 8" stroke="#111" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var XEYES_PHOTO = '<svg class="xeyes" viewBox="0 0 84 84" aria-hidden="true"><circle cx="29.4" cy="35.3" r="7" fill="#fff" fill-opacity=".85"/><circle cx="54.6" cy="35.3" r="7" fill="#fff" fill-opacity=".85"/><path d="M25 31l8.8 8.8M33.8 31L25 39.8M50.2 31L59 39.8M59 31l-8.8 8.8" stroke="#111" stroke-width="2.6" stroke-linecap="round"/></svg>';
  A.xeyesFor = function(photo){ return photo ? XEYES_PHOTO : XEYES; };
})();

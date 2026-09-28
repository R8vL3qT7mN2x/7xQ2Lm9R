/*
 * firebase-sync.js — спільне сховище поверх Firebase Realtime Database.
 *
 * Кожен ключ зберігається як JSON-рядок у вузлі /rozklad/<key>
 * (так уникаємо заборонених у ключах Firebase символів # . $ [ ]).
 *
 * fbGet повертає:  значення | null (немає даних) | undefined (помилка/офлайн)
 * fbSet повертає:  true | false (наприклад, «permission denied» без пароля)
 */

let fbApp = null;
let fbDb = null;
let fbReady = false;
const fbListeners = {};
const FB_CACHE_PREFIX = 'rozklad_fbcache_';

function fbPath(key) { return 'rozklad/' + key; }

function initFirebase() {
  try {
    if (typeof firebase === 'undefined') { fbReady = false; return; }
    if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.databaseURL) { fbReady = false; return; }
    fbApp = firebase.initializeApp(FIREBASE_CONFIG);
    fbDb = firebase.database();
    fbReady = true;
  } catch (e) {
    console.error('Firebase init failed:', e);
    fbReady = false;
  }
}

function fbCacheWrite(key, value) {
  try { localStorage.setItem(FB_CACHE_PREFIX + key, JSON.stringify(value)); } catch (e) {}
}
function fbCacheRead(key) {
  try {
    const raw = localStorage.getItem(FB_CACHE_PREFIX + key);
    return raw === null ? null : JSON.parse(raw);
  } catch (e) { return null; }
}

function fbParse(raw) {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function fbGet(key) {
  if (!fbReady) return undefined;
  try {
    const snap = await fbDb.ref(fbPath(key)).get();
    if (!snap.exists()) return null;
    const value = fbParse(snap.val());
    fbCacheWrite(key, value);
    return value;
  } catch (e) {
    console.error('Firebase get failed:', key, e);
    return undefined;
  }
}

async function fbSet(key, value) {
  if (!fbReady) return false;
  try {
    await fbDb.ref(fbPath(key)).set(JSON.stringify(value));
    fbCacheWrite(key, value);
    return true;
  } catch (e) {
    console.error('Firebase set failed:', key, e);
    return false;
  }
}

/** Підписка в реальному часі: коли редактор зберігає зміну, у всіх відкритих вкладок вона з'являється сама. */
function fbListen(key, onChange) {
  if (!fbReady || fbListeners[key]) return;
  fbListeners[key] = true;
  fbDb.ref(fbPath(key)).on('value', (snap) => {
    if (!snap.exists()) return;
    let value;
    try { value = fbParse(snap.val()); } catch (e) { return; }
    fbCacheWrite(key, value);
    onChange(value);
  }, (err) => console.error('Firebase listen failed:', key, err));
}

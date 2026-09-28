/*
 * edit-lock.js — редагувати заміни може лише той, хто ввів пароль
 * (EDIT_PASSWORD з firebase-config.js). Вхід запам'ятовується в цьому браузері.
 * Решта відвідувачів бачать розклад і заміни, але без кнопок редагування.
 * Якщо база не налаштована (fbReady=false) — сайт локальний, пароль не потрібен.
 */

const EDITOR_FLAG = 'rozklad_editor';

function initAdminAuth() { return Promise.resolve(); }

function isEditUnlocked() {
  if (!fbReady) return true;
  try { return localStorage.getItem(EDITOR_FLAG) === '1'; } catch (e) { return false; }
}

async function adminSignIn(password) {
  if (password === EDIT_PASSWORD) {
    try { localStorage.setItem(EDITOR_FLAG, '1'); } catch (e) {}
    return { ok: true };
  }
  return { ok: false, message: 'Невірний пароль.' };
}

async function adminSignOut() {
  try { localStorage.removeItem(EDITOR_FLAG); } catch (e) {}
}

/* ---------- вікно входу ---------- */
let loginResolver = null;

function showLoginSheet() {
  return new Promise((resolve) => {
    if (loginResolver) loginResolver(false);
    loginResolver = resolve;
    document.getElementById('fLoginPwd').value = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginOverlay').classList.add('open');
    setTimeout(() => document.getElementById('fLoginPwd').focus(), 250);
  });
}

function closeLoginSheet(result) {
  document.getElementById('loginOverlay').classList.remove('open');
  document.getElementById('fLoginPwd').value = '';
  if (loginResolver) { const r = loginResolver; loginResolver = null; r(result); }
}

async function submitLogin() {
  const pwd = document.getElementById('fLoginPwd').value;
  if (!pwd) { document.getElementById('loginError').textContent = 'Введіть пароль.'; return; }
  const res = await adminSignIn(pwd);
  if (res.ok) {
    closeLoginSheet(true);
    if (typeof onAdminStateChanged === 'function') onAdminStateChanged();
  } else {
    document.getElementById('loginError').textContent = res.message;
  }
}

document.getElementById('loginSubmit').onclick = submitLogin;
document.getElementById('loginCancel').onclick = () => closeLoginSheet(false);
document.getElementById('fLoginPwd').onkeydown = (e) => { if (e.key === 'Enter') submitLogin(); };
document.getElementById('loginOverlay').onclick = (e) => { if (e.target.id === 'loginOverlay') closeLoginSheet(false); };

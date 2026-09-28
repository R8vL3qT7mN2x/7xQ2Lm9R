/*
 * firebase-config.js — общая база для замен + ваш пароль.
 *
 * ПАРОЛЬ: впишите его ниже в EDIT_PASSWORD. Только тот, кто его знает,
 * увидит кнопки редактирования (⚙ Налаштування → «Доступ до редагування»).
 *
 * НАЛАШТУВАННЯ БАЗИ (один раз, ~5 хвилин), щоб заміни бачили всі:
 *   1. https://console.firebase.google.com → Add project (Analytics не потрібна).
 *   2. Build → Realtime Database → Create Database → «Start in test mode».
 *   3. Project settings (⚙) → Your apps → </> Web → зареєструйте →
 *      скопіюйте значення firebaseConfig нижче.
 *
 * Якщо FIREBASE_CONFIG порожній — сайт працює локально (правки видні лише вам,
 * пароль не потрібен).
 */

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// ВАШ ПАРОЛЬ ДЛЯ РЕДАГУВАННЯ (змініть на свій):
const EDIT_PASSWORD = "змініть-мене";

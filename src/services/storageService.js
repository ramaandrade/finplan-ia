// Advanced Persistent Storage Service (LocalStorage + IndexedDB + StorageManager)

const DB_NAME = 'finplan_permanent_db';
const STORE_NAME = 'app_state';

// Request browser persistent storage
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (granted) {
      console.log('Persistência permanente de dados concedida pelo navegador.');
    }
  }).catch(() => {});
}

// Simple IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject('IndexedDB not supported');
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null && item !== undefined) {
        return JSON.parse(item);
      }
    } catch (err) {
      console.warn('Erro ao ler do localStorage (' + key + '):', err);
    }
    return defaultValue;
  },

  set: (key, value) => {
    // 1. Save to LocalStorage
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Erro ao salvar no localStorage (' + key + '):', err);
    }

    // 2. Also save to IndexedDB as permanent safety backup
    openDB().then(db => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(value, key);
    }).catch(() => {});

    return true;
  },

  // Asynchronous recovery from IndexedDB if LocalStorage was cleared
  recoverFromIndexedDB: async (key) => {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {}
    openDB().then(db => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
    }).catch(() => {});
  }
};

export const parseBrazilianNumber = (input) => {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  
  let str = String(input).trim();
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

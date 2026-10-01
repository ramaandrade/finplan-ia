// Storage helper with safe try-catch and quota handling
export const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn('Erro ao ler do localStorage (' + key + '):', err);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Erro ao salvar no localStorage (' + key + '):', err);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {}
  }
};

export const parseBrazilianNumber = (input) => {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  
  let str = String(input).trim();
  // If string contains comma, e.g. "1.250,50" or "183,00"
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

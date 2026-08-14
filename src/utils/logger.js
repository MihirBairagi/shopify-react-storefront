const isDevelopment = import.meta.env.DEV;

export const logger = {
  error(...args) {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  warn(...args) {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
};

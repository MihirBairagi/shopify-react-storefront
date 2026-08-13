import { logger } from "./logger";

function getLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

export function getStorageItem(key) {
  try {
    return getLocalStorage()?.getItem(key) ?? null;
  } catch (error) {
    logger.warn("Unable to read browser storage:", error);
    return null;
  }
}

export function setStorageItem(key, value) {
  try {
    getLocalStorage()?.setItem(key, value);
  } catch (error) {
    logger.warn("Unable to write browser storage:", error);
  }
}

export function removeStorageItem(key) {
  try {
    getLocalStorage()?.removeItem(key);
  } catch (error) {
    logger.warn("Unable to clear browser storage:", error);
  }
}

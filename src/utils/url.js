export function isSecureUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function redirectToSecureUrl(value) {
  if (!isSecureUrl(value)) {
    throw new Error("A secure checkout URL was not returned.");
  }

  window.location.assign(value);
}

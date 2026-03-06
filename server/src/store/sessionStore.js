const TTL_MS = 60 * 60 * 1000; // 1 hour
const store = new Map();

export const sessionStore = {
  /** @param {string} id @param {import('../types.js').AnalysisResult} result */
  set(id, result) {
    store.set(id, { result, createdAt: Date.now() });
  },

  /** @param {string} id @returns {import('../types.js').AnalysisResult|null} */
  get(id) {
    const entry = store.get(id);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > TTL_MS) {
      store.delete(id);
      return null;
    }
    return entry.result;
  },
};

// Clean up expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, val] of store.entries()) {
    if (now - val.createdAt > TTL_MS) store.delete(id);
  }
}, 30 * 60 * 1000);
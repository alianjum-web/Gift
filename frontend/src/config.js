const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3060',
};

console.log(`backendUrl in config.js: ${config.backendUrl}`)
export {config as urlConfig}

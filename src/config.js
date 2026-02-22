export const API_CONFIG = {
    // Falls back to local if VITE_API_URL is not provided during build
    BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
    API_KEY: 'KITE-ADM-2026-SECURE-KEY'
};

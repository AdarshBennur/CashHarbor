/**
 * Get the base API URL from environment
 * Handles both patterns:
 * - With /api: https://api.example.com/api (used by apiClient)
 * - Without /api: https://api.example.com (for OAuth endpoints)
 * @returns {string} Base URL without trailing slash
 */
export const getApiBaseUrl = () => {
    const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    // Remove trailing slash
    let url = base.replace(/\/$/, '');
    // Remove /api suffix if present (apiClient adds it, OAuth shouldn't double it)
    if (url.endsWith('/api')) {
        url = url.slice(0, -4);
    }
    return url;
};

/**
 * Get full URL for OAuth endpoints (which need full path, not just /api base)
 * @param {string} path - Path starting with slash (e.g., '/api/auth/google/gmail')
 * @returns {string} Full URL
 */
export const getOAuthUrl = (path) => {
    return `${getApiBaseUrl()}${path}`;
};

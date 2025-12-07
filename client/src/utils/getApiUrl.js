/**
 * Get the base API URL from environment
 * @returns {string} Base API URL (e.g., 'http://localhost:5001' or 'https://api.example.com')
 */
export const getApiBaseUrl = () => {
    const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    // Remove trailing slash for consistency
    return base.replace(/\/$/, '');
};

/**
 * Get full URL for OAuth endpoints (which need full path, not just /api base)
 * @param {string} path - Path starting with slash (e.g., '/api/auth/google/gmail')
 * @returns {string} Full URL
 */
export const getOAuthUrl = (path) => {
    return `${getApiBaseUrl()}${path}`;
};

import apiClient from '../../utils/apiClient';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

/**
 * Get Gmail connection status
 */
export const getGmailStatus = async () => {
    try {
        const response = await apiClient.get('/gmail/status');
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('NOT_AUTHENTICATED');
        }
        throw error;
    }
};

/**
 * Disconnect Gmail account
 */
export const disconnectGmail = async () => {
    try {
        const response = await apiClient.post('/gmail/revoke');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getGmailStatus,
    disconnectGmail
};

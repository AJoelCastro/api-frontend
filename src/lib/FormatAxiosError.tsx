import axios from 'axios';

export const formatAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        const serverMsg = data?.message || (typeof data === 'string' ? data : JSON.stringify(data || {}));
        return `Request failed${status ? ` (status ${status})` : ''}: ${serverMsg || error.message}`;
    }
    return error?.message || String(error);
};

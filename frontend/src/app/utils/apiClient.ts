import { API_URL } from '@/lib/api';

type RequestOptions = {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    token?: string | null;
};

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
    const { method = 'GET', body, headers = {}, token } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (token) {
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};

// Vendor API Endpoints
export const VendorAPI = {
    onboard: (data: any, token: string) => apiRequest('/vendor/onboard', { method: 'POST', body: data, token }),
    getProfile: (token: string) => apiRequest('/vendor/me', { method: 'GET', token }),
    getStats: (token: string) => apiRequest('/vendor/stats', { method: 'GET', token }),
    updateProfile: (data: any, token: string) => apiRequest('/vendor/me', { method: 'PUT', body: data, token }),
    toggleStatus: (status: string, token: string) => apiRequest('/vendor/me/status', { method: 'PATCH', body: { status }, token }),
    addMenuItem: (data: any, token: string) => apiRequest('/vendor/menu', { method: 'POST', body: data, token }),
    deleteMenuItem: (id: string, token: string) => apiRequest(`/vendor/menu/${id}`, { method: 'DELETE', token }),
    getOrders: (token: string) => apiRequest('/bookings/vendor', { method: 'GET', token }),
    updateOrderStatus: (id: string, status: string, token: string) => apiRequest(`/bookings/${id}/status`, { method: 'PATCH', body: { status }, token }),

    // Packages
    getPackages: (token: string) => apiRequest('/vendor/packages', { method: 'GET', token }),
    createPackage: (data: any, token: string) => apiRequest('/vendor/packages', { method: 'POST', body: data, token }),
    deletePackage: (id: string, token: string) => apiRequest(`/vendor/packages/${id}`, { method: 'DELETE', token }),
};

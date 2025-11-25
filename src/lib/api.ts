/**
 * API Configuration
 * Base URL and helper functions for API requests
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  baseURL: API_BASE_URL,
  
  /**
   * Get authentication headers with JWT token
   */
  getAuthHeaders: (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },
  
  /**
   * Generic request handler with error handling
   */
  request: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...api.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  },
  
  /**
   * GET request
   */
  get: async <T>(endpoint: string): Promise<T> => {
    return api.request<T>(endpoint, { method: 'GET' });
  },
  
  /**
   * POST request
   */
  post: async <T>(endpoint: string, data: any): Promise<T> => {
    return api.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * PUT request
   */
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    return api.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    return api.request<T>(endpoint, { method: 'DELETE' });
  }
};


import { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails;
        
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorDetails = errorData.detail;
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map((err: any) => err.msg).join(', ')
              : errorData.detail;
          }
        } catch {
          // If parsing error response fails, use default message
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          details: errorDetails,
        };
        
        throw apiError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error; // Re-throw API errors
      }
      
      // Handle network errors
      const apiError: ApiError = {
        message: 'Network error: Unable to connect to server',
        details: error,
      };
      throw apiError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, item));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async getWithBody<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, item));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;

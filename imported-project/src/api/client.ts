/**
 * Real-Time Ticket Booking System - API Client
 * Configured for seamless future connection to the Node.js / Express.js backend.
 */

import type { ApiResponse, ApiHealthStatus } from '../types';
import { API_ENDPOINTS } from './endpoints';

// Base URL configured via Vite environment variable, with fallback to local Node/Express backend
export const API_BASE_URL = 
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Retrieves authorization headers if an auth token exists in storage.
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { ...headers, ...(customHeaders as Record<string, string>) };
  }

  /**
   * Generic request wrapper with type safety and standard error normalization.
   */
  public async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data?.message || data?.error || `Request failed with status ${response.status}`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: data?.data ?? data,
        message: data?.message,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
      return {
        success: false,
        error: `Network Connection Error: ${errorMessage}. (Backend target: ${this.baseUrl})`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  public get<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * Quick check for Express.js backend health and connectivity.
   */
  public async checkBackendHealth(): Promise<ApiResponse<ApiHealthStatus>> {
    return this.get<ApiHealthStatus>(API_ENDPOINTS.HEALTH);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

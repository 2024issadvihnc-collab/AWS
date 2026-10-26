/**
 * HTTP API Client
 * Gracefully interacts with backend or falls back when running in client-only demo mode.
 */

import type { ApiResponse } from '../types';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString(),
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error or backend offline',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString(),
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error or backend offline',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;

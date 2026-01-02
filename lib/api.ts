const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    createdAt: string;
  };
}

interface RegisterResponse {
  message: string;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || 'Something went wrong',
    );
  }

  return data as T;
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const response = await request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.accessToken);
      }

      return response;
    },

    register: async (
      displayName: string,
      email: string,
      password: string,
    ): Promise<RegisterResponse> => {
      return request<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ displayName, email, password }),
      });
    },

    getProfile: async (): Promise<User> => {
      return request<User>('/auth/me');
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    },

    getToken: () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
      }
      return null;
    },

    isAuthenticated: () => {
      return !!api.auth.getToken();
    },
  },
};

export { ApiError };
export type { User, LoginResponse, RegisterResponse };


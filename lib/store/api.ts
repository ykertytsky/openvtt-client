import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/lib/utils/token";

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? getToken() : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Base API slice - endpoints are injected from separate slice files
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'World'],
  endpoints: () => ({}), // Empty - endpoints injected via injectEndpoints
});

// Re-export User type from authApi for convenience
export type { User } from './slices/authApi';

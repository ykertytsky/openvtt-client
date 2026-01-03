import { apiSlice } from '../api';
import { setToken } from '@/lib/utils/token';

// Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

// Auth API endpoints
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        setToken(data.accessToken);
      },
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    getProfile: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = authApiSlice;


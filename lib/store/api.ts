import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

// base api query
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

// API slice for authethication 
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // Auth Endpoints 
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                const { data } = await queryFulfilled;
                localStorage.setItem('accessToken', data.accessToken);
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
  } = apiSlice;
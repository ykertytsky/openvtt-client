import { apiSlice } from '../api';

// Types
export interface World {
  id: string;
  name: string;
  description: string | null;
  systemId: number;
  ownerId: string;
  createdAt: string;
  settings: Record<string, unknown>;
  coverImageId: string | null;
}

interface CreateWorldRequest {
  name: string;
  description?: string;
  systemId?: number;
  settings?: Record<string, unknown>;
  coverImageId?: string;
}

interface CreateWorldResponse {
  world: World;
  message: string;
}

interface GetWorldsRequest {
  page?: number;
  limit?: number;
  systemId?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'systemId';
  sortOrder?: 'asc' | 'desc';
}

interface GetWorldsResponse {
  worlds: World[];
  message: string;
}

interface DeleteWorldRequest {
  id: string;
}

interface DeleteWorldResponse {
  message: string;
}

// Worlds Api endpoints
export const worldsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWorld: builder.mutation<CreateWorldResponse, CreateWorldRequest>({
      query: (world) => ({
        url: '/worlds/create',
        method: 'POST',
        body: world,
      }),
      invalidatesTags: ['World'],
    }),
    getWorlds: builder.query<GetWorldsResponse, GetWorldsRequest>({
      query: (params) => ({
        url: '/worlds/get-worlds',
        method: 'GET',
        params,
      }),
      transformResponse: (response: GetWorldsResponse | World[]): GetWorldsResponse => {
        // Handle both cases: array directly or wrapped object
        if (Array.isArray(response)) {
          return { worlds: response, message: 'Worlds fetched successfully' };
        }
        return response;
      },
      providesTags: ['World'],
    }),
    deleteWorld: builder.mutation<DeleteWorldResponse, DeleteWorldRequest>({
      query: ({ id }) => ({
        url: `/worlds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['World'],
    }),
  }),
});

export const { useCreateWorldMutation, useGetWorldsQuery, useDeleteWorldMutation } = worldsApiSlice;

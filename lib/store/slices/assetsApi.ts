import { apiSlice } from '../api';

// Types
export interface Asset {
  id: string;
  worldId: string | null;
  provider: 'local' | 's3';
  objectKey: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface UploadAssetRequest {
  file: File;
  folder?: string;
  filename?: string;
  worldId: string;
}

interface UploadAssetResponse {
  assetId: string;
  presignedUrl: string;
  objectKey: string;
  worldId: string | null;
}

interface GetAssetUrlResponse {
  presignedUrl: string;
}

// Assets Api endpoints
export const assetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadAsset: builder.mutation<UploadAssetResponse, UploadAssetRequest>({
      query: ({ file, folder, filename, worldId }) => {
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('worldId', worldId);
        if (folder) {
          formData.append('folder', folder);
        }
        if (filename) {
          formData.append('filename', filename);
        }

        return {
          url: '/assets/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['World'],
    }),
    getAssetUrl: builder.query<GetAssetUrlResponse, string>({
      query: (assetId) => ({
        url: `/assets/${assetId}/url`,
        method: 'GET',
      }),
    }),
    getAsset: builder.query<Asset, string>({
      query: (assetId) => ({
        url: `/assets/${assetId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useUploadAssetMutation, useGetAssetUrlQuery, useGetAssetQuery } = assetsApiSlice;


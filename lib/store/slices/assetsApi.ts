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
}

interface UploadAssetResponse {
  assetId: string;
  presignedUrl: string;
  objectKey: string;
}

interface GetAssetUrlResponse {
  presignedUrl: string;
}

// Assets Api endpoints
export const assetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadAsset: builder.mutation<UploadAssetResponse, UploadAssetRequest>({
      query: ({ file, folder, filename }) => {
        console.log('[API] Building FormData for upload:', { 
          fileName: file.name, 
          fileSize: file.size, 
          fileType: file.type,
          folder, 
          filename 
        });
        
        const formData = new FormData();
        formData.append('file', file);
        if (folder) {
          formData.append('folder', folder);
        }
        if (filename) {
          formData.append('filename', filename);
        }

        console.log('[API] Sending POST to /assets/upload');
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


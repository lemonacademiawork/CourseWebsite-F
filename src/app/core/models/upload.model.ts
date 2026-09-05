export interface UploadResponse {
  url: string;
  publicId: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

export interface MultiUploadResponse {
  urls: string[];
  files: UploadResponse[];
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder?: string;
}

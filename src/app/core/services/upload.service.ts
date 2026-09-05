import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UploadResponse, MultiUploadResponse, CloudinarySignature } from '../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /** POST /api/v1/upload/image — Upload single image */
  uploadImage(file: File, folder: string = 'courses'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) formData.append('folder', folder);
    return this.http.post<any>(`${this.apiUrl}/image`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** POST /api/v1/upload/images — Upload multiple images (up to 10) */
  uploadImages(files: File[], folder: string = 'gallery'): Observable<MultiUploadResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    if (folder) formData.append('folder', folder);
    return this.http.post<any>(`${this.apiUrl}/images`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** POST /api/v1/upload/video — Upload video */
  uploadVideo(file: File, folder: string = 'lessons'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('video', file);
    if (folder) formData.append('folder', folder);
    return this.http.post<any>(`${this.apiUrl}/video`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** POST /api/v1/upload/document — Upload document / PDF / raw file */
  uploadDocument(file: File, folder: string = 'resources'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return this.http.post<any>(`${this.apiUrl}/document`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** POST /api/v1/upload/avatar — Upload and crop user/trainer avatar */
  uploadAvatar(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<any>(`${this.apiUrl}/avatar`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** POST /api/v1/upload/media — Upload any media file (image, video, PDF) */
  uploadMedia(file: File, folder: string = 'gallery'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return this.http.post<any>(`${this.apiUrl}/media`, formData).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/upload/signature — Generate signed params for direct browser upload */
  getSignature(folder?: string): Observable<CloudinarySignature> {
    const params: any = {};
    if (folder) params.folder = folder;
    return this.http.get<any>(`${this.apiUrl}/signature`, { params }).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/upload — Delete file from Cloudinary by public ID */
  deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Observable<any> {
    return this.http.request('delete', this.apiUrl, {
      body: { publicId, resourceType }
    });
  }
}

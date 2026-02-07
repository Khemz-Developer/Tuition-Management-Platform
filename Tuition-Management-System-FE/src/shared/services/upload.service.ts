import api from './api'

interface UploadResponse {
  url: string
  publicId: string
  fileName: string
  fileSize: number
  mimeType: string
}

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export const uploadService = {
  async uploadImage(
    file: File,
    folder = 'images',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await api.post<{ data: UploadResponse }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          })
        }
      },
    })

    return response.data.data
  },

  async uploadDocument(
    file: File,
    folder = 'documents',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await api.post<{ data: UploadResponse }>('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          })
        }
      },
    })

    return response.data.data
  },

  async uploadVideo(
    file: File,
    folder = 'videos',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await api.post<{ data: UploadResponse }>('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          })
        }
      },
    })

    return response.data.data
  },

  async deleteFile(publicId: string): Promise<void> {
    await api.delete(`/upload/${publicId}`)
  },

  getAcceptedImageTypes(): string {
    return 'image/jpeg,image/png,image/gif,image/webp'
  },

  getAcceptedDocumentTypes(): string {
    return 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },

  getAcceptedVideoTypes(): string {
    return 'video/mp4,video/webm,video/quicktime'
  },

  getMaxImageSize(): number {
    return 5 * 1024 * 1024 // 5MB
  },

  getMaxDocumentSize(): number {
    return 10 * 1024 * 1024 // 10MB
  },

  getMaxVideoSize(): number {
    return 100 * 1024 * 1024 // 100MB
  },
}

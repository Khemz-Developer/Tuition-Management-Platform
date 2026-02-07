import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { promisify } from 'util';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Always use individual config values for reliability
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    
    // Validate all required values are present
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Cloudinary configuration is missing!');
      console.error(`   Cloud name: ${cloudName || 'MISSING'}`);
      console.error(`   API Key: ${apiKey ? 'SET' : 'MISSING'}`);
      console.error(`   API Secret: ${apiSecret ? 'SET' : 'MISSING'}`);
      throw new Error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    }
    
    // Configure Cloudinary with individual values
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
    });
    
    console.log('✅ Cloudinary configured successfully');
    console.log(`   Cloud name: ${cloudName}`);
    console.log(`   API Key: ${apiKey.substring(0, 6)}...`);
  }

  async uploadImage(file: Express.Multer.File, folder = 'images'): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed (JPEG, PNG, WebP, GIF)');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    return new Promise((resolve, reject) => {
      // Validate file buffer first
      if (!file.buffer || file.buffer.length === 0) {
        reject(new BadRequestException('File buffer is missing or empty'));
        return;
      }

      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `tuition-management/${folder}`,
            resource_type: 'image',
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto' }, // Optimize for profile pictures
              { fetch_format: 'auto' }, // Auto format (webp when supported)
            ],
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              const errorMessage = error.message || error.toString() || 'Unknown Cloudinary error';
              reject(new BadRequestException(`Upload failed: ${errorMessage}`));
            } else if (!result) {
              console.error('Cloudinary upload returned no result');
              reject(new BadRequestException('Upload failed: No result from Cloudinary'));
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          },
        );

        // Create a readable stream from the buffer
        const bufferStream = new Readable({
          read() {
            // Push the buffer and end the stream
            this.push(file.buffer);
            this.push(null);
          }
        });
        
        bufferStream.on('error', (streamError) => {
          console.error('Stream error:', streamError);
          const errorMessage = streamError?.message || streamError?.toString() || 'Unknown stream error';
          reject(new BadRequestException(`Stream error: ${errorMessage}`));
        });
        
        uploadStream.on('error', (uploadError) => {
          console.error('Upload stream error:', uploadError);
          const errorMessage = uploadError?.message || uploadError?.toString() || 'Unknown upload stream error';
          reject(new BadRequestException(`Upload stream error: ${errorMessage}`));
        });
        
        // Pipe the buffer stream to the upload stream
        bufferStream.pipe(uploadStream);
      } catch (error: any) {
        console.error('Error creating upload stream:', error);
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        reject(new BadRequestException(`Failed to create upload stream: ${errorMessage}`));
      }
    });
  }

  async uploadDocument(file: Express.Multer.File, folder = 'documents'): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (10MB max for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `tuition-management/${folder}`,
          resource_type: 'auto', // Auto-detect resource type
        },
        (error, result) => {
          if (error) {
            reject(new BadRequestException(`Upload failed: ${error.message}`));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      // Log error but don't throw - deletion is not critical
      console.error(`Failed to delete image ${publicId}:`, error);
    }
  }
}

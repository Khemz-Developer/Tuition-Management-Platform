import { Controller, Post, Delete, Param, UseGuards, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Express } from 'express';
import { memoryStorage } from 'multer';

// Configure multer to use memory storage for Cloudinary uploads
const storage = memoryStorage();

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const result = await this.uploadService.uploadImage(file, folder || 'images');
      // Return plain object - TransformInterceptor will wrap it
      return {
        url: result.url,
        publicId: result.publicId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  }

  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.uploadService.uploadDocument(file, folder || 'documents');
    // Return plain object - TransformInterceptor will wrap it
    return {
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Delete('image/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    await this.uploadService.deleteImage(publicId);
    return { message: 'Image deleted successfully' };
  }
}

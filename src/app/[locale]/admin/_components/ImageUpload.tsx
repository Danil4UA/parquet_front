"use client";

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import photosServices from '@/services/photosServices';
import { getSession } from 'next-auth/react';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  uploading?: boolean;
}

export default function ImageUpload({
  value = [],
  onChange,
  onUploadStateChange,
  maxFiles = 5,
  accept = "image/*",
  disabled = false,
  uploading = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const isProcessing = uploading || isUploading;

  const uploadSingleImage = async (file: File) => {
    try {
      const freshSession = await getSession();
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await photosServices.uploadSinglePhoto(freshSession, formData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upload image');
      }
      
      return response.data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const uploadMultipleImages = async (files: File[]) => {
    try {
      const freshSession = await getSession();
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('photos', file);
      });
      
      const response = await photosServices.uploadMultiplePhoto(freshSession, formData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upload images');
      }
      
      return response.data.files.map((fileInfo: any) => fileInfo.fileUrl);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  };


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const fileArray = Array.from(files);
    
    if (value.length + fileArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    if (onUploadStateChange) onUploadStateChange(true);

    try {
      let newImageUrls: string[] = [];
      
      if (fileArray.length === 1) {
        const url = await uploadSingleImage(fileArray[0]);
        newImageUrls = [url];
      } else {
        newImageUrls = await uploadMultipleImages(fileArray);
      }
      
      onChange([...value, ...newImageUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (onUploadStateChange) onUploadStateChange(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const url = value[indexToRemove];
    const fileName = url.split('/').pop();
    console.log("indexToRemove", indexToRemove)
    console.log("fileName,", fileName)
    console.log("url", url)
    if (fileName) {
      try {
        // Если у вас есть метод для удаления файла
        // const freshSession = await getSession();
        // await photosServices.deletePhoto(freshSession, fileName);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    console.log("i am here")
    onChange(value.filter((_, index) => index !== indexToRemove));
  };


  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card
              key={`${url}-${index}`}
              className="relative group aspect-square overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                style={{ backgroundImage: `url(${url})` }} 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8"
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div className={cn(
          "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg",
          disabled || isProcessing ? "opacity-50" : "cursor-pointer hover:border-primary transition-colors"
        )}>
          <input
            type="file"
            id="image-upload"
            multiple
            accept={accept}
            onChange={handleUpload}
            disabled={disabled || isProcessing}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
          >
            {isProcessing ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">
                {isProcessing ? 'Processing...' : 'Click to upload images'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {`${value.length} of ${maxFiles} images uploaded`}
              </p>
            </div>
          </label>
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-destructive mt-2">{uploadError}</p>
      )}
    </div>
  );
}
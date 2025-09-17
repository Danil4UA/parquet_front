"use client";

import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import photosServices from '@/services/photosServices';
import { getSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import SortableImageItem from './SortableImageItem';

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

  const { productId } = useParams<{ productId: string }>();

  const isProcessing = uploading || isUploading;

  const uploadSingleImage = async (file: File) => {
    try {
      const freshSession = await getSession();
      const formData = new FormData();
      formData.append('photo', file);
      
      if (productId) {
        formData.append('productId', productId);
      }

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
  
      formData.append('productId', productId);

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
    if (fileName) {
      try {
        // const freshSession = await getSession();
        // await photosServices.deletePhoto(freshSession, fileName);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      const oldIndex = value.findIndex((url) => url === active.id);
      const newIndex = value.findIndex((url) => url === over.id);

      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }
  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {value.map((url, index) => (
                <SortableImageItem
                  key={url}
                  url={url}
                  index={index}
                  onRemove={() => handleRemove(index)}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
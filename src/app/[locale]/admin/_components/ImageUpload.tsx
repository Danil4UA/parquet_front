"use client";
import React, { useCallback, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  preview?: boolean;
  uploading?: boolean;
}

export default function ImageUpload({
  value = [],
  onChange,
  onUploadStateChange,
  maxFiles = 5,
  accept = "image/*",
  disabled = false,
  preview = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  React.useEffect(() => {
    const urls: string[] = [];
    
    value.forEach(file => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });
    
    setPreviewUrls(urls);
    
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      setUploadError(null);
      setIsUploading(true);
      if (onUploadStateChange) onUploadStateChange(true);

      try {
        const selectedFiles: File[] = [];
        
        for (let i = 0; i < files.length; i++) {
          if (value.length + selectedFiles.length >= maxFiles) {
            setUploadError(`Maximum ${maxFiles} images allowed`);
            break;
          }

          selectedFiles.push(files[i]);
        }
        
        if (selectedFiles.length) {
          onChange([...value, ...selectedFiles]);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to process images. Please try again.');
      } finally {
        setIsUploading(false);
        if (onUploadStateChange) onUploadStateChange(false);
        e.target.value = '';
      }
    },
    [value, onChange, maxFiles, onUploadStateChange]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      onChange(value.filter((_, index) => index !== indexToRemove));
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      {preview && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <Card
              key={`${url}-${index}`}
              className="relative group aspect-square overflow-hidden"
            >
              <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${url})` }} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8"
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
        <div className={cn("flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg", disabled ? "opacity-50" : "cursor-pointer hover:border-primary transition-colors")}>
          <input
            type="file"
            id="image-upload"
            multiple
            accept={accept}
            onChange={handleUpload}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
          >
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium">
                {isUploading ? 'Processing...' : 'Click to upload images'}
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
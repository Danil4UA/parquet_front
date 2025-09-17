"use client";

import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import ImageUpload from '../../../_components/ImageUpload';

interface ProductImagesTabProps {
  images: string[];
  onChange: (urls: string[]) => void;
  uploadEndpoint?: string;
  token?: string;
}

export function ProductImagesTab({
  images = [],
  onChange,
}: ProductImagesTabProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Product Images</span>
          <span className="text-sm font-normal text-muted-foreground">
            {images.length} image(s) selected
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          name="images"
          render={() => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  value={images}
                  onChange={onChange}
                  onUploadStateChange={setIsUploading}
                  uploading={isUploading}
                  maxFiles={5}
                  accept="image/*"
                />
              </FormControl>
              {images.length === 0 && (
                <FormMessage className="text-red-600">
                  Добавьте хотя бы одно изображение
                </FormMessage>
              )}            
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Upload up to 5 product images. First image will be used as main product image.
        </p>
      </CardContent>
    </Card>
  );
}
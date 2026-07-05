"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, RotateCcw, ImageOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageUpload from "../_components/ImageUpload";
import contentServices from "@/services/contentServices";
import photosServices from "@/services/photosServices";
import useSiteContent, { siteContentQueryKey } from "@/hooks/useSiteContent";
import { CATEGORY_MEDIA_SLOTS } from "@/constants/siteMedia";

const MAX_HERO_IMAGES = 10;

function CategoryImageCell({
  slug,
  label,
  currentUrl,
  onUpload,
  onReset,
}: {
  slug: string;
  label: string;
  currentUrl?: string;
  onUpload: (slug: string, file: File) => Promise<void>;
  onReset: (slug: string) => Promise<void>;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = Boolean(currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsBusy(true);
    try {
      await onUpload(slug, file);
    } finally {
      setIsBusy(false);
      e.target.value = "";
    }
  };

  const handleReset = async () => {
    setIsBusy(true);
    try {
      await onReset(slug);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-white">
      {/* Same aspect ratio as the category cards on the site */}
      <div className="relative aspect-[4/5] bg-muted">
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {isBusy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="text-sm font-medium truncate">{label}</span>
        <div className="flex items-center gap-1">
          {isCustom && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Remove image"
              disabled={isBusy}
              onClick={handleReset}
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            disabled={isBusy}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            Replace
          </Button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default function MediaPage() {
  const queryClient = useQueryClient();
  const { data, isPending } = useSiteContent();

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.data) {
      setHeroImages(data.data.hero_slider || []);
      setCategoryImages(data.data.category_images || {});
    }
  }, [data?.data]);

  const saveHero = async (urls: string[]) => {
    const previous = heroImages;
    setHeroImages(urls);
    try {
      const session = await getSession();
      await contentServices.updateContent(session, "hero_slider", urls);
      queryClient.invalidateQueries({ queryKey: [siteContentQueryKey] });
      toast.success("Hero slider updated");
    } catch (error) {
      console.error("Error saving hero slider:", error);
      setHeroImages(previous);
      toast.error("Failed to save hero slider");
    }
  };

  const saveCategoryImages = async (next: Record<string, string>) => {
    const previous = categoryImages;
    setCategoryImages(next);
    try {
      const session = await getSession();
      await contentServices.updateContent(session, "category_images", next);
      queryClient.invalidateQueries({ queryKey: [siteContentQueryKey] });
      toast.success("Category image updated");
    } catch (error) {
      console.error("Error saving category images:", error);
      setCategoryImages(previous);
      toast.error("Failed to save category image");
    }
  };

  const handleCategoryUpload = async (slug: string, file: File) => {
    try {
      const session = await getSession();
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("preset", "hero");

      const response = await photosServices.uploadSinglePhoto(session, formData);
      if (!response.data?.success) {
        throw new Error("Upload failed");
      }

      await saveCategoryImages({ ...categoryImages, [slug]: response.data.fileUrl });
    } catch (error) {
      console.error("Error uploading category image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleCategoryReset = async (slug: string) => {
    const next = { ...categoryImages };
    delete next[slug];
    await saveCategoryImages(next);
  };

  if (isPending) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <h1 className="text-2xl font-bold">Media</h1>

      <Card>
        <CardHeader>
          <CardTitle>Homepage hero slider</CardTitle>
          <CardDescription>
            These photos rotate in the top block of the homepage. Drag to reorder —
            the order here is the order on the site. If the list is empty, the
            homepage shows a plain dark background.
            <span className="mt-1 block font-medium text-foreground">
              Recommended: landscape 16:9, at least 1920×1080. The photo is cropped
              on phones, so keep the subject near the center.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={heroImages}
            onChange={saveHero}
            maxFiles={MAX_HERO_IMAGES}
            uploadPreset="hero"
            inputId="hero-image-upload"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category images</CardTitle>
          <CardDescription>
            Photos for the category cards on the homepage. A category without an
            image shows a dark card on the site.
            <span className="mt-1 block font-medium text-foreground">
              Recommended: portrait 4:5 (e.g. 800×1000). The preview below shows
              exactly how the photo will be cropped on the site.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORY_MEDIA_SLOTS.map((slot) => (
              <CategoryImageCell
                key={slot.slug}
                slug={slot.slug}
                label={slot.label}
                currentUrl={categoryImages[slot.slug]}
                onUpload={handleCategoryUpload}
                onReset={handleCategoryReset}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type BookCoverImageProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className: string;
  fallbackClassName: string;
  fallbackText?: string;
  loading?: "eager" | "lazy";
};

export function BookCoverImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  fallbackText,
  loading = "lazy",
}: BookCoverImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isMissingOrFailed = !src || failedSrc === src;

  if (isMissingOrFailed) {
    return (
      <div className={`${fallbackClassName} book-cover-image-fallback`}>
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding="async"
      loading={loading}
      onError={() => setFailedSrc(src)}
      onLoad={(event) => {
        const image = event.currentTarget;

        if (image.naturalWidth <= 2 || image.naturalHeight <= 2) {
          setFailedSrc(src);
        }
      }}
    />
  );
}

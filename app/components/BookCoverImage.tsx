"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type BookCoverImageProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className: string;
  fallbackClassName: string;
  fallbackText?: string;
};

export function BookCoverImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  fallbackText,
}: BookCoverImageProps) {
  const [hasUsableImage, setHasUsableImage] = useState(Boolean(src));

  useEffect(() => {
    setHasUsableImage(Boolean(src));
  }, [src]);

  if (!src || !hasUsableImage) {
    return fallbackText ? (
      <div className={fallbackClassName}>{fallbackText}</div>
    ) : null;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasUsableImage(false)}
      onLoad={(event) => {
        const image = event.currentTarget;

        if (image.naturalWidth <= 2 || image.naturalHeight <= 2) {
          setHasUsableImage(false);
        }
      }}
    />
  );
}

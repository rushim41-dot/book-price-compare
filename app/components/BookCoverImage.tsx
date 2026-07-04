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
  fallbackSrc?: string | null;
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
  fallbackSrc,
  loading = "lazy",
}: BookCoverImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const primarySrc = src && !failedSources.includes(src) ? src : null;
  const backupSrc =
    fallbackSrc && !failedSources.includes(fallbackSrc) ? fallbackSrc : null;
  const hasAnyImage = Boolean(primarySrc || backupSrc);

  function markFailed(nextSrc: string) {
    setFailedSources((currentSources) =>
      currentSources.includes(nextSrc)
        ? currentSources
        : [...currentSources, nextSrc]
    );
  }

  if (!hasAnyImage) {
    return (
      <div className={`${fallbackClassName} book-cover-image-fallback`}>
        {fallbackText}
      </div>
    );
  }

  if (backupSrc) {
    return (
      <span className="book-cover-stack">
        <img
          src={backupSrc}
          alt=""
          width={width}
          height={height}
          className={className}
          decoding="async"
          loading={loading}
          aria-hidden="true"
          onError={() => markFailed(backupSrc)}
        />
        {primarySrc ? (
          <img
            src={primarySrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            decoding="async"
            loading={loading}
            onError={() => markFailed(primarySrc)}
            onLoad={(event) => {
              const image = event.currentTarget;

              if (image.naturalWidth <= 2 || image.naturalHeight <= 2) {
                markFailed(primarySrc);
              }
            }}
          />
        ) : null}
      </span>
    );
  }

  if (!primarySrc) {
    return (
      <div className={`${fallbackClassName} book-cover-image-fallback`}>
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={primarySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding="async"
      loading={loading}
      onError={() => markFailed(primarySrc)}
      onLoad={(event) => {
        const image = event.currentTarget;

        if (image.naturalWidth <= 2 || image.naturalHeight <= 2) {
          markFailed(primarySrc);
        }
      }}
    />
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type CoverImageState = "loading" | "loaded" | "failed";

type BookCoverImageProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className: string;
  fallbackClassName: string;
  fallbackText?: string;
  loading?: "eager" | "lazy";
  loadDelayMs?: number;
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
  loadDelayMs = 700,
}: BookCoverImageProps) {
  if (!src) {
    return (
      <BookCoverFrame
        imageState="failed"
        fallbackClassName={fallbackClassName}
        fallbackText={fallbackText}
      />
    );
  }

  return (
    <BookCoverImageWithSource
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fallbackClassName={fallbackClassName}
      fallbackText={fallbackText}
      loading={loading}
      loadDelayMs={loadDelayMs}
    />
  );
}

function BookCoverImageWithSource({
  src,
  alt,
  width,
  height,
  className,
  fallbackClassName,
  fallbackText,
  loading,
  loadDelayMs = 700,
}: Omit<BookCoverImageProps, "src"> & { src: string }) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [shouldRequestImage, setShouldRequestImage] = useState(loadDelayMs <= 0);
  const [imageState, setImageState] = useState<CoverImageState>("loading");
  const updateImageState = useCallback((image: HTMLImageElement) => {
    const nextState =
      image.naturalWidth <= 2 || image.naturalHeight <= 2 ? "failed" : "loaded";

    setImageState((currentState) =>
      currentState === "loading" ? nextState : currentState
    );
  }, []);

  useEffect(() => {
    if (shouldRequestImage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldRequestImage(true);
    }, loadDelayMs);

    return () => window.clearTimeout(timer);
  }, [loadDelayMs, shouldRequestImage]);

  useEffect(() => {
    if (!shouldRequestImage) {
      return;
    }

    let attempts = 0;
    const interval = window.setInterval(() => {
      const image = imageRef.current;

      if (image?.complete) {
        updateImageState(image);
        window.clearInterval(interval);
        return;
      }

      attempts += 1;

      if (attempts >= 20) {
        window.clearInterval(interval);
      }
    }, 150);

    return () => window.clearInterval(interval);
  }, [shouldRequestImage, updateImageState]);

  return (
    <BookCoverFrame
      imageState={imageState}
      fallbackClassName={fallbackClassName}
      fallbackText={fallbackText}
    >
      {shouldRequestImage && imageState !== "failed" ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          ref={imageRef}
          className={`${className} book-cover-image${
            imageState === "loaded" ? " book-cover-image-loaded" : ""
          }`}
          decoding="async"
          loading={loading}
          style={{ opacity: imageState === "loaded" ? 1 : 0 }}
          onError={() => setImageState("failed")}
          onLoad={(event) => {
            updateImageState(event.currentTarget);
          }}
        />
      ) : null}
    </BookCoverFrame>
  );
}

function BookCoverFrame({
  imageState,
  fallbackClassName,
  fallbackText,
  children,
}: {
  imageState: CoverImageState;
  fallbackClassName: string;
  fallbackText?: string;
  children?: ReactNode;
}) {
  const fallback = (
    <div
      className={`${fallbackClassName} book-cover-image-fallback`}
      style={{ visibility: imageState === "loaded" ? "hidden" : "visible" }}
    >
      {fallbackText}
    </div>
  );

  return (
    <span className="book-cover-image-frame">
      {fallback}
      {children}
    </span>
  );
}

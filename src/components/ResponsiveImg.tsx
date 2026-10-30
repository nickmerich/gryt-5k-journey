import type { ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import { responsiveImage } from "@/lib/responsive-image";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  /** Original Lovable asset URL (e.g. `asset.url`). */
  asset: string;
  /** `sizes` attribute describing the rendered width. */
  sizes: string;
  /** Cap the largest variant offered. */
  maxWidth?: number;
  /** LCP image: preload it in <head> and fetch with high priority. */
  priority?: boolean;
};

/**
 * Drop-in <img> that serves right-sized local WebP/AVIF variants with srcset.
 * Keeps intrinsic width/height from the original for layout stability.
 */
export function ResponsiveImg({ asset, sizes, maxWidth, priority, loading, decoding, ...rest }: Props) {
  const img = responsiveImage(asset, maxWidth);
  if (priority && img.srcSet) {
    const best = img.avifSrcSet ?? img.srcSet;
    preload(img.src, {
      as: "image",
      imageSrcSet: best,
      imageSizes: sizes,
      fetchPriority: "high",
      type: img.avifSrcSet ? "image/avif" : "image/webp",
    });
  }
  const el = (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      width={rest.width ?? img.width}
      height={rest.height ?? img.height}
      loading={priority ? undefined : (loading ?? "lazy")}
      decoding={decoding ?? (priority ? undefined : "async")}
      fetchPriority={priority ? "high" : rest.fetchPriority}
      {...rest}
    />
  );
  if (!img.avifSrcSet) return el;
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={img.avifSrcSet} sizes={sizes} />
      {el}
    </picture>
  );
}

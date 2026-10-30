import { lazy, Suspense, type ComponentProps, type ComponentType } from "react";

/**
 * Code-split versions of heavy below-the-fold sections. They still render on
 * the server (content is in the HTML and crawlers wait for the full stream);
 * in the browser their JS loads after the main bundle instead of on the
 * critical path, and React hydrates them when the chunk arrives.
 * Same names/props as the originals, so call sites only change the import path.
 * Sections that own in-page anchors (#run2, #course) stay static on purpose.
 */
function split<T extends ComponentType<any>>(load: () => Promise<T>) {
  const Lazy = lazy(async () => ({ default: await load() }));
  return function Split(props: ComponentProps<T>) {
    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}

export const PhotoGallery = split(() => import("./PhotoGallery").then((m) => m.PhotoGallery));
export const ArtistQuotes = split(() => import("./ArtistQuotes").then((m) => m.ArtistQuotes));
export const PartnerQA = split(() => import("./PartnerQA").then((m) => m.PartnerQA));

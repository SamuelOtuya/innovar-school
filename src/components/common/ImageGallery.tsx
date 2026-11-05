import { useEffect, useState } from "react";
import { Expand, ImageIcon } from "lucide-react";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

export type GalleryImage = {
  src: string;
  title?: string;
  description?: string;
};

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  showTitles?: boolean;
}

const gridClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function ImageGallery({
  images,
  columns = 3,
  showTitles = true,
}: ImageGalleryProps) {
  const [index, setIndex] = useState(-1);

  // Close the lightbox if its selected image
  // is removed by filtering or data updates.
  useEffect(() => {
    if (index >= images.length && index !== -1) {
      setIndex(-1);
    }
  }, [images.length, index]);

  const slides = images.map((image) => ({
    src: image.src,
    title: image.title,
    description: image.description,
    alt: image.title || "Innovar gallery photograph",
  }));

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-[#F8F9FE] px-6 py-16 text-center">
        <ImageIcon size={40} className="mx-auto mb-4 text-[#542080]/50" />

        <h3 className="mb-2 text-lg font-extrabold text-[#101A44]">
          Gallery Coming Soon
        </h3>

        <p className="text-sm leading-7 text-slate-600">
          Photographs from Innovar will appear here as they are published.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Image grid */}
      <div className={`grid grid-cols-1 gap-6 ${gridClasses[columns]}`}>
        {images.map((image, imageIndex) => (
          <button
            key={`${image.src}-${imageIndex}`}
            type="button"
            onClick={() => setIndex(imageIndex)}
            aria-label={`View ${
              image.title || `gallery image ${imageIndex + 1}`
            }`}
            className="group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_5px_25px_rgba(25,25,65,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(25,25,65,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#542080] motion-reduce:transform-none"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F1EBFA]">
              <img
                src={image.src}
                alt={image.title || "Innovar gallery photograph"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transform-none"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#101A44]/0 transition-colors duration-300 group-hover:bg-[#101A44]/45 group-focus-visible:bg-[#101A44]/45">
                <span className="flex h-14 w-14 translate-y-3 items-center justify-center rounded-full bg-[#F5BE20] text-[#101A44] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none">
                  <Expand size={24} />
                </span>
              </div>

              {/* Image counter */}
              <span className="absolute right-3 top-3 rounded-full bg-[#101A44]/70 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {String(imageIndex + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Caption */}
            {showTitles && image.title && (
              <div className="border-t border-slate-100 bg-white p-5">
                <h3 className="line-clamp-2 text-sm font-extrabold leading-6 text-[#101A44] transition-colors group-hover:text-[#542080]">
                  {image.title}
                </h3>

                {image.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen gallery */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={Math.max(index, 0)}
        slides={slides}
        plugins={[Zoom, Thumbnails, Captions]}
        carousel={{
          finite: images.length <= 1,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
        }}
        thumbnails={{
          position: "bottom",
          width: 90,
          height: 65,
          gap: 12,
          border: 2,
          borderRadius: 8,
          padding: 4,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
        }}
        styles={{
          container: {
            backgroundColor: "rgba(8, 12, 32, 0.97)",
          },
          thumbnailsContainer: {
            backgroundColor: "#101A44",
          },
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </>
  );
}

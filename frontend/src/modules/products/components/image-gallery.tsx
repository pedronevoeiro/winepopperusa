"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import type { ProductImage } from "@/lib/products-data"

interface ImageGalleryProps {
  images: ProductImage[]
  videoUrl?: string
}

function isGif(url: string): boolean {
  return /\.gif(\?|$)/i.test(url)
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url)
}

export default function ImageGallery({ images, videoUrl }: ImageGalleryProps) {
  // Build media list: images + optional video at position 2
  const mediaItems = [...images]
  const videoIndex = videoUrl ? Math.min(2, images.length) : -1

  const [activeIndex, setActiveIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const isActiveVideo = videoUrl && activeIndex === videoIndex
  const activeImage = !isActiveVideo ? (mediaItems[activeIndex > videoIndex && videoUrl ? activeIndex - 1 : activeIndex] ?? mediaItems[0]) : null

  // Adjust indices for items after video
  const totalItems = mediaItems.length + (videoUrl ? 1 : 0)

  function getMediaForIndex(idx: number) {
    if (videoUrl && idx === videoIndex) return { type: "video" as const, url: videoUrl }
    const imgIdx = videoUrl && idx > videoIndex ? idx - 1 : idx
    const img = mediaItems[imgIdx]
    return img ? { type: "image" as const, ...img } : null
  }

  const activeMedia = getMediaForIndex(activeIndex)

  if (!images.length) {
    return (
      <div className="aspect-square rounded-xl bg-brand-gray-100 flex items-center justify-center text-brand-gray-500">
        No image available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main display */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-gray-50">
        {activeMedia?.type === "video" ? (
          <video
            src={activeMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : activeMedia?.type === "image" ? (
          <Image
            src={activeMedia.url}
            alt={activeMedia.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={activeIndex === 0}
            unoptimized={isGif(activeMedia.url)}
          />
        ) : null}
      </div>

      {/* Thumbnail strip */}
      {totalItems > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {Array.from({ length: totalItems }).map((_, idx) => {
            const media = getMediaForIndex(idx)
            if (!media) return null

            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  idx === activeIndex
                    ? "border-brand-red"
                    : "border-transparent hover:border-brand-gray-300"
                }`}
                aria-label={media.type === "video" ? "Watch video" : `View image ${idx + 1}`}
              >
                {media.type === "video" ? (
                  <div className="w-full h-full bg-brand-black flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                ) : (
                  <Image
                    src={media.url}
                    alt={media.alt || ""}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized={isGif(media.url)}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

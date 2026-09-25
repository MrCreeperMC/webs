import { useState } from 'react'
import { Image, Video } from 'lucide-react'
import type { Media } from '../../types/post'
import { Lightbox } from './Lightbox'

interface MediaRendererProps {
  media: Media
  className?: string
  caption?: string
}

export function MediaRenderer({ media, className = '', caption }: MediaRendererProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl ${className}`}>
        <div className="text-center p-8">
          <Image className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Media unavailable</p>
        </div>
      </div>
    )
  }

  if (media.type === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video
          className="w-full h-full object-cover rounded-xl"
          poster={media.thumbnail}
          controls
          preload="metadata"
          onError={() => setFailed(true)}
        >
          <source src={media.url} />
          Your browser does not support video.
        </video>
        {(caption || media.caption) && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
            {caption || media.caption}
          </p>
        )}
      </div>
    )
  }

  if (media.type === 'image' || media.type === 'external') {
    return (
      <>
        <div className={`relative ${className}`}>
          <img
            src={media.url}
            alt={media.alt}
            loading="lazy"
            className="w-full h-full object-cover rounded-xl cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            onClick={() => setLightboxOpen(true)}
            onError={() => setFailed(true)}
          />
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        </div>
        {(caption || media.caption) && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
            {caption || media.caption}
          </p>
        )}
        {lightboxOpen && (
          <Lightbox
            src={media.url}
            alt={media.alt}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    )
  }

  return null
}

export function MediaTypeIcon({ type }: { type: string }) {
  if (type === 'video') return <Video className="w-3.5 h-3.5" />
  if (type === 'image') return <Image className="w-3.5 h-3.5" />
  return null
}

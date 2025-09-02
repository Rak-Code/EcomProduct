"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  quality = 85,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg?height=400&width=400'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    } else {
      onError?.()
    }
  }

  // Generate blur data URL for placeholder
  const generateBlurDataURL = (width: number = 10, height: number = 10) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, width, height)
    }
    return canvas.toDataURL()
  }

  const getOptimizedSrc = (originalSrc: string) => {
    // If it's a Cloudinary URL, add optimization parameters
    if (originalSrc.includes('res.cloudinary.com')) {
      const parts = originalSrc.split('/upload/')
      if (parts.length === 2) {
        const transformations = [
          'f_auto', // Auto format (WebP/AVIF when supported)
          'q_auto', // Auto quality
          'c_fill', // Crop to fill
          width && height ? `w_${width},h_${height}` : '',
          'dpr_auto' // Auto DPR for Retina displays
        ].filter(Boolean).join(',')
        
        return `${parts[0]}/upload/${transformations}/${parts[1]}`
      }
    }
    return originalSrc
  }

  const optimizedSrc = getOptimizedSrc(currentSrc)

  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <ImageIcon className="w-8 h-8" />
        <span className="ml-2 text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gray-100",
            fill ? "" : "rounded-lg"
          )}
          style={!fill ? { width, height } : undefined}
        >
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
      
      <Image
        src={optimizedSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL()}
        sizes={sizes || (fill ? '100vw' : `${width}px`)}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        style={fill ? { objectFit: 'cover' } : undefined}
      />
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P & OptimizedImageProps>
) {
  return function LazyImage(props: P & OptimizedImageProps) {
    const [isInView, setIsInView] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsInView(true)
            setHasLoaded(true)
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      )

      const element = document.getElementById(`lazy-image-${Math.random()}`)
      if (element) observer.observe(element)

      return () => observer.disconnect()
    }, [hasLoaded])

    if (!isInView && !hasLoaded) {
      return (
        <div
          id={`lazy-image-${Math.random()}`}
          className={cn(
            "bg-gray-100 animate-pulse",
            props.fill ? "absolute inset-0" : "",
            props.className
          )}
          style={!props.fill ? { width: props.width, height: props.height } : undefined}
        />
      )
    }

    return <Component {...props} />
  }
}

// Product image component with specific optimizations
export function ProductImage(props: OptimizedImageProps) {
  const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  
  return (
    <OptimizedImage
      {...props}
      sizes={props.sizes || defaultSizes}
      placeholder="blur"
      quality={90}
    />
  )
}

// Thumbnail image component
export function ThumbnailImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 25vw, 150px"
      quality={75}
    />
  )
}

// Hero image component
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="100vw"
      priority={true}
      quality={95}
      placeholder="blur"
    />
  )
}
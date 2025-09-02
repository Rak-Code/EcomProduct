"use client"

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  currentImages?: string[]
  maxImages?: number
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  className?: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export default function ImageUpload({ 
  onImagesChange, 
  currentImages = [], 
  maxImages = 5,
  maxFileSize = 5, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(currentImages)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedFormats.join(', ')}`
    }
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }
    
    // Check total images limit
    if (images.length >= maxImages) {
      return `Maximum ${maxImages} images allowed`
    }
    
    return null
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!)
    formData.append('folder', 'paribito-products')
    
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return data.secure_url
  }

  const handleFileUpload = async (files: FileList) => {
    setError('')
    const fileArray = Array.from(files)
    
    // Validate all files first
    for (const file of fileArray) {
      const validation = validateFile(file)
      if (validation) {
        setError(validation)
        return
      }
    }
    
    // Initialize upload progress
    const newProgress: UploadProgress[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }))
    setUploadProgress(prev => [...prev, ...newProgress])
    
    // Upload files
    const uploadPromises = fileArray.map(async (file, index) => {
      try {
        // Simulate progress (since Cloudinary doesn't provide real progress)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => 
            prev.map(p => 
              p.file === file && p.progress < 90 
                ? { ...p, progress: p.progress + 10 }
                : p
            )
          )
        }, 200)
        
        const url = await uploadToCloudinary(file)
        
        clearInterval(progressInterval)
        
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file 
              ? { ...p, progress: 100, status: 'success', url }
              : p
          )
        )
        
        return url
      } catch (error) {
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file 
              ? { ...p, status: 'error', error: 'Upload failed' }
              : p
          )
        )
        throw error
      }
    })
    
    try {
      const urls = await Promise.all(uploadPromises)
      const newImages = [...images, ...urls]
      setImages(newImages)
      onImagesChange(newImages)
      
      // Clear successful uploads after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.status !== 'success'))
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [images, maxImages])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Drop images here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Max {maxImages} images, {maxFileSize}MB each
          </p>
          <p className="text-xs text-gray-400">
            Supports: {acceptedFormats.map(f => f.split('/')[1]).join(', ')}
          </p>
        </div>
        
        <Label htmlFor="file-upload" className="cursor-pointer">
          <Button type="button" className="mt-4">
            Choose Files
          </Button>
        </Label>
        <Input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((upload, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">
                    {upload.file.name}
                  </p>
                  {upload.status === 'uploading' && (
                    <Progress value={upload.progress} className="mt-1" />
                  )}
                  {upload.status === 'error' && (
                    <p className="text-red-500 text-xs mt-1">{upload.error}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {upload.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <Image
                  src={image}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-center mt-1 text-gray-500">
                Image {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Images count */}
      <p className="text-sm text-gray-500 text-center">
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  )
}
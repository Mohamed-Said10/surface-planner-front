"use client"

import type React from "react"
import { Upload, X, Image, Video, FileText } from "lucide-react"
import { useState } from "react"

interface UploadedFile {
  file: File
  preview?: string
  id: string
}

interface UploadSectionProps {
  title: string
  acceptedFormats?: string
  acceptedTypes?: string[]
  maxSize?: number // in MB
  onFileUpload?: (files: FileList) => void
}

function UploadSection({ 
  title, 
  acceptedFormats = "Images, Videos, Documents", 
  acceptedTypes = ["image/*", "video/*", ".pdf", ".doc", ".docx"],
  maxSize = 10,
  onFileUpload 
}: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string>("")

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
      return false
    }

    // Check file type
    const isValid = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''))
      }
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type === type
    })

    if (!isValid) {
      setError(`File ${file.name} is not a supported format`)
      return false
    }

    setError("")
    return true
  }

  const processFiles = async (files: FileList) => {
    const validFiles: File[] = []
    
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file)
      }
    })

    if (validFiles.length > 0) {
      const newUploadedFiles: UploadedFile[] = []
      
      for (const file of validFiles) {
        let preview: string | undefined = undefined
        
        if (file.type.startsWith('image/')) {
          try {
            preview = await fileToBase64(file)
          } catch (error) {
            console.error('Error converting image to base64:', error)
          }
        }
        
        newUploadedFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview
        })
      }

      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
      
      if (onFileUpload) {
        const fileList = new DataTransfer()
        validFiles.forEach(file => fileList.items.add(file))
        onFileUpload(fileList.files)
      }
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await processFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFiles(files)
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className=" border-gray-200 pb-6 mb-6 last:-0 last:pb-0 last:mb-0">
      <div className="flex items-start gap-6">
        <div className="w-40 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>

        <div className="flex-1">
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
              isDragOver 
                ? "lue-400 bg-blue-50 scale-105" 
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            } ${uploadedFiles.length > 0 ? 'min-h-[200px]' : 'p-8'}`}
            onDragOver={uploadedFiles.length === 0 ? handleDragOver : undefined}
            onDragLeave={uploadedFiles.length === 0 ? handleDragLeave : undefined}
            onDrop={uploadedFiles.length === 0 ? handleDrop : undefined}
          >
            {uploadedFiles.length === 0 && (
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileSelect}
                accept={acceptedTypes.join(',')}
              />
            )}

            {uploadedFiles.length === 0 ? (
              <div className="flex flex-col items-center text-center">
                <Upload className={`h-8 w-8 mb-3 transition-colors ${
                  isDragOver ? "text-blue-500" : "text-gray-400"
                }`} />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">{acceptedFormats}</p>
                <p className="text-xs text-gray-400 mt-1">Max size: {maxSize}MB</p>
              </div>
            ) : (
              <div className="p-4 h-full">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                  {uploadedFiles.map((uploadedFile) => (
                    <div key={uploadedFile.id} className="relative group">
                      {uploadedFile.preview ? (
                        <div className="aspect-square relative">
                          <img 
                            src={uploadedFile.preview} 
                            alt={uploadedFile.file.name}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeFile(uploadedFile.id)
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 opacity-100 z-30"
                            title="Remove file"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2 rounded-b-lg">
                            <div className="truncate font-medium">
                              {uploadedFile.file.name}
                            </div>
                            <div className="text-gray-300">
                              {formatFileSize(uploadedFile.file.size)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-200 rounded-lg flex flex-col items-center justify-center relative p-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeFile(uploadedFile.id)
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 opacity-100 z-30"
                            title="Remove file"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="text-gray-600 mb-2">
                            {getFileIcon(uploadedFile.file)}
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full px-1 font-medium">
                            {uploadedFile.file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center pt-2 border-t border-gray-200">
                  <input
                    ref={(input) => {
                      if (input) {
                        input.setAttribute('data-add-more', 'true')
                      }
                    }}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={acceptedTypes.join(',')}
                    id={`add-more-${title.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                  <label
                    htmlFor={`add-more-${title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <Upload className="h-4 w-4" />
                    Add More Files
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface UploadWorkProps {
  bookingId?: string
  onFileUpload?: (section: string, files: FileList) => void
}

export default function UploadWork({ bookingId, onFileUpload }: UploadWorkProps) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  const handleSectionUpload = (section: string) => async (files: FileList) => {
    console.log(`Files uploaded to ${section}:`, files)

    if (bookingId) {
      // Upload files to backend
      setUploading(prev => ({ ...prev, [section]: true }))

      try {
        const formData = new FormData()
        formData.append('bookingId', bookingId)
        formData.append('fileType', section)

        Array.from(files).forEach((file) => {
          formData.append('files', file)
        })

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/files`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`Successfully uploaded files to ${section}:`, data)
        } else {
          console.error(`Failed to upload files to ${section}`)
        }
      } catch (error) {
        console.error(`Error uploading files to ${section}:`, error)
      } finally {
        setUploading(prev => ({ ...prev, [section]: false }))
      }
    }

    if (onFileUpload) {
      onFileUpload(section, files)
    }
  }

  const uploadSections = [
    {
      title: "Unedited Photos",
      acceptedFormats: "JPG, PNG, HEIC, WEBP files",
      acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/webp", ".jpg", ".jpeg", ".png", ".heic", ".webp"],
      maxSize: 50,
      onUpload: handleSectionUpload("unedited-photos"),
    },
    {
      title: "Edited Photos",
      acceptedFormats: "JPG, PNG, TIFF, WEBP files",
      acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/tiff", "image/webp", ".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"],
      maxSize: 50,
      onUpload: handleSectionUpload("edited-photos"),
    },
    {
      title: "Videos",
      acceptedFormats: "MP4, MOV, AVI, MKV files",
      acceptedTypes: ["video/mp4", "video/quicktime", "video/avi", "video/x-msvideo", ".mkv"],
      maxSize: 500,
      onUpload: handleSectionUpload("videos"),
    },
    {
      title: "360° Virtual Tour",
      acceptedFormats: "360° images, VR files",
      acceptedTypes: ["image/*", "video/*", ".vrm", ".obj"],
      maxSize: 100,
      onUpload: handleSectionUpload("virtual-tour"),
    },
    {
      title: "Floor Plan & Room Staging",
      acceptedFormats: "PDF, DWG, JPG, PNG files",
      acceptedTypes: ["application/pdf", ".dwg", "image/jpeg", "image/png"],
      maxSize: 25,
      onUpload: handleSectionUpload("floor-plan"),
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-3">Upload Work</h2>
      <div className=" mb-3 mt-3"/>
        <div className="dvideligne border-b mb-3 mt-3"/>

      <div className="space-y-0">
        {uploadSections.map((section, index) => (
          <UploadSection
            key={index}
            title={section.title}
            acceptedFormats={section.acceptedFormats}
            acceptedTypes={section.acceptedTypes}
            maxSize={section.maxSize}
            onFileUpload={section.onUpload}
          />
        ))}
      </div>
    </div>
  )
}
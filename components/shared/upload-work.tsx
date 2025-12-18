"use client"

import type React from "react"
import { Upload, X, Image, Video, FileText } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface UploadedFile {
  file: File | null // Null for existing files from backend
  preview?: string
  id: string
  isExisting?: boolean // Flag to identify files from backend
  fileName?: string // Store filename for existing files
  fileSize?: number // Store file size for existing files
  fileUrl?: string // Store URL for existing files
}

interface UploadSectionProps {
  title: string
  acceptedFormats?: string
  acceptedTypes?: string[]
  maxSize?: number // in MB
  onFileUpload?: (files: FileList) => void
  onUploadProgress?: (section: string, hasFiles: boolean) => void
  existingFiles?: any[] // Files already uploaded to backend
}

function UploadSection({
  title,
  acceptedFormats = "Images, Videos, Documents",
  acceptedTypes = ["image/*", "video/*", ".pdf", ".doc", ".docx"],
  maxSize = 10,
  onFileUpload,
  onUploadProgress,
  existingFiles = []
}: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string>("")

  // Initialize with existing files from backend
  useEffect(() => {
    if (existingFiles && existingFiles.length > 0) {
      const existingFileItems: UploadedFile[] = existingFiles.map((file) => {
        // The backend returns fileUrl which is the full URL to the file
        const imageUrl = file.fileUrl || file.url
        console.log(`[${title}] Loading existing file:`, file.fileName, 'URL:', imageUrl)

        return {
          file: null, // We don't have the actual File object, just metadata
          id: file.id,
          preview: imageUrl, // Use the full file URL as preview
          isExisting: true,
          fileName: file.fileName || imageUrl?.split('/').pop() || 'File',
          fileSize: file.fileSize || 0,
          fileUrl: imageUrl
        }
      })

      setUploadedFiles(existingFileItems)

      // Only notify parent once on initial load, not on every render
      if (onUploadProgress) {
        onUploadProgress(title, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingFiles, title]) // Remove onUploadProgress from dependencies to prevent infinite loop

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

      setUploadedFiles(prev => {
        const newFiles = [...prev, ...newUploadedFiles];
        
        // Notifier le parent du changement
        if (onUploadProgress) {
          onUploadProgress(title, newFiles.length > 0);
        }
        
        return newFiles;
      });
      
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
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      
      // Notifier le parent du changement
      if (onUploadProgress) {
        onUploadProgress(title, filtered.length > 0);
      }
      
      return filtered;
    });
  }

  const getFileIcon = (uploadedFile: UploadedFile) => {
    // For existing files, check the URL or filename extension
    if (uploadedFile.isExisting) {
      const fileName = uploadedFile.fileName?.toLowerCase() || ''
      if (fileName.match(/\.(jpg|jpeg|png|gif|webp|heic)$/)) return <Image className="h-4 w-4" />
      if (fileName.match(/\.(mp4|mov|avi|mkv)$/)) return <Video className="h-4 w-4" />
      return <FileText className="h-4 w-4" />
    }

    // For new files, check the File object type
    if (uploadedFile.file) {
      if (uploadedFile.file.type.startsWith('image/')) return <Image className="h-4 w-4" />
      if (uploadedFile.file.type.startsWith('video/')) return <Video className="h-4 w-4" />
    }
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
                  isDragOver ? "text-blue-500" : "text-[#0F553E]"
                }`} />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-[#0F553E]">Click to upload</span> or drag and drop
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
                            alt={uploadedFile.isExisting ? uploadedFile.fileName : uploadedFile.file?.name}
                            className="w-full h-full object-cover rounded-lg border"
                            onError={(e) => {
                              console.error(`Failed to load image: ${uploadedFile.preview}`)
                              // Replace broken image with a placeholder
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                parent.classList.remove('aspect-square')
                                parent.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center', 'aspect-square')
                              }
                            }}
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
                              {uploadedFile.isExisting ? uploadedFile.fileName : uploadedFile.file?.name}
                            </div>
                            <div className="text-gray-300">
                              {uploadedFile.isExisting
                                ? (uploadedFile.fileSize ? formatFileSize(uploadedFile.fileSize) : 'Unknown size')
                                : (uploadedFile.file ? formatFileSize(uploadedFile.file.size) : '')
                              }
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
                            {getFileIcon(uploadedFile)}
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full px-1 font-medium">
                            {uploadedFile.isExisting ? uploadedFile.fileName : uploadedFile.file?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {uploadedFile.isExisting
                              ? (uploadedFile.fileSize ? formatFileSize(uploadedFile.fileSize) : 'Unknown size')
                              : (uploadedFile.file ? formatFileSize(uploadedFile.file.size) : '')
                            }
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
  onUploadProgress?: (section: string, hasFiles: boolean) => void
}

export default function UploadWork({ bookingId, onFileUpload, onUploadProgress }: UploadWorkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [existingFiles, setExistingFiles] = useState<Record<string, any[]>>({})
  // Use ref instead of state to store File objects (File objects can't be serialized in state)
  const allFilesRef = useRef<Record<string, File[]>>({})

  // Fetch existing uploaded files from backend
  useEffect(() => {
    const fetchExistingFiles = async () => {
      if (!bookingId) return

      try {
        setIsLoadingFiles(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/files`, {
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('Failed to fetch existing files')
          return
        }

        const data = await response.json()
        console.log('Fetched existing files from backend:', data)
        console.log('Type of data:', typeof data)
        console.log('Is array?', Array.isArray(data))

        // Handle different response formats
        let files: any[] = []

        if (Array.isArray(data)) {
          // Backend returned array directly
          files = data
        } else if (data && typeof data === 'object') {
          // Backend might return { files: [...] } or similar
          if (Array.isArray(data.files)) {
            files = data.files
          } else if (Array.isArray(data.data)) {
            files = data.data
          } else {
            console.error('Unexpected data structure:', data)
            return
          }
        }

        console.log('Extracted files array:', files)

        // Group files by type
        const filesByType: Record<string, any[]> = {}
        files.forEach((file: any) => {
          if (!filesByType[file.fileType]) {
            filesByType[file.fileType] = []
          }
          filesByType[file.fileType].push(file)
        })

        setExistingFiles(filesByType)
        console.log('Grouped files by type:', filesByType)
        console.log('Available file type keys:', Object.keys(filesByType))
      } catch (error) {
        console.error('Error fetching existing files:', error)
      } finally {
        setIsLoadingFiles(false)
      }
    }

    fetchExistingFiles()
  }, [bookingId])

  const handleSectionUpload = (section: string) => async (files: FileList) => {
    console.log(`Files added to ${section}:`, files)
    console.log(`Current ref before update:`, allFilesRef.current)
    console.log(`Ref is object?`, typeof allFilesRef.current === 'object')
    console.log(`Ref has array values?`, Object.values(allFilesRef.current).every(v => Array.isArray(v)))

    // Store files locally without uploading (using ref to preserve File objects)
    const filesArray = Array.from(files)

    // Defensive check: ensure allFilesRef.current is a proper files object
    if (!allFilesRef.current || typeof allFilesRef.current !== 'object' || 'id' in allFilesRef.current) {
      console.warn('allFilesRef was corrupted, resetting to empty object')
      allFilesRef.current = {}
    }

    allFilesRef.current = {
      ...allFilesRef.current,
      [section]: [...(allFilesRef.current[section] || []), ...filesArray]
    }
    console.log(`Updated allFiles ref:`, allFilesRef.current)

    if (onFileUpload) {
      onFileUpload(section, files)
    }
  }

  const handleSubmitWork = async () => {
    if (!bookingId) {
      setSubmitError("Booking ID is required");
      return;
    }

    console.log('Current allFiles ref at submit:', allFilesRef.current)
    console.log('Number of sections with files:', Object.keys(allFilesRef.current).length)

    // Check if at least one section has files
    const hasFiles = Object.values(allFilesRef.current).some((files: File[]) => files.length > 0);
    if (!hasFiles) {
      setSubmitError("Please upload at least one file before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Upload files for each section
      for (const [section, files] of Object.entries(allFilesRef.current)) {
        console.log(`Processing section: ${section} with ${files.length} files`)

        // Check if files are valid File objects
        files.forEach((file: File, index: number) => {
          console.log(`  File ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            isFile: file instanceof File
          })
        })

        if (files.length > 0) {
          // Filter out invalid files
          const validFiles = files.filter((file: File) => file instanceof File && file.size > 0)
          console.log(`  Valid files for ${section}: ${validFiles.length}/${files.length}`)

          if (validFiles.length === 0) {
            console.log(`  Skipping ${section} - no valid files`)
            continue
          }

          const formData = new FormData();
          formData.append('bookingId', bookingId);
          formData.append('fileType', section);

          validFiles.forEach((file: File) => {
            formData.append('files', file);
          });

          console.log(`  Uploading ${validFiles.length} files for ${section}...`)
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/files`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });

          console.log(`  Upload response status for ${section}:`, uploadResponse.status)

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error(`  Upload failed for ${section}:`, errorData)
            throw new Error(`Failed to upload ${section}: ${errorData.message || 'Unknown error'}`);
          }

          console.log(`  ✓ Successfully uploaded files for ${section}`);
        }
      }

      console.log('All sections processed successfully')

      // After all files are uploaded, update status to COMPLETED
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED',
        }),
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.details || 'Failed to update status');
      }

      setSubmitSuccess(true);

      // Reload page after 2 seconds to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting work:", error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit work');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('UploadWork component rendered, current allFiles:', allFilesRef.current)

  const uploadSections = [
    {
      title: "Unedited Photos",
      sectionKey: "unedited-photos",
      acceptedFormats: "JPG, PNG, HEIC, WEBP files",
      acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/webp", ".jpg", ".jpeg", ".png", ".heic", ".webp"],
      maxSize: 50,
      onUpload: handleSectionUpload("unedited-photos"),
    },
    {
      title: "Edited Photos",
      sectionKey: "edited-photos",
      acceptedFormats: "JPG, PNG, TIFF, WEBP files",
      acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/tiff", "image/webp", ".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"],
      maxSize: 50,
      onUpload: handleSectionUpload("edited-photos"),
    },
    {
      title: "Videos",
      sectionKey: "videos",
      acceptedFormats: "MP4, MOV, AVI, MKV files",
      acceptedTypes: ["video/mp4", "video/quicktime", "video/avi", "video/x-msvideo", ".mkv"],
      maxSize: 500,
      onUpload: handleSectionUpload("videos"),
    },
    {
      title: "360° Virtual Tour",
      sectionKey: "virtual-tour",
      acceptedFormats: "360° images, VR files",
      acceptedTypes: ["image/*", "video/*", ".vrm", ".obj"],
      maxSize: 100,
      onUpload: handleSectionUpload("virtual-tour"),
    },
    {
      title: "Floor Plan & Room Staging",
      sectionKey: "floor-plan",
      acceptedFormats: "PDF, DWG, JPG, PNG files",
      acceptedTypes: ["application/pdf", ".dwg", "image/jpeg", "image/png"],
      maxSize: 25,
      onUpload: handleSectionUpload("floor-plan"),
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
      <h2 className="text-lg font-semibold mb-3">Upload Work</h2>
      <div className=" mb-3 mt-3"/>
        <div className="dvideligne border-b mb-3 mt-3"/>

      <div className="space-y-0">
        {isLoadingFiles ? (
          <div className="p-8 text-center text-gray-500">
            Loading existing files...
          </div>
        ) : (
          uploadSections.map((section) => (
            <UploadSection
              key={section.sectionKey}
              title={section.title}
              acceptedFormats={section.acceptedFormats}
              acceptedTypes={section.acceptedTypes}
              maxSize={section.maxSize}
              onFileUpload={section.onUpload}
              onUploadProgress={onUploadProgress}
              existingFiles={existingFiles[section.sectionKey] || []}
            />
          ))
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Work submitted successfully! The booking status has been updated to Completed.
          </div>
        )}

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {submitError}
          </div>
        )}

        <button
          onClick={handleSubmitWork}
          disabled={isSubmitting || submitSuccess}
          className="w-full py-3 px-6 bg-[#0F553E] hover:bg-[#0F553E]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : submitSuccess ? 'Work Submitted!' : 'Submit Work & Complete Booking'}
        </button>
      </div>
    </div>
  )
}
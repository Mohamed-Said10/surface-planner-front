"use client"

import React, { useState } from "react"
import { X, Download, ChevronLeft, ChevronRight, Image as ImageIcon, Video as VideoIcon } from "lucide-react"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  name: string
  category: string
}

interface MediaGalleryProps {
  files: MediaFile[]
  bookingId: string
}

export default function MediaGallery({ files, bookingId }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number>(0)

  if (!files || files.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No photos or videos uploaded yet</p>
          <p className="text-gray-400 text-xs">Your photographer will upload the work here once completed</p>
        </div>
      </div>
    )
  }

  // Group files by category
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = []
    }
    acc[file.category].push(file)
    return acc
  }, {} as Record<string, MediaFile[]>)

  const openLightbox = (file: MediaFile, index: number) => {
    setSelectedMedia(file)
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setSelectedMedia(null)
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (lightboxIndex - 1 + files.length) % files.length
      : (lightboxIndex + 1) % files.length
    
    setLightboxIndex(newIndex)
    setSelectedMedia(files[newIndex])
  }

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const downloadAllFiles = async (category: string) => {
    const categoryFiles = groupedFiles[category]
    for (const file of categoryFiles) {
      await downloadFile(file.url, file.name)
      // Add a small delay between downloads to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const getCategoryTitle = (category: string): string => {
    const titles: Record<string, string> = {
      "unedited-photos": "Unedited Photos",
      "edited-photos": "Edited Photos",
      "videos": "Videos",
      "virtual-tour": "360° Virtual Tour",
      "floor-plan": "Floor Plan & Room Staging"
    }
    return titles[category] || category
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
        <div key={category} className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
          {/* Category Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#F5F6F6] border-b border-[#E0E0E0]">
            <div className="flex items-center gap-3">
              {category.includes("video") ? (
                <VideoIcon className="w-5 h-5 text-[#0D4835]" />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#0D4835]" />
              )}
              <h3 className="text-sm font-semibold text-[#343B48]">
                {getCategoryTitle(category)}
              </h3>
              <span className="text-xs text-[#515662] bg-white px-2 py-1 rounded-full border border-[#E0E0E0]">
                {categoryFiles.length} {categoryFiles.length === 1 ? "file" : "files"}
              </span>
            </div>
            <button
              onClick={() => downloadAllFiles(category)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0D4835] border border-[#0D4835] rounded-lg hover:bg-[#0D4835] hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          {/* Media Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryFiles.map((file, index) => (
                <div
                  key={file.id}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-[#E0E0E0] hover:border-[#0D4835] transition-all hover:shadow-lg"
                  onClick={() => openLightbox(file, files.indexOf(file))}
                >
                  {file.type === "image" ? (
                    <>
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <div className="bg-white rounded-full p-3 group-hover:scale-110 transition-transform">
                          <VideoIcon className="w-6 h-6 text-[#0D4835]" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Download button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadFile(file.url, file.name)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4 text-[#0D4835]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {files.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox("prev")}
                className="absolute left-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => navigateLightbox("next")}
                className="absolute right-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Media Content */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
              />
            )}
          </div>

          {/* Media Info & Download */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-white text-sm font-medium">{selectedMedia.name}</span>
            <button
              onClick={() => downloadFile(selectedMedia.url, selectedMedia.name)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D4835] hover:bg-[#0D4835]/90 text-white rounded-full transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Counter */}
          {files.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-md px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">
                {lightboxIndex + 1} / {files.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

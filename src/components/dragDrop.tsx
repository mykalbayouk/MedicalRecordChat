import React, { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'

interface UploadProps {
  onUploadComplete?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
}

const DragAndDropUpload: React.FC<UploadProps> = ({
  onUploadComplete,
  maxFiles = 1,
  maxSize = 5242880 *  30, // 5MB
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    setUploadError(null)
    if (onUploadComplete) {
      onUploadComplete(acceptedFiles)
    }
  }, [onUploadComplete])

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors = fileRejections.map(
      (rejection) => `${rejection.file.name}: ${rejection.errors[0].message}`
    )
    setUploadError(errors.join('\n'))
  }, [])

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDropAccepted,
  onDropRejected,
  maxFiles,
  maxSize,
  accept: {
    // 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.tiff'],
    'application/pdf': ['.pdf'],
  },
})

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4">
      <div
        {...getRootProps()}
        className={`w-full p-6 text-center ${isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300'} rounded-lg cursor-pointer`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here</p>
        ) : (
          <p className="text-gray-600">Drag and drop files here, or click to select files</p>
        )}
      </div>

      {uploadError && <div className="mt-4 text-red-600">{uploadError}</div>}

      {files.length > 0 && (
        <div className="mt-4 w-full">
          <h4 className="text-lg font-semibold">Selected File:</h4>
          <ul className="list-disc list-inside">
            {files.map((file) => (
              <li key={file.name} className="text-white-700">
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DragAndDropUpload

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface UploadCardProps {
    onSelectedFile: (file: File | null) => void
}

export default function UploadCard({ onSelectedFile }: UploadCardProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        onSelectedFile?.(file)
    }, [onSelectedFile])
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop, multiple: false, accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "application/pdf": [".pdf"]
        }, maxSize: 20 * 1024 * 1024
    })
    const file = acceptedFiles[0]
    return (
        <div className="gradient-border shadow-lg w-full" {...getRootProps()}>
            <input {...getInputProps()} />
            {
                <div className="cursor-pointer">
                    <div className="flex rounded-2xl items-center flex-col bg-white p-10 gap-2">
                        {file ? (
                            <div className="uploader-selected-file flex items-center justify-between gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                                <img src="/images/pdf.png" alt="pdf-image" className="size-8"></img>
                                <div>
                                    <p className="text-lg text-gray-500">{file.name}</p>
                                    <p className="text-lg text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button onClick={() => onSelectedFile?.(null)}>
                                    <img src="/icons/cross.svg" alt="close-icon" className="size-4"></img>
                                </button>
                            </div>
                        ) : (<div>
                            <img src="/icons/info.svg" alt="info-icon" className="size-16 mx-auto"></img>
                            <p className="text-lg text-gray-500"><strong>Click to upload</strong> or drag and drop</p>
                            <p className="text-lg text-gray-500">PDF, PNG or JPG (max. 10MB)</p>
                        </div>)
                        }
                    </div >
                </div >
            }
        </div >
    )
}
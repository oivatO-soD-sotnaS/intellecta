import { Input } from "@heroui/input"
import { useState, useRef } from "react"
import { RxUpload } from "react-icons/rx"

interface FileInputCustomPorps {
  uploading: any
  uploadProfilePicture: any
}

const FileInputCustom = ({
  uploading,
  uploadProfilePicture,
}: FileInputCustomPorps) => {
  const [fileName, setFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setFileName(file.name)
      uploadProfilePicture(file)
    }
  }

  return (
    <div className="relative cursor-pointer">
      <input
        ref={inputRef}
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
        id="profile-upload-real"
        type="file"
        onChange={handleFileChange}
      />

      <Input
        readOnly
        className="w-full cursor-pointer"
        classNames={{
          label: "text-base font-medium text-gray-700 dark:text-gray-200 pb-3",
          inputWrapper: `
            h-12 bg-gray-50 dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded-lg px-4 flex items-center 
            focus-within:border-indigo-500 dark:focus-within:border-indigo-400 
            transition-colors relative
            cursor-pointer
          `,
          input: `
            flex-1 text-base placeholder-gray-400 dark:placeholder-gray-500 
            bg-transparent focus:outline-none truncate 
            ${fileName ? "text-gray-800 dark:text-white" : "text-gray-400"} cursor-pointer
          `,
        }}
        isDisabled={uploading}
        label="Foto de Perfil"
        labelPlacement="outside"
        placeholder="Escolha a Foto"
        startContent={
          <div className="pointer-events-none cursor-pointer">
            <RxUpload className="w-5 h-5" />
          </div>
        }
        value={fileName}
        onClick={() => inputRef.current?.click()}
      />
    </div>
  )
}

export default FileInputCustom

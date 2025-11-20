"use client";
import React from "react";

type FileInputProps = {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
  accept?: string;
  label?: string;
};

const FileInput: React.FC<FileInputProps> = ({
  value,
  onChange,
  error,
  accept,
  label = "Upload Files",
}) => {
  const [dragActive, setDragActive] = React.useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const newFiles = Array.from(incoming);
    const uniqueFiles = [
      ...value,
      ...newFiles.filter(
        (f) => !value.some((sf) => sf.name === f.name && sf.size === f.size)
      ),
    ];
    onChange(uniqueFiles);
  };

  const removeFile = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-medium text-gray-700">{label}</label>}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {value.length > 0 ? (
          <ul className="text-left text-gray-700 font-medium space-y-2">
            {value.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500">
            Drag & drop your PDF or JPG files here or{" "}
            <span className="text-blue-600 underline">click to browse</span>
          </span>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FileInput;

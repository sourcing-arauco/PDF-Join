import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isSecondary?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, isSecondary = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  if (isSecondary) {
    return (
      <div className="w-full mt-4 text-center">
        <button
          onClick={onButtonClick}
          className="text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          O haz clic aquí para añadir más archivos
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`w-full max-w-2xl p-8 sm:p-12 md:p-16 border-4 border-dashed rounded-2xl cursor-pointer transition-colors duration-300
        ${isDragActive ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 hover:border-slate-600'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <UploadIcon className="w-16 h-16 text-slate-500" />
        <p className="text-xl font-bold text-slate-300">
          Arrastra y suelta tus archivos PDF aquí
        </p>
        <p className="text-slate-400">o haz clic para seleccionar</p>
      </div>
    </div>
  );
};
import React, { useState, useRef, useCallback } from 'react';
import { AppFile } from '../types';
import { FileItem } from './FileItem';

interface FileListProps {
  files: AppFile[];
  setFiles: React.Dispatch<React.SetStateAction<AppFile[]>>;
}

export const FileList: React.FC<FileListProps> = ({ files, setFiles }) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newFiles = [...files];
      const draggedItemContent = newFiles.splice(dragItem.current, 1)[0];
      newFiles.splice(dragOverItem.current, 0, draggedItemContent);
      setFiles(newFiles);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const removeFile = useCallback((id: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
  }, [setFiles]);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-slate-400 mb-4 text-center">Arrastra y suelta para reordenar los archivos antes de combinar.</p>
      {files.map((appFile, index) => (
        <FileItem
          key={appFile.id}
          appFile={appFile}
          index={index}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onRemove={() => removeFile(appFile.id)}
        />
      ))}
    </div>
  );
};
import React from 'react';
import { AppFile } from '../types';
import { DocumentIcon, GripVerticalIcon, XIcon } from './icons';

interface FileItemProps {
  appFile: AppFile;
  index: number;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const FileItem: React.FC<FileItemProps> = ({ appFile, index, onDragStart, onDragEnter, onDragEnd, onRemove }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="flex items-center p-3 bg-slate-800 rounded-lg shadow-md cursor-grab active:cursor-grabbing transition-shadow duration-200"
    >
      <div className="flex items-center flex-grow">
        <span className="text-slate-500 mr-3 select-none">{index + 1}.</span>
        <GripVerticalIcon className="w-5 h-5 text-slate-500 mr-3" />
        <DocumentIcon className="w-6 h-6 text-indigo-400 mr-4" />
        <div className="flex-grow">
          <p className="text-slate-200 font-medium truncate" title={appFile.file.name}>
            {appFile.file.name}
          </p>
          <p className="text-xs text-slate-400">
            {formatBytes(appFile.file.size)}
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="ml-4 p-1 rounded-full text-slate-500 hover:bg-slate-700 hover:text-slate-200 transition-colors"
        aria-label="Quitar archivo"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
import React, { useState, useCallback } from 'react';
import { AppFile } from './types';
import { mergePdfs } from './services/pdfService';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MergeButton } from './components/MergeButton';
import { DownloadLink } from './components/DownloadLink';
import { StartOverButton } from './components/StartOverButton';

type AppState = 'IDLE' | 'FILES_SELECTED' | 'MERGING' | 'MERGED';

export default function App() {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: AppFile[] = Array.from(selectedFiles)
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        file,
      }));

    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setAppState('FILES_SELECTED');
    }
  }, []);
  
  const handleMerge = async () => {
    if (files.length < 2) return;

    setAppState('MERGING');
    try {
      const pdfBlob = await mergePdfs(files.map(f => f.file));
      const url = URL.createObjectURL(pdfBlob);
      setMergedPdfUrl(url);
      setAppState('MERGED');
    } catch (error) {
      console.error("Falló la combinación de PDFs:", error);
      alert("Ocurrió un error al combinar los PDF. Por favor, inténtalo de nuevo.");
      setAppState('FILES_SELECTED');
    }
  };

  const handleStartOver = () => {
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }
    setFiles([]);
    setMergedPdfUrl(null);
    setAppState('IDLE');
  };

  const renderContent = () => {
    switch (appState) {
      case 'MERGING':
        return <div className="text-center text-lg text-slate-300">Combinando los PDF, por favor espera...</div>;
      case 'MERGED':
        return (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-green-400">¡Éxito!</h2>
            <p className="text-slate-300">Tu PDF combinado está listo para descargar.</p>
            {mergedPdfUrl && <DownloadLink url={mergedPdfUrl} />}
            <StartOverButton onClick={handleStartOver} />
          </div>
        );
      case 'IDLE':
      case 'FILES_SELECTED':
      default:
        return (
          <>
            {files.length === 0 ? (
              <DropZone onFilesSelected={handleFilesSelected} />
            ) : (
              <div className="w-full max-w-2xl">
                <FileList files={files} setFiles={setFiles} />
                <DropZone onFilesSelected={handleFilesSelected} isSecondary={true} />
                <div className="mt-8 flex justify-center items-center gap-4">
                  <StartOverButton onClick={handleStartOver} />
                  <MergeButton onClick={handleMerge} disabled={files.length < 2} />
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

// Helper components that are simple and only used within App.tsx
const MergeButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
  >
    Combinar PDFs
  </button>
);

const DownloadLink: React.FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    download="combinado.pdf"
    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
  >
    Descargar PDF Combinado
  </a>
);

const StartOverButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-6 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-200"
  >
    Empezar de Nuevo
  </button>
);
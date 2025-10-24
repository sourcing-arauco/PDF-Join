import React from 'react';
import { MergeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto py-6 mb-8 text-center">
        <div className="flex items-center justify-center gap-4">
            <MergeIcon className="w-10 h-10 text-indigo-400" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Combinador de PDF Pro
            </h1>
        </div>
        <p className="mt-4 text-lg text-slate-400">
            Combina tus archivos PDF en un solo documento.
        </p>
    </header>
  );
};
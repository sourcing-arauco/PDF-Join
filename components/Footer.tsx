import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-5xl mx-auto py-6 mt-8 text-center">
            <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Combinador de PDF Pro. Todos los derechos reservados.
            </p>
        </footer>
    );
};
'use client';

interface LoadingSpinnerProps {
  title?: string;
  description?: string;
}

export default function LoadingSpinner({
  title = 'Parsing job opening...',
  description = 'Please wait while we extract the details',
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-10 shadow-2xl border border-slate-100 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-slate-900 font-bold text-lg">{title}</p>
            <p className="text-slate-500 text-sm">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

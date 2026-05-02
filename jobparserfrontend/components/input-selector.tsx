'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, FileText } from 'lucide-react';

interface InputSelectorProps {
  onSelectMode: (mode: 'url' | 'text') => void;
}

export default function InputSelector({ onSelectMode }: InputSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        onClick={() => onSelectMode('url')}
        className="cursor-pointer p-8 hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-blue-400"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <Link className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Job Opening URL
            </h3>
            <p className="text-slate-600 text-sm">
              Paste a link to a job posting and we{"'"}ll extract all the details
            </p>
          </div>
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Continue with URL
          </Button>
        </div>
      </Card>

      <Card
        onClick={() => onSelectMode('text')}
        className="cursor-pointer p-8 hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-emerald-400"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-emerald-100 p-4 rounded-lg">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Job Description Text
            </h3>
            <p className="text-slate-600 text-sm">
              Copy and paste the full job description and we{"'"}ll parse it for you
            </p>
          </div>
          <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
            Continue with Text
          </Button>
        </div>
      </Card>
    </div>
  );
}

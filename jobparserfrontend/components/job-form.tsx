'use client';

import { useState } from 'react';
import type { JobSubmitPayload } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface JobFormProps {
  mode: 'url' | 'text';
  onSubmit: (payload: JobSubmitPayload) => void;
  onCancel: () => void;
  loading: boolean;
  prefillSourceUrl?: string;
}

export default function JobForm({
  mode,
  onSubmit,
  onCancel,
  loading,
  prefillSourceUrl,
}: JobFormProps) {
  const [value, setValue] = useState('');
  const [sourceUrl, setSourceUrl] = useState(prefillSourceUrl ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!value.trim()) {
      setValidationError(
        mode === 'url'
          ? 'Please enter a valid URL'
          : 'Please paste the job description text'
      );
      return;
    }

    if (mode === 'url' && !validateUrl(value)) {
      setValidationError('Please enter a valid URL');
      return;
    }

    if (mode === 'text' && sourceUrl.trim() && !validateUrl(sourceUrl)) {
      setValidationError('Please enter a valid source URL or leave it blank');
      return;
    }

    onSubmit(
      mode === 'url'
        ? value.trim()
        : {
            text: value.trim(),
            sourceUrl: sourceUrl.trim() || undefined,
          }
    );
  };

  return (
    <Card className="p-8 border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            {mode === 'url' ? 'Job Posting URL' : 'Job Description'}
          </label>

          {mode === 'url' ? (
            <Input
              type="url"
              placeholder="https://example.com/job/software-engineer"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setValidationError(null);
              }}
              className="w-full px-4 py-3 border-slate-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          ) : (
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="Optional source URL"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-4 py-3 border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={loading}
              />
              <textarea
                placeholder="Paste the full job description here..."
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setValidationError(null);
                }}
                rows={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical font-sans text-slate-900 placeholder-slate-500 disabled:bg-slate-50 disabled:text-slate-500"
                disabled={loading}
              />
            </div>
          )}
        </div>

        {validationError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{validationError}</p>
          </div>
        )}

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={`px-8 text-white ${
              mode === 'url'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Parsing...' : 'Parse Job Opening'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

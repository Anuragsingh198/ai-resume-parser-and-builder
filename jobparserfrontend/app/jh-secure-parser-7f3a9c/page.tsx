'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InputSelector from '@/components/input-selector';
import JobForm from '@/components/job-form';
import JobDetailsDisplay from '@/components/job-details-display';
import LoadingSpinner from '@/components/loading-spinner';
import { Twitter, PlusCircle } from 'lucide-react';
import { extractJob, listJob, type JobData, type JobSubmitPayload } from '@/lib/api';

type InputMode = 'url' | 'text' | null;

export default function SecureParserPage() {
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [listingJob, setListingJob] = useState(false);

  const handleReset = () => {
    setInputMode(null);
    setJobData(null);
    setError(null);
    setLastUrl(null);
  };

  const switchToTextMode = () => {
    setInputMode('text');
    setError(null);
  };

  const handleSubmit = async (payload: JobSubmitPayload) => {
    if (!inputMode) return;

    setLoading(true);
    setError(null);

    try {
      if (inputMode === 'url' && typeof payload === 'string') {
        setLastUrl(payload);
      }
      const data = await extractJob(inputMode, payload);
      setJobData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse job opening');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListJob = async () => {
    if (!jobData) return;

    setListingJob(true);
    try {
      const result = await listJob(jobData);
      if (result.status === 'already_listed') {
        toast.warning(result.message ?? 'Job is already listed.');
      } else {
        toast.success(result.message ?? 'Job listed successfully.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to list job.');
    } finally {
      setListingJob(false);
    }
  };

  const handleListAndPost = async () => {
    if (!jobData) return;

    setListingJob(true);
    try {
      const result = await listJob(jobData, true);
      if (result.status === 'already_listed') {
        toast.warning(result.message ?? 'Job is already listed.');
      } else {
        toast.success(result.message ?? 'Job listed and posted to X successfully.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to list and post job.');
    } finally {
      setListingJob(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200 transition-transform hover:scale-110">
            <PlusCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Post a <span className="text-blue-600">New Job</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Our AI-powered parser extracts structured data from URLs or text in seconds. Simply paste and list.
          </p>
        </div>

        {!jobData ? (
          <div className="mx-auto max-w-2xl">
            {!inputMode ? (
              <InputSelector onSelectMode={setInputMode} />
            ) : (
              <div>
                <JobForm
                  mode={inputMode}
                  onSubmit={handleSubmit}
                  onCancel={handleReset}
                  loading={loading}
                  prefillSourceUrl={inputMode === 'text' ? lastUrl ?? undefined : undefined}
                />
                {error && (
                  <Card className="mt-6 border-red-200 bg-red-50 p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-red-800">{error}</p>
                      {inputMode === 'url' && (
                        <Button
                          type="button"
                          onClick={switchToTextMode}
                          variant="outline"
                          className="border-red-200 bg-white text-red-800 hover:bg-red-100"
                        >
                          Paste job text instead
                        </Button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Parse Another Job Opening
              </Button>
            </div>
            <JobDetailsDisplay data={jobData} onChange={setJobData} showJsonResponse />
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleListJob}
                disabled={listingJob}
                variant="outline"
                className="h-14 border-blue-600 px-8 text-lg text-blue-600 hover:bg-blue-50"
              >
                {listingJob ? 'Listing...' : 'List Job'}
              </Button>
              <Button
                onClick={handleListAndPost}
                disabled={listingJob}
                className="h-14 bg-black px-12 text-lg text-white hover:bg-slate-900"
              >
                {listingJob ? (
                  'Processing...'
                ) : (
                  <span className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 fill-white" />
                    List & Post to X
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import JobDetailsDisplay from '@/components/job-details-display';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchListedJob, type JobData } from '@/lib/api';
import { ArrowLeft, ExternalLink, RefreshCcw } from 'lucide-react';

function getApplyUrl(job: JobData) {
  return job.application_url || job.source_url || null;
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadJob() {
      if (!params.id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetchListedJob(params.id);
        if (!ignore) setJob(response);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load job detail.');
          setJob(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadJob();
    return () => {
      ignore = true;
    };
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner title="Loading job..." description="Fetching the saved job details" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>

          {job && getApplyUrl(job) && (
            <Button asChild className="w-fit bg-blue-600 text-white hover:bg-blue-700">
              <a href={getApplyUrl(job) ?? '#'} target="_blank" rel="noreferrer">
                Apply
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 p-6">
            <p className="mb-4 text-sm text-red-800">{error}</p>
            <Button type="button" onClick={() => window.location.reload()} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </Card>
        )}

        {!error && job && <JobDetailsDisplay data={job} />}
      </div>
    </main>
  );
}

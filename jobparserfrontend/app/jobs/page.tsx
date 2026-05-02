'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import JobFilters, { type JobFiltersValue } from '@/components/job-filters';
import { fetchListedJobs, type JobData, type ListedJobsResponse } from '@/lib/api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Search,
  Zap,
} from 'lucide-react';

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: JobFiltersValue = {
  keyword: '',
  location: '',
  workMode: '',
  jobType: '',
  experienceLevel: '',
};

function formatText(value?: string | null) {
  if (!hasKnownValue(value)) return null;
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getLocations(job: JobData) {
  const formatObj = (loc?: { city?: string | null; state?: string | null; country?: string | null }) => {
    if (!loc) return null;
    return [loc.city, loc.state, loc.country].filter(hasKnownValue).join(', ');
  };

  return (job.locations ?? [])
    .map(formatObj)
    .filter(hasKnownValue)
    .concat([formatObj(job.location)].filter(hasKnownValue));
}

function formatLocation(job: JobData) {
  if (job.work_mode === 'remote') return 'Remote';
  
  const locations = getLocations(job);

  if (locations.length === 0) return null;
  if (locations.length === 1) return locations[0];
  return `${locations[0]} (+${locations.length - 1} more)`;
}

function formatSalary(job: JobData) {
  const min = job.salary?.min;
  const max = job.salary?.max;
  if (typeof min !== 'number' && typeof max !== 'number') return null;

  const range = [min, max]
    .filter((value): value is number => typeof value === 'number')
    .map((value) => `${value.toLocaleString()}`.trim())
    .join(' - ');

  return `${range}${hasKnownValue(job.salary?.period) ? ` / ${job.salary.period}` : ''}`;
}

function formatExperience(job: JobData) {
  const min = job.experience_years?.min;
  const max = job.experience_years?.max;
  if (typeof min === 'number' && typeof max === 'number') return `${min}-${max} yrs`;
  if (typeof min === 'number') return `${min}+ yrs`;
  if (typeof max === 'number') return `Up to ${max} yrs`;
  return formatText(job.experience_level);
}

function hasKnownValue(value?: string | null): value is string {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== '' && normalized !== 'unknown' && normalized !== 'not specified';
}

function getWorkModeColor(mode?: string | null) {
  if (mode === 'remote') return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100';
  if (mode === 'hybrid') return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
  if (mode === 'in_office') return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
  return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
}

function getApplyUrl(job: JobData) {
  return job.application_url || job.source_url || null;
}

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFiltersValue>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListedJobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeFilters = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      keyword: filters.keyword.trim(),
      location: filters.location.trim(),
      workMode: filters.workMode,
      jobType: filters.jobType,
      experienceLevel: filters.experienceLevel,
    }),
    [filters, page]
  );

  useEffect(() => {
    let ignore = false;

    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchListedJobs(activeFilters);
        if (!ignore) setData(response);
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load listed jobs.');
          setData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      ignore = true;
    };
  }, [activeFilters]);

  const handleFilterChange = (nextFilters: JobFiltersValue) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const jobs = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">Job Listings</h1>
            </div>
            <p className="text-base text-slate-600 sm:text-lg">
              Browse saved jobs, filter quickly, and open full posting details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
          <aside className="lg:col-span-1">
            <JobFilters filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          <section className="lg:col-span-3">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{jobs.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{data?.total ?? 0}</span> jobs
              </p>
              <p className="text-sm text-slate-500">
                Page {data?.page ?? page} of {totalPages}
              </p>
            </div>

            {error && (
              <Card className="mb-4 border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </Card>
            )}

            {loading && !data ? (
              <div className="flex min-h-96 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative h-14 w-14">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-blue-600 border-t-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Loading jobs...</p>
                    <p className="text-sm text-slate-500">Fetching saved job listings</p>
                  </div>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {loading && (
                  <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-800">
                    Refreshing jobs...
                  </p>
                )}
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-slate-200 bg-white p-2 transition-all hover:border-blue-300 hover:shadow-lg sm:p-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                              {hasKnownValue(job.title) ? job.title : 'Untitled role'}
                            </h2>
                            {hasKnownValue(job.company_name) && (
                              <p className="text-base text-slate-600">{job.company_name}</p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400" />
                        </div>

                        <div className="mb-2 grid grid-cols-1 gap-1 text-base text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                          {getLocations(job).length > 0 && (
                            <span className="flex min-w-0 items-center gap-2">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="truncate">
                                  {job.work_mode === 'remote' ? 'Remote' : getLocations(job)[0]}
                                </span>
                                {getLocations(job).length > 1 && job.work_mode !== 'remote' && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="text-blue-600 font-semibold cursor-pointer whitespace-nowrap hover:text-blue-700">
                                          (+{getLocations(job).length - 1} more)
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-slate-900 text-white border-slate-800">
                                        <div className="space-y-1 p-1">
                                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">All Locations</p>
                                          {getLocations(job).map((loc, i) => (
                                            <p key={i} className="text-sm">{loc}</p>
                                          ))}
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </span>
                          )}
                          {formatSalary(job) && (
                            <span className="flex items-center gap-2">
                              <Banknote className="h-4 w-4 flex-shrink-0" />
                              <span>{formatSalary(job)}</span>
                            </span>
                          )}
                          {job.posted_at && (
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {hasKnownValue(job.job_id) && (
                            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                              ID: {job.job_id}
                            </Badge>
                          )}
                          {formatText(job.work_mode) && (
                            <Badge className={getWorkModeColor(job.work_mode)}>
                              {formatText(job.work_mode)}
                            </Badge>
                          )}
                          {formatText(job.job_type) && (
                            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                              {formatText(job.job_type)}
                            </Badge>
                          )}
                          {formatExperience(job) && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              {formatExperience(job)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-col gap-2 border-t border-slate-100 pt-1 sm:flex-row sm:justify-end">
                      {getApplyUrl(job) && (
                        <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                          <a href={getApplyUrl(job) ?? '#'} target="_blank" rel="noreferrer">
                            Apply
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/job/${job.id}`}>
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-slate-200 bg-white p-10 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="mb-2 text-lg font-semibold text-slate-900">No jobs found</p>
                <p className="text-sm text-slate-600">Try changing filters or search for something else.</p>
              </Card>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <Button
                        key={pageNumber}
                        type="button"
                        variant={pageNumber === page ? 'default' : 'outline'}
                        onClick={() => setPage(pageNumber)}
                        className={pageNumber === page ? 'bg-blue-600 text-white' : ''}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

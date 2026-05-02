export type InputMode = 'url' | 'text';

export interface JobData {
  id: string;
  job_id?: string | null;
  title?: string | null;
  company_name?: string | null;
  location?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
    remote?: boolean | null;
  };
  locations?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
    remote?: boolean | null;
  }[];
  work_mode?: string | null;
  job_type?: string | null;
  experience_level?: string | null;
  experience_years?: {
    min?: number | null;
    max?: number | null;
  };
  salary?: {
    min?: number | null;
    max?: number | null;
    currency?: string | null;
    period?: string | null;
  };
  description?: string | null;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  education?: string | null;
  posted_at?: string | null;
  opened_at?: string | null;
  closed_at?: string | null;
  application_url?: string | null;
  source_url?: string | null;
  source_name?: string | null;
  created_at?: string;
  updated_at?: string;
  x_post?: string | null;
  [key: string]: unknown;
}

export interface TextJobPayload {
  text: string;
  sourceUrl?: string;
}

export type JobSubmitPayload = string | TextJobPayload;

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000'
).replace(/\/$/, '');

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    typeof payload.detail === 'string'
  ) {
    return payload.detail;
  }

  return fallback;
}

export async function extractJob(mode: InputMode, payload: JobSubmitPayload) {
  const endpoint =
    mode === 'url'
      ? `${API_BASE_URL}/api/v1/jobs/extract`
      : `${API_BASE_URL}/api/v1/jobs/extract-text`;

  const body =
    mode === 'url'
      ? { url: payload }
      : {
          text: (payload as TextJobPayload).text,
          source_url: (payload as TextJobPayload).sourceUrl || undefined,
        };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `API error: ${response.status}`));
  }

  return data;
}

export async function listJob(jobData: JobData, postToX: boolean = false) {
  const url = postToX 
    ? `${API_BASE_URL}/api/v1/jobs/list?post_to_x=true`
    : `${API_BASE_URL}/api/v1/jobs/list`;
    
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `API error: ${response.status}`));
  }

  return data as {
    id: string;
    job_id?: string | null;
    status: 'listed' | 'already_listed';
    message?: string | null;
  };
}

export interface ListedJobsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  location?: string;
  workMode?: string;
  jobType?: string;
  experienceLevel?: string;
}

export interface ListedJobsResponse {
  items: JobData[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function fetchListedJobs(params: ListedJobsParams = {}) {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 6));

  if (params.keyword) searchParams.set('keyword', params.keyword);
  if (params.location) searchParams.set('location', params.location);
  if (params.workMode) searchParams.set('work_mode', params.workMode);
  if (params.jobType) searchParams.set('job_type', params.jobType);
  if (params.experienceLevel) {
    searchParams.set('experience_level', params.experienceLevel);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/listed?${searchParams}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `API error: ${response.status}`));
  }

  return data as ListedJobsResponse;
}

export async function fetchListedJob(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/listed/${id}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `API error: ${response.status}`));
  }

  return data as JobData;
}

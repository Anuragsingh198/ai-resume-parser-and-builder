'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Briefcase,
  Banknote,
  GraduationCap,
  Calendar,
  Users,
  Code,
  Link as LinkIcon,
  Clock,
  Copy,
  Check,
  Pencil,
  Save,
  X,
  Twitter,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { JobData } from '@/lib/api';

interface JobDetailsDisplayProps {
  data: JobData;
  onChange?: (data: JobData) => void;
  showJsonResponse?: boolean;
}

function hasKnownValue(value?: string | null): value is string {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== '' && normalized !== 'unknown' && normalized !== 'not specified';
}

export default function JobDetailsDisplay({
  data,
  onChange,
  showJsonResponse = false,
}: JobDetailsDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingJson, setIsEditingJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(data, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditingJson) {
      setJsonDraft(JSON.stringify(data, null, 2));
      setJsonError(null);
    }
  }, [data, isEditingJson]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(isEditingJson ? jsonDraft : JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startJsonEdit = () => {
    setJsonDraft(JSON.stringify(data, null, 2));
    setJsonError(null);
    setIsEditingJson(true);
  };

  const cancelJsonEdit = () => {
    setJsonDraft(JSON.stringify(data, null, 2));
    setJsonError(null);
    setIsEditingJson(false);
  };

  const saveJsonEdit = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as JobData;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setJsonError('JSON must be an object.');
        return;
      }
      if (!parsed.id || typeof parsed.id !== 'string') {
        setJsonError('JSON must include an internal string id.');
        return;
      }
      if (!parsed.source_url || typeof parsed.source_url !== 'string') {
        setJsonError('JSON must include a source_url.');
        return;
      }

      onChange?.(parsed);
      setJsonError(null);
      setIsEditingJson(false);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString();
  };

  const formatSalary = () => {
    const min = data.salary?.min;
    const max = data.salary?.max;
    if (typeof min !== 'number' && typeof max !== 'number') return null;

    const range = [min, max]
      .filter((value): value is number => typeof value === 'number')
      .map(formatMoney)
      .join(' - ');
    const period = hasKnownValue(data.salary?.period) ? ` ${data.salary.period}` : '';
    return range + period;
  };

  const getExperienceYears = () => {
    if (!data.experience_years) return null;
    const min = data.experience_years.min;
    const max = data.experience_years.max;
    if (min && max) return `${min}-${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
    return null;
  };

  const formatWorkMode = (mode?: string | null) => {
    if (!hasKnownValue(mode)) return null;
    return mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatText = (text?: string | null) => {
    if (!hasKnownValue(text)) return null;
    return text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatLocationObj = (loc?: { city?: string | null; state?: string | null; country?: string | null }) => {
    if (!loc) return null;
    return [loc.city, loc.state, loc.country].filter(hasKnownValue).join(', ');
  };

  const locations = data.locations?.length 
    ? data.locations.map(formatLocationObj).filter(hasKnownValue)
    : [formatLocationObj(data.location)].filter(hasKnownValue);

  const locationText = locations.join(' | ');
  const requirements = data.requirements?.filter(hasKnownValue) ?? [];
  const responsibilities = data.responsibilities?.filter(hasKnownValue) ?? [];
  const skills = data.skills?.filter(hasKnownValue) ?? [];
  const benefits = data.benefits?.filter(hasKnownValue) ?? [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="p-8 border-slate-200 bg-white">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {hasKnownValue(data.title) ? data.title : 'Untitled role'}
            </h1>
            {hasKnownValue(data.company_name) && (
              <p className="text-xl text-slate-600 mb-6">{data.company_name}</p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {hasKnownValue(data.job_id) && (
                <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                  Job ID: {data.job_id}
                </Badge>
              )}
              {formatText(data.job_type) && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {formatText(data.job_type)}
                </Badge>
              )}
              {formatText(data.experience_level) && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  {formatText(data.experience_level)} Level
                </Badge>
              )}
              {formatWorkMode(data.work_mode) && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  {formatWorkMode(data.work_mode)}
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
            {locationText && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    {locations.length > 1 ? 'Locations' : 'Location'}
                  </p>
                  <p className="text-slate-900 font-medium">{locationText}</p>
                </div>
              </div>
            )}

            {getExperienceYears() && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Experience</p>
                  <p className="text-slate-900 font-medium">{getExperienceYears()}</p>
                </div>
              </div>
            )}

            {formatSalary() && (
              <div className="flex items-start gap-3">
                <Banknote className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Salary</p>
                  <p className="text-slate-900 font-medium">{formatSalary()}</p>
                </div>
              </div>
            )}

            {data.posted_at && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Posted</p>
                  <p className="text-slate-900 font-medium">{formatDate(data.posted_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Description */}
      {hasKnownValue(data.description) && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Job Description
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {data.description}
          </p>
        </Card>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Requirements
          </h2>
          <ul className="space-y-3">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  ✓
                </span>
                <span className="text-slate-700">{req}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Responsibilities */}
      {responsibilities.length > 0 && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Responsibilities
          </h2>
          <ul className="space-y-3">
            {responsibilities.map((resp, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  →
                </span>
                <span className="text-slate-700">{resp}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                className="bg-slate-100 text-slate-800 hover:bg-slate-100 px-3 py-1 text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Education */}
      {hasKnownValue(data.education) && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Education
          </h2>
          <p className="text-slate-700">{data.education}</p>
        </Card>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <Card className="p-8 border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits</h2>
          <ul className="space-y-3">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  ★
                </span>
                <span className="text-slate-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Footer Info */}
      {(data.application_url || hasKnownValue(data.source_name)) && (
        <Card className="p-8 border-slate-200 bg-slate-50">
          <div className="space-y-4">
            {hasKnownValue(data.source_name) && (
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Source</p>
                <p className="text-slate-900">{data.source_name}</p>
              </div>
            )}
            {data.application_url && (
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Apply Now</p>
                <a
                  href={data.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <LinkIcon className="w-4 h-4" />
                  Open Job Posting
                </a>
              </div>
            )}
          </div>
        </Card>
      )}

      {showJsonResponse && (
        <Card className="p-8 border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Twitter className="w-6 h-6 text-[#1DA1F2]" />
              X (Twitter) Summary Post
            </h2>
          </div>
          <div className="space-y-3">
            <textarea
              value={data.x_post || ''}
              onChange={(e) => {
                onChange?.({ ...data, x_post: e.target.value });
              }}
              placeholder="Generated X post content will appear here..."
              className="min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 font-sans text-base leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <p>Characters: {data.x_post?.length || 0} / 280</p>
              {data.x_post && data.x_post.length > 280 && (
                <p className="text-red-500 font-medium">Over 280 character limit!</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {showJsonResponse && (
        <Card className="p-8 border-slate-200 bg-slate-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              API Response (JSON)
            </h2>
            <div className="flex flex-wrap gap-2">
              {onChange && !isEditingJson && (
                <button
                  onClick={startJsonEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              )}
              {isEditingJson && (
                <>
                  <button
                    onClick={saveJsonEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelJsonEdit}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>
          {isEditingJson ? (
            <div className="space-y-3">
              <textarea
                value={jsonDraft}
                onChange={(event) => {
                  setJsonDraft(event.target.value);
                  setJsonError(null);
                }}
                spellCheck={false}
                className="min-h-96 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {jsonError && (
                <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {jsonError}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto font-mono text-sm max-h-96">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

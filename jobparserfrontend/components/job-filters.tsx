'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

export interface JobFiltersValue {
  keyword: string;
  location: string;
  workMode: string;
  jobType: string;
  experienceLevel: string;
}

interface JobFiltersProps {
  filters: JobFiltersValue;
  onFilterChange: (filters: JobFiltersValue) => void;
}

const WORK_MODES = [
  { value: '', label: 'Any work mode' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'in_office', label: 'In office' },
];

const JOB_TYPES = [
  { value: '', label: 'Any job type' },
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'other', label: 'Other' },
];



export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobFiltersValue>(filters);
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 20]);

  useEffect(() => {
    setLocalFilters(filters);
    if (filters.experienceLevel && filters.experienceLevel.includes('-')) {
      try {
        const parts = filters.experienceLevel.split('-');
        setExperienceRange([Number(parts[0]), Number(parts[1])]);
      } catch {
        setExperienceRange([0, 20]);
      }
    } else {
      setExperienceRange([0, 20]);
    }
  }, [filters]);

  const hasActiveFilters = Object.values(localFilters).some(Boolean);

  const updateFilter = (key: keyof JobFiltersValue, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleExperienceChange = (value: number[]) => {
    if (value.length === 2) {
      setExperienceRange([value[0], value[1]]);
      setLocalFilters((prev) => ({ ...prev, experienceLevel: `${value[0]}-${value[1]}` }));
    }
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      keyword: '',
      location: '',
      workMode: '',
      jobType: '',
      experienceLevel: '',
    };
    setLocalFilters(emptyFilters);
    setExperienceRange([0, 20]);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="sticky top-20 border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Filter className="h-5 w-5 text-blue-600" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 text-xs text-blue-700"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Search</span>
          <Input
            value={localFilters.keyword}
            onChange={(event) => updateFilter('keyword', event.target.value)}
            placeholder="Title, company, skill..."
            className="border-slate-200"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Location</span>
          <Input
            value={localFilters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
            placeholder="City, country, remote..."
            className="border-slate-200"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Work Mode</span>
          <select
            value={localFilters.workMode}
            onChange={(event) => updateFilter('workMode', event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            {WORK_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Job Type</span>
          <select
            value={localFilters.jobType}
            onChange={(event) => updateFilter('jobType', event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <div className="block">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-900">
            <span>Experience Years</span>
            <span className="text-slate-600 font-normal">
              {experienceRange[0]} - {experienceRange[1]}{experienceRange[1] === 20 ? '+' : ''} yrs
            </span>
          </div>
          <div className="px-2 pt-2 pb-4">
            <Slider
              min={0}
              max={20}
              step={1}
              value={experienceRange}
              onValueChange={handleExperienceChange}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={applyFilters}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-2"
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}

import { memo } from 'react';
import { X, Filter } from 'lucide-react';
import { JobType } from '../types';

export interface JobFiltersProps {
  selectedType: JobType | 'All';
  selectedLocation: string;
  selectedSkills: string[];
  availableTypes: JobType[];
  availableLocations: string[];
  availableSkills: string[];
  onTypeChange: (type: JobType | 'All') => void;
  onLocationChange: (location: string) => void;
  onSkillToggle: (skill: string) => void;
  onClearFilters: () => void;
  isVisible?: boolean;
}

const JobFilters = memo(({
  selectedType,
  selectedLocation,
  selectedSkills,
  availableTypes,
  availableLocations,
  availableSkills,
  onTypeChange,
  onLocationChange,
  onSkillToggle,
  onClearFilters,
  isVisible = true,
}: JobFiltersProps) => {
  const hasActiveFilters =
    selectedType !== 'All' || selectedLocation !== 'All' || selectedSkills.length > 0;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        {/* Job Type Filter */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-medium text-gray-700 mb-2 md:mb-2">
            Job Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTypeChange('All')}
              className={`
                px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap
                ${
                  selectedType === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              All
            </button>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`
                  px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-medium text-gray-700 mb-2 md:mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm bg-white"
            aria-label="Filter by location"
          >
            <option value="All">All Locations</option>
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-medium text-gray-700 mb-2 md:mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 max-h-20 md:max-h-24 overflow-y-auto">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => onSkillToggle(skill)}
                  className={`
                    px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

JobFilters.displayName = 'JobFilters';

export default JobFilters;

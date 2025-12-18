import { memo } from 'react';
import { Building2, MapPin, Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Job } from '../types';

export interface JobCardProps {
  job: Job;
  onSeeMatch: (jobId: string) => void;
  onApply: (jobId: string) => void;
  className?: string;
}

const JobCard = memo(({ job, onSeeMatch, onApply, className = '' }: JobCardProps) => {
  const handleSeeMatch = () => {
    if (job?.id) {
      onSeeMatch(job.id);
    }
  };

  const handleApply = () => {
    if (job?.id) {
      onApply(job.id);
    }
  };

  // Validate job data
  if (!job || !job.id) {
    return null;
  }

  const displayedSkills = job.skills?.slice(0, 3) || [];
  const remainingSkillsCount = (job.skills?.length || 0) - displayedSkills.length;

  return (
    <article
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col ${className}`}
      data-testid={`job-card-${job.id}`}
    >
      {/* Company Logo and Title Section */}
      <header className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          ) : (
            <Building2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-gray-900 truncate" title={job.title}>
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 truncate" title={job.company}>
            {job.company}
          </p>
        </div>
      </header>

      {/* Job Details */}
      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="truncate" title={job.location}>
            {job.location}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span>Posted {job.postedDate}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3" title={job.description}>
        {job.description}
      </p>

      {/* Skills Tags */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayedSkills.map((skill, index) => (
            <span
              key={`${job.id}-skill-${index}`}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
              title={`${remainingSkillsCount} more skills: ${job.skills.slice(3).join(', ')}`}
            >
              +{remainingSkillsCount} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <footer className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={handleSeeMatch}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`See match details for ${job.title} at ${job.company}`}
        >
          See Match
          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Apply to ${job.title} at ${job.company}`}
        >
          Apply
        </button>
      </footer>
    </article>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;


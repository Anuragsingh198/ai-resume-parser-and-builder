import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Search from '../components/Search';
import JobFilters from '../components/JobFilters';
import { DUMMY_JOBS } from '../constants/jobs';
import { Job, JobType } from '../types';

const EngineeringJobs = () => {
  const navigate = useNavigate();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const allJobs = useMemo<Job[]>(() => DUMMY_JOBS, []);
  const filterOptions = useMemo(() => {
    const types = Array.from(new Set(allJobs.map((job) => job.type))) as JobType[];
    const locations = Array.from(new Set(allJobs.map((job) => job.location))).sort();
    const allSkills = allJobs.flatMap((job) => job.skills);
    const skills = Array.from(new Set(allSkills)).sort();

    return { types, locations, skills };
  }, [allJobs]);
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search filter - search in title, company, description, and skills
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          job.location.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Job type filter
      if (selectedType !== 'All' && job.type !== selectedType) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && job.location !== selectedLocation) {
        return false;
      }

      // Skills filter - job must have at least one selected skill
      if (selectedSkills.length > 0) {
        const hasSelectedSkill = selectedSkills.some((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase())
        );
        if (!hasSelectedSkill) return false;
      }

      return true;
    });
  }, [allJobs, searchQuery, selectedType, selectedLocation, selectedSkills]);

  const handleSeeMatch = useCallback(
    (jobId: string) => {
      if (!jobId) {
        console.error('Job ID is required for navigation');
        return;
      }
      navigate(`/jobs/match/${jobId}`);
    },
    [navigate]
  );

  const handleApply = useCallback(
    (jobId: string) => {
      if (!jobId) {
        console.error('Job ID is required for application');
        return;
      }
      const job = allJobs.find((j) => j.id === jobId);
      if (job) {
        alert(`Applying to ${job.title} at ${job.company}. This is a demo.`);
      }
    },
    [allJobs]
  );

  const handleSkillToggle = useCallback((skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      return [...prev, skill];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedLocation('All');
    setSelectedSkills([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Engineering Jobs</h1>
          <p className="text-lg text-gray-600">Discover exciting engineering opportunities</p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search jobs by title, company, skills, or location..."
            className="w-full"
          />
        </div>

        {/* Filters Toggle and Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredJobs.length}</span> of{' '}
              <span className="font-semibold">{allJobs.length}</span> jobs
            </p>
          </div>
        </div>

        {/* Horizontal Filter Card */}
        {showFilters && (
          <div className="mb-6">
            <JobFilters
              selectedType={selectedType}
              selectedLocation={selectedLocation}
              selectedSkills={selectedSkills}
              availableTypes={filterOptions.types}
              availableLocations={filterOptions.locations}
              availableSkills={filterOptions.skills}
              onTypeChange={setSelectedType}
              onLocationChange={setSelectedLocation}
              onSkillToggle={handleSkillToggle}
              onClearFilters={handleClearFilters}
              isVisible={showFilters}
            />
          </div>
        )}

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} role="listitem">
                <JobCard
                  job={job}
                  onSeeMatch={handleSeeMatch}
                  onApply={handleApply}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find more jobs.
                </p>
                {(searchQuery || selectedType !== 'All' || selectedLocation !== 'All' || selectedSkills.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineeringJobs;

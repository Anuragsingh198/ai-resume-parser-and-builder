import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Tag, Palette, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks';
import { setJobDetails } from '../redux/slices/resumeSlice';

const JobDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    companyName: '',
    jobDescription: '',
    position: '',
    keywords: '',
    resumeStyle: 'ATS' as 'ATS' | 'Modern' | 'Minimal' | 'Professional',
    useDemoContent: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setJobDetails(formData));
    navigate('/resume/result');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Go Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job & Company Details</h1>
          <p className="text-gray-600 mb-8">
            Provide information about the company and position to optimize your resume
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-5 w-5" />
                <span>Company Name *</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="e.g., Google, Microsoft, Amazon"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-5 w-5" />
                <span>Position / Job Title *</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-5 w-5" />
                <span>Job Description *</span>
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Paste the job description here..."
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-5 w-5" />
                <span>Keywords (Optional)</span>
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, TypeScript, AWS (comma-separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add specific keywords you want to emphasize in your resume
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-5 w-5" />
                <span>Resume Style *</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['ATS', 'Modern', 'Minimal', 'Professional'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleChange('resumeStyle', style)}
                    className={`px-4 py-3 rounded-md border-2 transition-colors ${
                      formData.resumeStyle === style
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="useDemoContent"
                checked={formData.useDemoContent}
                onChange={(e) => handleChange('useDemoContent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="useDemoContent" className="text-sm text-gray-700">
                Use Demo Resume Content (for testing purposes)
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Generate Resume</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;


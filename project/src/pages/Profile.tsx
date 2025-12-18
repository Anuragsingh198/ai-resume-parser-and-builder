import { User, Mail, Briefcase, Award, FileText, Settings } from 'lucide-react';
import { useAppSelector } from '../redux/hooks';
import ResumeCard from '../components/ResumeCard';

const Profile = () => {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const generatedResumes = useAppSelector((state) => state.resume.generatedResumes);

  // Mock user data - in real app, this would come from backend
  const user = reduxUser || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    resumeCompletionStatus: 75,
  };

  const preferences = {
    ats: true,
    modern: false,
    professional: true,
  };

  const savedCompanies = [
    { companyName: 'Google', jobDescription: 'Senior Software Engineer position...' },
    { companyName: 'Microsoft', jobDescription: 'Full Stack Developer role...' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">User Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user.experience} experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    {user.resumeCompletionStatus}% Complete
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Preferences */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Resume Preferences</h3>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.ats}
                    readOnly
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">ATS-Friendly</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.modern}
                    readOnly
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Modern</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.professional}
                    readOnly
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Professional</span>
                </label>
              </div>
            </div>

            {/* Saved Companies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Companies</h3>
              <div className="space-y-3">
                {savedCompanies.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">{item.companyName}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.jobDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Resumes List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Generated Resumes</h2>
                </div>
              </div>

              {generatedResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedResumes.map((resume) => (
                    <ResumeCard key={resume.id} {...resume} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No resumes generated yet</p>
                  <p className="text-gray-400">Create your first resume to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


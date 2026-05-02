import { Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../redux/hooks';

interface ResumePreviewProps {
  onDownload: () => void;
  onRegenerate: () => void;
  onEdit: () => void;
}

const ResumePreview = ({ onDownload, onRegenerate, onEdit }: ResumePreviewProps) => {
  const resumeData = useAppSelector((state) => state.resume.resumeData);
  const jobDetails = useAppSelector((state) => state.resume.jobDetails);

  if (!resumeData || !jobDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No resume data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{resumeData.basicInfo.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {resumeData.basicInfo.email && <span>{resumeData.basicInfo.email}</span>}
            {resumeData.basicInfo.phone && <span>{resumeData.basicInfo.phone}</span>}
            {resumeData.basicInfo.location && <span>{resumeData.basicInfo.location}</span>}
            {resumeData.basicInfo.linkedin && (
              <a href={resumeData.basicInfo.linkedin} className="underline">
                LinkedIn
              </a>
            )}
            {resumeData.basicInfo.portfolio && (
              <a href={resumeData.basicInfo.portfolio} className="underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {jobDetails.position && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Objective</h2>
              <p className="text-gray-700">
                Seeking a {jobDetails.position} position at {jobDetails.companyName} where I can leverage my skills and experience.
              </p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Experience
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Education
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{edu.year}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1">{project.description}</p>
                    {project.technologies && (
                      <p className="text-sm text-gray-500 mt-1">
                        Technologies: {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.skills.length > 0 && resumeData.skills[0] && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  skill && (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {resumeData.achievements.length > 0 && resumeData.achievements[0] && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Achievements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {resumeData.achievements.map((achievement, index) => (
                  achievement && <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {resumeData.additionalInfo && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Additional Information
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{resumeData.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <button
          onClick={onDownload}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={onRegenerate}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Regenerate Resume</span>
        </button>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Go Back & Edit</span>
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;


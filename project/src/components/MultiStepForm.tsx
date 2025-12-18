import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks';
import { setResumeData } from '../redux/slices/resumeSlice';

interface MultiStepFormProps {
  onComplete: (data: any) => void;
}

const MultiStepForm = ({ onComplete }: MultiStepFormProps) => {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    education: [{ degree: '', institution: '', year: '', gpa: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    skills: [''],
    achievements: [''],
    additionalInfo: '',
  });

  const updateField = (section: string, field: string, value: any, index?: number) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (index !== undefined) {
        if (Array.isArray(newData[section as keyof typeof newData])) {
          const arr = [...(newData[section as keyof typeof newData] as any[])];
          arr[index] = { ...arr[index], [field]: value };
          (newData[section as keyof typeof newData] as any) = arr;
        }
      } else {
        (newData[section as keyof typeof newData] as any) = {
          ...(newData[section as keyof typeof newData] as any),
          [field]: value,
        };
      }
      return newData;
    });
  };

  const addArrayItem = (section: string) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const arr = [...(newData[section as keyof typeof newData] as any[])];
      if (section === 'education') {
        arr.push({ degree: '', institution: '', year: '', gpa: '' });
      } else if (section === 'experience') {
        arr.push({ title: '', company: '', duration: '', description: '' });
      } else if (section === 'projects') {
        arr.push({ name: '', description: '', technologies: '', link: '' });
      } else {
        arr.push('');
      }
      (newData[section as keyof typeof newData] as any) = arr;
      return newData;
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const arr = [...(newData[section as keyof typeof newData] as any[])];
      arr.splice(index, 1);
      (newData[section as keyof typeof newData] as any) = arr;
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      dispatch(setResumeData(formData as any));
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.basicInfo.name}
                  onChange={(e) => updateField('basicInfo', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.basicInfo.email}
                  onChange={(e) => updateField('basicInfo', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.basicInfo.phone}
                  onChange={(e) => updateField('basicInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.basicInfo.location}
                  onChange={(e) => updateField('basicInfo', 'location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={formData.basicInfo.linkedin}
                  onChange={(e) => updateField('basicInfo', 'linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                <input
                  type="url"
                  value={formData.basicInfo.portfolio}
                  onChange={(e) => updateField('basicInfo', 'portfolio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              <button
                onClick={() => addArrayItem('education')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">Education {index + 1}</h3>
                  {formData.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateField('education', 'degree', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateField('education', 'institution', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateField('education', 'year', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateField('education', 'gpa', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
              <button
                onClick={() => addArrayItem('experience')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                  {formData.experience.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('experience', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateField('experience', 'title', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateField('experience', 'company', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateField('experience', 'duration', e.target.value, index)}
                      placeholder="e.g., Jan 2020 - Present"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateField('experience', 'description', e.target.value, index)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={() => addArrayItem('projects')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">Project {index + 1}</h3>
                  {formData.projects.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('projects', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateField('projects', 'name', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) => updateField('projects', 'technologies', e.target.value, index)}
                      placeholder="e.g., React, Node.js, MongoDB"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateField('projects', 'description', e.target.value, index)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateField('projects', 'link', e.target.value, index)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              <button
                onClick={() => addArrayItem('skills')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[index] = e.target.value;
                    setFormData((prev) => ({ ...prev, skills: newSkills }));
                  }}
                  placeholder="Enter a skill"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {formData.skills.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('skills', index)}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              <button
                onClick={() => addArrayItem('achievements')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Achievement
              </button>
            </div>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...formData.achievements];
                    newAchievements[index] = e.target.value;
                    setFormData((prev) => ({ ...prev, achievements: newAchievements }));
                  }}
                  placeholder="Enter an achievement"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {formData.achievements.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('achievements', index)}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information (Certifications, Languages, etc.)
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any additional information you'd like to include..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[...Array(totalSteps)].map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : index + 1 === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1 < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center">
                  {['Basic Info', 'Education', 'Experience', 'Projects', 'Skills', 'Achievements', 'Additional'][index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">{renderStep()}</div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-2 rounded-md ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <span>{currentStep === totalSteps ? 'Complete' : 'Next'}</span>
          {currentStep !== totalSteps && <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowRight } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { useAppDispatch } from '../redux/hooks';
import { setUploadedFile, setParsedResume, setResumeData } from '../redux/slices/resumeSlice';

const ResumeCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedOption, setSelectedOption] = useState<'upload' | 'form' | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUploadSuccess = (file: File, parsedData: any) => {
    dispatch(setUploadedFile(file));
    dispatch(setParsedResume(parsedData));
    setUploadComplete(true);
    
    // Convert parsed data to resume data format
    const resumeData = {
      basicInfo: {
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        location: parsedData.location || '',
        linkedin: parsedData.linkedin || '',
        portfolio: parsedData.portfolio || '',
      },
      education: parsedData.education || [],
      experience: parsedData.experience || [],
      projects: parsedData.projects || [],
      skills: parsedData.skills || [],
      achievements: parsedData.achievements || [],
      additionalInfo: parsedData.additionalInfo || '',
    };
    
    dispatch(setResumeData(resumeData));
  };

  const handleUploadError = (error: string) => {
    alert(error);
  };

  const handleContinue = () => {
    navigate('/resume/job-details');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Start Resume Creation</h1>
          <p className="text-lg text-gray-600">
            Choose how you'd like to provide your resume information
          </p>
        </div>

        {!selectedOption ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setSelectedOption('upload')}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-left group"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume PDF</h2>
              <p className="text-gray-600">
                Upload your existing resume and we'll extract all the information automatically
              </p>
            </button>

            <button
              onClick={() => setSelectedOption('form')}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-left group"
            >
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fill Multi-step Form</h2>
              <p className="text-gray-600">
                Manually enter your details through our guided multi-step form
              </p>
            </button>
          </div>
        ) : selectedOption === 'upload' ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <button
              onClick={() => {
                setSelectedOption(null);
                setUploadComplete(false);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to options
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Resume</h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
            {uploadComplete && (
              <div className="mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">
                    ✓ Resume uploaded and parsed successfully!
                  </p>
                </div>
                <button
                  onClick={handleContinue}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>Continue to Job Details</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <button
              onClick={() => setSelectedOption(null)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to options
            </button>
            <p className="text-gray-600 mb-6">
              You'll be redirected to the multi-step form to enter your details.
            </p>
            <button
              onClick={() => navigate('/resume/form')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Start Filling Form</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCreate;


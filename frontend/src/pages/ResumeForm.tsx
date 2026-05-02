import { useNavigate } from 'react-router-dom';
import MultiStepForm from '../components/MultiStepForm';

const ResumeForm = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/resume/job-details');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Information</h1>
          <p className="text-lg text-gray-600">
            Fill in your details step by step to create your perfect resume
          </p>
        </div>
        <MultiStepForm onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default ResumeForm;


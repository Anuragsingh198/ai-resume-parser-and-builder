import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { addGeneratedResume } from '../redux/slices/resumeSlice';

const ResumeResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector((state) => state.resume.resumeData);
  const jobDetails = useAppSelector((state) => state.resume.jobDetails);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const isDemo = searchParams.get('demo') === 'true';

  useEffect(() => {
    if (isDemo) {
      // Demo mode - skip generation
      setIsGenerating(false);
      setGenerationComplete(true);
      setInsights([
        'Resume optimized for ATS compatibility',
        'Keywords matched to job description',
        'Formatting adjusted for modern standards',
      ]);
      return;
    }

    // Simulate resume generation
    const generateResume = async () => {
      setIsGenerating(true);
      
      try {
        // In a real app, this would call the backend API
        // const response = await axios.post('/api/generate-resume', {
        //   resumeData: state.resumeData,
        //   jobDetails: state.jobDetails,
        // });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Mock insights
        setInsights([
          `Resume optimized for ${jobDetails?.companyName || 'target company'}`,
          'Keywords matched to job description',
          'Formatting adjusted for ATS compatibility',
          'Experience reordered by relevance',
        ]);

        // Add to generated resumes
        if (jobDetails) {
          const newResume = {
            id: `resume-${Date.now()}`,
            companyName: jobDetails.companyName,
            position: jobDetails.position,
            createdAt: new Date().toISOString(),
          };
          dispatch(addGeneratedResume(newResume));
        }

        setGenerationComplete(true);
      } catch (error) {
        console.error('Generation error:', error);
        alert('Error generating resume. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    if (resumeData && jobDetails) {
      generateResume();
    } else {
      // Redirect if no data
      navigate('/resume/create');
    }
  }, [isDemo, resumeData, jobDetails, dispatch, navigate]);

  const handleDownload = () => {
    // In a real app, this would download the PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    // Regenerate logic
    setTimeout(() => {
      setGenerationComplete(true);
      setIsGenerating(false);
    }, 2000);
  };

  const handleEdit = () => {
    navigate('/resume/create');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating your resume...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {generationComplete && (
          <>
            {insights.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Company-Specific Insights
                </h3>
                <ul className="space-y-2">
                  {insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span className="text-blue-800">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ResumePreview
              onDownload={handleDownload}
              onRegenerate={handleRegenerate}
              onEdit={handleEdit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeResult;


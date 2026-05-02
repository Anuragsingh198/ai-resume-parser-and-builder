import { Link } from 'react-router-dom';
import { Upload, FileText, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import ResumeCard from '../components/ResumeCard';

const Home = () => {
  const demoResumes = [
    {
      id: 'demo-1',
      companyName: 'Google',
      position: 'Senior Software Engineer',
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
    {
      id: 'demo-2',
      companyName: 'Microsoft',
      position: 'Full Stack Developer',
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
    {
      id: 'demo-3',
      companyName: 'Amazon',
      position: 'Cloud Solutions Architect',
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI-Powered Resume Builder for Any Company
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Upload your resume or fill your details — we analyze the company & create a tailor-made resume that fits perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resume/create"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Create Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#demo-resumes"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors shadow-lg"
              >
                View Demo Resumes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How the Platform Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Step 1</h3>
              <p className="text-gray-600 text-lg">
                Upload your resume or fill the form with your professional details
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Step 2</h3>
              <p className="text-gray-600 text-lg">
                Enter company name + job description to customize your resume
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Step 3</h3>
              <p className="text-gray-600 text-lg">
                Get an optimized resume instantly tailored for your target company
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Resume Section */}
      <section id="demo-resumes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Demo Resumes
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Check out sample resumes optimized for top companies
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoResumes.map((resume) => (
              <ResumeCard key={resume.id} {...resume} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Resume Builder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'AI-Powered Optimization',
              'ATS-Friendly Formats',
              'Company-Specific Tailoring',
              'Multiple Style Options',
              'Instant Generation',
              'Professional Templates',
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


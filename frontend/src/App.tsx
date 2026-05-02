import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthInitializer from './components/AuthInitializer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResumeCreate from './pages/ResumeCreate';
import ResumeForm from './pages/ResumeForm';
import JobDetails from './pages/JobDetails';
import ResumeResult from './pages/ResumeResult';
import EngineeringJobs from './pages/EngineeringJobs';
import JobMatch from './pages/JobMatch';

function App() {
  return (
    <Router>
      <AuthInitializer />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume/create" element={<ResumeCreate />} />
            <Route path="/resume/form" element={<ResumeForm />} />
            <Route path="/resume/job-details" element={<JobDetails />} />
            <Route path="/resume/result" element={<ResumeResult />} />
            <Route path="/jobs" element={<EngineeringJobs />} />
            <Route path="/jobs/match/:jobId" element={<JobMatch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

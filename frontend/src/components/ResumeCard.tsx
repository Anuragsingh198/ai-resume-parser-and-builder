import { FileText, Calendar, Building2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResumeCardProps {
  id: string;
  companyName: string;
  position: string;
  createdAt: string;
  thumbnail?: string;
  isDemo?: boolean;
}

const ResumeCard = ({ id, companyName, position, createdAt, thumbnail, isDemo = false }: ResumeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {thumbnail ? (
        <img src={thumbnail} alt={`${companyName} Resume`} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <FileText className="h-16 w-16 text-white opacity-50" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{companyName}</h3>
          {isDemo && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Demo</span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Building2 className="h-4 w-4 mr-1" />
          <span className="truncate">{position}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        
        <Link
          to={isDemo ? `/resume/result?demo=true&company=${encodeURIComponent(companyName)}` : `/resume/result?id=${id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="h-4 w-4 mr-2" />
          {isDemo ? 'View Sample' : 'View Resume'}
        </Link>
      </div>
    </div>
  );
};

export default ResumeCard;


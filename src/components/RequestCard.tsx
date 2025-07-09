import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, User, Star, AlertCircle, MessageSquare } from 'lucide-react';
import { ServiceRequest, User as UserType } from '../types';

interface RequestCardProps {
  request: ServiceRequest;
  user: UserType;
  currentUser: UserType;
  onRespond: (requestId: string, message: string) => void;
  matches?: any[];
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  user, 
  currentUser, 
  onRespond, 
  matches = [] 
}) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    onRespond(request.id, responseMessage);
    setResponseMessage('');
    setShowResponseForm(false);
  };

  const urgencyColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800 border-blue-200',
    matched: 'bg-purple-100 text-purple-800 border-purple-200',
    'in-progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const timeUntilNeeded = new Date(request.neededBy).getTime() - new Date().getTime();
  const daysUntilNeeded = Math.ceil(timeUntilNeeded / (1000 * 60 * 60 * 24));

  const userMatch = matches.find(m => m.userId === currentUser.id);
  const matchScore = userMatch ? Math.round(userMatch.score * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{user.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${urgencyColors[request.urgency]}`}>
              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{request.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{request.location.neighborhood}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{request.estimatedDuration}h • {daysUntilNeeded > 0 ? `${daysUntilNeeded} days left` : 'Overdue'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>
              {request.compensation.type === 'free' ? 'Free' :
               request.compensation.type === 'paid' ? `$${request.compensation.amount}` :
               'Trade'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{request.responses.length} responses</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {request.skillsNeeded.map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {userMatch && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 font-medium">
                You're a {matchScore}% match!
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <span className="text-xs text-blue-600 font-medium">{matchScore}%</span>
              </div>
            </div>
          </div>
        )}

        {request.userId !== currentUser.id && request.status === 'open' && (
          <div className="border-t pt-4">
            {!showResponseForm ? (
              <button
                onClick={() => setShowResponseForm(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Respond to Request
              </button>
            ) : (
              <form onSubmit={handleSubmitResponse} className="space-y-3">
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Tell them how you can help..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                  >
                    Send Response
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseMessage('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
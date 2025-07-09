import React, { useState } from 'react';
import { X, DollarSign, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { ServiceRequest } from '../types';
import { skillCategories, neighborhoods } from '../utils/mockData';

interface ServiceRequestFormProps {
  onSubmit: (request: Omit<ServiceRequest, 'id' | 'userId' | 'createdAt' | 'responses'>) => void;
  onClose: () => void;
  currentUser: any;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ 
  onSubmit, 
  onClose, 
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillsNeeded: [] as string[],
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    estimatedDuration: 2,
    location: {
      address: currentUser?.address || '',
      neighborhood: currentUser?.neighborhood || ''
    },
    compensation: {
      type: 'free' as 'free' | 'paid' | 'trade',
      amount: 0,
      description: ''
    },
    neededBy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'open',
      neededBy: new Date(formData.neededBy).toISOString()
    });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(skill)
        ? prev.skillsNeeded.filter(s => s !== skill)
        : [...prev.skillsNeeded, skill]
    }));
  };

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Service Request</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What help do you need?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide details about what you need help with..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as const).map(level => (
                    <label key={level} className="flex items-center space-x-2 text-sm">
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={formData.urgency === level}
                        onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[level]}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Needed
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {skillCategories.map(skill => (
                  <label key={skill} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.skillsNeeded.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({...formData, estimatedDuration: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Needed By
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.neededBy}
                  onChange={(e) => setFormData({...formData, neededBy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {...formData.location, address: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street address"
                />
                <select
                  required
                  value={formData.location.neighborhood}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {...formData.location, neighborhood: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select neighborhood</option>
                  {neighborhoods.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Compensation
              </label>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  {(['free', 'paid', 'trade'] as const).map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="compensationType"
                        value={type}
                        checked={formData.compensation.type === type}
                        onChange={(e) => setFormData({
                          ...formData,
                          compensation: {
                            ...formData.compensation,
                            type: e.target.value as any
                          }
                        })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </label>
                  ))}
                </div>
                
                {formData.compensation.type === 'paid' && (
                  <input
                    type="number"
                    min="0"
                    value={formData.compensation.amount}
                    onChange={(e) => setFormData({
                      ...formData,
                      compensation: {
                        ...formData.compensation,
                        amount: parseFloat(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amount in dollars"
                  />
                )}
                
                <input
                  type="text"
                  value={formData.compensation.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    compensation: {
                      ...formData.compensation,
                      description: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional compensation details..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
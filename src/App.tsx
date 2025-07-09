import React, { useState, useEffect } from 'react';
import { AppState, ServiceRequest, User, Match } from './types';
import { initializeStorage, saveToStorage } from './utils/storage';
import { findMatches } from './utils/matchingAlgorithm';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FilterPanel from './components/FilterPanel';
import RequestCard from './components/RequestCard';
import ServiceRequestForm from './components/ServiceRequestForm';

function App() {
  const [appState, setAppState] = useState<AppState>(() => initializeStorage());
  const [currentView, setCurrentView] = useState<'dashboard' | 'requests' | 'my-requests'>('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [authError, setAuthError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    neighborhood: '',
    urgency: '',
    compensation: '',
    status: ''
  });

  useEffect(() => {
    saveToStorage(appState);
  }, [appState]);

  const handleLogin = (email: string, password: string) => {
    const user = appState.users.find(u => u.email === email && u.password === password);
    if (user) {
      setAppState(prev => ({
        ...prev,
        currentUser: user,
        isAuthenticated: true
      }));
      setAuthError('');
    } else {
      setAuthError('Invalid email or password');
    }
  };

  const handleRegister = (userData: any) => {
    const existingUser = appState.users.find(u => u.email === userData.email);
    if (existingUser) {
      setAuthError('Email already exists');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      rating: 5.0,
      completedRequests: 0,
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    setAppState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
      isAuthenticated: true
    }));
    setAuthError('');
  };

  const handleLogout = () => {
    setAppState(prev => ({
      ...prev,
      currentUser: null,
      isAuthenticated: false
    }));
  };

  const handleCreateRequest = (requestData: any) => {
    const newRequest: ServiceRequest = {
      id: Date.now().toString(),
      userId: appState.currentUser!.id,
      ...requestData,
      createdAt: new Date().toISOString(),
      responses: []
    };

    const matches = findMatches(newRequest, appState.users);
    
    setAppState(prev => ({
      ...prev,
      serviceRequests: [...prev.serviceRequests, newRequest],
      matches: [...prev.matches, ...matches]
    }));
    setShowCreateForm(false);
  };

  const handleRespondToRequest = (requestId: string, message: string) => {
    const responseId = Date.now().toString();
    const response = {
      id: responseId,
      userId: appState.currentUser!.id,
      requestId,
      message,
      proposedTime: new Date().toISOString(),
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    setAppState(prev => ({
      ...prev,
      serviceRequests: prev.serviceRequests.map(req =>
        req.id === requestId
          ? { ...req, responses: [...req.responses, response] }
          : req
      )
    }));
  };

  const getFilteredRequests = () => {
    let filtered = appState.serviceRequests;

    if (filters.search) {
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(req => req.category === filters.category);
    }

    if (filters.neighborhood) {
      filtered = filtered.filter(req => req.location.neighborhood === filters.neighborhood);
    }

    if (filters.urgency) {
      filtered = filtered.filter(req => req.urgency === filters.urgency);
    }

    if (filters.compensation) {
      filtered = filtered.filter(req => req.compensation.type === filters.compensation);
    }

    if (filters.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    return filtered;
  };

  const getMyRequests = () => {
    return appState.serviceRequests.filter(req => req.userId === appState.currentUser!.id);
  };

  const getMatchesForRequest = (requestId: string) => {
    return appState.matches.filter(match => match.requestId === requestId);
  };

  const getNotificationCount = () => {
    const myRequests = getMyRequests();
    return myRequests.reduce((count, req) => count + req.responses.length, 0);
  };

  if (!appState.isAuthenticated) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={appState.currentUser}
        onLogout={handleLogout}
        onCreateRequest={() => setShowCreateForm(true)}
        notifications={getNotificationCount()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-2 px-4 rounded-md font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('requests')}
              className={`py-2 px-4 rounded-md font-medium transition-colors ${
                currentView === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setCurrentView('my-requests')}
              className={`py-2 px-4 rounded-md font-medium transition-colors ${
                currentView === 'my-requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Requests
            </button>
          </div>
        </nav>

        {currentView === 'dashboard' && (
          <Dashboard
            serviceRequests={appState.serviceRequests}
            users={appState.users}
            currentUser={appState.currentUser!}
          />
        )}

        {currentView === 'requests' && (
          <div>
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={() => setFilters({
                search: '',
                category: '',
                neighborhood: '',
                urgency: '',
                compensation: '',
                status: ''
              })}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredRequests().map(request => {
                const user = appState.users.find(u => u.id === request.userId)!;
                const matches = getMatchesForRequest(request.id);
                return (
                  <RequestCard
                    key={request.id}
                    request={request}
                    user={user}
                    currentUser={appState.currentUser!}
                    onRespond={handleRespondToRequest}
                    matches={matches}
                  />
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'my-requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getMyRequests().map(request => {
              const user = appState.users.find(u => u.id === request.userId)!;
              const matches = getMatchesForRequest(request.id);
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  user={user}
                  currentUser={appState.currentUser!}
                  onRespond={handleRespondToRequest}
                  matches={matches}
                />
              );
            })}
          </div>
        )}
      </main>

      {showCreateForm && (
        <ServiceRequestForm
          onSubmit={handleCreateRequest}
          onClose={() => setShowCreateForm(false)}
          currentUser={appState.currentUser!}
        />
      )}
    </div>
  );
}

export default App;
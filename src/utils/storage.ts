import { User, ServiceRequest, AppState } from '../types';
import { mockUsers, mockServiceRequests } from './mockData';

const STORAGE_KEY = 'neighbornet_data';

export const initializeStorage = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  const initialState: AppState = {
    currentUser: null,
    users: mockUsers,
    serviceRequests: mockServiceRequests,
    matches: [],
    isAuthenticated: false
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
};

export const saveToStorage = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
import { User, ServiceRequest } from '../types';

export const neighborhoods = [
  'Downtown', 'Riverside', 'Hillcrest', 'Oakwood', 'Maple Heights',
  'Sunset District', 'Pine Valley', 'Cedar Grove', 'Elmwood', 'Fairview'
];

export const skillCategories = [
  'Home Maintenance', 'Garden & Yard', 'Pet Care', 'Childcare',
  'Technology', 'Transportation', 'Cooking', 'Cleaning', 'Tutoring',
  'Healthcare', 'Arts & Crafts', 'Music', 'Sports', 'Senior Care'
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@email.com',
    password: 'password123',
    name: 'John Doe',
    phone: '(555) 123-4567',
    address: '123 Main St',
    neighborhood: 'Downtown',
    skills: ['Home Maintenance', 'Garden & Yard', 'Technology'],
    availability: {
      days: ['Monday', 'Wednesday', 'Saturday'],
      timeSlots: ['Morning', 'Afternoon']
    },
    rating: 4.8,
    completedRequests: 15,
    joinedAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    email: 'sarah.wilson@email.com',
    password: 'password123',
    name: 'Sarah Wilson',
    phone: '(555) 234-5678',
    address: '456 Oak Ave',
    neighborhood: 'Riverside',
    skills: ['Pet Care', 'Childcare', 'Cooking'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Sunday'],
      timeSlots: ['Afternoon', 'Evening']
    },
    rating: 4.9,
    completedRequests: 22,
    joinedAt: '2024-02-10',
    isActive: true
  },
  {
    id: '3',
    email: 'mike.brown@email.com',
    password: 'password123',
    name: 'Mike Brown',
    phone: '(555) 345-6789',
    address: '789 Pine Rd',
    neighborhood: 'Hillcrest',
    skills: ['Transportation', 'Technology', 'Tutoring'],
    availability: {
      days: ['Monday', 'Friday', 'Saturday'],
      timeSlots: ['Morning', 'Evening']
    },
    rating: 4.6,
    completedRequests: 8,
    joinedAt: '2024-03-05',
    isActive: true
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    userId: '1',
    title: 'Need help with leaky faucet',
    description: 'My kitchen faucet has been leaking for a week. Looking for someone with plumbing experience to fix it.',
    category: 'Home Maintenance',
    skillsNeeded: ['Home Maintenance'],
    urgency: 'medium',
    estimatedDuration: 2,
    location: {
      address: '123 Main St',
      neighborhood: 'Downtown'
    },
    compensation: {
      type: 'paid',
      amount: 50,
      description: 'Will pay $50 for the repair'
    },
    status: 'open',
    createdAt: '2024-12-18T10:00:00Z',
    neededBy: '2024-12-22T18:00:00Z',
    responses: []
  },
  {
    id: '2',
    userId: '2',
    title: 'Dog walking needed',
    description: 'Looking for someone to walk my golden retriever twice a day while I\'m out of town.',
    category: 'Pet Care',
    skillsNeeded: ['Pet Care'],
    urgency: 'high',
    estimatedDuration: 1,
    location: {
      address: '456 Oak Ave',
      neighborhood: 'Riverside'
    },
    compensation: {
      type: 'paid',
      amount: 25,
      description: '$25 per day'
    },
    status: 'open',
    createdAt: '2024-12-17T14:30:00Z',
    neededBy: '2024-12-20T08:00:00Z',
    responses: []
  },
  {
    id: '3',
    userId: '3',
    title: 'Math tutoring for high school student',
    description: 'Need help with calculus homework. Looking for someone patient and experienced.',
    category: 'Tutoring',
    skillsNeeded: ['Tutoring'],
    urgency: 'low',
    estimatedDuration: 2,
    location: {
      address: '789 Pine Rd',
      neighborhood: 'Hillcrest'
    },
    compensation: {
      type: 'paid',
      amount: 30,
      description: '$30 per hour'
    },
    status: 'open',
    createdAt: '2024-12-16T09:15:00Z',
    neededBy: '2024-12-25T20:00:00Z',
    responses: []
  }
];

export const timeSlots = [
  'Early Morning (6-9 AM)',
  'Morning (9-12 PM)',
  'Afternoon (12-5 PM)',
  'Evening (5-8 PM)',
  'Night (8-11 PM)'
];

export const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];